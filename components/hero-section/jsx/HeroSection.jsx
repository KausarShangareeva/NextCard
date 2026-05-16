'use client';

import { useEffect, useMemo, useState } from 'react';

const MESSAGES = [
  { e: '📚', t: "We're generating your learning cards…" },
  { e: '🧠', t: "You'll get a quiz after every 3 mastered topics." },
  { e: '🤖', t: "You can also customize your robot-teacher's skin!" },
  { e: '🚀', t: 'Preparing your personalized learning journey…' },
];

const STEPS = [
  [18, 350], [35, 1100], [52, 2500], [68, 4000],
  [79, 5600], [88, 7200], [95, 9100], [100, 12000],
];

const SPARKLE_COLORS = ['#a78bfa', '#67e8f9', '#f9a8d4', '#93c5fd', '#fde68a'];

const DECO = [
  { s: 54, t: '10%', l: '4.5%',  d: '8.5s', dl: '0s'   },
  { s: 30, t: '24%', l: '12%',   d: '10s',  dl: '1.8s' },
  { s: 72, t: '6%',  r: '6.5%',  d: '12s',  dl: '0.4s' },
  { s: 40, t: '40%', r: '3.5%',  d: '9s',   dl: '2.2s' },
  { s: 22, t: '60%', l: '2%',    d: '7s',   dl: '1s'   },
  { s: 16, t: '18%', r: '18%',   d: '6s',   dl: '3s'   },
  { s: 36, t: '70%', r: '12%',   d: '11s',  dl: '0.8s' },
];

const ACCENT = '#f59e0b';
const CTA_LABEL = 'Simplify Now';
const OVERLAY_DARK = 85;
const ACCENT_GRADIENT = `linear-gradient(135deg, ${ACCENT}, #ec4899)`;

function Navbar() {
  return (
    <nav className="navbar">
      <a href="#" className="logo">
        <div className="logo-mark" style={{ background: ACCENT_GRADIENT }}>✦</div>
        FollowCard
      </a>
      <ul className="nav-ul">
        <li><a href="#">Features</a></li>
        <li><a href="#">How it Works</a></li>
        <li><a href="#">Pricing</a></li>
      </ul>
      <div className="nav-r">
        <button className="nb-ghost">Log In</button>
        <button
          className="nb-cta"
          style={{ background: ACCENT_GRADIENT, boxShadow: '0 4px 16px rgba(244,131,79,0.35)' }}
        >
          Get Started
        </button>
      </div>
    </nav>
  );
}

function IdleState({ url, setUrl, onSubmit }) {
  const valid = url.trim().length > 4;

  const handlePaste = (e) => {
    const text = e.clipboardData.getData('text');
    if (text && text.trim().length > 4) {
      setTimeout(() => onSubmit(text.trim()), 100);
    }
  };

  return (
    <div className="glass-box">
      <span className="link-ic">🔗</span>
      <input
        className="url-inp"
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onPaste={handlePaste}
        onKeyDown={(e) => e.key === 'Enter' && valid && onSubmit()}
        placeholder="Paste your documentation link here…"
      />
      <button
        className="go-btn"
        disabled={!valid}
        onClick={() => onSubmit()}
        style={{ background: ACCENT_GRADIENT, boxShadow: '0 4px 22px rgba(244,131,79,0.44)' }}
      >
        {CTA_LABEL}
      </button>
    </div>
  );
}

