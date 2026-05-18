'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Instrument_Serif } from 'next/font/google';
import { BookOpen, Bot, Brain, Rocket, X } from 'lucide-react';
import styles from './HeroSection.module.css';
import { STORAGE_KEYS } from '@/lib/storage';

const serif = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
});

const CTA_LABEL = 'Simplify now';

const I = {
  Link: (p) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  ArrowUR: (p) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  ),
  Check: (p) => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
};

const MESSAGES = [
  { icon: BookOpen, text: 'Generating your learning cards…' },
  { icon: Brain,    text: 'Adding a quiz every 3 topics' },
  { icon: Bot,      text: 'Choosing your robot-teacher skin' },
  { icon: Rocket,   text: 'Mapping your learning journey' },
];

// Fake bar that caps at 95% — the real API call jumps it to 100% on success.
const FAKE_STEPS = [
  [18, 350], [35, 1100], [52, 2500], [68, 4000],
  [79, 5600], [88, 7200], [95, 9100],
];

const EXAMPLES = [
  { label: 'react.dev',       url: 'https://react.dev/learn' },
  { label: 'stripe.com/docs', url: 'https://stripe.com/docs/api' },
  { label: 'vercel.com/docs', url: 'https://vercel.com/docs' },
];

function IdleState({ url, setUrl, error, onDismissError, onSubmit }) {
  const valid = url.trim().length > 4;

  const handlePaste = (e) => {
    const text = e.clipboardData.getData('text');
    if (text && text.trim().length > 4) {
      setTimeout(() => onSubmit(text.trim()), 100);
    }
  };

  return (
    <>
      <div className={styles.inputRow}>
        <div className={styles.inputIc}><I.Link /></div>
        <input
          className={styles.inputField}
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onPaste={handlePaste}
          onKeyDown={(e) => e.key === 'Enter' && valid && onSubmit()}
          placeholder="Paste your documentation link…"
          autoFocus
        />
        <button
          className={styles.submitBtn}
          disabled={!valid}
          onClick={() => onSubmit()}
        >
          {CTA_LABEL} <I.ArrowUR />
        </button>
      </div>

      {error && (
        <div className={styles.errorChip} role="alert">
          <span>{error}</span>
          <button
            className={styles.errorDismiss}
            onClick={onDismissError}
            aria-label="Dismiss"
          >
            <X size={12} strokeWidth={2.4} />
          </button>
        </div>
      )}

      <div className={styles.actions}>
        <span className={styles.actionsLabel}>Try:</span>
        {EXAMPLES.map((e) => (
          <button key={e.url} className={styles.pillChip} onClick={() => onSubmit(e.url)}>
            {e.label}
          </button>
        ))}
      </div>

      <div className={styles.trust}>
        {['No signup required', 'Works with any docs', 'Quizzes built in'].map((t) => (
          <div key={t} className={styles.trustI}>
            <I.Check /> {t}
          </div>
        ))}
      </div>
    </>
  );
}

function LoadingPanel({ pct, mi, onCancel }) {
  const msg = MESSAGES[mi];
  const MsgIcon = msg.icon;
  return (
    <div className={styles.loadPanel}>
      <div className={styles.loadRow}>
        <div className={styles.loadMsg} key={mi}>
          <div className={styles.msgIcon}>
            <MsgIcon size={16} strokeWidth={2} />
          </div>
          <span>{msg.text}</span>
        </div>
        <div className={styles.loadRight}>
          <div className={styles.loadPct}>{Math.round(pct)}%</div>
          <button
            className={styles.loadCancel}
            onClick={onCancel}
            title="Cancel"
            aria-label="Cancel"
          >
            <X size={12} strokeWidth={2.4} />
          </button>
        </div>
      </div>
      <div className={styles.pbar}>
        <div className={styles.pbarFill} style={{ width: `${Math.max(pct, 3)}%` }}>
          {pct < 100 && <div className={styles.pbarDot} />}
        </div>
      </div>
      <div className={styles.loadSub}>This usually takes about 12 seconds</div>
    </div>
  );
}

