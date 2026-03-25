import * as cheerio from 'cheerio';

export interface ExtractedLink {
    label: string;
    href: string;
    domain: string;
    isExternal: boolean;
}

export interface StructuredJobPosting {
    title?: string;
    company?: string;
    location?: string;
    employmentType?: string;
    seniority?: string;
    salary?: string;
    deadline?: string;
    description?: string;
    companyWebsite?: string;
}

export interface ExtractionMeta {
    extractorUsed: string;
    contentLength: number;
    wasTruncated: boolean;
    structuredDataDetected: boolean;
    fetchedStatus: number;
}

export interface ExtractedContent {
    title: string;
    metaDescription: string;
    h1: string[];
    headings: string[];
    textContent: string;
    summaryText: string;
    sourceUrl: string;
    finalUrl: string;
    sourceDomain: string;
    rootDomain: string;
    canonicalUrl: string;
    emails: string[];
    applicationLinks: ExtractedLink[];
    companyWebsiteLinks: ExtractedLink[];
    salaryMentions: string[];
    suspiciousTerms: string[];
    structuredJobPosting: StructuredJobPosting | null;
    extractionMeta: ExtractionMeta;
}

const PRIVATE_HOST_PATTERNS = [
    /^localhost$/,
    /^127\./,
    /^10\./,
    /^192\.168\./,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    /^\[::1\]$/,
    /^::1$/,
    /^fc/i,
    /^fd/i,
];

const JOB_BOARD_DOMAINS = new Set([
    'linkedin.com',
    'indeed.com',
    'glassdoor.com',
    'lever.co',
    'greenhouse.io',
    'workday.com',
    'boards.greenhouse.io',
    'jobs.ashbyhq.com',
    'wellfound.com',
    'ziprecruiter.com',
]);

const SUSPICIOUS_PATTERNS = [
    /training fee/i,
    /upfront fee/i,
    /processing fee/i,
    /registration fee/i,
    /gift card/i,
    /wire transfer/i,
    /western union/i,
    /cryptocurrency/i,
    /bitcoin/i,
    /telegram/i,
    /whatsapp/i,
    /signal app/i,
    /download (?:our )?app/i,
    /purchase (?:your )?equipment/i,
    /reimbursement after purchase/i,
    /social security number/i,
    /\bssn\b/i,
    /bank account/i,
    /immediate start with no interview/i,
];

function getRootDomain(hostname: string): string {
    const parts = hostname.toLowerCase().split('.').filter(Boolean);
    if (parts.length <= 2) {
        return hostname.toLowerCase();
    }

    return parts.slice(-2).join('.');
}

function normalizeWhitespace(value: string): string {
    return value.replace(/\s+/g, ' ').trim();
}

function toAbsoluteUrl(baseUrl: string, href: string): string | null {
    try {
        return new URL(href, baseUrl).toString();
    } catch {
        return null;
    }
}

function uniqueStrings(values: string[]): string[] {
    return Array.from(new Set(values.filter(Boolean)));
}

function safeJsonParse(value: string): unknown {
    try {
        return JSON.parse(value);
    } catch {
        return null;
    }
}

function findJobPostingNode(input: unknown): Record<string, unknown> | null {
    if (!input) {
        return null;
    }

    if (Array.isArray(input)) {
        for (const item of input) {
            const found = findJobPostingNode(item);
            if (found) {
                return found;
            }
        }
        return null;
    }

    if (typeof input !== 'object') {
        return null;
    }

    const record = input as Record<string, unknown>;
    const rawType = record['@type'];

    if (typeof rawType === 'string' && rawType.toLowerCase() === 'jobposting') {
        return record;
    }

    if (Array.isArray(rawType) && rawType.some((item) => typeof item === 'string' && item.toLowerCase() === 'jobposting')) {
        return record;
    }

    for (const value of Object.values(record)) {
        const found = findJobPostingNode(value);
        if (found) {
            return found;
        }
    }

    return null;
}

function getStringField(value: unknown): string {
    if (typeof value === 'string') {
        return normalizeWhitespace(value);
    }

    if (typeof value === 'number') {
        return String(value);
    }

    return '';
}

