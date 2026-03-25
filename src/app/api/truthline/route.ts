import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import {
    extractVacancyContent,
    isLikelyJobBoard,
    normalizeUrl,
    validateUrl,
    type ExtractedContent,
} from '@/lib/truthline';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const authClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ANALYSIS_VERSION = 2;
const MODEL_NAME = 'gpt-4o-2024-08-06';

type ConfidenceLevel = 'low' | 'medium' | 'high';
type EvidenceQuality = 'limited' | 'moderate' | 'strong';
type VerificationStatus = 'verified' | 'warning' | 'unverified' | 'not_found';
type Verdict = 'Strong Apply' | 'Apply With Caution' | 'Only Apply If It Matches Your Goals' | 'Not Recommended';

interface VerificationCheck {
    label: string;
    status: VerificationStatus;
    detail: string;
    evidence: string;
}

interface AnalysisResult {
    sourceUrl: string;
    fetchedAt: string;
    vacancy: {
        title: string;
        company: string;
        location: string;
        employmentType: string;
        seniority: string;
        salary: string;
        deadline: string;
        summary: string;
    };
    evidenceProfile: {
        confidence: ConfidenceLevel;
        evidenceQuality: EvidenceQuality;
        sourceType: 'job_board' | 'company_site' | 'unknown';
        structuredDataDetected: boolean;
        extractorUsed: string;
        contentLength: number;
        requiresManualReview: boolean;
    };
    verificationChecklist: VerificationCheck[];
    findings: Array<{
        area: string;
        assessment: string;
        evidence: string;
        severity: 'low' | 'medium' | 'high';
    }>;
    verifiedSignals: string[];
    riskSignals: string[];
    missingInformation: string[];
    recommendation: {
        verdict: Verdict;
        score: number;
        reasoning: string;
        nextSteps: string[];
    };
    audit: {
        analysisVersion: number;
        model: string;
        cached: boolean;
    };
}

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : 'Unknown error';
}

function asString(value: unknown, fallback = ''): string {
    if (typeof value === 'string') {
        return value.trim();
    }

    if (typeof value === 'number') {
        return String(value);
    }

    return fallback;
}

function asStringArray(value: unknown): string[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map((item) => asString(item))
        .filter(Boolean)
        .slice(0, 12);
}

function asChecklist(value: unknown): VerificationCheck[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map((item) => {
            if (!item || typeof item !== 'object') {
                return null;
            }

            const record = item as Record<string, unknown>;
            const status = asString(record.status) as VerificationStatus;
            if (!['verified', 'warning', 'unverified', 'not_found'].includes(status)) {
                return null;
            }

            return {
                label: asString(record.label),
                status,
                detail: asString(record.detail),
                evidence: asString(record.evidence),
            };
        })
        .filter((item): item is VerificationCheck => Boolean(item))
        .slice(0, 8);
}

function asFindings(value: unknown): AnalysisResult['findings'] {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map((item) => {
            if (!item || typeof item !== 'object') {
                return null;
            }

            const record = item as Record<string, unknown>;
            const severity = asString(record.severity) as 'low' | 'medium' | 'high';
            if (!['low', 'medium', 'high'].includes(severity)) {
                return null;
            }

            return {
                area: asString(record.area),
                assessment: asString(record.assessment),
                evidence: asString(record.evidence),
                severity,
            };
        })
        .filter((item): item is AnalysisResult['findings'][number] => Boolean(item))
        .slice(0, 8);
}

function unique(values: string[]): string[] {
    return Array.from(new Set(values.filter(Boolean)));
}

function getDomainFromUrl(value: string): string {
    try {
        return new URL(value).hostname.toLowerCase();
    } catch {
        return '';
    }
}

function getVerdict(score: number, requiresManualReview: boolean): Verdict {
    if (requiresManualReview || score < 40) {
        return 'Not Recommended';
    }

    if (score < 60) {
        return 'Only Apply If It Matches Your Goals';
    }

    if (score < 80) {
        return 'Apply With Caution';
    }

    return 'Strong Apply';
}

