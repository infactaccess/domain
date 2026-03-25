'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : 'Failed to send message. Please try again later.';
}

export default function ContactPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: '',
        _gotcha: '' // Honeypot field for anti-spam
    });

    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Prevent duplicate rapid submissions if currently processing
        if (status === 'submitting') return;

        setStatus('submitting');
        setErrorMessage('');

        try {
            // Invoke the Supabase Edge Function to deliver the contact message securely
            const { data, error } = await supabase.functions.invoke('contact-form-submit', {
                body: formData,
            });

            if (error) {
                throw new Error(error.message || 'An unexpected error occurred while sending your message.');
            }

            // Handle server-returned validation errors smoothly without revealing raw server details if possible
            if (data?.error) {
                throw new Error(data.error);
            }

            setStatus('success');

            // Auto-reset the form success state after 5 seconds
            setTimeout(() => {
                setStatus('idle');
                setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '', _gotcha: '' });
            }, 5000);

        } catch (err: unknown) {
            console.error("Submission failed:", err);
            setStatus('error');
            setErrorMessage(getErrorMessage(err));
        }
    };

    return (
        <>
            <section className={styles.hero}>
                <div className={styles.heroGlow1} />
                <div className="container">
                    <h1 className={styles.heroTitle}>Contact Us</h1>
                    <p className={styles.heroDesc}>
                        We&apos;re here to help. Got a question, partnership idea, or just want to say hi? Reach out to us.
                    </p>
                </div>
            </section>

            <section className={styles.sectionLight}>
                <div className={`container ${styles.contactGrid}`}>

                    <div className={styles.contactInfoWrapper}>
                        <div className={styles.infoCard}>
                            <h2 className={styles.infoTitle}>Get in Touch</h2>
                            <p className={styles.infoDesc}>We typically respond within 24-48 business hours.</p>

                            <div className={styles.infoItem}>
                                <span className={styles.infoIcon}>📍</span>
                                <div>
                                    <strong>Location</strong>
                                    <p>Lagos, Nigeria</p>
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <span className={styles.infoIcon}>✉️</span>
                                <div>
                                    <strong>Email</strong>
                                    <p><a href="mailto:info@in-factaccess.com">info@in-factaccess.com</a></p>
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <span className={styles.infoIcon}>📞</span>
                                <div>
                                    <strong>Phone</strong>
                                    <p><a href="tel:+447539487898">+44 (753) 948-7898</a></p>
                                </div>
                            </div>
                        </div>

                        <div className={styles.mapCard}>
                            {/* Google Maps embed of Lagos, Nigeria */}
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126844.06233486164!2d3.262590206124508!3d6.536066205777174!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos%2C%20Nigeria!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={false}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Lagos, Nigeria Map"
                            ></iframe>
                        </div>
                    </div>

                    <div className={styles.formCard}>
                        <h2 className={styles.formTitle}>Send a Message</h2>

                        {status === 'success' ? (
                            <div className={styles.successMessage}>
                                <div className={styles.successIcon}>✓</div>
                                <h3>Thank you!</h3>
                                <p>Your message has been sent successfully. We&apos;ll be in touch soon.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className={styles.form}>

                                {/* Honeypot field, hidden from UI to catch basic spam bots */}
                                <input
                                    type="text"
                                    name="_gotcha"
                                    style={{ display: 'none' }}
                                    tabIndex={-1}
                                    autoComplete="off"
                                    value={formData._gotcha}
                                    onChange={(e) => setFormData({ ...formData, _gotcha: e.target.value })}
                                />

                                {status === 'error' && (
                                    <div style={{ color: 'red', backgroundColor: '#fee2e2', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                        {errorMessage}
                                    </div>
                                )}

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="firstName">First Name</label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            className="input"
                                            required
                                            disabled={status === 'submitting'}
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="lastName">Last Name</label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            className="input"
                                            required
                                            disabled={status === 'submitting'}
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="email">Email Address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="input"
                                            required
                                            disabled={status === 'submitting'}
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="phone">Phone Number</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            className="input"
                                            disabled={status === 'submitting'}
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="message">Message</label>
                                    <textarea
                                        id="message"
                                        className="input"
                                        rows={6}
                                        required
                                        disabled={status === 'submitting'}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{ width: '100%', marginTop: '1rem', opacity: status === 'submitting' ? 0.7 : 1 }}
                                    disabled={status === 'submitting'}
                                >
                                    {status === 'submitting' ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        )}
                    </div>

                </div>
            </section>
        </>
    );
}