function parseStructuredJobPosting($: cheerio.CheerioAPI): StructuredJobPosting | null {
    const jsonLdBlocks = $('script[type="application/ld+json"]')
        .map((_, el) => $(el).contents().text())
        .get()
        .map((text) => safeJsonParse(text))
        .filter(Boolean);

    for (const block of jsonLdBlocks) {
        const posting = findJobPostingNode(block);
        if (!posting) {
            continue;
        }

        const hiringOrganization = posting.hiringOrganization as Record<string, unknown> | undefined;
        const jobLocation = posting.jobLocation as Record<string, unknown> | Array<Record<string, unknown>> | undefined;
        const salaryBase = posting.baseSalary as Record<string, unknown> | undefined;
        const validThrough = getStringField(posting.validThrough);

        let location = '';
        const firstLocation = Array.isArray(jobLocation) ? jobLocation[0] : jobLocation;
        if (firstLocation && typeof firstLocation === 'object') {
            const place = firstLocation.address as Record<string, unknown> | undefined;
            const locality = getStringField(place?.addressLocality);
            const region = getStringField(place?.addressRegion);
            const country = getStringField(place?.addressCountry);
            location = [locality, region, country].filter(Boolean).join(', ');
        }

        let salary = '';
        if (salaryBase && typeof salaryBase === 'object') {
            const salaryValue = salaryBase.value as Record<string, unknown> | undefined;
            const minValue = getStringField(salaryValue?.minValue);
            const maxValue = getStringField(salaryValue?.maxValue);
            const unit = getStringField(salaryValue?.unitText);
            const rawValue = getStringField(salaryBase.value);
            salary = rawValue || [minValue && `$${minValue}`, maxValue && `$${maxValue}`, unit].filter(Boolean).join(' - ');
        }

        return {
            title: getStringField(posting.title),
            company: getStringField(hiringOrganization?.name),
            location,
            employmentType: getStringField(posting.employmentType),
            seniority: getStringField(posting.experienceRequirements),
            salary,
            deadline: validThrough,
            description: getStringField(posting.description),
            companyWebsite: getStringField(hiringOrganization?.sameAs),
        };
    }

    return null;
}

function extractLinks($: cheerio.CheerioAPI, url: string, sourceDomain: string) {
    const applicationLinks: ExtractedLink[] = [];
    const companyWebsiteLinks: ExtractedLink[] = [];

    $('a[href]').each((_, el) => {
        const href = $(el).attr('href');
        if (!href) {
            return;
        }

        const absolute = toAbsoluteUrl(url, href);
        if (!absolute) {
            return;
        }

        const label = normalizeWhitespace($(el).text());
        const linkUrl = new URL(absolute);
        const domain = linkUrl.hostname.toLowerCase();
        const isExternal = domain !== sourceDomain;
        const link: ExtractedLink = { label, href: absolute, domain, isExternal };
        const lowerLabel = label.toLowerCase();
        const lowerHref = absolute.toLowerCase();

        if (
            lowerLabel.includes('apply') ||
            lowerLabel.includes('job') ||
            lowerLabel.includes('career') ||
            lowerHref.includes('/apply') ||
            lowerHref.includes('/jobs') ||
            lowerHref.includes('/careers')
        ) {
            applicationLinks.push(link);
        }

        if (
            lowerLabel.includes('company website') ||
            lowerLabel.includes('about') ||
            lowerLabel.includes('homepage') ||
            lowerHref.includes('about') ||
            lowerHref.includes('company')
        ) {
            companyWebsiteLinks.push(link);
        }
    });

    return {
        applicationLinks: dedupeLinks(applicationLinks),
        companyWebsiteLinks: dedupeLinks(companyWebsiteLinks),
    };
}

function dedupeLinks(links: ExtractedLink[]): ExtractedLink[] {
    const seen = new Set<string>();
    return links.filter((link) => {
        if (seen.has(link.href)) {
            return false;
        }
        seen.add(link.href);
        return true;
    });
}

function extractSuspiciousTerms(text: string): string[] {
    return uniqueStrings(
        SUSPICIOUS_PATTERNS
            .map((pattern) => text.match(pattern)?.[0] || '')
            .filter(Boolean)
            .map((value) => value.toLowerCase())
    );
}

function extractSalaryMentions(text: string): string[] {
    const matches = text.match(/(?:\$|USD|EUR|GBP|NGN|KES|GHS)\s?[\d,]+(?:\s?-\s?(?:\$|USD|EUR|GBP|NGN|KES|GHS)?\s?[\d,]+)?(?:\s?(?:per|\/)\s?(?:hour|month|year))?/gi) || [];
    return uniqueStrings(matches.map((match) => normalizeWhitespace(match)).slice(0, 6));
}

function getExtractorCandidates($: cheerio.CheerioAPI) {
    return [
        { selector: '[itemtype*="JobPosting"]', name: 'schema-jobposting' },
        { selector: 'article', name: 'article' },
        { selector: '.job-description', name: 'job-description' },
        { selector: '.vacancy-details', name: 'vacancy-details' },
        { selector: '.job-details', name: 'job-details' },
        { selector: 'main', name: 'main' },
        { selector: '#content', name: 'content-id' },
        { selector: '.content', name: 'content-class' },
    ].filter(({ selector }) => $(selector).length > 0);
}

/**
 * Validates if the given string is a valid HTTP/HTTPS URL and not a private network target.
 */