function buildRuleBasedContext(extracted: ExtractedContent) {
    const sourceType = isLikelyJobBoard(extracted.sourceDomain) ? 'job_board' : extracted.sourceDomain === extracted.rootDomain ? 'company_site' : 'unknown';
    const emailDomains = unique(extracted.emails.map((email) => email.split('@')[1] || ''));
    const applicationDomains = unique(extracted.applicationLinks.map((link) => link.domain));
    const companyWebsiteDomains = unique(
        [
            ...extracted.companyWebsiteLinks.map((link) => link.domain),
            extracted.structuredJobPosting?.companyWebsite ? getDomainFromUrl(extracted.structuredJobPosting.companyWebsite) : '',
        ].filter(Boolean)
    );

    const externalApplicationDomains = applicationDomains.filter((domain) => domain !== extracted.sourceDomain);
    const suspiciousTerms = extracted.suspiciousTerms;
    const missingInformation = unique([
        !extracted.structuredJobPosting?.company && !/company|about us|organization/i.test(extracted.textContent) ? 'The employer identity is not clearly stated.' : '',
        !extracted.structuredJobPosting?.location && !/remote|hybrid|onsite|location/i.test(extracted.textContent) ? 'The work location is unclear.' : '',
        !extracted.structuredJobPosting?.salary && extracted.salaryMentions.length === 0 ? 'No compensation details were found.' : '',
        !/apply|application|submit/i.test(extracted.textContent) && extracted.applicationLinks.length === 0 ? 'The application method is not clearly explained.' : '',
        !/interview|process|timeline/i.test(extracted.textContent) ? 'The hiring process or next steps are not described.' : '',
    ]);

    const verificationChecklist: VerificationCheck[] = [
        {
            label: 'Listing structure',
            status: extracted.extractionMeta.contentLength >= 1200 ? 'verified' : extracted.extractionMeta.contentLength >= 500 ? 'warning' : 'unverified',
            detail: extracted.extractionMeta.contentLength >= 1200 ? 'The page exposed enough vacancy content for a substantive review.' : 'Only a limited amount of vacancy content was available for analysis.',
            evidence: `${extracted.extractionMeta.contentLength} characters extracted using ${extracted.extractionMeta.extractorUsed}.`,
        },
        {
            label: 'Structured job metadata',
            status: extracted.structuredJobPosting ? 'verified' : 'not_found',
            detail: extracted.structuredJobPosting ? 'Structured metadata consistent with a job posting was detected.' : 'No reliable structured job metadata was detected on the page.',
            evidence: extracted.structuredJobPosting ? 'JSON-LD JobPosting or equivalent metadata was present.' : 'No JobPosting schema was found.',
        },
        {
            label: 'Employer identity',
            status: extracted.structuredJobPosting?.company ? 'verified' : 'warning',
            detail: extracted.structuredJobPosting?.company ? 'The employer name was explicitly identified.' : 'The employer name could not be confirmed with high confidence from structured signals.',
            evidence: extracted.structuredJobPosting?.company ? `Employer detected as ${extracted.structuredJobPosting.company}.` : 'No clear company field was extracted from structured metadata.',
        },
        {
            label: 'Application routing',
            status: externalApplicationDomains.length === 0 ? 'verified' : externalApplicationDomains.length <= 2 ? 'warning' : 'unverified',
            detail: externalApplicationDomains.length === 0 ? 'The application flow stays on the source domain.' : 'The application flow redirects to external domains and should be verified manually.',
            evidence: externalApplicationDomains.length === 0 ? `No external application domains were detected beyond ${extracted.sourceDomain}.` : `External application domains: ${externalApplicationDomains.join(', ')}.`,
        },
        {
            label: 'Contact-domain alignment',
            status: emailDomains.length === 0 ? 'not_found' : emailDomains.every((domain) => domain === extracted.sourceDomain || companyWebsiteDomains.includes(domain)) ? 'verified' : 'warning',
            detail: emailDomains.length === 0 ? 'No recruiter or contact email was found on the page.' : 'Contact domains were compared against the source and company website domains.',
            evidence: emailDomains.length === 0 ? 'No public contact email extracted.' : `Contact email domains found: ${emailDomains.join(', ')}.`,
        },
        {
            label: 'Scam-signal language',
            status: suspiciousTerms.length === 0 ? 'verified' : suspiciousTerms.length <= 2 ? 'warning' : 'unverified',
            detail: suspiciousTerms.length === 0 ? 'No common fee/payment/chat-app scam language was detected in the listing text.' : 'The listing includes language that often requires extra verification before applying.',
            evidence: suspiciousTerms.length === 0 ? 'No suspicious payment or off-platform chat terms detected.' : `Detected terms: ${suspiciousTerms.join(', ')}.`,
        },
    ];

    const verifiedSignals = unique([
        extracted.structuredJobPosting ? 'Structured job metadata was present.' : '',
        extracted.extractionMeta.contentLength >= 1200 ? 'The listing exposed substantial visible content for review.' : '',
        extracted.salaryMentions.length > 0 || extracted.structuredJobPosting?.salary ? 'Compensation information was disclosed or referenced.' : '',
        externalApplicationDomains.length === 0 ? 'The application path stays on the source domain.' : '',
        emailDomains.length > 0 && emailDomains.every((domain) => domain === extracted.sourceDomain || companyWebsiteDomains.includes(domain)) ? 'Contact domains align with the listing or company domains.' : '',
    ]);

    const riskSignals = unique([
        suspiciousTerms.length > 0 ? `Suspicious terms detected: ${suspiciousTerms.join(', ')}.` : '',
        externalApplicationDomains.length > 0 ? `External application routing detected: ${externalApplicationDomains.join(', ')}.` : '',
        missingInformation.length >= 3 ? 'Several core job details are missing or unclear.' : '',
        extracted.extractionMeta.contentLength < 700 ? 'The page exposed limited content, which lowers confidence.' : '',
        extracted.extractionMeta.wasTruncated ? 'The extracted content had to be truncated before analysis.' : '',
    ]);

    const verifiedCount = verificationChecklist.filter((item) => item.status === 'verified').length;
    const warningCount = verificationChecklist.filter((item) => item.status === 'warning').length;
    const unverifiedCount = verificationChecklist.filter((item) => item.status === 'unverified').length;

    let evidenceQuality: EvidenceQuality = 'limited';
    if (verifiedCount >= 4 && extracted.extractionMeta.contentLength >= 1200) {
        evidenceQuality = 'strong';
    } else if (verifiedCount >= 2 && extracted.extractionMeta.contentLength >= 700) {
        evidenceQuality = 'moderate';
    }

    let confidence: ConfidenceLevel = 'low';
    if (evidenceQuality === 'strong' && unverifiedCount === 0) {
        confidence = 'high';
    } else if (evidenceQuality === 'moderate' && unverifiedCount <= 1) {
        confidence = 'medium';
    }

    const requiresManualReview = confidence === 'low' || suspiciousTerms.length > 0 || unverifiedCount > 0 || missingInformation.length >= 3;

    return {
        sourceType,
        emailDomains,
        applicationDomains,
        companyWebsiteDomains,
        externalApplicationDomains,
        suspiciousTerms,
        missingInformation,
        verificationChecklist,
        verifiedSignals,
        riskSignals,
        evidenceQuality,
        confidence,
        requiresManualReview,
        summary: {
            sourceDomain: extracted.sourceDomain,
            rootDomain: extracted.rootDomain,
            hasStructuredJobPosting: Boolean(extracted.structuredJobPosting),
            contentLength: extracted.extractionMeta.contentLength,
        },
    };
}

