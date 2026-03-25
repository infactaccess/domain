import styles from './page.module.css';

export default function AboutPage() {
    return (
        <>
            <section className={styles.hero}>
                <div className={styles.heroGlow1} />
                <div className="container">
                    <h1 className={styles.heroTitle}>About Infact Access</h1>
                    <p className={styles.heroDesc}>
                        Empowering young people with verified opportunities and practical guidance to build their careers.
                    </p>
                </div>
            </section>

            <section className={styles.sectionLight}>
                <div className="container">
                    <div className={styles.contentWrap}>
                        <h2 className={styles.sectionTitle}>Our Mission</h2>
                        <p className={styles.paragraph}>
                            Infact Access exists to cut through online misinformation and connect young people with genuine, verified opportunities. We make it easier to find trusted jobs, scholarships, grants, and training by carefully checking every listing, so users can apply with confidence and focus their efforts on opportunities that are real and worthwhile.
                        </p>
                        <p className={styles.paragraph}>
                            Our aim is to become a leading and trusted gateway for youth career and educational growth.
                        </p>

                        <h2 className={styles.sectionTitle} style={{ marginTop: '3rem' }}>Our Vision</h2>
                        <p className={styles.paragraph}>
                            We believe every young person deserves a fair chance to succeed, no matter their background. By providing a safe, simple, and reliable platform, Infact Access seeks to remove barriers, expand access to life-changing opportunities, and empower young people to reach their full potential.
                        </p>

                        <div className={styles.statsGrid} style={{ marginTop: '4rem' }}>
                            <div className={styles.statItem}>
                                <div className={styles.statValue}>Trust</div>
                                <div className={styles.statLabel}>100% verified listings</div>
                            </div>
                            <div className={styles.statItem}>
                                <div className={styles.statValue}>Access</div>
                                <div className={styles.statLabel}>Opportunities for everyone</div>
                            </div>
                            <div className={styles.statItem}>
                                <div className={styles.statLabel}>Guidance</div>
                                <div className={styles.statValue}>Practical support</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
