'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, syncProfileFromUser } from '@/lib/supabase';
import styles from './page.module.css';

type Mode = 'signin' | 'signup';
type PasswordTone = 'bad' | 'okay' | 'good';

const PASSWORD_RULES = {
  minLength: 8,
  strongLength: 12,
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /\d/,
  symbol: /[^A-Za-z0-9]/,
};

const NIGERIAN_STATES = [
  'Abia',
  'Adamawa',
  'Akwa Ibom',
  'Anambra',
  'Bauchi',
  'Bayelsa',
  'Benue',
  'Borno',
  'Cross River',
  'Delta',
  'Ebonyi',
  'Edo',
  'Ekiti',
  'Enugu',
  'Gombe',
  'Imo',
  'Jigawa',
  'Kaduna',
  'Kano',
  'Katsina',
  'Kebbi',
  'Kogi',
  'Kwara',
  'Lagos',
  'Nasarawa',
  'Niger',
  'Ogun',
  'Ondo',
  'Osun',
  'Oyo',
  'Plateau',
  'Rivers',
  'Sokoto',
  'Taraba',
  'Yobe',
  'Zamfara',
];

function getPasswordChecks(password: string) {
  return {
    minLength: password.length >= PASSWORD_RULES.minLength,
    uppercase: PASSWORD_RULES.uppercase.test(password),
    lowercase: PASSWORD_RULES.lowercase.test(password),
    number: PASSWORD_RULES.number.test(password),
    symbol: PASSWORD_RULES.symbol.test(password),
  };
}

