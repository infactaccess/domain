'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { supabase } from '@/lib/supabase';
import { FACEBOOK_APP_URL, FACEBOOK_WEB_URL, handleSocialLinkClick } from '@/lib/social';

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown error';
}

type Step = {
  id: string;
  question: string;
  options: string[];
  field: string;
};

const INITIAL_STEP: Step = {
  id: 'category',
  question: 'What type of opportunity are you looking for?',
  options: ['Grant', 'Verified Jobs'],
  field: 'category',
};

const GRANTS_STEPS: Step[] = [
  {
    id: 'entity',
    question: 'What type of entity are you?',
    options: ['Individual', 'Startup', 'Small Business', 'Non-Profit'],
    field: 'entity_type',
  },
  {
    id: 'industry',
    question: 'What is your industry or focus area?',
    options: ['Technology', 'Agriculture', 'Social Impact', 'Creative/Arts', 'General'],
    field: 'industry',
  },
  {
    id: 'funding',
    question: 'What level of funding are you seeking?',
    options: ['Under $10k', '$10k - $50k', 'Over $50k'],
    field: 'funding_level',
  },
];

const JOBS_STEPS: Step[] = [
  {
    id: 'career',
    question: 'What level of experience do you have?',
    options: ['Entry Level', 'Mid Level', 'Senior', 'Executive'],
    field: 'experience_level',
  },
  {
    id: 'field',
    question: 'What is your preferred industry?',
    options: ['Technology', 'Finance', 'Healthcare', 'Operations', 'General'],
    field: 'industry',
  },
  {
    id: 'region',
    question: 'Where are you looking to work?',
    options: ['Remote', 'Lagos', 'Abuja', 'Other Nigeria', 'International'],
    field: 'work_location',
  },
];

type JobOpportunity = {
  id: string;
  title: string;
  organization: string;
  category: string;
  location: string | null;
  description: string;
  url: string;
  postedAt: string | null;
  deadline: string | null;
  jobType: string | null;
  source: 'myjobmag';
};

