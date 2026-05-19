"use client";

import { Instrument_Serif } from "next/font/google";
import { ShieldCheck } from "lucide-react";
import BookDemoButton from "@/components/ui/BookDemoButton";
import Container from "@/components/ui/Container";
import styles from "./HeroSection.module.css";

const serif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const PREVIEW_STATS = [
  { label: "Total employees", value: "1,250", sub: "across 6 role profiles" },
  { label: "AMLR coverage", value: "96%", sub: "+4% vs last quarter", positive: true },
  { label: "Active programs", value: "18", sub: "all up to date" },
  { label: "Pending reviews", value: "7", sub: "due this week" },
];

const PREVIEW_ROLES = [
  { name: "AML Officer", articles: "Art. 20 · 42 · 51 · 69", completion: 98, risk: "high" },
  { name: "KYC Analyst", articles: "Art. 20 · 42 · 51", completion: 94, risk: "high" },
  { name: "Branch Manager", articles: "Art. 20 · 51 · 69", completion: 91, risk: "medium" },
  { name: "Customer Onboarding", articles: "Art. 20 · 42", completion: 89, risk: "medium" },
];

const RISK_LABEL = { high: "High", medium: "Medium", low: "Low" };

export default function HeroSection() {
  return (
    <section className={styles.page}>
      <div className={styles.glow} aria-hidden="true" />

      <Container className={styles.stage}>
        <span className={styles.badge}>
          <ShieldCheck size={14} strokeWidth={2} />
          Trusted Compliance Platform
        </span>

        <h1 className={styles.h1}>
          Generate{" "}
          <span className={`${serif.className} ${styles.h1Italic}`}>
            role-based
          </span>{" "}
          compliance
          <br />
          training,{" "}
          <span className={`${serif.className} ${styles.h1Italic}`}>
            automatically.
          </span>
        </h1>

        <p className={styles.sub}>
          NextCard turns <span className={styles.subEmph}>AMLR 2024/1624</span>{" "}
          requirements into role-based micro-lessons and learning paths designed
          for regulated enterprises — onboarding new hires in days, not months.
        </p>

        <div className={styles.ctaRow}>
          <BookDemoButton
            size="lg"
            label="Book your Demo"
            className={styles.heroCta}
          />
        </div>
      </Container>

      <div className={styles.previewWrap}>
        <div className={styles.previewBrand}>
          <span className={styles.previewBrandMark}>N</span>
          NextCard Platform
        </div>

        <div className={styles.previewFrame}>
          <div className={styles.preview}>
          <div className={styles.previewChrome}>
            <span className={`${styles.dot} ${styles.dotR}`} />
            <span className={`${styles.dot} ${styles.dotY}`} />
            <span className={`${styles.dot} ${styles.dotG}`} />
            <div className={styles.urlPill}>nextcard.ai / client</div>
          </div>

          <div className={styles.previewBody}>
            <aside className={styles.previewSide}>
              <div className={styles.sideLogo}>NC</div>
              <span className={`${styles.sideItem} ${styles.sideItemActive}`}>Overview</span>
              <span className={styles.sideItem}>Employees</span>
              <span className={styles.sideItem}>Courses</span>
              <span className={styles.sideItem}>Documents</span>
              <span className={styles.sideItem}>Reports</span>
              <span className={styles.sideItem}>Audit</span>
            </aside>

            <div className={styles.previewMain}>
              <div className={styles.previewHead}>
                <div className={styles.previewEyebrow}>Overview</div>
                <h3 className={styles.previewTitle}>Welcome back, Linnéa.</h3>
                <p className={styles.previewSub}>
                  Your compliance programs are 96% AMLR-aligned. 7 reviews need
                  attention this week.
                </p>
              </div>

              <div className={styles.previewStats}>
                {PREVIEW_STATS.map((s) => (
                  <div key={s.label} className={styles.previewStatCard}>
                    <div className={styles.previewStatLabel}>{s.label}</div>
                    <div className={styles.previewStatValue}>{s.value}</div>
                    <div
                      className={`${styles.previewStatSub} ${
                        s.positive ? styles.previewStatSubPos : ""
                      }`.trim()}
                    >
                      {s.sub}
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.previewPanel}>
                <div className={styles.previewPanelHead}>
                  <div className={styles.previewPanelTitle}>Roles &amp; programs</div>
                  <div className={styles.previewPanelMeta}>6 profiles · 973 seats</div>
                </div>

                <div className={styles.previewRoles}>
                  {PREVIEW_ROLES.map((r) => (
                    <div key={r.name} className={styles.previewRoleRow}>
                      <div className={styles.previewRoleNameCol}>
                        <div className={styles.previewRoleName}>{r.name}</div>
                        <div className={styles.previewRoleArticles}>{r.articles}</div>
                      </div>
                      <div className={styles.previewRoleBarWrap}>
                        <div className={styles.previewRoleBar}>
                          <div
                            className={styles.previewRoleBarFill}
                            style={{ width: `${r.completion}%` }}
                          />
                        </div>
                        <div className={styles.previewRoleBarLabel}>
                          {r.completion}% complete
                        </div>
                      </div>
                      <span
                        className={`${styles.previewRiskPill} ${
                          styles[`risk_${r.risk}`]
                        }`}
                      >
                        <span className={styles.previewRiskDot} aria-hidden="true" />
                        {RISK_LABEL[r.risk]} risk
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>

        <div className={`${styles.floatCard} ${styles.floatLeft}`}>
          <div className={styles.floatLabel}>AMLR articles mapped</div>
          <div className={styles.floatValue}>184 articles</div>
          <div className={styles.floatSub}>across 6 role profiles</div>
        </div>

        <div className={`${styles.floatCard} ${styles.floatRight}`}>
          <div className={styles.floatLabel}>Onboarding time</div>
          <div className={styles.floatValue}>−68% faster</div>
          <div className={styles.floatSub}>trusted by tier-1 banks</div>
        </div>
      </div>
    </section>
  );
}
