'use client';

import styles from './broadcasts.module.css';

export default function BroadcastsPage() {
    const channels = [
        {
            title: 'WhatsApp Updates',
            desc: 'Fast, verified alerts sent direct to your inbox. We promise no spam, just real opportunities.',
            icon: '💬',
            action: 'Join WhatsApp',
            link: '#',
        },
        {
            title: 'Telegram Channel',
            desc: 'Join the community feed for daily drops, quick tips, and real-time updates.',
            icon: '✈️',
            action: 'Join Telegram',
            link: '#',
        },
        {
            title: 'Email Newsletter',
            desc: 'The weekly roundup of our top picks, detailed explainers, and exclusive guidance.',
            icon: '✉️',
            action: 'Subscribe Now',
            link: '#footer',
        },
    ];

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-body)' }}>
            <header className={styles.header}>
                <div className="container">
                    <h1 className={styles.title}>Broadcast Channels</h1>
                    <p className={styles.subtitle}>
                        Get alerts where you want them. Join our broadcast channels to get the best verified opportunities sent directly to you.
                    </p>
                </div>
            </header>

            <main className="container">
                <div className={styles.grid}>
                    {channels.map((channel) => (
                        <div key={channel.title} className={styles.card}>
                            <div className={styles.icon}>{channel.icon}</div>
                            <h2 className={styles.cardTitle}>{channel.title}</h2>
                            <p className={styles.cardDesc}>{channel.desc}</p>
                            <a href={channel.link} className="btn btn-primary" style={{ width: '100%' }}>
                                {channel.action}
                            </a>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
