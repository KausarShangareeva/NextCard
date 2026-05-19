"use client";

import { useMemo, useState } from "react";
import {
  Download,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  FileText,
  UserPlus,
  ScanLine,
  Settings,
} from "lucide-react";
import styles from "./ClientAudit.module.css";

const ENTRIES = [
  {
    id: 1,
    date: "10 May 2026",
    clock: "14:32:08",
    severity: "info",
    icon: <CheckCircle2 size={14} strokeWidth={1.8} />,
    action: <><strong>Lars Johansson</strong> completed module <strong>3 · Beneficial Ownership</strong> with score 92%</>,
    article: "AMLR Art. 42",
    actor: "Lars Johansson · AML Officer",
    hash: "0x8f3a…b1e2",
  },
  {
    id: 2,
    date: "10 May 2026",
    clock: "11:14:55",
    severity: "high",
    icon: <AlertTriangle size={14} strokeWidth={1.8} />,
    action: <><strong>2 high-risk customers</strong> flagged for additional review by <strong>Erik Hellström</strong></>,
    article: "AMLR Art. 20 + Art. 22 (EDD)",
    actor: "Erik Hellström · Compliance Lead",
    hash: "0xa72c…9f04",
  },
  {
    id: 3,
    date: "10 May 2026",
    clock: "09:02:11",
    severity: "info",
    icon: <UserPlus size={14} strokeWidth={1.8} />,
    action: <>New employee onboarded: <strong>Maria Lindberg</strong>, KYC Analyst — AMLR onboard program auto-assigned</>,
    article: "AMLR Art. 11 (training obligation)",
    actor: "system · HRIS sync",
    hash: "0x4b91…7c33",
  },
  {
    id: 4,
    date: "9 May 2026",
    clock: "16:48:20",
    severity: "low",
    icon: <ShieldCheck size={14} strokeWidth={1.8} />,
    action: <><strong>AMLR Article 51</strong> coverage updated from 96% → 100% after Sanctions module re-roll</>,
    article: "AMLR Art. 51",
    actor: "Linnéa Andersson · Compliance Officer",
    hash: "0xe025…1a8d",
  },
  {
    id: 5,
    date: "9 May 2026",
    clock: "13:21:09",
    severity: "info",
    icon: <ScanLine size={14} strokeWidth={1.8} />,
    action: <><strong>Klara Andersson</strong> started <strong>Sanctions Screening</strong> track</>,
    article: "AMLR Art. 51",
    actor: "Klara Andersson · KYC Analyst",
    hash: "0xc4d6…f307",
  },
  {
    id: 6,
    date: "8 May 2026",
    clock: "10:05:42",
    severity: "info",
    icon: <FileText size={14} strokeWidth={1.8} />,
    action: <>Compliance review submitted by <strong>Erik Hellström</strong> · 18 cases approved, 2 escalated to MLRO</>,
    article: "AMLR Art. 69 (SAR)",
    actor: "Erik Hellström · Compliance Lead",
    hash: "0x37bf…e290",
  },
  {
    id: 7,
    date: "7 May 2026",
    clock: "17:30:00",
    severity: "info",
    icon: <FileText size={14} strokeWidth={1.8} />,
    action: <>Quarterly audit report generated and shared with <strong>Finansinspektionen</strong></>,
    article: "Reporting · all articles",
    actor: "Linnéa Andersson · Compliance Officer",
    hash: "0x95ea…2c1f",
  },
  {
    id: 8,
    date: "6 May 2026",
    clock: "08:11:33",
    severity: "low",
    icon: <Settings size={14} strokeWidth={1.8} />,
    action: <>Risk-domain weights updated: Sanctions raised from <strong>Med</strong> → <strong>High</strong> after EBA guidance refresh</>,
    article: "AMLR Art. 8 (risk assessment)",
    actor: "Linnéa Andersson · Compliance Officer",
    hash: "0x6d20…b478",
  },
];

const FILTERS = [
  { value: "all",    label: "All events" },
  { value: "high",   label: "High severity" },
  { value: "medium", label: "Medium severity" },
  { value: "low",    label: "Low severity" },
  { value: "info",   label: "Info" },
];

const ICON_CLS = {
  high:   "entryIconHigh",
  medium: "entryIconMedium",
  low:    "entryIconLow",
  info:   "entryIconInfo",
};

export default function ClientAudit() {
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(
    () =>
      filter === "all"
        ? ENTRIES
        : ENTRIES.filter((e) => e.severity === filter),
    [filter]
  );

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <div className={styles.headLeft}>
          <div className={styles.eyebrow}>Workspace</div>
          <h1 className={styles.title}>Audit log</h1>
          <p className={styles.sub}>
            Tamper-evident record of every compliance-relevant action.
            Each entry is hash-chained and exportable as a PDF bundle for
            regulators and internal auditors.
          </p>
        </div>
        <button type="button" className={styles.exportBtn}>
          <Download size={13} strokeWidth={2} />
          Export PDF
        </button>
      </header>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Events this month</div>
          <div className={styles.statValue}>1,847</div>
          <div className={styles.statSub}>+12% vs last month</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>High-severity events</div>
          <div className={styles.statValue}>3</div>
          <div className={styles.statSub}>all reviewed within 24h</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Retention</div>
          <div className={styles.statValue}>7 yrs</div>
          <div className={styles.statSub}>aligned with AMLR Art. 56</div>
        </div>
      </div>

      <div className={styles.filters}>
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`${styles.chip} ${
              filter === f.value ? styles.chipActive : ""
            }`.trim()}
          >
            {f.label}
          </button>
        ))}
      </div>

      <section className={styles.panel}>
        {filtered.map((e) => (
          <article key={e.id} className={styles.entry}>
            <div className={styles.entryTime}>
              <span className={styles.entryDate}>{e.date}</span>
              <span className={styles.entryClock}>{e.clock}</span>
            </div>
            <div className={styles.entryBody}>
              <span
                className={`${styles.entryIcon} ${styles[ICON_CLS[e.severity]]}`}
                aria-hidden="true"
              >
                {e.icon}
              </span>
              <div className={styles.entryText}>
                <div className={styles.entryAction}>{e.action}</div>
                <div className={styles.entryMeta}>
                  <span className={styles.metaPill}>{e.article}</span>
                  <span>{e.actor}</span>
                </div>
              </div>
            </div>
            <span className={styles.entryHash}>{e.hash}</span>
          </article>
        ))}
      </section>
    </div>
  );
}
