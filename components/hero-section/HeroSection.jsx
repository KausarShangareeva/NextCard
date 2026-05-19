"use client";

import { Instrument_Serif } from "next/font/google";
import BookDemoButton from "@/components/ui/BookDemoButton";
import Container from "@/components/ui/Container";
import styles from "./HeroSection.module.css";

const serif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const I = {
  Play: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
  ChevronDown: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      <path d="M12 5v14M5 12l7 7 7-7" />
    </svg>
  ),
};

const TICKER_ITEMS = [
  { num: "184", text: "AMLR articles mapped" },
  { num: "−68%", text: "onboarding time" },
  { num: "18", text: "role archetypes built-in" },
  { num: "4", text: "risk domains scored" },
  { num: "tier-1", text: "trusted by ", leading: true },
];

function TickerSegment() {
  return (
    <>
      {TICKER_ITEMS.map((item, i) => (
        <span key={i} className={styles.tickerItem}>
          <span className={styles.tickerSlash}>/</span>
          {item.leading ? (
            <>
              {item.text}
              {item.num}
              {" banks"}
            </>
          ) : (
            <>
              {item.num} {item.text}
            </>
          )}
        </span>
      ))}
    </>
  );
}

export default function HeroSection() {
  return (
    <div>
      <section className={styles.page}>
        <div className={styles.gridTex} />

        <Container className={styles.stage}>
          <h1 className={styles.h1}>
            Generate{" "}
            <span className={`${serif.className} ${styles.h1Italic}`}>
              role-based
            </span>
            <br />
            compliance training,
            <br />
            <span className={styles.h1Underline}>automatically.</span>
          </h1>

          <p className={styles.sub}>
            AI transforms <span className={styles.subEmph}>AMLR 2024/1624</span>{" "}
            requirements into role‑based micro‑lessons and learning paths
            designed for regulated enterprises.
          </p>

          <div className={styles.ctaRow}>
            <BookDemoButton size="lg" />
            <a href="#" className={styles.btnSecondary}>
              <span className={styles.play}>
                <I.Play width={9} height={9} />
              </span>
              See how it works
            </a>
          </div>

          <button className={styles.scrollCue} aria-label="Scroll down">
            <I.ChevronDown width={14} height={14} />
          </button>
        </Container>

        <div className={styles.ticker}>
          <div className={styles.tickerTrack}>
            <TickerSegment />
            <TickerSegment />
          </div>
        </div>
      </section>
    </div>
  );
}
