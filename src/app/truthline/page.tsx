'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : 'Failed to analyze the vacancy.';
}

type ConfidenceLevel = 'low' | 'medium' | 'high';
type EvidenceQuality = 'limited' | 'moderate' | 'strong';
type VerificationStatus = 'verified' | 'warning' | 'unverified' | 'not_found';

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
    verificationChecklist: Array<{
        label: string;
        status: VerificationStatus;
        detail: string;
        evidence: string;
    }>;
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
        verdict: string;
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

function formatLabel(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function TruthLinePage() {
    const router = useRouter();
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        async function checkAuth() {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/auth');
                return;
            }

            setIsCheckingAuth(false);
        }

        checkAuth();
    }, [router]);

    const validateInput = (input: string) => {
        try {
            const parsed = new URL(input);
            return parsed.protocol === 'http:' || parsed.protocol === 'https:';
        } catch {
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateInput(url)) {
            setError('Please enter a valid vacancy URL starting with http:// or https://.');
            return;
        }

        setError(null);
        setLoading(true);
        setResult(null);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.access_token) {
                router.push('/auth');
                return;
            }

            const res = await fetch('/api/truthline', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({ url }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to analyze the vacancy.');
            }

            setResult(data);
        } catch (err: unknown) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    if (isCheckingAuth) {
        return (
            <div className={styles.loadingSection} style={{ paddingTop: '10rem' }}>
                <div className={styles.spinner} />
                <p>Verifying access...</p>
            </div>
        );
    }

    return (
        <div className={`container ${styles.container}`}>
            <div className={styles.intro}>
                <div className={styles.kicker}>Application Safety Review</div>
                <h1 className={styles.title}>TruthLine</h1>
                <p className={styles.subtitle}>
                    Submit a live vacancy URL to review listing quality, verification signals, unknowns, and practical next steps before you apply.
                </p>
            </div>

            <div className={`card ${styles.searchCard}`}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="url" className={styles.label}>Vacancy URL</label>
                        <input
                            id="url"
                            type="text"
                            className={styles.input}
                            placeholder="https://www.linkedin.com/jobs/view/..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className={`btn btn-primary ${styles.submitBtn}`}
                        disabled={loading || !url}
                    >
                        {loading ? 'Reviewing...' : 'Review Vacancy'}
                    </button>
                </form>
            </div>

            {loading && (
                <div className={`card animate-in ${styles.loadingSection}`}>
                    <div className={styles.spinner} />
                    <p style={{ fontWeight: 700 }}>Running a vacancy authenticity review...</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                        Extracting job details, checking verification signals, and preparing an application safety brief.
                    </p>
                </div>
            )}

            {error && (
                <div className={`card animate-in ${styles.errorCard}`}>
                    <p style={{ color: '#b91c1c', fontWeight: 700 }}>{error}</p>
                </div>
            )}

            {result && !loading && (
                <div className={`animate-in ${styles.results}`}>
                    <div className={`card ${styles.verdictCard}`}>
                        <div className={styles.verdictInfo}>
                            <div className={styles.kicker}>Overall Recommendation</div>
                            <div className={styles.verdictValue}>{result.recommendation.verdict}</div>
                            <p className={styles.reasoning}>{result.recommendation.reasoning}</p>
                            <div className={styles.metaRow}>
                                <span className={`${styles.pill} ${styles['pill-' + result.evidenceProfile.confidence]}`}>
                                    {formatLabel(result.evidenceProfile.confidence)} confidence
                                </span>
                                <span className={`${styles.pill} ${styles['pill-evidence-' + result.evidenceProfile.evidenceQuality]}`}>
                                    {formatLabel(result.evidenceProfile.evidenceQuality)} evidence
                                </span>
                                <span className={styles.pill}>
                                    {result.evidenceProfile.sourceType === 'job_board' ? 'Job board source' : result.evidenceProfile.sourceType === 'company_site' ? 'Company site source' : 'Mixed source'}
                                </span>
                                {result.evidenceProfile.requiresManualReview && (
                                    <span className={`${styles.pill} ${styles.pillWarning}`}>Manual review recommended</span>
                                )}
                            </div>
                        </div>

                        <div className={styles.scorePanel}>
                            <label className={styles.label}>Trust Score</label>
                            <div className={styles.scoreCircle} style={{
                                borderColor: result.recommendation.score >= 80 ? '#15803d' : result.recommendation.score >= 60 ? '#a16207' : '#b91c1c',
                                color: result.recommendation.score >= 80 ? '#15803d' : result.recommendation.score >= 60 ? '#a16207' : '#b91c1c'
                            }}>
                                {result.recommendation.score}%
                            </div>
                            <p className={styles.scoreMeta}>
                                {result.audit.cached ? 'Returned from recent analysis cache.' : 'Freshly analyzed from the submitted page.'}
                            </p>
                        </div>
                    </div>

                    <section>
                        <h2 className={styles.sectionHead}>Vacancy Snapshot</h2>
                        <div className={styles.snapshotGrid}>
                            <div className={styles.snapItem}>
                                <label>Job Title</label>
                                <p>{result.vacancy.title || 'Not specified'}</p>
                            </div>
                            <div className={styles.snapItem}>
                                <label>Company</label>
                                <p>{result.vacancy.company || 'Not specified'}</p>
                            </div>
                            <div className={styles.snapItem}>
                                <label>Location</label>
                                <p>{result.vacancy.location || 'Not specified'}</p>
                            </div>
                            <div className={styles.snapItem}>
                                <label>Employment Type</label>
                                <p>{result.vacancy.employmentType || 'Not specified'}</p>
                            </div>
                            <div className={styles.snapItem}>
                                <label>Seniority</label>
                                <p>{result.vacancy.seniority || 'Not specified'}</p>
                            </div>
                            <div className={styles.snapItem}>
                                <label>Compensation</label>
                                <p>{result.vacancy.salary || 'Not disclosed'}</p>
                            </div>
                            <div className={styles.snapItem}>
                                <label>Deadline</label>
                                <p>{result.vacancy.deadline || 'Not specified'}</p>
                            </div>
                            <div className={`${styles.snapItem} ${styles.summaryItem}`}>
                                <label>Listing Summary</label>
                                <p>{result.vacancy.summary || 'No reliable listing summary was extracted.'}</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className={styles.sectionHead}>Verification Checklist</h2>
                        <div className={styles.grid}>
                            {result.verificationChecklist.map((item, idx) => (
                                <div key={idx} className={styles.checkCard}>
                                    <div className={styles.findingHeader}>
                                        <span className={styles.findingArea}>{item.label}</span>
                                        <span className={`${styles.severity} ${styles['status-' + item.status]}`}>
                                            {item.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <p className={styles.checkDetail}>{item.detail}</p>
                                    <p className={styles.evidenceText}>
                                        <strong>Evidence:</strong> {item.evidence}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className={styles.briefGrid}>
                        <div className={`card ${styles.briefCard}`}>
                            <h2 className={styles.sectionHead}>Verified Signals</h2>
                            <ul className={styles.signalList}>
                                {result.verifiedSignals.length > 0 ? result.verifiedSignals.map((signal, idx) => (
                                    <li key={idx}>{signal}</li>
                                )) : <li>No strong positive signals were confirmed from the page alone.</li>}
                            </ul>
                        </div>

                        <div className={`card ${styles.briefCard}`}>
                            <h2 className={styles.sectionHead}>Risk Signals</h2>
                            <ul className={styles.signalList}>
                                {result.riskSignals.length > 0 ? result.riskSignals.map((signal, idx) => (
                                    <li key={idx}>{signal}</li>
                                )) : <li>No major scam-pattern language was detected in the available listing text.</li>}
                            </ul>
                        </div>

                        <div className={`card ${styles.briefCard}`}>
                            <h2 className={styles.sectionHead}>Unknowns</h2>
                            <ul className={styles.signalList}>
                                {result.missingInformation.length > 0 ? result.missingInformation.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                )) : <li>No major information gaps were identified from the visible listing content.</li>}
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className={styles.sectionHead}>Assessment Notes</h2>
                        <div className={styles.grid}>
                            {result.findings.map((finding, idx) => (
                                <div key={idx} className={styles.findingCard}>
                                    <div className={styles.findingHeader}>
                                        <span className={styles.findingArea}>{finding.area}</span>
                                        <span className={`${styles.severity} ${styles['severity-' + finding.severity]}`}>
                                            {finding.severity} risk
                                        </span>
                                    </div>
                                    <p className={styles.checkDetail}>{finding.assessment}</p>
                                    <p className={styles.evidenceText}>
                                        <strong>Evidence:</strong> {finding.evidence}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className={styles.sectionHead}>Before You Apply</h2>
                        <div className={`card ${styles.stepsCard}`}>
                            <ol className={styles.stepsList}>
                                {result.recommendation.nextSteps.map((step, idx) => (
                                    <li key={idx}>{step}</li>
                                ))}
                            </ol>
                        </div>
                    </section>

                    <div className={styles.disclaimer}>
                        <p>
                            <strong>Professional Disclaimer:</strong> TruthLine reviews the publicly accessible listing content at the submitted URL and checks
                            for visible verification signals and common risk indicators. It is not a substitute for employer-side due diligence, legal review,
                            or direct confirmation through the official company website.
                        </p>
                        <p style={{ marginTop: '0.5rem' }}>
                            Reviewed at: {new Date(result.fetchedAt).toLocaleString()} | <a href={result.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>View original source</a>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
