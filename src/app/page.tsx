import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import { FACEBOOK_APP_URL, FACEBOOK_WEB_URL, WHATSAPP_CHANNEL_URL } from '@/lib/social';
import HomePageActions from '@/components/HomePageActions';
import SocialLinkButton from '@/components/SocialLinkButton';

const features = [
  { title: 'Verified Opportunities', icon: '✨', items: ['Jobs', 'Grants', 'Scholarships', 'Training'] },
  { title: 'Opportunity Navigator', icon: '🧭', items: ['Guided question flow', 'Tailored discovery', 'Easier decision making'] },
  { title: 'Resources & Media Hub', icon: '📚', items: ['Articles', 'Explainers', 'Guides', 'Practical tips'] },
  { title: 'Membership Dashboard', icon: '🎛️', items: ['Saved opportunities', 'Personalised recommendations', 'Member-only resources'] },
  { title: 'Scam Awareness & Safety', icon: '🛡️', items: ['Safer discovery', 'Verification signals', 'Practical warnings'] },
  { title: 'Broadcast Channels', icon: '📱', items: ['WhatsApp alerts', 'Facebook', 'Email digests'] },
];

const articles = [
  {
    cat: 'Guidance',
    title: 'How to spot remote work scams before applying',
    image: '/1.png',
    alt: 'A scam alert shown on a phone in front of a fake job offer warning on a laptop',
  },
  {
    cat: 'Tips',
    title: '5 elements every winning grant essay has',
    image: '/2.png',
    alt: 'A student writing notes in a notebook beside an open laptop',
  },
  {
    cat: 'Explainers',
    title: 'Understanding fellowships vs. standard grants',
    image: '/3.png',
    alt: 'A person comparing fellowship and grant documents at a desk',
  },
];

export default function HomePage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroImageWrap}>
          <Image
            src="/hero-bg.png"
            alt="Infact Access - connecting young people to jobs, scholarships, grants, training programmes, practical resources, and useful guidance"
            fill
            priority
            className={styles.heroImage}
          />
          <div className={styles.heroImageOverlay} />
        </div>
        <div className={`container ${styles.heroContent}`}>
          <h1 className={styles.heroTitle}>
            Access verified opportunities.
            <br />
            Build skills. Make smarter moves.
          </h1>
          <p className={styles.heroDesc}>
            Infact Access helps young people discover trusted jobs, grants, training programmes, practical resources,
            and useful guidance - all in one place.
          </p>
          <div className={styles.heroCta}>
            <HomePageActions variant="hero" />
          </div>
        </div>
      </section>

      <section className={styles.statsBand}>
        <div className={`container ${styles.statsGrid}`}>
          <div className={styles.statItem}>
            <div className={styles.statValue}>1,000+</div>
            <div className={styles.statLabel}>Verified opportunities updated weekly</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>All-in-One</div>
            <div className={styles.statLabel}>Career, scholarship, & training support</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>100%</div>
            <div className={styles.statLabel}>Scam-awareness & practical safety guidance</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>Mobile-First</div>
            <div className={styles.statLabel}>Built for youth audiences on the go</div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionLight}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Everything you need, verified.</h2>
            <p className={styles.sectionSubtitle}>
              A comprehensive platform designed to filter out the noise and give you direct access to real
              opportunities.
            </p>
          </div>
          <div className={styles.featureGrid}>
            {features.map((feature) => (
              <div key={feature.title} className={styles.featureCard}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <ul className={styles.featureList}>
                  {feature.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.testimonialWrap}>
            <p className={styles.quote}>
              &ldquo;Infact Access helped me find opportunities I could actually trust. It feels like a youth platform
              that actually respects your time.&rdquo;
            </p>
            <div className={styles.quoter}>- Sarah M., Final Year Student</div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionLight}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Latest Insights & Resources</h2>
            <p className={styles.sectionSubtitle}>
              Practical advice, explainers, and guidance to help you secure the bag and build your career.
            </p>
          </div>
          <div className={styles.articleGrid}>
            {articles.map((article) => (
              <Link href="/resources" key={article.title} className={styles.articleCard}>
                <div className={styles.articleImage}>
                  <Image
                    src={article.image}
                    alt={article.alt}
                    fill
                    className={styles.articleImageMedia}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className={styles.articleContent}>
                  <span className={styles.articleCategory}>{article.cat}</span>
                  <h3 className={styles.articleTitle}>{article.title}</h3>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link href="/resources" className="btn btn-outline">
              View All Resources
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>How Infact Access Works</h2>
          </div>
          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>1</div>
              <h3 className={styles.stepTitle}>Discover what fits you</h3>
              <p className={styles.stepDesc}>
                Use the Navigator to answer simple questions and narrow down the noise.
              </p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>2</div>
              <h3 className={styles.stepTitle}>Explore verified opportunities</h3>
              <p className={styles.stepDesc}>Browse safe, checked listings and read our practical guidance.</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>3</div>
              <h3 className={styles.stepTitle}>Join, save, & stay updated</h3>
              <p className={styles.stepDesc}>Create a profile to save matches and get alerts straight to your phone.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container">
        <div className={styles.ctaBanner}>
          <h2 className={styles.ctaTitle}>Ready to unlock your potential?</h2>
          <p className={styles.ctaDesc}>
            Unlock access to verified opportunities, useful resources, and weekly updates.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <HomePageActions variant="cta" />
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionLight}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Get alerts where you want them.</h2>
            <p className={styles.sectionSubtitle}>
              Join our broadcast channels to get the best verified opportunities sent directly to you.
            </p>
          </div>
          <div className={styles.broadcastGrid}>
            <div className={styles.broadcastCard}>
              <span style={{ display: 'inline-flex' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="#25D366">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.405-.883-.733-1.48-1.639-1.653-1.939-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
              </span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>WhatsApp Updates</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Fast, verified alerts sent direct to your inbox.
              </p>
              <Link href={WHATSAPP_CHANNEL_URL} className="btn btn-outline">
                Join WhatsApp
              </Link>
            </div>
            <div className={styles.broadcastCard}>
              <span style={{ display: 'inline-flex' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Facebook Channel</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Join the community feed for daily drops.
              </p>
              <SocialLinkButton href={FACEBOOK_WEB_URL} appUrl={FACEBOOK_APP_URL} className="btn btn-outline">
                Follow Facebook
              </SocialLinkButton>
            </div>
            <div className={styles.broadcastCard}>
              <span style={{ fontSize: '2rem' }}>✉️</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Email Newsletter</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                The weekly roundup of our top picks.
              </p>
              <a href="#footer" className="btn btn-outline">
                Subscribe Below
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
