"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Caveat, Instrument_Serif } from "next/font/google";
import { ArrowLeft } from "lucide-react";
import { STORAGE_KEYS } from "@/lib/storage";
import { LESSONS } from "./content";
import { QuizPhase } from "./quiz";
import styles from "./page.module.css";

const caveat = Caveat({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

const serif = Instrument_Serif({
  weight: "400",
  style: ["italic", "normal"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

type Phase = "learn" | "quiz";

export default function LearnPage() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("learn");

  // Gate: must come through /courses/new flow (sessionStorage primed).
  // Direct visit / hard refresh → bounce home.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEYS.parseResult);
      if (!raw) {
        router.replace("/");
        return;
      }
    } catch {
      router.replace("/");
      return;
    }
    setHydrated(true);
  }, [router]);

  if (!hydrated) return null;

  const lesson = LESSONS[idx];
  const total = LESSONS.length;
  const { Body } = lesson;

  const goNext = () => {
    if (idx < total - 1) setIdx(idx + 1);
    else setPhase("quiz");
  };

  return (
    <div className={`${styles.page} ${caveat.variable} ${serif.variable}`}>
      <div className={styles.topbar}>
        <button
          className={styles.backBtn}
          onClick={() => router.push("/courses/new")}
        >
          <ArrowLeft size={13} strokeWidth={2.4} /> Topics
        </button>
        <span className={styles.topicTag}>
          {phase === "quiz" ? "Mini Quiz" : lesson.topicLabel}
        </span>
        {phase === "learn" && (
          <div className={styles.dots} aria-label={`Lesson ${idx + 1} of ${total}`}>
            {LESSONS.map((_, i) => (
              <span
                key={i}
                className={`${styles.dot} ${i <= idx ? styles.dotOn : ""}`}
                aria-hidden
              />
            ))}
          </div>
        )}
      </div>

      {phase === "quiz" ? (
        <div className={styles.center}>
          <QuizPhase
            onPass={() => router.push("/")}
            onFail={() => {
              setPhase("learn");
              setIdx(0);
            }}
          />
        </div>
      ) : (
        <div className={styles.center}>
          <article className={styles.lcard}>
            <div className={styles.lcardGrid} aria-hidden />
            {lesson.notes?.map((n, i) => (
              <div
                key={i}
                className={styles.hnote}
                style={{ ...n.style, color: n.color ?? "#c0392b" }}
                aria-hidden
              >
                {n.text}
              </div>
            ))}
            <div className={styles.lcardInner}>
              <div className={styles.lcardNum}>
                {idx + 1} / {total}
              </div>
              <h3 className={styles.lcardTitle}>{lesson.title}</h3>
              <div className={styles.lcardBody}>
                <Body />
              </div>
            </div>
          </article>

          <div className={styles.lnav}>
            {idx > 0 && (
              <button
                className={styles.reviewBtn}
                onClick={() => setIdx(0)}
              >
                ↩ Review from start
              </button>
            )}
            <button className={styles.ctaBtn} onClick={goNext}>
              {idx < total - 1 ? "Got it, let's go →" : "Finish & take quiz →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