function buildPrompt(url: string, extracted: ExtractedContent, context: ReturnType<typeof buildRuleBasedContext>) {
    return `
You are TruthLine, a professional job authenticity and application-risk analyst.
Your job is to help candidates avoid low-quality or suspicious job listings while staying evidence-based and conservative.

Hard rules:
1. Use only the evidence provided in this request.
2. Never invent company facts, legal status, recruiter identity, or external reputation.
3. If the evidence is limited, say so clearly and lower confidence.
4. Respect the rule-based verification checks and suspicious-term detections. You may add nuance, but do not ignore them.
5. Recommendation verdict must be exactly one of:
   - "Strong Apply"
   - "Apply With Caution"
   - "Only Apply If It Matches Your Goals"
   - "Not Recommended"

Return strict JSON with this shape:
{
  "sourceUrl": "${url}",
  "fetchedAt": "${new Date().toISOString()}",
  "vacancy": {
    "title": "",
    "company": "",
    "location": "",
    "employmentType": "",
    "seniority": "",
    "salary": "",
    "deadline": "",
    "summary": ""
  },
  "evidenceProfile": {
    "confidence": "low|medium|high",
    "evidenceQuality": "limited|moderate|strong",
    "sourceType": "job_board|company_site|unknown",
    "structuredDataDetected": true,
    "extractorUsed": "",
    "contentLength": 0,
    "requiresManualReview": false
  },
  "verificationChecklist": [
    {
      "label": "",
      "status": "verified|warning|unverified|not_found",
      "detail": "",
      "evidence": ""
    }
  ],
  "findings": [
    {
      "area": "",
      "assessment": "",
      "evidence": "",
      "severity": "low|medium|high"
    }
  ],
  "verifiedSignals": [""],
  "riskSignals": [""],
  "missingInformation": [""],
  "recommendation": {
    "verdict": "",
    "score": 0,
    "reasoning": "",
    "nextSteps": [""]
  },
  "audit": {
    "analysisVersion": ${ANALYSIS_VERSION},
    "model": "${MODEL_NAME}",
    "cached": false
  }
}

Input evidence:
URL: ${url}
Final URL: ${extracted.finalUrl}
Page title: ${extracted.title}
Meta description: ${extracted.metaDescription}
H1 headings: ${JSON.stringify(extracted.h1)}
Section headings: ${JSON.stringify(extracted.headings)}
Structured job posting: ${JSON.stringify(extracted.structuredJobPosting)}
Emails found: ${JSON.stringify(extracted.emails)}
Application links: ${JSON.stringify(extracted.applicationLinks)}
Company website links: ${JSON.stringify(extracted.companyWebsiteLinks)}
Salary mentions: ${JSON.stringify(extracted.salaryMentions)}
Suspicious terms: ${JSON.stringify(extracted.suspiciousTerms)}
Rule-based verification checklist: ${JSON.stringify(context.verificationChecklist)}
Rule-based verified signals: ${JSON.stringify(context.verifiedSignals)}
Rule-based risk signals: ${JSON.stringify(context.riskSignals)}
Rule-based missing information: ${JSON.stringify(context.missingInformation)}
Rule-based evidence profile: ${JSON.stringify({
        confidence: context.confidence,
        evidenceQuality: context.evidenceQuality,
        sourceType: context.sourceType,
        requiresManualReview: context.requiresManualReview,
        extractorUsed: extracted.extractionMeta.extractorUsed,
        contentLength: extracted.extractionMeta.contentLength,
        structuredDataDetected: extracted.extractionMeta.structuredDataDetected,
    })}

Vacancy content summary:
${extracted.summaryText}

Vacancy content:
${extracted.textContent}
`;
}

