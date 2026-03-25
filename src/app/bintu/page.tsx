'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

type ChatRole = 'user' | 'assistant';

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  pending?: boolean;
};

const STARTER_PROMPTS = [
  'What does Infact Access help users do?',
  'How does Infact Access verify opportunities?',
  'What kinds of opportunities can I find here?',
  'Explain the mission of Infact Access',
];

const STORAGE_PREFIX = 'bintu-chat:';

function createMessage(role: ChatRole, content: string, extras?: Partial<ChatMessage>): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
    ...extras,
  };
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Bintu could not respond right now.';
}

export default function BintuPage() {
  const router = useRouter();
  const revealTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const transcriptRef = useRef<HTMLDivElement | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push('/auth');
        return;
      }

      const storageKey = `${STORAGE_PREFIX}${session.user.id}`;
      const cached = window.localStorage.getItem(storageKey);

      setUserId(session.user.id);

      if (cached) {
        try {
          const parsed = JSON.parse(cached) as { sessionId: string | null; messages: ChatMessage[] };
          setSessionId(parsed.sessionId ?? null);
          setMessages(Array.isArray(parsed.messages) ? parsed.messages.filter((message) => !message.pending) : []);
        } catch {
          window.localStorage.removeItem(storageKey);
        }
      }

      setIsCheckingAuth(false);
    }

    checkAuth();

    return () => {
      if (revealTimerRef.current) {
        clearInterval(revealTimerRef.current);
      }
    };
  }, [router]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    window.localStorage.setItem(
      `${STORAGE_PREFIX}${userId}`,
      JSON.stringify({
        sessionId,
        messages,
      })
    );
  }, [messages, sessionId, userId]);

  useEffect(() => {
    if (!transcriptRef.current) {
      return;
    }

    transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
  }, [messages]);

  const canSend = useMemo(() => draft.trim().length > 0 && !loading, [draft, loading]);
  const canClear = useMemo(
    () => (messages.length > 0 || draft.trim().length > 0 || sessionId !== null) && !loading,
    [draft, loading, messages.length, sessionId]
  );

  async function handleSubmit(nextPrompt?: string) {
    const messageText = (nextPrompt ?? draft).trim();
    if (!messageText || loading) {
      return;
    }

    if (revealTimerRef.current) {
      clearInterval(revealTimerRef.current);
    }

    const userMessage = createMessage('user', messageText);
    const assistantPlaceholder = createMessage('assistant', '', { pending: true });

    setDraft('');
    setError(null);
    setLoading(true);
    setMessages((current) => [...current, userMessage, assistantPlaceholder]);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        router.push('/auth');
        return;
      }

      const response = await fetch('/api/bintu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          message: messageText,
          sessionId,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Bintu could not respond right now.');
      }

      setSessionId(payload.sessionId ?? null);
      progressivelyRevealReply(payload.answer);
    } catch (submitError: unknown) {
      setError(getErrorMessage(submitError));
      setMessages((current) => current.filter((message) => message.id !== assistantPlaceholder.id));
    } finally {
      setLoading(false);
    }
  }

  function progressivelyRevealReply(answer: string) {
    const words = answer.split(/\s+/).filter(Boolean);
    let cursor = 0;

    setMessages((current) =>
      current.map((message, index) =>
        index === current.length - 1
          ? {
              ...message,
              content: '',
              pending: false,
            }
          : message
      )
    );

    revealTimerRef.current = setInterval(() => {
      cursor += 5;
      const partial = `${words.slice(0, cursor).join(' ')}${cursor < words.length ? ' ' : ''}`;

      setMessages((current) =>
        current.map((message, index) =>
          index === current.length - 1
            ? {
                ...message,
                content: partial,
                pending: false,
              }
            : message
        )
      );

      if (cursor >= words.length && revealTimerRef.current) {
        clearInterval(revealTimerRef.current);
        revealTimerRef.current = null;
      }
    }, 28);
  }

  function handleComposerKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void handleSubmit();
    }
  }

  function handleClearChat() {
    if (revealTimerRef.current) {
      clearInterval(revealTimerRef.current);
      revealTimerRef.current = null;
    }

    setDraft('');
    setMessages([]);
    setSessionId(null);
    setError(null);

    if (userId) {
      window.localStorage.removeItem(`${STORAGE_PREFIX}${userId}`);
    }
  }

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
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.kicker}>Knowledge Assistant</div>
          <h1 className={styles.title}>Ask Bintu</h1>
          <p className={styles.subtitle}>
            Bintu answers from verified Infact Access materials, so you can get clear guidance grounded in the platform&apos;s real information.
          </p>
          <div className={styles.heroPills}>
            <span className={styles.heroPill}>Authenticated support</span>
            <span className={styles.heroPill}>Infact Access grounded</span>
            <span className={styles.heroPill}>Clear, concise answers</span>
          </div>
        </div>

        <div className={`card ${styles.portraitCard}`}>
          <div className={styles.portraitFrame}>
            <Image src="/bintu.png" alt="Portrait of Bintu" fill sizes="(max-width: 900px) 220px, 280px" className={styles.portrait} />
          </div>
          <div className={styles.portraitCopy}>
            <h2>Bintu</h2>
            <p>
              I help you find and understand verified jobs, grants, training, and career opportunities. I provide clear guidance on applications and career planning, so you can make confident decisions and move forward with purpose.
            </p>
          </div>
        </div>
      </section>

      {error && (
        <div className={`card animate-in ${styles.errorCard}`}>
          <p>{error}</p>
        </div>
      )}

      <section className={styles.chatLayout}>
        <div className={`card ${styles.chatCard}`}>
          <div className={styles.chatHeader}>
            <div>
              <h2 className={styles.sectionHead}>Conversation</h2>
              <p className={styles.sectionSubhead}>Bintu stays within verified Infact Access scope and responds clearly when a topic sits outside what she provides.</p>
            </div>
          </div>

          <div ref={transcriptRef} className={styles.transcript}>
            {messages.length === 0 ? (
              <div className={styles.emptyState}>
                <p className={styles.emptyLead}>Start with one of these prompts.</p>
                <div className={styles.promptGrid}>
                  {STARTER_PROMPTS.map((prompt) => (
                    <button key={prompt} type="button" className={styles.promptCard} onClick={() => void handleSubmit(prompt)}>
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <article
                  key={message.id}
                  className={`${styles.messageRow} ${message.role === 'assistant' ? styles.assistantRow : styles.userRow}`}
                >
                  {message.role === 'assistant' && (
                    <div className={styles.avatar}>
                      <Image src="/bintu.png" alt="Bintu avatar" fill sizes="48px" className={styles.avatarImage} />
                    </div>
                  )}
                  <div className={`${styles.bubble} ${message.role === 'assistant' ? styles.assistantBubble : styles.userBubble}`}>
                    <p>{message.content || (message.pending ? 'Bintu is thinking...' : '')}</p>
                  </div>
                </article>
              ))
            )}
          </div>

          <form
            className={styles.composer}
            onSubmit={(event) => {
              event.preventDefault();
              void handleSubmit();
            }}
          >
            <label htmlFor="bintu-message" className={styles.composerLabel}>
              Ask Bintu
            </label>
            <textarea
              id="bintu-message"
              className={styles.textarea}
              placeholder="Ask about Infact Access, verified opportunities, grants, or other in-scope topics..."
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleComposerKeyDown}
              rows={4}
              disabled={loading}
            />
            <div className={styles.composerFooter}>
              <span className={styles.footerHint}>{loading ? 'Bintu is thinking...' : 'Press Enter to send, Shift+Enter for a new line.'}</span>
              <div className={styles.composerActions}>
                <button type="button" className="btn btn-outline" onClick={handleClearChat} disabled={!canClear}>
                  Clear
                </button>
                <button type="submit" className="btn btn-primary" disabled={!canSend}>
                  {loading ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
