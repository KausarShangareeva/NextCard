"use client";

import styles from "./ExplainabilityPanel.module.css";

// ─── Types (mirrors the API route output) ─────────────────────────────────────

export interface TrainingModule {
  moduleTitle: string;
  quarter: "Q1" | "Q2" | "Q3" | "Q4";
  riskDimension: string;   // e.g. "AML – CRITICAL"
  amlrArticle: string;     // e.g. "Art. 12 – Employee training obligations"
  competencyGap: string;
  rationale: string;
}

export interface ExplainabilityPanelProps {
  modules: TrainingModule[];
  roleName: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const QUARTER_NAMES: Record<string, string> = {
  Q1: "Foundation",
  Q2: "Application",
  Q3: "Deepening",
  Q4: "Embedding",
};

const QUARTERS = ["Q1", "Q2", "Q3", "Q4"] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function riskLevelClass(riskDimension: string): string {
  const upper = riskDimension.toUpperCase();
  if (upper.includes("CRITICAL")) return styles.riskCritical;
  if (upper.includes("HIGH"))     return styles.riskHigh;
  if (upper.includes("MEDIUM"))   return styles.riskMedium;
  return styles.riskLow;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Arrow() {
  return <div className={styles.arrow} aria-hidden="true">↓</div>;
}

function ModuleCard({ mod }: { mod: TrainingModule }) {
  return (
    <article className={styles.card}>

      {/* Step 1 — Risk dimension */}
      <div className={styles.step}>
        <span className={styles.stepLabel}>Risk</span>
        <span className={`${styles.riskBadge} ${riskLevelClass(mod.riskDimension)}`}>
          <span className={styles.riskDot} aria-hidden="true" />
          {mod.riskDimension}
        </span>
      </div>

      <Arrow />

      {/* Step 2 — AMLR article */}
      <div className={styles.step}>
        <span className={styles.stepLabel}>AMLR Article</span>
        <span className={styles.articlePill}>{mod.amlrArticle}</span>
      </div>

      <Arrow />

      {/* Step 3 — Competency gap */}
      <div className={styles.step}>
        <span className={styles.stepLabel}>Competency Gap</span>
        <span className={styles.stepValue}>{mod.competencyGap}</span>
      </div>

      <Arrow />

      {/* Step 4 — Module */}
      <div className={styles.step}>
        <span className={styles.stepLabel}>Module</span>
        <span className={styles.moduleTitle}>{mod.moduleTitle}</span>
      </div>

      {/* Rationale — visually separated, this is the explainability money shot */}
      <div className={styles.rationale}>
        <span className={styles.rationaleLabel}>Why this module</span>
        <p className={styles.rationaleText}>{mod.rationale}</p>
      </div>

    </article>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ExplainabilityPanel({
  modules,
  roleName,
}: ExplainabilityPanelProps) {
  const byQuarter = QUARTERS.reduce<Record<string, TrainingModule[]>>(
    (acc, q) => {
      acc[q] = modules.filter((m) => m.quarter === q);
      return acc;
    },
    {}
  );

  return (
    <div className={styles.root} aria-label={`Training plan for ${roleName}`}>
      {QUARTERS.map((q) => {
        const qModules = byQuarter[q];
        if (qModules.length === 0) return null;

        return (
          <section key={q} className={styles.quarter}>
            <div className={styles.quarterHead}>
              <span className={styles.quarterLabel}>{q}</span>
              <h2 className={styles.quarterName}>{QUARTER_NAMES[q]}</h2>
              <span className={styles.quarterCount}>
                {qModules.length} module{qModules.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className={styles.moduleList}>
              {qModules.map((mod, i) => (
                <ModuleCard key={`${q}-${i}`} mod={mod} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
