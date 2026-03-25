'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase, syncProfileFromUser } from '@/lib/supabase';
import styles from './page.module.css';

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

type Resource = {
  id: string;
  title: string;
  type: string;
  url: string | null;
  description: string | null;
};

type User = {
  id: string;
  email?: string;
};

const UPCOMING_DEADLINE_WINDOW_DAYS = 7;

function parseStoredDate(value: string | null): Date | null {
  if (!value) {
    return null;
  }

  const isoDateMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoDateMatch) {
    const [, year, month, day] = isoDateMatch;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function isDeadlineWithinDays(deadline: string | null, days: number): boolean {
  const deadlineDate = parseStoredDate(deadline);
  if (!deadlineDate) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const cutoff = new Date(today);
  cutoff.setDate(cutoff.getDate() + days);

  return deadlineDate >= today && deadlineDate <= cutoff;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState<JobOpportunity[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [firstName, setFirstName] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await syncProfileFromUser(session.user);

        // Fetch profile to get names
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name')
          .eq('id', session.user.id)
          .single();

        if (profile?.first_name) {
          setFirstName(profile.first_name);
        } else if (typeof session.user.user_metadata?.first_name === 'string') {
          setFirstName(session.user.user_metadata.first_name);
        }

        // Load the user's saved IDs from Supabase first
        const userSavedIds = await fetchSavedItemIds(session.user.id);

        await Promise.all([
          fetchOpportunities(userSavedIds),
          fetchResources(),
        ]);
      } else {
        // Guest mode: don't show any featured jobs anymore as per request
        await Promise.all([fetchOpportunities(new Set()), fetchResources()]);
      }
      setLoading(false);
    }
    init();
  }, []);

  async function fetchOpportunities(userSavedIds: Set<string>) {
    try {
      if (userSavedIds.size > 0) {
        // Fetch SPECIFIC saved jobs from our DB (the ones we upserted in navigator)
        const { data, error } = await supabase
          .from('opportunities')
          .select('*')
          .in('id', Array.from(userSavedIds));

        if (error) throw error;

        // Map DB fields back to JobOpportunity type
        const mappedJobs: JobOpportunity[] = (data || []).map(item => ({
          id: item.id,
          title: item.title,
          organization: item.organization,
          category: item.type || 'General',
          location: item.location,
          description: item.description || '',
          url: item.url || '',
          postedAt: item.created_at, // Use created_at as fallback
          deadline: item.deadline,
          jobType: item.eligibility, // eligibility maps to jobType in our app
          source: 'myjobmag'
        }));

        setOpportunities(mappedJobs);
      } else {
        // Empty mode / Guest: no opportunities
        setOpportunities([]);
      }
    } catch (e) {
      console.error('Failed to load opportunities for dashboard', e);
      setOpportunities([]);
    }
  }

  async function fetchResources() {
    const { data } = await supabase.from('resources').select('*').limit(4);
    if (data) setResources(data);
  }

  async function fetchSavedItemIds(userId: string): Promise<Set<string>> {
    const { data } = await supabase
      .from('saved_opportunities')
      .select('opportunity_id')
      .eq('profile_id', userId);

    const ids = new Set<string>(data ? data.map((r) => r.opportunity_id) : []);
    setSavedIds(ids);
    return ids;
  }

  async function toggleSave(oppId: string) {
    if (!user) return;
    if (savedIds.has(oppId)) {
      await supabase
        .from('saved_opportunities')
        .delete()
        .match({ profile_id: user.id, opportunity_id: oppId });
      setSavedIds((prev) => { const s = new Set(prev); s.delete(oppId); return s; });
      setOpportunities((prev) => prev.filter((opp) => opp.id !== oppId));
    } else {
      await supabase
        .from('saved_opportunities')
        .insert({ profile_id: user.id, opportunity_id: oppId });
      setSavedIds((prev) => new Set([...prev, oppId]));
    }
  }

  const greeting = user
    ? `Welcome back, ${firstName?.trim() || user.email?.split('@')[0] || 'Member'}!`
    : 'Your Opportunity Dashboard';

  const upcomingDeadlines = opportunities.filter((o) =>
    isDeadlineWithinDays(o.deadline, UPCOMING_DEADLINE_WINDOW_DAYS)
  ).length;
  const savedCount = savedIds.size;

  if (loading) {
    return (
      <div className="container section" style={{ textAlign: 'center', paddingTop: '6rem' }}>
        <div className={styles.spinner} />
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container section">
      {/* ── Header ── */}
      <div className={`animate-in ${styles.dashHeader}`}>
        <div>
          <h1 className={styles.dashTitle}>{greeting}</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {user
              ? "Here's a summary of your activity and matching opportunities."
              : 'Sign in to unlock personalized matches and track saved opportunities.'}
          </p>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className={`animate-in delay-1 ${styles.statsRow}`}>
        <div className={`card ${styles.statCard}`}>
          <div className={styles.statNum}>{opportunities.length}</div>
          <div className={styles.statLabel}>Matching Opportunities</div>
        </div>
        <div className={`card ${styles.statCard}`}>
          <div className={styles.statNum}>{savedCount}</div>
          <div className={styles.statLabel}>Saved</div>
        </div>
        <div className={`card ${styles.statCard}`}>
          <div className={styles.statNum}>{upcomingDeadlines}</div>
          <div className={styles.statLabel}>Upcoming Deadlines</div>
        </div>
        <div className={`card ${styles.statCard}`}>
          <div className={styles.statNum}>{resources.length}</div>
          <div className={styles.statLabel}>Resources Available</div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className={`animate-in delay-2 card ${styles.actions}`}>
        <h2 className={styles.sectionHead}>Quick Actions</h2>
        <div className={styles.actionBtns}>
          <Link href={user ? "/opportunities" : "/auth"} className="btn btn-primary">Browse All Opportunities</Link>
          <Link href={user ? "/navigator" : "/auth"} className="btn btn-outline">Use the Navigator</Link>
          <Link href={user ? "/truthline" : "/auth"} className="btn btn-outline">TruthLine</Link>
          <Link href="/grants" className="btn btn-outline">Grants</Link>
          <Link href={user ? "/bintu" : "/auth"} className="btn btn-outline">Ask Bintu</Link>
        </div>
      </div>

      {/* ── Matched Opportunities ── */}
      {user && opportunities.length > 0 && (
        <section className="animate-in delay-2" style={{ marginTop: '2.5rem' }}>
          <h2 className={styles.sectionHead}>
            Your Matches
          </h2>
          <div className={`grid-3 ${styles.cardGrid}`}>
            {opportunities.map((opp) => (
              <div key={opp.id} className={`card ${styles.oppCard}`}>
                <div className={styles.oppTop}>
                  <span className={`badge badge-program`}>
                    {opp.category.length > 20 ? opp.category.substring(0, 20) + '...' : opp.category}
                  </span>
                  <button
                    className={`${styles.saveBtn} ${savedIds.has(opp.id) ? styles.saved : ''}`}
                    onClick={() => toggleSave(opp.id)}
                    title={savedIds.has(opp.id) ? 'Remove Match' : 'Save'}
                    aria-label={savedIds.has(opp.id) ? 'Remove Match' : 'Save'}
                  >
                    {savedIds.has(opp.id) ? '✕' : '♡'}
                  </button>
                </div>
                <h3 className={styles.oppTitle}>{opp.title}</h3>
                <p className={styles.oppOrg}>{opp.organization}</p>
                <div className={styles.oppMeta}>
                  {opp.location && <span>📍 {opp.location}</span>}
                  {opp.postedAt && (
                    <span>📅 {new Date(opp.postedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  )}
                  {opp.jobType && <span>💼 {opp.jobType}</span>}
                </div>
                {opp.url && (
                  <a href={opp.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ marginTop: '1rem', display: 'block', textAlign: 'center' }}>
                    View Job →
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Resources ── */}
      {resources.length > 0 && (
        <section className="animate-in delay-3" style={{ marginTop: '2.5rem' }}>
          <h2 className={styles.sectionHead}>Resources & Guides</h2>
          <div className={`grid-2 ${styles.cardGrid}`}>
            {resources.map((res) => (
              <div key={res.id} className={`card ${styles.resourceCard}`}>
                <div className={styles.resType}>{res.type}</div>
                <h3 className={styles.resTitle}>{res.title}</h3>
                {res.description && (
                  <p className={styles.resDesc}>{res.description}</p>
                )}
                {res.url && (
                  <a href={res.url} target="_blank" rel="noopener noreferrer" className={styles.resLink}>
                    Read Guide →
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
