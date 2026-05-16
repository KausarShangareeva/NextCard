'use client';

import { useCallback, useEffect, useState } from 'react';
import { Inter, Instrument_Serif } from 'next/font/google';
import styles from './HeroSection.module.css';

const inter = Inter({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
});
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
  Plus: (p) => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  Check: (p) => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
  X: (p) => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  ),
  Cards: (p) => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="5" width="14" height="16" rx="2" />
      <path d="M7 3h10a2 2 0 0 1 2 2v14" />
    </svg>
  ),
  Brain: (p) => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
    </svg>
  ),
  Robot: (p) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="8" width="18" height="12" rx="2" />
      <path d="M12 4v4M9 14h.01M15 14h.01M9 18h6" />
      <circle cx="12" cy="3" r="1" />
    </svg>
  ),
  Rocket: (p) => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  ),
  Logo: (p) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" {...p}>
      <rect x="3" y="4" width="13" height="17" rx="2.5" opacity="0.4" />
      <rect x="8" y="3" width="13" height="17" rx="2.5" />
    </svg>
  ),
};

const MESSAGES = [
  { icon: I.Cards,  text: 'Generating your learning cards…' },
  { icon: I.Brain,  text: 'Adding a quiz every 3 topics' },
  { icon: I.Robot,  text: 'Choosing your robot-teacher skin' },
  { icon: I.Rocket, text: 'Mapping your learning journey' },
];

const STEPS = [
  [18, 350], [35, 1100], [52, 2500], [68, 4000],
  [79, 5600], [88, 7200], [95, 9100], [100, 12000],
];

const EXAMPLES = [
  { label: 'react.dev',       url: 'https://react.dev/learn' },
  { label: 'stripe.com/docs', url: 'https://stripe.com/docs/api' },
  { label: 'vercel.com/docs', url: 'https://vercel.com/docs' },
];

function IdleState({ url, setUrl, onSubmit }) {
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

function LoadingState({ pct, mi, onCancel }) {
  const msg = MESSAGES[mi];
  const MsgIcon = msg.icon;
  return (
    <div className={styles.panel}>
      <div className={styles.loadRow}>
        <div className={styles.loadMsg} key={mi}>
          <div className={styles.msgIcon}><MsgIcon /></div>
          <span>{msg.text}</span>
        </div>
        <div className={styles.loadRight}>
          <div className={styles.loadPct}>{Math.round(pct)}%</div>
          <button className={styles.loadCancel} onClick={onCancel} title="Cancel">
            <I.X />
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

function DoneState({ onReset }) {
  const cards = [
    { tag: 'Topic 1', color: '#a855f7', name: 'Authentication Flow' },
    { tag: 'Topic 2', color: '#ec4899', name: 'API Rate Limits' },
    { tag: 'Topic 3', color: '#f97316', name: 'Error Handling' },
    { tag: 'Quiz',    color: '#10b981', name: '3 questions ready' },
  ];
  return (
    <div className={styles.panel}>
      <div className={styles.doneEyebrow}>
        <I.Check /> Your path is ready
      </div>
      <div className={styles.doneCards}>
        {cards.map((c, i) => (
          <div key={i} className={styles.dcard} style={{ animationDelay: `${i * 0.06}s` }}>
            <div className={styles.dcardTag} style={{ color: c.color }}>{c.tag}</div>
            <div className={styles.dcardName}>{c.name}</div>
          </div>
        ))}
      </div>
      <div className={styles.doneRow}>
        <button className={styles.doneCta}>
          Start learning <I.ArrowUR />
        </button>
        <button className={styles.doneReset} onClick={onReset}>
          Try another
        </button>
      </div>
    </div>
  );
}

export default function HeroSection() {
  const [url, setUrl] = useState('');
  const [phase, setPhase] = useState('idle');
  const [pct, setPct] = useState(0);
  const [mi, setMi] = useState(0);

  const go = useCallback(
    (pastedUrl) => {
      const u = pastedUrl || url;
      if (!u || u.trim().length < 4) return;
      if (pastedUrl) setUrl(pastedUrl);
      setPhase('loading');
      setPct(0);
      setMi(0);
    },
    [url]
  );

  const reset = useCallback(() => {
    setPhase('idle');
    setUrl('');
    setPct(0);
    setMi(0);
  }, []);

  useEffect(() => {
    if (phase !== 'loading') return;
    const ts = STEPS.map(([p, ms]) =>
      setTimeout(() => {
        setPct(p);
        if (p === 100) setTimeout(() => setPhase('done'), 650);
      }, ms)
    );
    const iv = setInterval(() => setMi((i) => (i + 1) % MESSAGES.length), 3000);
    return () => {
      ts.forEach(clearTimeout);
      clearInterval(iv);
    };
  }, [phase]);

  return (
    <div className={`${styles.root} ${inter.className}`}>
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

        <nav className={styles.nav}>
          <a href="#" className={styles.brand}>
            <div className={styles.brandMark}><I.Logo /></div>
            NextCard
          </a>
          <div className={styles.navMid}>
            <a href="#" className={`${styles.navLink} ${styles.navLinkActive}`}>Home</a>
            <a href="#" className={styles.navLink}>For learners <I.Plus /></a>
            <a href="#" className={styles.navLink}>For teams <I.Plus /></a>
          </div>
          <button className={styles.navCta}>Let&apos;s Talk <I.ArrowUR /></button>
        </nav>

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

            {phase === 'idle'    && <IdleState url={url} setUrl={setUrl} onSubmit={go} />}
            {phase === 'loading' && <LoadingState pct={pct} mi={mi} onCancel={reset} />}
            {phase === 'done'    && <DoneState onReset={reset} />}
          </div>
        </div>
      </section>
    </div>
  );
}