export function validateUrl(url: string): boolean {
    try {
        const parsed = new URL(url);
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
            return false;
        }

        const hostname = parsed.hostname.toLowerCase();
        if (PRIVATE_HOST_PATTERNS.some((pattern) => pattern.test(hostname))) {
            return false;
        }

        return true;
    } catch {
        return false;
    }
}

/**
 * Normalizes a URL for caching purposes.
 */
export function normalizeUrl(url: string): string {
    try {
        const parsed = new URL(url);
        const paramsToKeep = ['id', 'jobId', 'job_id', 'gh_jid', 'lever-source', 'v', 'p'];
        const searchParams = new URLSearchParams();

        parsed.searchParams.forEach((value, key) => {
            const lowerKey = key.toLowerCase();
            if (paramsToKeep.includes(key) || lowerKey.includes('job') || lowerKey.includes('gh_jid')) {
                searchParams.append(key, value);
            }
        });

        parsed.search = searchParams.toString();
        parsed.hash = '';
        return parsed.toString();
    } catch {
        return url;
    }
}

/**
 * Fetches HTML from a URL and extracts meaningful job-related content and signals.
 */
export async function extractVacancyContent(url: string): Promise<ExtractedContent | null> {
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
            },
            redirect: 'follow',
            next: { revalidate: 3600 },
        });

        if (!response.ok) {
            console.error(`Failed to fetch URL: ${url}, status: ${response.status}`);
            return null;
        }

        const html = await response.text();
        const finalUrl = response.url || url;
        const finalParsed = new URL(finalUrl);
        const sourceDomain = finalParsed.hostname.toLowerCase();
        const rootDomain = getRootDomain(sourceDomain);
        const $ = cheerio.load(html);

        $('script:not([type="application/ld+json"]), style, nav, footer, header, noscript, iframe, link, .ads, .sidebar, .menu').remove();

        const title = normalizeWhitespace($('title').text());
        const metaDescription = normalizeWhitespace($('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '');
        const canonicalUrl = $('link[rel="canonical"]').attr('href') || finalUrl;
        const h1 = $('h1').map((_, el) => normalizeWhitespace($(el).text())).get().filter(Boolean);
        const headings = $('h2, h3').map((_, el) => normalizeWhitespace($(el).text())).get().filter(Boolean).slice(0, 20);

        const structuredJobPosting = parseStructuredJobPosting($);
        const extractorCandidates = getExtractorCandidates($);
        let extractorUsed = 'body-fallback';
        let textContent = '';

        for (const candidate of extractorCandidates) {
            const candidateText = normalizeWhitespace($(candidate.selector).text());
            if (candidateText.length > textContent.length) {
                textContent = candidateText;
                extractorUsed = candidate.name;
            }
        }

        if (textContent.length < 300) {
            textContent = normalizeWhitespace($('body').text());
            extractorUsed = 'body-fallback';
        }

        const { applicationLinks, companyWebsiteLinks } = extractLinks($, finalUrl, sourceDomain);
        const emailMatches = html.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || [];
        const emails = uniqueStrings(emailMatches.map((value) => value.toLowerCase())).slice(0, 10);
        const salaryMentions = extractSalaryMentions(textContent);
        const suspiciousTerms = extractSuspiciousTerms(textContent);

        let wasTruncated = false;
        const maxLength = 14000;
        if (textContent.length > maxLength) {
            textContent = `${textContent.slice(0, maxLength)} ... [truncated]`;
            wasTruncated = true;
        }

        const structuredDescription = structuredJobPosting?.description ? normalizeWhitespace(structuredJobPosting.description) : '';
        const summaryText = normalizeWhitespace(
            [metaDescription, structuredDescription, textContent.slice(0, 1200)]
                .filter(Boolean)
                .join(' ')
        ).slice(0, 1600);

        return {
            title,
            metaDescription,
            h1,
            headings,
            textContent,
            summaryText,
            sourceUrl: url,
            finalUrl,
            sourceDomain,
            rootDomain,
            canonicalUrl,
            emails,
            applicationLinks,
            companyWebsiteLinks,
            salaryMentions,
            suspiciousTerms,
            structuredJobPosting,
            extractionMeta: {
                extractorUsed,
                contentLength: textContent.length,
                wasTruncated,
                structuredDataDetected: Boolean(structuredJobPosting),
                fetchedStatus: response.status,
            },
        };
    } catch (error) {
        console.error('Error extracting content:', error);
        return null;
    }
}

export function isLikelyJobBoard(domain: string): boolean {
    const normalized = domain.toLowerCase();
    return Array.from(JOB_BOARD_DOMAINS).some((candidate) => normalized === candidate || normalized.endsWith(`.${candidate}`));
}

