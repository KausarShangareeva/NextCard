"use client";

import { PlayCircle, Clock, CheckCircle2, Sparkles } from "lucide-react";
import { useLearnerAuth } from "./LearnerGate";
import { planWithProgress } from "./learnerCourses";
import styles from "./LearnerCoursesPage.module.css";

const STATUS = (p) => {
  if (p === 0) return { label: "Not started", cls: "statusNotStarted", cta: "Start" };
  if (p === 100) return { label: "Completed", cls: "statusDone", cta: "Review" };
  return { label: "In progress", cls: "statusInProgress", cta: "Continue" };
};

export default function LearnerCoursesPage() {
  const { session } = useLearnerAuth();
  if (!session) return null;

  const plan = planWithProgress(session.role);
  const totalModules = plan.reduce((s, q) => s + q.modules.length, 0);
  const totalMinutes = plan.reduce(
    (s, q) => s + q.modules.reduce((m, mod) => m + mod.minutes, 0),
    0
  );

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <div className={styles.headLeft}>
          <div className={styles.eyebrow}>Learner portal</div>
          <h1 className={styles.title}>My training plan</h1>
          <p className={styles.sub}>
            {totalModules} modules across 4 quarters · ~
            {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m total.
            Tailored to your <strong>{session.role}</strong> role and AMLR
            obligations.
          </p>
        </div>
      </header>

      {plan.map((q) => (
        <section key={q.id} className={styles.quarter}>
          <header className={styles.quarterHead}>
            <div>
              <h2 className={styles.quarterTitle}>{q.name}</h2>
              <p className={styles.quarterHint}>{q.hint}</p>
            </div>
            <span className={styles.quarterMeta}>
              {q.modules.length} module{q.modules.length === 1 ? "" : "s"}
            </span>
          </header>

          <div className={styles.grid}>
            {q.modules.map((m) => {
              const s = STATUS(m.progress);
              return (
                <article key={m.id} className={styles.card}>
                  <div className={styles.cardTop}>
                    <span className={styles.cardArticle}>{m.article}</span>
                    <span className={`${styles.statusPill} ${styles[s.cls]}`}>
                      {m.progress === 100 && (
                        <CheckCircle2 size={11} strokeWidth={2.2} />
                      )}
                      {s.label}
                    </span>
                  </div>

                  <h3 className={styles.cardName}>{m.name}</h3>
                  <div className={styles.cardMeta}>
                    <Clock size={11} strokeWidth={1.8} />
                    {m.minutes} min · {m.articleTitle}
                  </div>

                  <div className={styles.cardWhy}>
                    <Sparkles size={11} strokeWidth={1.8} />
                    <span>
                      <strong>Assigned to you because </strong>
                      {m.why}
                    </span>
                  </div>

                  <div className={styles.cardFoot}>
                    <div className={styles.cardBar}>
                      <div
                        className={`${styles.cardBarFill} ${
                          m.progress === 100 ? styles.cardBarFillDone : ""
                        }`.trim()}
                        style={{ width: `${Math.max(m.progress, 4)}%` }}
                      />
                    </div>
                    <span className={styles.cardPct}>{m.progress}%</span>
                  </div>

                  <button type="button" className={styles.cta}>
                    <PlayCircle size={13} strokeWidth={1.8} />
                    {s.cta}
                  </button>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
