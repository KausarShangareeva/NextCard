"use client";

import Link from "next/link";
import {
  Sparkles,
  Trophy,
  Clock,
  PlayCircle,
  ArrowRight,
} from "lucide-react";
import { useLearnerAuth } from "./LearnerGate";
import { ROLE_PROFILES } from "@/components/client-employees/roleProfiles";
import { modulesFor } from "./learnerCourses";
import styles from "./LearnerOverview.module.css";

const ROLE_SHORT = {
  "Money Laundering Reporting Officer": "MLRO",
  "Transaction Monitoring (TM) Analyst": "TM Analyst",
};

const firstWord = (username) => {
  const [first] = username.split(".");
  if (!first) return "there";
  return first.charAt(0).toUpperCase() + first.slice(1);
};

export default function LearnerOverview() {
  const { session } = useLearnerAuth();
  if (!session) return null;

  const profile = ROLE_PROFILES[session.role];
  const myModules = modulesFor(session.role);

  const done = myModules.filter((m) => m.progress === 100).length;
  const inProgress = myModules.filter((m) => m.progress > 0 && m.progress < 100).length;
  const totalMinutesLeft = myModules.reduce(
    (sum, m) => sum + Math.round((m.minutes * (100 - m.progress)) / 100),
    0
  );

  const next = myModules
    .filter((m) => m.progress < 100)
    .sort((a, b) => b.progress - a.progress)[0];

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <div className={styles.headLeft}>
          <div className={styles.eyebrow}>Learner portal</div>
          <h1 className={styles.title}>
            Welcome back, {firstWord(session.username)}.
          </h1>
          <p className={styles.sub}>
            You&apos;re training as{" "}
            <strong>{ROLE_SHORT[session.role] ?? session.role}</strong>. Your
            plan covers the AMLR articles that apply to this role — every
            module shows why it&apos;s in your plan.
          </p>
        </div>
        <div className={styles.headRight}>
          <span className={styles.roleBadge}>
            <Sparkles size={12} strokeWidth={2} />
            {profile?.programs}
          </span>
        </div>
      </header>

      <section className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Modules assigned</div>
          <div className={styles.statValue}>{myModules.length}</div>
          <div className={styles.statSub}>across 4 quarters</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Completed</div>
          <div className={styles.statValue}>
            {done}
            <span className={styles.statValueTail}>
              / {myModules.length}
            </span>
          </div>
          <div className={styles.statSub}>
            {inProgress} in progress
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Estimated time left</div>
          <div className={styles.statValue}>
            {totalMinutesLeft}
            <span className={styles.statValueTail}>min</span>
          </div>
          <div className={styles.statSub}>across remaining modules</div>
        </div>
      </section>

      {next && (
        <section className={styles.nextCard}>
          <div className={styles.nextLeft}>
            <span className={styles.nextEyebrow}>Pick up where you left off</span>
            <h2 className={styles.nextTitle}>{next.name}</h2>
            <p className={styles.nextBlurb}>
              <strong>Why this is in your plan:</strong> {next.why}
            </p>
            <div className={styles.nextMeta}>
              <span className={styles.nextMetaItem}>
                <Trophy size={12} strokeWidth={1.8} />
                {next.article} · {next.articleTitle}
              </span>
              <span className={styles.nextMetaItem}>
                <Clock size={12} strokeWidth={1.8} />
                ~{next.minutes} min
              </span>
            </div>
          </div>
          <div className={styles.nextRight}>
            <div className={styles.nextProgressLabel}>
              {next.progress}% complete
            </div>
            <div className={styles.nextProgressBar}>
              <div
                className={styles.nextProgressFill}
                style={{ width: `${Math.max(next.progress, 4)}%` }}
              />
            </div>
            <Link href="/learner/courses" className={styles.nextCta}>
              <PlayCircle size={14} strokeWidth={1.8} />
              Continue training
              <ArrowRight size={13} strokeWidth={2} />
            </Link>
          </div>
        </section>
      )}

      <section className={styles.allCourses}>
        <header className={styles.allHead}>
          <h2 className={styles.allTitle}>Your training plan</h2>
          <Link href="/learner/courses" className={styles.allLink}>
            View all
            <ArrowRight size={12} strokeWidth={2} />
          </Link>
        </header>
        <div className={styles.miniList}>
          {myModules.map((m) => (
            <div key={m.id} className={styles.miniRow}>
              <span className={styles.miniQuarter}>{m.quarter}</span>
              <div className={styles.miniText}>
                <div className={styles.miniName}>{m.name}</div>
                <div className={styles.miniMeta}>
                  {m.article} · ~{m.minutes} min
                </div>
              </div>
              <div className={styles.miniProgress}>
                <div className={styles.miniBar}>
                  <div
                    className={`${styles.miniBarFill} ${
                      m.progress === 100 ? styles.miniBarFillDone : ""
                    }`.trim()}
                    style={{ width: `${Math.max(m.progress, 4)}%` }}
                  />
                </div>
                <span className={styles.miniPct}>{m.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
