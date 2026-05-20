"use client";

import { useState } from "react";
import {
  Shield,
  ScanLine,
  AlertTriangle,
  FileText,
  Users,
  Coins,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import styles from "./ClientCourses.module.css";

const ICON = { size: 18, strokeWidth: 1.8 };

const PROGRAMS = [
  {
    id: "amlr-core",
    icon: <Shield {...ICON} />,
    name: "AMLR core",
    roles: "AML DDI Manager, MLRO, TM Analyst, Customer Advisor",
    completion: 94,
    articles: ["Art. 8", "Art. 11"],
    why: "Foundation regulation literacy. Required by Art. 11 for every employee in a risk-bearing role and sets the risk-based mindset (Art. 8).",
  },
  {
    id: "kyc",
    icon: <ScanLine {...ICON} />,
    name: "KYC & Customer Due Diligence",
    roles: "Customer Advisor, TM Analyst",
    completion: 88,
    articles: ["Art. 20"],
    why: "Customer Advisors verify identity at onboarding; TM Analysts assess alerts against expected behaviour. Both hinge on a sound CDD process under Art. 20.",
  },
  {
    id: "sanctions",
    icon: <AlertTriangle {...ICON} />,
    name: "Sanctions screening",
    roles: "AML DDI Manager, MLRO, TM Analyst",
    completion: 91,
    articles: ["Art. 51"],
    why: "Anyone touching escalations or partner onboarding must apply EU restrictive measures correctly. Mis-screening exposes the firm to enforcement and reputational risk.",
  },
  {
    id: "sar",
    icon: <FileText {...ICON} />,
    name: "SAR documentation",
    roles: "MLRO, TM Analyst",
    completion: 97,
    articles: ["Art. 69", "Art. 70"],
    why: "TM Analyst notes flow into the SAR; MLRO carries personal liability for the submission. Quality of writing here directly affects regulator readiness.",
  },
  {
    id: "bo",
    icon: <Users {...ICON} />,
    name: "Beneficial ownership",
    roles: "AML DDI Manager, Customer Advisor",
    completion: 100,
    articles: ["Art. 42"],
    why: "Corporate customer onboarding requires UBO identification under Art. 42. Failure to untangle hidden control is a top FIU finding.",
  },
  {
    id: "crypto",
    icon: <Coins {...ICON} />,
    name: "Crypto compliance",
    roles: "Crypto Compliance Officer · awaiting course",
    completion: 0,
    articles: ["MiCAR Art. 38"],
    why: "Custom course requested for your new crypto desk. We're building it from the role description you uploaded.",
  },
];

export default function ClientCourses() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <div className={styles.headLeft}>
          <div className={styles.eyebrow}>Workspace</div>
          <h1 className={styles.title}>Compliance programs</h1>
          <div className={styles.subCard}>
            <div className={styles.subStat}>
              <span className={styles.subStatNum}>{PROGRAMS.length}</span>
              <span className={styles.subStatLabel}>programs</span>
            </div>
            <span className={styles.subDivider} aria-hidden="true" />
            <div className={styles.subStat}>
              <span className={styles.subStatNum}>4</span>
              <span className={styles.subStatLabel}>role profiles</span>
            </div>
            <span className={styles.subDivider} aria-hidden="true" />
            <p className={styles.subHint}>
              Need a course for a new role? Select the relevant employees on
              the Employees page and request a tailored program from there.
            </p>
          </div>
        </div>
      </header>

      <header className={styles.gridHead}>
        <h2 className={styles.gridTitle}>Active programs</h2>
      </header>

      <div className={styles.grid}>
        {PROGRAMS.map((p) => {
          const isOpen = expanded === p.id;
          return (
            <article key={p.id} className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.cardIcon}>{p.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 className={styles.cardName}>{p.name}</h3>
                  <div className={styles.cardArticles}>
                    {p.articles.map((a) => (
                      <span key={a} className={styles.cardArticleChip}>
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.cardRoles}>
                <div className={styles.cardRolesLabel}>Assigned roles</div>
                {p.roles}
              </div>

              <button
                type="button"
                className={`${styles.whyToggle} ${isOpen ? styles.whyToggleOpen : ""}`.trim()}
                onClick={() => setExpanded(isOpen ? null : p.id)}
                aria-expanded={isOpen}
              >
                <Sparkles size={11} strokeWidth={1.8} />
                Why your team needs this
                <ChevronDown
                  size={13}
                  strokeWidth={2}
                  className={styles.whyChevron}
                />
              </button>

              {isOpen && (
                <div className={styles.whyBody}>
                  {p.why}
                </div>
              )}

              <div className={styles.cardFoot}>
                <div className={styles.cardFootTop}>
                  <span className={styles.cardFootLabel}>
                    {p.completion === 0 ? "Status" : "Avg completion"}
                  </span>
                  <span className={styles.cardFootValue}>
                    {p.completion === 0 ? "Pending" : `${p.completion}%`}
                  </span>
                </div>
                <div className={styles.cardBar}>
                  <div
                    className={`${styles.cardBarFill} ${
                      p.completion === 100 ? styles.cardBarFillDone : ""
                    }`.trim()}
                    style={{ width: `${Math.max(p.completion, 4)}%` }}
                  />
                </div>
              </div>
            </article>
          );
        })}
      </div>

    </div>
  );
}