function getPasswordFeedback(password: string): {
  tone: PasswordTone;
  summary: string;
  missing: string[];
} {
  const checks = getPasswordChecks(password);
  const missing = [
    !checks.minLength ? `at least ${PASSWORD_RULES.minLength} characters` : null,
    !checks.uppercase ? '1 uppercase letter' : null,
    !checks.lowercase ? '1 lowercase letter' : null,
    !checks.number ? '1 number' : null,
    !checks.symbol ? '1 symbol' : null,
  ].filter(Boolean) as string[];

  if (!password) {
    return {
      tone: 'bad',
      summary: 'Use at least 8 characters with uppercase, lowercase, number, and symbol.',
      missing,
    };
  }

  if (missing.length > 0) {
    return {
      tone: 'bad',
      summary: `Password is not acceptable yet. Missing ${missing.join(', ')}.`,
      missing,
    };
  }

  if (password.length >= PASSWORD_RULES.strongLength) {
    return {
      tone: 'good',
      summary: 'Strong password. This meets the standard and has good length.',
      missing,
    };
  }

  return {
    tone: 'okay',
    summary: 'Acceptable password. Add more length for stronger protection.',
    missing,
  };
}

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const passwordFeedback = getPasswordFeedback(password);
  const passwordsMatch = password === confirmPassword;
  const showConfirmMismatch = mode === 'signup' && confirmPassword.length > 0 && !passwordsMatch;
  const isSignupPasswordValid = mode !== 'signup' || (passwordFeedback.missing.length === 0 && passwordsMatch);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (mode === 'signup') {
      if (passwordFeedback.missing.length > 0) {
        setError(`Password does not yet meet the minimum standard. Missing ${passwordFeedback.missing.join(', ')}.`);
        return;
      }

      if (!passwordsMatch) {
        setError('Password and Confirm Password must match.');
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === 'signin') {
        const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        if (data.user) {
          await syncProfileFromUser(data.user);
        }
        router.push('/dashboard');
      } else {
        const signupMetadata = {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          full_name: `${firstName.trim()} ${lastName.trim()}`.trim(),
          phone: phoneNumber.trim(),
          phone_number: phoneNumber.trim(),
          city: city.trim(),
          state: state.trim(),
        };

        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: signupMetadata
          },
        });
        if (error) throw error;
        if (data.session && data.user) {
          await syncProfileFromUser(data.user);
        }
        if (data.session) {
          await supabase.auth.signOut();
        }

        setSuccess('Check your email to confirm your account, then sign in.');
        setMode('signin');
        setPassword('');
        setConfirmPassword('');
        setShowPassword(false);
        setShowConfirmPassword(false);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`container ${styles.authWrap}`}>
      <div className={`card animate-in ${styles.authCard}`}>
        <div className={styles.authLogo}>
          <Image
            src="/logo.png"
            alt="Infact Access logo"
            width={677}
            height={369}
            className={styles.logoImage}
            priority
          />
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${mode === 'signin' ? styles.tabActive : ''}`}
            onClick={() => { setMode('signin'); setError(null); setSuccess(null); }}
          >
            Sign In
          </button>
          <button
            className={`${styles.tab} ${mode === 'signup' ? styles.tabActive : ''}`}
            onClick={() => { setMode('signup'); setError(null); setSuccess(null); }}
          >
            Sign Up
          </button>
        </div>

        <h1 className={styles.authTitle}>
          {mode === 'signin' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className={styles.authSub}>
          {mode === 'signin'
            ? 'Sign in to access your personalized opportunity dashboard.'
            : "Join thousands discovering verified jobs and grants from the Government, NGO's and companies."}
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {mode === 'signup' && (
            <div className={styles.signupGrid}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="first-name">First Name</label>
                <input
                  id="first-name"
                  type="text"
                  className="input"
                  placeholder="Jane"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  autoComplete="given-name"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="last-name">Last Name</label>
                <input
                  id="last-name"
                  type="text"
                  className="input"
                  placeholder="Smith"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  autoComplete="family-name"
                />
              </div>
              <div className={`${styles.field} ${styles.fullSpan}`}>
                <label className={styles.label} htmlFor="phone-number">Phone Number</label>
                <input
                  id="phone-number"
                  type="tel"
                  className="input"
                  placeholder="+1 555 123 4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  autoComplete="tel"
                  inputMode="tel"
                />
              </div>
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label} htmlFor="auth-email">Email Address</label>
            <input
              id="auth-email"
              type="email"
              className="input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          {mode === 'signup' && (
            <div className={styles.signupGrid}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="city">City</label>
                <input
                  id="city"
                  type="text"
                  className="input"
                  placeholder="Lagos"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  autoComplete="address-level2"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="state">State</label>
                <select
                  id="state"
                  className="input"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                  autoComplete="address-level1"
                >
                  <option value="">Select a state</option>
                  {NIGERIAN_STATES.map((stateName) => (
                    <option key={stateName} value={stateName}>
                      {stateName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label} htmlFor="auth-password">Password</label>
            <div className={styles.passwordField}>
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                className={`input ${styles.passwordInput}`}
                placeholder={mode === 'signup' ? 'Create a secure password' : '********'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={PASSWORD_RULES.minLength}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M3.27 2 2 3.27l3.05 3.05C3.2 7.9 1.84 9.8 1 12c2 5 6.27 8 11 8 2.13 0 4.16-.6 5.96-1.72L20.73 21 22 19.73 3.27 2ZM12 18c-3.54 0-6.69-2.06-8.42-6 .74-1.68 1.83-3.03 3.16-4.03l2.1 2.1A4 4 0 0 0 13.93 15l2.56 2.56c-1.35.29-2.66.44-4.49.44Zm0-12c3.54 0 6.69 2.06 8.42 6-.65 1.48-1.58 2.72-2.7 3.67l-1.45-1.45A4 4 0 0 0 9.78 7.75L8.04 6.01C9.28 5.37 10.62 5 12 5Zm-.03 3a3 3 0 0 1 3 3c0 .35-.06.69-.17 1l-3.83-3.83c.31-.11.65-.17 1-.17Z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M12 5c4.73 0 9 3 11 7-2 4-6.27 7-11 7S3 16 1 12c2-4 6.27-7 11-7Zm0 2C8.48 7 5.32 9.06 3.58 12 5.32 14.94 8.48 17 12 17s6.68-2.06 8.42-5C18.68 9.06 15.52 7 12 7Zm0 2.5A2.5 2.5 0 1 1 9.5 12 2.5 2.5 0 0 1 12 9.5Zm0 2A.5.5 0 1 0 12.5 12a.5.5 0 0 0-.5-.5Z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <>
              <div
                className={`${styles.passwordHint} ${
                  passwordFeedback.tone === 'bad'
                    ? styles.passwordHintBad
                    : passwordFeedback.tone === 'okay'
                      ? styles.passwordHintOkay
                      : styles.passwordHintGood
                }`}
                aria-live="polite"
              >
                <strong>
                  {passwordFeedback.tone === 'bad'
                    ? 'Red: Password not acceptable yet.'
                    : passwordFeedback.tone === 'okay'
                      ? 'Yellow: Password is acceptable.'
                      : 'Green: Password is strong.'}
                </strong>
                <span>{passwordFeedback.summary}</span>
                <span>Rules: at least 8 characters, uppercase, lowercase, number, and symbol.</span>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="confirm-password">Confirm Password</label>
                <div className={styles.passwordField}>
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`input ${styles.passwordInput}`}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={PASSWORD_RULES.minLength}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    aria-pressed={showConfirmPassword}
                  >
                    {showConfirmPassword ? (
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path fill="currentColor" d="M3.27 2 2 3.27l3.05 3.05C3.2 7.9 1.84 9.8 1 12c2 5 6.27 8 11 8 2.13 0 4.16-.6 5.96-1.72L20.73 21 22 19.73 3.27 2ZM12 18c-3.54 0-6.69-2.06-8.42-6 .74-1.68 1.83-3.03 3.16-4.03l2.1 2.1A4 4 0 0 0 13.93 15l2.56 2.56c-1.35.29-2.66.44-4.49.44Zm0-12c3.54 0 6.69 2.06 8.42 6-.65 1.48-1.58 2.72-2.7 3.67l-1.45-1.45A4 4 0 0 0 9.78 7.75L8.04 6.01C9.28 5.37 10.62 5 12 5Zm-.03 3a3 3 0 0 1 3 3c0 .35-.06.69-.17 1l-3.83-3.83c.31-.11.65-.17 1-.17Z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path fill="currentColor" d="M12 5c4.73 0 9 3 11 7-2 4-6.27 7-11 7S3 16 1 12c2-4 6.27-7 11-7Zm0 2C8.48 7 5.32 9.06 3.58 12 5.32 14.94 8.48 17 12 17s6.68-2.06 8.42-5C18.68 9.06 15.52 7 12 7Zm0 2.5A2.5 2.5 0 1 1 9.5 12 2.5 2.5 0 0 1 12 9.5Zm0 2A.5.5 0 1 0 12.5 12a.5.5 0 0 0-.5-.5Z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div
                className={`${styles.passwordHint} ${showConfirmMismatch ? styles.passwordHintBad : styles.passwordHintGood}`}
                aria-live="polite"
              >
                <strong>
                  {showConfirmMismatch ? 'Passwords do not match.' : 'Confirm Password is in sync.'}
                </strong>
                <span>
                  {showConfirmMismatch
                    ? 'Enter the exact same password in both fields.'
                    : 'Your confirmation must exactly match the password above.'}
                </span>
              </div>
            </>
          )}

          {error && (
            <div className={styles.errorMsg} role="alert">
              Warning: {error}
            </div>
          )}
          {success && (
            <div className={styles.successMsg} role="status">
              Success: {success}
            </div>
          )}

          <button
            type="submit"
            className={`btn btn-primary ${styles.submitBtn}`}
            disabled={loading || !isSignupPasswordValid}
            id="auth-submit"
          >
            {loading
              ? 'Please wait...'
              : mode === 'signin'
                ? 'Sign In'
                : 'Create Account'}
          </button>
        </form>

        <p className={styles.switchMode}>
          {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <button
            className={styles.switchLink}
            onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); setSuccess(null); }}
          >
            {mode === 'signin' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}
