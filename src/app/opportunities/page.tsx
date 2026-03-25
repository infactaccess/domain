'use client';

import { useState, useEffect, useCallback } from 'react';
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

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown error';
}

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<JobOpportunity[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const PAGE_SIZE = 12;

  const fetchOpportunities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        search,
        category,
        page: page.toString(),
        pageSize: PAGE_SIZE.toString(),
      });

      const res = await fetch(`/api/opportunities?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch from live feed');
      const data = await res.json();

      setOpportunities(data.items || []);

      // Update dynamic categories only once or continuously? 
      // We will refresh categories matching the full feed from API response 
      // so that users know what's available. The API returns full unique categories list.
      if (data.categories) {
        setCategories(['All', ...data.categories]);
      }

      setTotal(data.total || 0);

    } catch (err: unknown) {
      console.error(getErrorMessage(err));
      setError('Live opportunities could not be loaded at this time.');
    } finally {
      setLoading(false);
    }
  }, [search, category, page]);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  return (
    <div className="container section">
      <div className="animate-in" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 className="section-title">Explore Opportunities</h1>
        <p className="section-subtitle">Browse and filter live job opportunities from trusted listings</p>
      </div>

      {/* ── Filters ── */}
      <div className={`card animate-in delay-1 ${styles.filterBar}`}>
        <input
          className="input"
          placeholder="Search by title, role or company..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
        />
        <div className={styles.catPillsContainer}>
          <div className={styles.catPills}>
            {categories.map((c) => (
              <button
                key={c}
                className={`${styles.pill} ${c === category ? styles.pillActive : ''}`}
                onClick={() => { setCategory(c); setPage(0); }}
              >
                {c.length > 25 ? c.substring(0, 25) + '...' : c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Results ── */}
      {error ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', marginTop: '2rem' }}>
          <h3 style={{ color: 'var(--error)' }}>Hmm, something went wrong</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '1rem' }}>
            {error}
          </p>
          <button className="btn btn-outline" onClick={fetchOpportunities}>
            Try Again
          </button>
        </div>
      ) : loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div className={styles.spinner} />
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Fetching live opportunities...</p>
        </div>
      ) : opportunities.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', marginTop: '2rem' }}>
          <h3>No opportunities found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Try adjusting your filters or search terms.
          </p>
        </div>
      ) : (
        <>
          <div className={`grid-3 ${styles.resultsGrid}`}>
            {opportunities.map((opp) => (
              <div key={opp.id} className={`card ${styles.oppCard}`}>
                <div className={styles.oppHeader}>
                  <span className={`badge badge-program`}>
                    {opp.category.length > 20 ? opp.category.substring(0, 20) + '...' : opp.category}
                  </span>
                  {opp.postedAt && (
                    <span className={styles.deadline}>
                      📅 {new Date(opp.postedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  )}
                </div>
                <h3 className={styles.oppTitle}>{opp.title}</h3>
                <p className={styles.oppOrg}>{opp.organization}</p>
                {opp.description && (
                  <p className={styles.oppDesc}>
                    {opp.description.replace(/<[^>]*>?/gm, '').slice(0, 120)}...
                  </p>
                )}
                <div className={styles.oppFooter}>
                  {opp.location && (
                    <span className={styles.country}>🌍 {opp.location}</span>
                  )}
                  {opp.jobType && (
                    <span className={styles.funding}>💼 {opp.jobType}</span>
                  )}
                </div>
                {opp.url && (
                  <a href={opp.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
                    View Job →
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className={styles.pagination}>
            <button className="btn btn-outline" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
              ← Previous
            </button>
            <span className={styles.pageNum}>Page {page + 1} of {Math.ceil(total / PAGE_SIZE) || 1}</span>
            <button
              className="btn btn-outline"
              disabled={(page + 1) * PAGE_SIZE >= total}
              onClick={() => setPage((p) => p + 1)}
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