function normalizeResult(result: unknown, extracted: ExtractedContent, context: ReturnType<typeof buildRuleBasedContext>): AnalysisResult {
    const record = (result && typeof result === 'object' ? result : {}) as Record<string, unknown>;
    const vacancyRecord = (record.vacancy && typeof record.vacancy === 'object' ? record.vacancy : {}) as Record<string, unknown>;
    const evidenceRecord = (record.evidenceProfile && typeof record.evidenceProfile === 'object' ? record.evidenceProfile : {}) as Record<string, unknown>;
    const recommendationRecord = (record.recommendation && typeof record.recommendation === 'object' ? record.recommendation : {}) as Record<string, unknown>;

    const rawScore = Number(recommendationRecord.score);
    let score = Number.isFinite(rawScore) ? Math.max(0, Math.min(100, Math.round(rawScore))) : 50;

    if (context.evidenceQuality === 'limited') {
        score = Math.min(score, 59);
    }
    if (context.requiresManualReview) {
        score = Math.min(score, 54);
    }
    if (context.suspiciousTerms.length > 0) {
        score = Math.min(score, 39);
    }

    const verdict = getVerdict(score, context.requiresManualReview && context.suspiciousTerms.length > 0);
    const nextSteps = unique([
        ...asStringArray(recommendationRecord.nextSteps),
        'Confirm the employer identity using the official company website before applying.',
        context.externalApplicationDomains.length > 0 ? 'Verify every external application domain before submitting personal information.' : '',
        context.suspiciousTerms.length > 0 ? 'Do not pay fees or share sensitive financial information before a verified hiring process.' : '',
    ]).slice(0, 6);

    const checklist = asChecklist(record.verificationChecklist);
    const findings = asFindings(record.findings);

    const evidenceQuality = (['limited', 'moderate', 'strong'].includes(asString(evidenceRecord.evidenceQuality)) ? asString(evidenceRecord.evidenceQuality) : context.evidenceQuality) as EvidenceQuality;
    const confidence = (['low', 'medium', 'high'].includes(asString(evidenceRecord.confidence)) ? asString(evidenceRecord.confidence) : context.confidence) as ConfidenceLevel;

    return {
        sourceUrl: asString(record.sourceUrl, extracted.sourceUrl) || extracted.sourceUrl,
        fetchedAt: asString(record.fetchedAt, new Date().toISOString()) || new Date().toISOString(),
        vacancy: {
            title: asString(vacancyRecord.title, extracted.structuredJobPosting?.title || extracted.h1[0] || extracted.title),
            company: asString(vacancyRecord.company, extracted.structuredJobPosting?.company || ''),
            location: asString(vacancyRecord.location, extracted.structuredJobPosting?.location || ''),
            employmentType: asString(vacancyRecord.employmentType, extracted.structuredJobPosting?.employmentType || ''),
            seniority: asString(vacancyRecord.seniority, extracted.structuredJobPosting?.seniority || ''),
            salary: asString(vacancyRecord.salary, extracted.structuredJobPosting?.salary || extracted.salaryMentions[0] || ''),
            deadline: asString(vacancyRecord.deadline, extracted.structuredJobPosting?.deadline || ''),
            summary: asString(vacancyRecord.summary, extracted.summaryText.slice(0, 320)),
        },
        evidenceProfile: {
            confidence,
            evidenceQuality,
            sourceType: (['job_board', 'company_site', 'unknown'].includes(asString(evidenceRecord.sourceType)) ? asString(evidenceRecord.sourceType) : context.sourceType) as AnalysisResult['evidenceProfile']['sourceType'],
            structuredDataDetected: extracted.extractionMeta.structuredDataDetected,
            extractorUsed: extracted.extractionMeta.extractorUsed,
            contentLength: extracted.extractionMeta.contentLength,
            requiresManualReview: context.requiresManualReview,
        },
        verificationChecklist: checklist.length > 0 ? checklist : context.verificationChecklist,
        findings: findings.length > 0 ? findings : [
            {
                area: 'Evidence Coverage',
                assessment: 'The listing was reviewed using the content exposed on the submitted page.',
                evidence: `${extracted.extractionMeta.contentLength} characters were extracted using ${extracted.extractionMeta.extractorUsed}.`,
                severity: context.evidenceQuality === 'strong' ? 'low' : 'medium',
            },
        ],
        verifiedSignals: unique([...context.verifiedSignals, ...asStringArray(record.verifiedSignals)]).slice(0, 8),
        riskSignals: unique([...context.riskSignals, ...asStringArray(record.riskSignals)]).slice(0, 8),
        missingInformation: unique([...context.missingInformation, ...asStringArray(record.missingInformation)]).slice(0, 10),
        recommendation: {
            verdict,
            score,
            reasoning: asString(
                recommendationRecord.reasoning,
                context.requiresManualReview
                    ? 'The listing contains meaningful unknowns or verification gaps, so it should be treated cautiously until key details are confirmed independently.'
                    : 'The available listing evidence appears usable, but you should still confirm identity, application routing, and compensation details before applying.'
            ),
            nextSteps,
        },
        audit: {
            analysisVersion: ANALYSIS_VERSION,
            model: MODEL_NAME,
            cached: false,
        },
    };
}