function LoadingState({ pct, mi }) {
  const sparks = useMemo(
    () =>
      Array.from({ length: 11 }, (_, i) => ({
        id: i,
        left: `${i * 9.1 + 1.5}%`,
        size: 3 + (i % 3),
        color: SPARKLE_COLORS[i % 5],
        d: `${1.3 + ((i * 0.28) % 1.3)}s`,
        dl: `${(i * 0.21) % 2.1}s`,
      })),
    []
  );

  const msg = MESSAGES[mi];

  return (
    <div className="load-box">
      <div className="load-row">
        <div className="load-msg" key={mi}>
          <span style={{ marginRight: 7 }}>{msg.e}</span>
          {msg.t}
        </div>
        <div className="load-pct">{Math.round(pct)}%</div>
      </div>

      <div className="pbar-track">
        <div className="pbar-fill" style={{ width: `${Math.max(pct, 3)}%` }}>
          {pct < 100 && <div className="pbar-dot" />}
        </div>
      </div>

      <div className="sparks-wrap">
        {sparks.map((s) => (
          <div
            key={s.id}
            className="spark"
            style={{
              left: s.left,
              width: s.size,
              height: s.size,
              background: s.color,
              ['--d']: s.d,
              ['--dl']: s.dl,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function DoneState({ onReset }) {
  const cards = [
    { tag: 'Topic 1', name: 'Authentication Flow' },
    { tag: 'Topic 2', name: 'API Rate Limits' },
    { tag: 'Topic 3', name: 'Error Handling' },
    { tag: '✦ Quiz',  name: '3 quick questions ready' },
  ];
  return (
    <div className="success-box">
      <div className="sc-label">✨ Your cards are ready!</div>
      <div className="sc-cards">
        {cards.map((c, i) => (
          <div key={i} className="sc-card" style={{ animationDelay: `${i * 0.07}s` }}>
            <div className="sc-card-tag">{c.tag}</div>
            <div className="sc-card-name">{c.name}</div>
          </div>
        ))}
      </div>
      <div className="sc-row">
        <button
          className="sc-cta"
          style={{ background: ACCENT_GRADIENT, boxShadow: '0 6px 28px rgba(244,131,79,0.48)' }}
        >
          Start Learning →
        </button>
        <button className="sc-reset" onClick={onReset}>
          Try another link
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

  const go = (pastedUrl) => {
    const u = pastedUrl || url;
    if (!u || u.trim().length < 4) return;
    if (pastedUrl) setUrl(pastedUrl);
    setPhase('loading');
    setPct(0);
    setMi(0);
  };

  const reset = () => {
    setPhase('idle');
    setUrl('');
    setPct(0);
    setMi(0);
  };

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

  const od = OVERLAY_DARK / 100;
  const veil = {
    background: `linear-gradient(to bottom,
      rgba(8,6,28,${od})        0%,
      rgba(8,6,28,${od * 0.8})  28%,
      rgba(8,6,28,${od * 0.28}) 55%,
      transparent               72%)`,
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap"
        rel="stylesheet"
      />

      <Navbar />

      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-veil" style={veil} />

        {DECO.map((b, i) => (
          <div
            key={i}
            className="deco"
            style={{
              width: b.s,
              height: b.s,
              top: b.t,
              left: b.l,
              right: b.r,
              ['--d']: b.d,
              ['--dl']: b.dl,
              animation: `dBubble ${b.d} ease-in-out infinite ${b.dl}`,
            }}
          />
        ))}

        <div className="hero-inner">
          <div className="badge">
            <div className="badge-pip" />
            AI-Powered Learning
          </div>

          <h1 className="h1">
            Turn Complex Documentation
            <br />
            Into <span className="h1-grad">Playful Learning</span>
          </h1>

          <p className="sub">
            Paste any documentation link — and let AI transform it into interactive cards,
            quizzes, and a personalized learning journey.
          </p>

          <div className="iw">
            {phase === 'idle'    && <IdleState url={url} setUrl={setUrl} onSubmit={go} />}
            {phase === 'loading' && <LoadingState pct={pct} mi={mi} />}
            {phase === 'done'    && <DoneState onReset={reset} />}
          </div>

          {phase === 'idle' && (
            <div className="trust">
              {['No signup required', 'Works with any docs', 'Quiz-based learning'].map((t) => (
                <div key={t} className="trust-i">
                  <span className="trust-ck">✓</span> {t}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <style jsx global>{`
        body {
          font-family: 'DM Sans', sans-serif;
          background: #09071f;
          color: #fff;
          overflow-x: hidden;
        }
      `}</style>

      <style jsx>{`
        .navbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          height: 68px; padding: 0 48px;
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(9, 7, 31, 0.52);
          backdrop-filter: blur(22px); -webkit-backdrop-filter: blur(22px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        }
        .logo {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700; font-size: 20px;
          display: flex; align-items: center; gap: 9px;
          color: white; text-decoration: none; letter-spacing: -0.01em;
        }
        .logo-mark {
          width: 34px; height: 34px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; font-weight: 800;
          box-shadow: 0 4px 16px rgba(244, 131, 79, 0.45);
          flex-shrink: 0;
        }
        .nav-ul { display: flex; align-items: center; gap: 32px; list-style: none; }
        .nav-ul :global(a) {
          color: rgba(255, 255, 255, 0.68); text-decoration: none;
          font-size: 14px; font-weight: 500;
          transition: color 0.2s; letter-spacing: 0.01em;
        }
        .nav-ul :global(a:hover) { color: white; }
        .nav-r { display: flex; align-items: center; gap: 10px; }
        .nb-ghost {
          padding: 8px 18px; border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.17);
          background: transparent; color: rgba(255, 255, 255, 0.82);
          font-size: 14px; font-weight: 500; cursor: pointer;
          transition: all 0.2s; font-family: 'DM Sans', sans-serif;
        }
        .nb-ghost:hover { background: rgba(255, 255, 255, 0.08); border-color: rgba(255, 255, 255, 0.3); }
        .nb-cta {
          padding: 8px 20px; border-radius: 10px; border: none;
          color: white; font-size: 14px; font-weight: 600; cursor: pointer;
          font-family: 'DM Sans', sans-serif; transition: all 0.2s;
        }
        .nb-cta:hover { transform: translateY(-1px); }

        .hero {
          position: relative; min-height: 100vh;
          display: flex; justify-content: center; overflow: hidden;
        }
        .hero-bg {
          position: absolute; inset: 0; z-index: 0;
          background-image: url('/uploads/hero-bg.png');
          background-size: cover; background-position: center;
        }
        .hero-veil { position: absolute; inset: 0; z-index: 1; }

        .deco {
          position: absolute; border-radius: 50%; z-index: 2;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.12), rgba(255,255,255,0.02));
          border: 1px solid rgba(255, 255, 255, 0.14);
          pointer-events: none;
        }
        @keyframes dBubble {
          0%, 100% { transform: translateY(0) translateX(0) scale(1); }
          38% { transform: translateY(-22px) translateX(8px) scale(1.04); }
          68% { transform: translateY(-10px) translateX(-5px) scale(0.97); }
        }

        .hero-inner {
          position: relative; z-index: 3;
          display: flex; flex-direction: column; align-items: center; text-align: center;
          padding: 136px 24px 80px; max-width: 780px; width: 100%;
        }

        .badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 15px; border-radius: 100px; margin-bottom: 24px;
          background: rgba(103, 232, 249, 0.09);
          border: 1px solid rgba(103, 232, 249, 0.26);
          color: #a5f3fc; font-size: 11.5px; font-weight: 600;
          letter-spacing: 0.07em; text-transform: uppercase;
        }
        .badge-pip {
          width: 6px; height: 6px; border-radius: 50%; background: #67e8f9;
          animation: pip 2.2s ease-in-out infinite; flex-shrink: 0;
        }
        @keyframes pip {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(0.6); }
        }

        .h1 {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 800;
          font-size: clamp(38px, 5.8vw, 66px);
          line-height: 1.07; letter-spacing: -0.026em;
          margin-bottom: 18px;
          text-shadow: 0 2px 30px rgba(0, 0, 0, 0.4);
          text-wrap: balance;
        }
        .h1-grad {
          background: linear-gradient(128deg, #ffb285 0%, #ff6b9d 48%, #bf80ff 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .sub {
          font-size: clamp(15px, 1.8vw, 18.5px);
          color: rgba(255, 255, 255, 0.63);
          max-width: 500px; line-height: 1.72;
          margin-bottom: 40px; font-weight: 300;
        }

        .iw { width: 100%; max-width: 690px; }

        .glass-box {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px);
          border: 1.5px solid rgba(255, 255, 255, 0.2); border-radius: 20px;
          padding: 12px 12px 12px 20px;
          display: flex; align-items: center; gap: 12px;
          box-shadow: 0 16px 56px rgba(0, 0, 0, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.13);
          transition: border-color 0.25s, box-shadow 0.25s;
        }
        .glass-box:focus-within {
          border-color: rgba(103, 232, 249, 0.42);
          box-shadow: 0 16px 56px rgba(0, 0, 0, 0.32), 0 0 0 3px rgba(103, 232, 249, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.13);
        }
        .link-ic { font-size: 18px; opacity: 0.72; flex-shrink: 0; }
        .url-inp {
          flex: 1; background: none; border: none; outline: none;
          color: white; font-size: 15px; font-family: 'DM Sans', sans-serif;
          font-weight: 400; min-width: 0;
        }
        .url-inp::placeholder { color: rgba(255, 255, 255, 0.38); }
        .go-btn {
          flex-shrink: 0; padding: 13px 26px; border-radius: 14px;
          border: none; color: white; font-size: 14.5px; font-weight: 700;
          cursor: pointer; font-family: 'Space Grotesk', sans-serif;
          letter-spacing: 0.015em; white-space: nowrap; transition: all 0.25s;
        }
        .go-btn:hover:not(:disabled) { transform: translateY(-1px); filter: brightness(1.1); }
        .go-btn:disabled {
          background: rgba(255, 255, 255, 0.1) !important;
          box-shadow: none !important;
          color: rgba(255, 255, 255, 0.35); cursor: not-allowed;
        }

        .load-box {
          background: rgba(255, 255, 255, 0.07);
          backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px);
          border: 1.5px solid rgba(139, 92, 246, 0.3); border-radius: 20px;
          padding: 24px 28px 22px;
          box-shadow: 0 16px 56px rgba(0, 0, 0, 0.3), 0 0 48px rgba(99, 102, 241, 0.07),
            inset 0 1px 0 rgba(255, 255, 255, 0.09);
          animation: popIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.96) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        .load-row {
          display: flex; align-items: flex-start; justify-content: space-between;
          gap: 16px; margin-bottom: 20px;
        }
        .load-msg {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 14.5px; font-weight: 500;
          color: rgba(255, 255, 255, 0.92); line-height: 1.45;
          animation: msgIn 0.38s cubic-bezier(0.22, 1, 0.36, 1);
        }
        @keyframes msgIn {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .load-pct {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13px; font-weight: 700; color: #a5f3fc;
          letter-spacing: 0.04em; flex-shrink: 0; padding-top: 1px;
        }

        .pbar-track {
          height: 9px; background: rgba(255, 255, 255, 0.09);
          border-radius: 100px; position: relative; overflow: visible;
        }
        .pbar-fill {
          height: 100%; border-radius: 100px; position: relative; overflow: visible;
          background: linear-gradient(90deg, #7c3aed 0%, #6366f1 22%, #3b82f6 50%, #06b6d4 74%, #ec4899 100%);
          background-size: 300% 100%;
          animation: pShimmer 2s linear infinite;
          transition: width 0.95s cubic-bezier(0.22, 0.61, 0.36, 1);
          box-shadow: 0 0 10px rgba(99, 102, 241, 0.7), 0 0 22px rgba(59, 130, 246, 0.4);
        }
        @keyframes pShimmer {
          0%   { background-position: 0% 0%; }
          100% { background-position: 300% 0%; }
        }
        .pbar-dot {
          position: absolute; right: -6px; top: 50%; transform: translateY(-50%);
          width: 17px; height: 17px; border-radius: 50%; background: white;
          animation: dotGlow 1.1s ease-in-out infinite;
        }
        @keyframes dotGlow {
          0%, 100% {
            box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.5),
              0 0 14px 5px rgba(99, 102, 241, 0.8),
              0 0 28px 10px rgba(59, 130, 246, 0.35);
          }
          50% {
            box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.7),
              0 0 20px 8px rgba(99, 102, 241, 1),
              0 0 40px 14px rgba(59, 130, 246, 0.55);
          }
        }

        .sparks-wrap {
          position: relative; margin-top: 2px;
          height: 44px; overflow: visible; pointer-events: none;
        }
        .spark {
          position: absolute; border-radius: 50%; bottom: 6px;
          animation: sparkUp var(--d) ease-out infinite var(--dl);
        }
        @keyframes sparkUp {
          0%   { opacity: 0; transform: translateY(0) scale(0); }
          18%  { opacity: 0.95; transform: translateY(-8px) scale(1); }
          100% { opacity: 0; transform: translateY(-40px) scale(0.2); }
        }

        .success-box { animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .sc-label {
          font-size: 11.5px; font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase; color: #67e8f9; margin-bottom: 14px;
        }
        .sc-cards {
          display: flex; gap: 10px; justify-content: center;
          flex-wrap: wrap; margin-bottom: 18px;
        }
        .sc-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.17);
          border-radius: 14px; padding: 14px 16px; min-width: 148px; text-align: left;
          animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .sc-card-tag {
          font-size: 10px; font-weight: 700; letter-spacing: 0.07em;
          text-transform: uppercase; color: #c084fc; margin-bottom: 7px;
        }
        .sc-card-name {
          font-family: 'Space Grotesk', sans-serif; font-size: 12.5px;
          font-weight: 600; color: white; line-height: 1.35;
        }
        .sc-row { display: flex; gap: 10px; justify-content: center; align-items: center; }
        .sc-cta {
          padding: 13px 32px; border-radius: 13px; border: none;
          color: white; font-size: 14.5px; font-weight: 700; cursor: pointer;
          font-family: 'Space Grotesk', sans-serif; transition: all 0.2s;
        }
        .sc-cta:hover { transform: translateY(-2px); filter: brightness(1.1); }
        .sc-reset {
          padding: 10px 16px; background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.18); border-radius: 10px;
          color: rgba(255, 255, 255, 0.55); font-size: 13px; cursor: pointer;
          font-family: 'DM Sans', sans-serif; transition: all 0.2s;
        }
        .sc-reset:hover { border-color: rgba(255, 255, 255, 0.35); color: rgba(255, 255, 255, 0.8); }

        .trust {
          display: flex; align-items: center; gap: 26px;
          margin-top: 18px; flex-wrap: wrap; justify-content: center;
        }
        .trust-i {
          display: flex; align-items: center; gap: 6px;
          font-size: 12.5px; color: rgba(255, 255, 255, 0.48);
        }
        .trust-ck { color: #67e8f9; font-size: 11px; }
      `}</style>
    </>
  );
}
