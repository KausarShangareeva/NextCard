"use client";

import {
  Plus,
  Download,
  FileText,
  BarChart3,
  ShieldCheck,
  Users,
  ArrowRight,
} from "lucide-react";
import styles from "./ClientReports.module.css";

const RISK_DOMAINS = [
  { name: "AML",        score: 92 },
  { name: "Sanctions",  score: 100 },
  { name: "Fraud",      score: 78 },
  { name: "Documentation", score: 88 },
];

const REPORTS = [
  {
    id: 1,
    name: "Q1 2026 — Compliance posture",
    desc: "Board-pack summary · coverage trend, role gaps, training velocity",
    icon: <BarChart3 size={16} strokeWidth={1.8} />,
    period: "Q1 2026",
    generated: "12 Apr 2026",
  },
  {
    id: 2,
    name: "AMLR Article coverage — full snapshot",
    desc: "Article-by-article map showing which roles are trained on what",
    icon: <ShieldCheck size={16} strokeWidth={1.8} />,
    period: "as of 10 May 2026",
    generated: "10 May 2026",
  },
  {
    id: 3,
    name: "Auditor evidence bundle — Finansinspektionen",
    desc: "ZIP · training records + AMLR mapping + hash-chained audit log",
    icon: <FileText size={16} strokeWidth={1.8} />,
    period: "Jan 2025 – Apr 2026",
    generated: "8 May 2026",
  },
  {
    id: 4,
    name: "Risk-domain heatmap by role",
    desc: "Per-role exposure across AML · Sanctions · Fraud · Documentation",
    icon: <Users size={16} strokeWidth={1.8} />,
    period: "Q1 2026",
    generated: "5 Apr 2026",
  },
  {
    id: 5,
    name: "Q4 2025 — Compliance posture",
    desc: "Board-pack summary for the previous quarter",
    icon: <BarChart3 size={16} strokeWidth={1.8} />,
    period: "Q4 2025",
    generated: "8 Jan 2026",
  },
];

// 12 cells visualising AMLR article coverage
const COVERAGE = [
  "on","on","on","on","on","on","on","on","on","on","partial","off",
];

export default function ClientReports() {
  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <div className={styles.headLeft}>
          <div className={styles.eyebrow}>Workspace</div>
          <h1 className={styles.title}>Reports</h1>
          <p className={styles.sub}>
            Board-ready PDFs, auditor evidence bundles, and AMLR coverage
            snapshots. Every report pulls from the live audit log — nothing
            is hand-assembled.
          </p>
        </div>
        <button type="button" className={styles.generateBtn}>
          <Plus size={13} strokeWidth={2.2} />
          Generate report
        </button>
      </header>

      <div className={styles.featured}>
        <div className={styles.featuredCard}>
          <div className={styles.featuredEyebrow}>This quarter</div>
          <h2 className={styles.featuredTitle}>AMLR article coverage</h2>
          <p className={styles.featuredSub}>
            176 of 184 articles fully mapped. 4 partial · 2 not applicable
            for your jurisdiction · 2 awaiting role assignment.
          </p>
          <div className={styles.coverageRow}>
            <div className={styles.coverageNum}>96%</div>
            <div className={styles.coverageLabel}>
              +4 pts vs Q1 · target 98% by Q3
            </div>
          </div>
          <div className={styles.coverageBars}>
            {COVERAGE.map((state, i) => (
              <span
                key={i}
                className={`${styles.coverageCell} ${
                  state === "on"
                    ? styles.coverageCellOn
                    : state === "partial"
                    ? styles.coverageCellPartial
                    : ""
                }`.trim()}
                aria-hidden="true"
              />
            ))}
          </div>
          <a href="#" className={styles.featuredAction}>
            View full breakdown
            <ArrowRight size={12} strokeWidth={2} />
          </a>
        </div>

        <div className={`${styles.featuredCard} ${styles.featuredCardDark}`}>
          <div className={styles.featuredEyebrow}>Risk posture</div>
          <h2 className={styles.featuredTitle}>Risk-domain readiness</h2>
          <p className={styles.featuredSub}>
            Average training score across each compliance risk domain.
          </p>
          <div className={styles.riskRow}>
            {RISK_DOMAINS.map((r) => (
              <div key={r.name} className={styles.riskItem}>
                <span className={styles.riskName}>{r.name}</span>
                <div className={styles.riskBar}>
                  <div
                    className={styles.riskBarFill}
                    style={{ width: `${r.score}%` }}
                  />
                </div>
                <span className={styles.riskValue}>{r.score}%</span>
              </div>
            ))}
          </div>
          <a href="#" className={styles.featuredAction}>
            Drill into a domain
            <ArrowRight size={12} strokeWidth={2} />
          </a>
        </div>
      </div>

      <section className={styles.panel}>
        <header className={styles.panelHead}>
          <h2 className={styles.panelTitle}>All reports</h2>
          <span className={styles.panelMeta}>{REPORTS.length} available</span>
        </header>
        <div className={styles.reportList}>
          {REPORTS.map((r) => (
            <div key={r.id} className={styles.reportRow}>
              <span className={styles.reportIcon}>{r.icon}</span>
              <div>
                <div className={styles.reportName}>{r.name}</div>
                <div className={styles.reportDesc}>{r.desc}</div>
              </div>
              <span className={styles.reportPeriod}>{r.period}</span>
              <span className={styles.reportDate}>
                generated {r.generated}
              </span>
              <a href="#" className={styles.downloadBtn}>
                <Download size={11} strokeWidth={2} />
                Download
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