export default function HeroSection() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [phase, setPhase] = useState('idle'); // 'idle' | 'loading'
  const [pct, setPct] = useState(0);
  const [mi, setMi] = useState(0);
  const [error, setError] = useState(null);

  const go = useCallback(
    (pastedUrl) => {
      const u = (pastedUrl || url).trim();
      if (!u || u.length < 4) return;
      if (pastedUrl) setUrl(pastedUrl);

      setError(null);
      setPct(0);
      setMi(0);
      setPhase('loading');

      let cancelled = false;
      (async () => {
        try {
          const res = await fetch('/api/parse', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: u }),
          });
          const data = await res.json();
          if (cancelled) return;
          if (!res.ok) {
            setPhase('idle');
            setError(data?.error?.message ?? 'Failed to parse the site.');
            return;
          }
          setPct(100);
          try {
            sessionStorage.setItem(STORAGE_KEYS.parseResult, JSON.stringify(data));
          } catch {
            /* sessionStorage can throw in private mode — keep going */
          }
          setTimeout(() => {
            if (!cancelled) router.push('/courses/new');
          }, 500);
        } catch {
          if (cancelled) return;
          setPhase('idle');
          setError("Couldn't reach the parser. Check your connection.");
        }
      })();

      // Stored on instance so reset() can flip it
      go.cancelCurrent = () => {
        cancelled = true;
      };
    },
    [url, router],
  );

  const reset = useCallback(() => {
    if (go.cancelCurrent) go.cancelCurrent();
    setPhase('idle');
    setPct(0);
    setMi(0);
  }, [go]);

  // Fake progress ticks
  useEffect(() => {
    if (phase !== 'loading') return;
    const timeouts = FAKE_STEPS.map(([p, ms]) =>
      setTimeout(() => setPct((cur) => Math.max(cur, p)), ms),
    );
    return () => timeouts.forEach(clearTimeout);
  }, [phase]);

  // Cycle messages
  useEffect(() => {
    if (phase !== 'loading') return;
    const iv = setInterval(() => setMi((i) => (i + 1) % MESSAGES.length), 3000);
    return () => clearInterval(iv);
  }, [phase]);

  return (
    <div className={styles.root}>
      <section className={styles.hero}>
        <div className={styles.gridTex} />

        <div className={styles.glow} style={{
          width: 480, height: 480, top: '-10%', left: '-8%',
          background: '#e9d5ff',
          ['--d']: '14s', ['--dl']: '0s', ['--tx']: '30px', ['--ty']: '20px',
        }} />
        <div className={styles.glow} style={{
          width: 540, height: 540, top: '20%', right: '-10%',
          background: '#fbcfe8',
          ['--d']: '16s', ['--dl']: '2s', ['--tx']: '-30px', ['--ty']: '20px',
        }} />
        <div className={styles.glow} style={{
          width: 460, height: 460, bottom: '-15%', left: '30%',
          background: '#fed7aa',
          ['--d']: '18s', ['--dl']: '1s', ['--tx']: '20px', ['--ty']: '-20px',
        }} />

        <div className={styles.stage}>
          <div className={styles.headCol}>
            <h1 className={`${serif.className} ${styles.h1}`}>
              <span className={styles.h1Line}>Turn dense docs</span>
              <span className={styles.h1Line}>
                into <span className={styles.h1Italic}>playful cards</span>
              </span>
              <span className={`${styles.h1Line} ${styles.h1Fade}`}>you&apos;ll actually finish</span>
            </h1>

            <p className={styles.sub}>
              Paste any documentation link. AI breaks it into bite-sized cards,
              quizzes, and a learning path made just for you.
            </p>

            {phase === 'idle' && (
              <IdleState
                url={url}
                setUrl={setUrl}
                error={error}
                onDismissError={() => setError(null)}
                onSubmit={go}
              />
            )}
            {phase === 'loading' && (
              <LoadingPanel pct={pct} mi={mi} onCancel={reset} />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