async function getAuthenticatedUserId(req: Request): Promise<string | null> {
    const authorization = req.headers.get('authorization');
    if (!authorization?.startsWith('Bearer ')) {
        return null;
    }

    const token = authorization.slice('Bearer '.length).trim();
    if (!token) {
        return null;
    }

    const { data, error } = await authClient.auth.getUser(token);
    if (error) {
        console.error('TruthLine auth verification failed:', error.message);
        return null;
    }

    return data.user?.id ?? null;
}

export async function POST(req: Request) {
    try {
        const { url } = await req.json();

        if (!url || !validateUrl(url)) {
            return NextResponse.json({ error: 'Invalid URL provided.' }, { status: 400 });
        }

        const normalized = normalizeUrl(url);
        const userId = await getAuthenticatedUserId(req);

        const { data: cached } = await supabase
            .from('truthline_analyses')
            .select('*')
            .eq('normalized_url', normalized)
            .eq('analysis_version', ANALYSIS_VERSION)
            .gt('created_at', new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString())
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (cached?.result_json) {
            const cachedResult = cached.result_json as AnalysisResult;
            cachedResult.audit = {
                analysisVersion: ANALYSIS_VERSION,
                model: MODEL_NAME,
                cached: true,
            };
            return NextResponse.json(cachedResult);
        }

        const extracted = await extractVacancyContent(url);
        if (!extracted || extracted.textContent.length < 250) {
            return NextResponse.json({
                error: 'The page was reachable, but it did not expose enough vacancy content for a reliable review.'
            }, { status: 422 });
        }

        const context = buildRuleBasedContext(extracted);
        const prompt = buildPrompt(url, extracted, context);

        const completion = await openai.chat.completions.create({
            model: MODEL_NAME,
            messages: [
                {
                    role: 'system',
                    content: 'You are a conservative job authenticity analyst. Be precise, evidence-based, and professional.',
                },
                { role: 'user', content: prompt },
            ],
            response_format: { type: 'json_object' },
        });

        const parsed = JSON.parse(completion.choices[0].message.content || '{}');
        const resultJson = normalizeResult(parsed, extracted, context);

        const { error: insertError } = await supabase
            .from('truthline_analyses')
            .insert({
                user_id: userId,
                vacancy_url: url,
                normalized_url: normalized,
                source_domain: extracted.sourceDomain,
                vacancy_title: resultJson.vacancy.title || extracted.title,
                company_name: resultJson.vacancy.company || 'Unknown',
                recommendation_verdict: resultJson.recommendation.verdict,
                recommendation_score: resultJson.recommendation.score,
                analysis_version: ANALYSIS_VERSION,
                confidence_level: resultJson.evidenceProfile.confidence,
                evidence_quality: resultJson.evidenceProfile.evidenceQuality,
                requires_manual_review: resultJson.evidenceProfile.requiresManualReview,
                result_json: resultJson,
            });

        if (insertError) {
            console.error('Supabase persistence error:', insertError);
        }

        return NextResponse.json(resultJson);
    } catch (error: unknown) {
        console.error('TruthLine API Error:', error);
        return NextResponse.json({
            error: getErrorMessage(error) || 'TruthLine could not complete the review right now. Please try again shortly.'
        }, { status: 500 });
    }
}
