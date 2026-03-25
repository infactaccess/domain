'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import PillNav from '@/components/PillNav';
import {
  FACEBOOK_APP_URL,
  FACEBOOK_WEB_URL,
  INSTAGRAM_APP_URL,
  INSTAGRAM_WEB_URL,
  WHATSAPP_WEB_URL,
  handleWhatsAppLinkClick,
  handleSocialLinkClick,
} from '@/lib/social';

const TargetCursor = dynamic(() => import('@/components/TargetCursor'), {
  ssr: false,
});

const navLinks = [
  { href: '/resources', label: 'Resources' },
  { href: '/dashboard', label: 'Membership' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

const shouldRenderDevEffects = process.env.NODE_ENV === 'production';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/');
  }

  async function handleNewsletter(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    try {
      await supabase.from('newsletter_subscribers').insert({ email });
      setSubscribed(true);
      setEmail('');
    } catch {
      // Intentionally silent to avoid blocking the footer UX.
    }
  }

  const navItems = navLinks.map((link) =>
    link.href === '/dashboard'
      ? { ...link, label: user ? 'Dashboard' : 'Membership' }
      : link
  );

  return (
    <>
      {shouldRenderDevEffects ? (
        <TargetCursor targetSelector="a, button, .btn, .articleCard, .broadcastCard" />
      ) : null}
      <header className={cn('app-header', pathname === '/' && 'is-home')}>
        <div className="top-bar">
          <div className="top-bar-inner">
            <span>Verified opportunities, practical guidance, and weekly alerts for young people</span>
            {user ? (
              <button onClick={handleLogout} className="top-bar-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                Logout
              </button>
            ) : null}
          </div>
        </div>

        <PillNav
          logo="/logo.png"
          logoAlt="IA"
          logoHref="/"
          items={[
            ...navItems,
            user
              ? { href: '#logout', label: 'Logout', onClick: (e) => { e?.preventDefault(); handleLogout(); } }
              : { href: '/auth', label: 'Join Infact Access' }
          ]}
          activeHref={pathname}
          initialLoadAnimation={shouldRenderDevEffects}
        />
      </header>

      <main>{children}</main>

      <footer className="footer">
        <div className="footer-inner">
          <div>
            <Link href="/" className="footer-brand">Infact Access</Link>
            <p className="footer-desc">
              A youth-focused content and membership platform that helps you discover verified opportunities, practical resources, trusted guidance, and update channels.
            </p>
            <div className="footer-socials" aria-label="Social media links">
              <a
                href={WHATSAPP_WEB_URL}
                className="footer-social-link"
                aria-label="WhatsApp"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsAppLinkClick}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="footer-social-icon">
                  <path fill="currentColor" d="M20.52 3.48A11.86 11.86 0 0 0 12.07 0C5.5 0 .17 5.33.17 11.9c0 2.1.55 4.15 1.6 5.96L0 24l6.31-1.65a11.9 11.9 0 0 0 5.76 1.47h.01c6.56 0 11.89-5.34 11.89-11.91 0-3.18-1.24-6.17-3.45-8.43Zm-8.45 18.3h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.22-3.75.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.24c0-5.46 4.44-9.9 9.91-9.9 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.9 7c0 5.46-4.45 9.9-9.9 9.9Zm5.43-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.39-1.47-.88-.78-1.48-1.74-1.66-2.04-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.5h-.57c-.2 0-.52.08-.8.37-.27.3-1.05 1.02-1.05 2.49 0 1.47 1.08 2.89 1.23 3.09.15.2 2.12 3.24 5.13 4.54.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.76-.72 2.01-1.42.25-.69.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z" />
                </svg>
              </a>

              <a
                href={FACEBOOK_WEB_URL}
                className="footer-social-link"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => handleSocialLinkClick(event, FACEBOOK_WEB_URL, FACEBOOK_APP_URL)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="footer-social-icon">
                  <path fill="currentColor" d="M22 12.07C22 6.5 17.52 2 12 2S2 6.5 2 12.07C2 17.1 5.66 21.27 10.44 22v-7.04H7.9v-2.89h2.54V9.86c0-2.52 1.49-3.91 3.78-3.91 1.1 0 2.25.2 2.25.2v2.48H15.2c-1.25 0-1.64.78-1.64 1.57v1.88h2.79l-.45 2.89h-2.34V22C18.34 21.27 22 17.1 22 12.07Z" />
                </svg>
              </a>

              <a
                href={INSTAGRAM_WEB_URL}
                className="footer-social-link"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => handleSocialLinkClick(event, INSTAGRAM_WEB_URL, INSTAGRAM_APP_URL)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="footer-social-icon">
                  <path fill="currentColor" d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5Zm8.93 1.35a1.07 1.07 0 1 1 0 2.14 1.07 1.07 0 0 1 0-2.14ZM12 6.86A5.14 5.14 0 1 1 6.86 12 5.15 5.15 0 0 1 12 6.86Zm0 1.8A3.34 3.34 0 1 0 15.34 12 3.35 3.35 0 0 0 12 8.66Z" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h4>Platform</h4>
            <ul>
              <li><Link href={user ? "/opportunities" : "/auth"}>Opportunities</Link></li>
              <li><Link href={user ? "/navigator" : "/auth"}>Opportunity Navigator</Link></li>
              <li><Link href="/dashboard">Membership</Link></li>
              <li><Link href="/resources">Resources</Link></li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h4>Stay Updated</h4>
            <p className="footer-desc">Unlock access to verified opportunities, useful resources, and weekly updates.</p>
            {subscribed ? (
              <p style={{ color: 'var(--secondary)', marginTop: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
                ✓ Subscribed!
              </p>
            ) : (
              <form onSubmit={handleNewsletter} className="footer-newsletter-input">
                <input
                  type="email"
                  className="input"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-primary btn-sm">Subscribe</button>
              </form>
            )}
          </div>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} Infact Access. All rights reserved.
        </div>
      </footer>
    </>
  );
}
