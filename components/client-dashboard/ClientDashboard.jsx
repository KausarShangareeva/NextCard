"use client";

import {
  CheckCircle2,
  BookOpen,
  UserPlus,
  FileText,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import styles from "./ClientDashboard.module.css";

const STATS = [
  { label: "Total employees",  value: "1,250", sub: "across 4 role profiles" },
  { label: "AMLR coverage",    value: "96%",   sub: "+4% vs last quarter", positive: true },
  { label: "Active programs",  value: "18",    sub: "all up to date" },
  { label: "Pending reviews",  value: "7",     sub: "due this week" },
];

const ROLES = [
  { name: "AML DDI Manager",                     team: "AML Due Diligence & Investigations", employees: 38,  completion: 96,  risk: "high"   },
  { name: "Money Laundering Reporting Officer",  team: "Risk & Compliance · 2LoD",           employees: 12,  completion: 100, risk: "high"   },
  { name: "Transaction Monitoring (TM) Analyst", team: "Fraud & Financial Crime",            employees: 184, completion: 92,  risk: "medium" },
  { name: "Customer Advisor",                    team: "Customer Operations",                employees: 1016,completion: 84,  risk: "medium" },
];

const ACTIVITY = [
  { icon: <CheckCircle2 size={14} strokeWidth={1.8} />, html: <><strong>Lars Johansson</strong> completed <strong>Module 3 · Beneficial Ownership</strong></>, time: "2h ago" },
  { icon: <BookOpen     size={14} strokeWidth={1.8} />, html: <><strong>Klara Andersson</strong> started <strong>Sanctions Screening</strong> track</>, time: "4h ago" },
  { icon: <FileText     size={14} strokeWidth={1.8} />, html: <>Compliance review submitted by <strong>Erik Hellström</strong></>, time: "5h ago" },
  { icon: <UserPlus     size={14} strokeWidth={1.8} />, html: <>New employee onboarded: <strong>Maria Lindberg</strong>, Customer Advisor</>, time: "1d ago" },
  { icon: <ShieldCheck  size={14} strokeWidth={1.8} />, html: <>AMLR <strong>Article 51</strong> coverage updated to 100%</>, time: "1d ago" },
  { icon: <FileText     size={14} strokeWidth={1.8} />, html: <>Quarterly audit report generated</>, time: "2d ago" },
  { icon: <AlertTriangle size={14} strokeWidth={1.8} />, html: <>2 high-risk customers flagged for additional review</>, time: "3d ago" },
];

const RISK_CLASS = {
  high: "riskHigh",
  medium: "riskMedium",
  low: "riskLow",
};

const RISK_LABEL = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

export default function ClientDashboard() {
  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <div className={styles.headLeft}>
          <div className={styles.eyebrow}>Overview</div>
          <h1 className={styles.title}>Welcome back, Linnéa.</h1>
          <p className={styles.sub}>
            Your compliance programs are 96% AMLR-aligned. 7 reviews need
            attention this week.
          </p>
        </div>
      </header>

      <div className={styles.statsRow}>
        {STATS.map((s) => (
          <div key={s.label} className={styles.statCard}>
            <div className={styles.statLabel}>{s.label}</div>
            <div className={styles.statValue}>{s.value}</div>
            <div className={`${styles.statSub} ${s.positive ? styles.statSubPos : ""}`.trim()}>
              {s.sub}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.grid}>
        <section className={styles.panel}>
          <header className={styles.panelHead}>
            <h2 className={styles.panelTitle}>Roles &amp; programs</h2>
            <span className={styles.panelMeta}>{ROLES.length} profiles · {ROLES.reduce((s, r) => s + r.employees, 0).toLocaleString()} seats</span>
          </header>
          <div className={styles.rolesList}>
            {ROLES.map((r) => (
              <div key={r.name} className={styles.roleRow}>
                <div className={styles.roleNameCol}>
                  <div className={styles.roleName}>{r.name}</div>
                  <div className={styles.roleArticles}>{r.team}</div>
                </div>
                <div className={styles.roleBarWrap}>
                  <div className={styles.roleBar}>
                    <div
                      className={styles.roleBarFill}
                      style={{ width: `${r.completion}%` }}
                    />
                  </div>
                  <div className={styles.roleBarLabel}>{r.completion}% complete</div>
                </div>
                <div className={styles.roleEmployees}>
                  {r.employees.toLocaleString()} {r.employees === 1 ? "person" : "people"}
                </div>
                <span className={`${styles.riskPill} ${styles[RISK_CLASS[r.risk]]}`}>
                  <span className={styles.riskDot} aria-hidden="true" />
                  {RISK_LABEL[r.risk]} risk
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.panel}>
          <header className={styles.panelHead}>
            <h2 className={styles.panelTitle}>Recent activity</h2>
          </header>
          <div className={styles.feed}>
            {ACTIVITY.map((a, i) => (
              <div key={i} className={styles.feedItem}>
                <span className={styles.feedIcon} aria-hidden="true">
                  {a.icon}
                </span>
                <div className={styles.feedBody}>
                  <div className={styles.feedText}>{a.html}</div>
                  <div className={styles.feedTime}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