export default function NavigatorPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<JobOpportunity[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const activeSteps =
    answers.category === 'Grant' ? [INITIAL_STEP, ...GRANTS_STEPS] :
      answers.category === 'Verified Jobs' ? [INITIAL_STEP, ...JOBS_STEPS] :
        [INITIAL_STEP];

  const handleSelect = async (option: string) => {
    const step = activeSteps[currentStep];
    const newAnswers = { ...answers, [step.field]: option };
    setAnswers(newAnswers);

    const nextSteps =
      newAnswers.category === 'Grant' ? [INITIAL_STEP, ...GRANTS_STEPS] :
        newAnswers.category === 'Verified Jobs' ? [INITIAL_STEP, ...JOBS_STEPS] :
          [INITIAL_STEP];

    if (currentStep < nextSteps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      // Final step — fetch results
      setLoading(true);

      try {
        const searchParams = new URLSearchParams({ pageSize: '12' });

        if (newAnswers.experience_level) {
          searchParams.append('experienceLevel', newAnswers.experience_level);
        }

        if (newAnswers.industry) {
          searchParams.append('industry', newAnswers.industry);
        }

        if (newAnswers.work_location) {
          searchParams.append('workLocation', newAnswers.work_location);
        }

        const res = await fetch(`/api/opportunities?${searchParams.toString()}`);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        setResults(data.items || []);
      } catch (err) {
        console.error('Error fetching matches:', err);
        setResults([]);
      }

      setLoading(false);
    }
  };

  const handleSaveMatches = async () => {
    setSaveStatus('Saving...');
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      setSaveStatus('Please sign in to save matches.');
      return;
    }

    if (!results || results.length === 0) {
      setSaveStatus('No matches to save.');
      return;
    }

    try {
      let savedCount = 0;
      let lastError = '';
      const newSavedIds = new Set(savedIds);

      for (const opp of results) {
        const { error: upsertError } = await supabase
          .from('opportunities')
          .upsert({
            id: opp.id,
            title: opp.title,
            organization: opp.organization,
            type: opp.category,
            description: opp.description,
            location: opp.location,
            url: opp.url,
            deadline: opp.deadline,
            eligibility: opp.jobType || null
          }, { onConflict: 'id' });

        if (upsertError) {
          console.error('Error upserting opportunity:', upsertError);
          lastError = upsertError.message;
          continue;
        }

        const { error } = await supabase
          .from('saved_opportunities')
          .insert({ profile_id: session.user.id, opportunity_id: opp.id });

        if (!error) {
          savedCount++;
          newSavedIds.add(opp.id);
        } else if (error.code === '23505') {
          // Already saved
        } else {
          lastError = error.message;
        }
      }

      if (savedCount > 0) {
        setSavedIds(newSavedIds);
        setSaveStatus(`Saved ${savedCount} matches! Redirecting...`);
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        setSaveStatus(`Save failed: ${lastError || 'Matches already saved or no new matches found.'}`);
      }
    } catch (e: unknown) {
      console.error(e);
      setSaveStatus(`Failed to save matches: ${getErrorMessage(e)}`);
    }
  };

  const resetNavigator = () => {
    setCurrentStep(0);
    setAnswers({});
    setResults(null);
    setLoading(false);
    setSaveStatus(null);
  };

  const progress = results ? 100 : ((currentStep) / activeSteps.length) * 100;
  const step = activeSteps[currentStep];

  return (
    <div className="container section">
      <div className="animate-in" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 className="section-title">Opportunity Navigator</h1>
        <p className={`section-subtitle ${styles.pageSubtitle}`}>Answer a few questions and we&apos;ll match you with the best opportunities</p>
      </div>

      {/* Progress */}
      <div className={`card-glass card animate-in delay-1 ${styles.navigatorCard}`}>
        <div className="progress-bar" style={{ marginBottom: '2rem' }}>
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <div className={styles.spinner} />
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Finding your best matches...</p>
          </div>
        ) : results ? (
          /* ── Results View ── */
          <div>
            {answers.category === 'Grant' ? (
              <div className={styles.grantResultIntro}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.8rem', fontWeight: 'bold' }}>Grant Opportunities</h2>
                <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', lineHeight: '1.6' }}>
                  <p style={{ marginBottom: '1rem' }}>
                    Grants are highly competitive and often have limited application windows.
                  </p>
                  <p style={{ marginBottom: '1rem' }}>
                    To ensure you receive the latest verified grant opportunities, application links, and guidance on how to apply for the specific grant type you selected, please follow the Infact Access Facebook page.
                  </p>
                  <p style={{ marginBottom: '2rem' }}>
                    We regularly publish new grant opportunities and application guidance there to help members stay informed and improve their chances of success.
                  </p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
                  <a
                    href={FACEBOOK_WEB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.grantFacebookLink} footer-social-link`}
                    aria-label="Facebook"
                    onClick={(event) => handleSocialLinkClick(event, FACEBOOK_WEB_URL, FACEBOOK_APP_URL)}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.grantFacebookIcon}>
                      <path fill="currentColor" d="M22 12.07C22 6.5 17.52 2 12 2S2 6.5 2 12.07C2 17.1 5.66 21.27 10.44 22v-7.04H7.9v-2.89h2.54V9.86c0-2.52 1.49-3.91 3.78-3.91 1.1 0 2.25.2 2.25.2v2.48H15.2c-1.25 0-1.64.78-1.64 1.57v1.88h2.79l-.45 2.89h-2.34V22C18.34 21.27 22 17.1 22 12.07Z" />
                    </svg>
                  </a>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button className="btn btn-outline" onClick={resetNavigator}>Start Over</button>
                </div>
              </div>
            ) : (
              <>
                <div className={styles.resultHeader}>
                  <h2>🎉 We found <span style={{ color: 'var(--primary)' }}>{results.length}</span> matches!</h2>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-primary" onClick={handleSaveMatches}>Save to Dashboard</button>
                    <button className="btn btn-outline" onClick={resetNavigator}>Start Over</button>
                  </div>
                </div>
                {saveStatus && <p style={{ color: 'var(--primary)', marginBottom: '1rem', fontWeight: 600 }}>{saveStatus}</p>}
                <div className={styles.answerSummary}>
                  {Object.entries(answers).map(([key, val]) => (
                    <span key={key} className="badge badge-grant">{val}</span>
                  ))}
                </div>
                {results.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p style={{ color: 'var(--text-muted)' }}>No opportunities match your profile yet. Try adjusting your preferences.</p>
                  </div>
                ) : (
                  <div className={styles.resultsList}>
                    {results.map((opp) => (
                      <div key={opp.id} className={`card ${styles.resultItem}`}>
                        <div>
                          <h3 className={styles.resultTitle}>{opp.title}</h3>
                          <p className={styles.resultOrg}>{opp.organization}</p>
                        </div>
                        <div className={styles.resultMeta}>
                          {opp.location && <span className={styles.resultFund}>📍 {opp.location}</span>}
                          {opp.postedAt && <span>📅 {new Date(opp.postedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
                        </div>
                        {opp.url && (
                          <a href={opp.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ marginTop: '0.75rem' }}>
                            View Opportunity →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          /* ── Question View ── */
          <div className={styles.questionView}>
            <div className={styles.stepIndicator}>
              Step {currentStep + 1} of {activeSteps.length}
            </div>
            <h2 className={styles.question}>{step.question}</h2>
            <div className={styles.optionsGrid}>
              {step.options.map((opt) => (
                <button key={opt} className={styles.optionBtn} onClick={() => handleSelect(opt)}>
                  {opt}
                </button>
              ))}
            </div>
            {currentStep > 0 && (
              <button className="btn btn-outline" style={{ marginTop: '1.5rem' }} onClick={() => setCurrentStep((s) => s - 1)}>
                ← Go Back
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
