"use client";

import { useState } from "react";
import {
  Sparkles,
  ShieldAlert,
  Layers,
  CheckCircle2,
  Send,
  Clock,
  Info,
} from "lucide-react";
import Dropdown from "@/components/ui/Dropdown";
import {
  ROLE_LIST,
  ROLE_RISKS,
  RISK_TO_AMLR,
  AMLR_ARTICLES,
  planFor,
  articleCoverage,
} from "./builderData";
import styles from "./CourseBuilder.module.css";

const RISK_CATS = ["AML", "Sanctions", "Fraud", "Documentation"];

const RISK_CLASS = {
  high:   "riskHigh",
  medium: "riskMedium",
  low:    "riskLow",
};

const RISK_LABEL = {
  high:   "High",
  medium: "Medium",
  low:    "Low",
};

const ROLE_OPTIONS = ROLE_LIST.map((r) => ({ value: r, label: r }));

export default function CourseBuilder() {
  const [role, setRole] = useState(ROLE_LIST[0]);
  const [published, setPublished] = useState(false);

  const risks = ROLE_RISKS[role];
  const coverage = articleCoverage(role);
  const plan = planFor(role);

  const totalModules = plan.reduce((s, q) => s + q.modules.length, 0);
  const totalMinutes = plan.reduce(
    (s, q) => s + q.modules.reduce((mm, m) => mm + m.minutes, 0),
    0
  );

  const onPublish = () => {
    setPublished(true);
    setTimeout(() => setPublished(false), 2400);
  };

  return (
    <div className={styles.builder}>
      {/* ─── STEP 1: Role intake ─── */}
      <section className={styles.step}>
        <header className={styles.stepHead}>
          <span className={styles.stepBadge}>1</span>
          <div className={styles.stepHeadText}>
            <h2 className={styles.stepTitle}>Pick a role</h2>
            <p className={styles.stepSub}>
              We start from the role description and inherent risk exposure
              your client provided.
            </p>
          </div>
        </header>

        <div className={styles.roleRow}>
          <div className={styles.roleField}>
            <label htmlFor="cb-role" className={styles.label}>
              Compliance role
            </label>
            <Dropdown
              id="cb-role"
              value={role}
              onChange={(v) => {
                setRole(v);
                setPublished(false);
              }}
              placeholder="Pick a role"
              options={ROLE_OPTIONS}
            />
          </div>

          <div className={styles.roleStats}>
            <div className={styles.roleStat}>
              <span className={styles.roleStatLabel}>Modules</span>
              <span className={styles.roleStatValue}>{totalModules}</span>
            </div>
            <span className={styles.roleStatDivider} aria-hidden="true" />
            <div className={styles.roleStat}>
              <span className={styles.roleStatLabel}>Total time</span>
              <span className={styles.roleStatValue}>
                {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
              </span>
            </div>
            <span className={styles.roleStatDivider} aria-hidden="true" />
            <div className={styles.roleStat}>
              <span className={styles.roleStatLabel}>AMLR articles</span>
              <span className={styles.roleStatValue}>{coverage.length}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STEP 2: Risk → AMLR mapping ─── */}
      <section className={styles.step}>
        <header className={styles.stepHead}>
          <span className={styles.stepBadge}>2</span>
          <div className={styles.stepHeadText}>
            <h2 className={styles.stepTitle}>Risks → AMLR articles</h2>
            <p className={styles.stepSub}>
              Each risk category maps to specific AMLR articles. Hover any
              article to see <em>why</em> it&apos;s in the plan for this role.
            </p>
          </div>
        </header>

        <div className={styles.mapWrap}>
          <div className={styles.mapCol}>
            <span className={styles.mapColLabel}>
              <ShieldAlert size={12} strokeWidth={1.8} />
              Role risk profile
            </span>
            <ul className={styles.riskList}>
              {RISK_CATS.map((cat) => {
                const r = risks[cat];
                return (
                  <li key={cat} className={styles.riskItem}>
                    <span className={styles.riskName}>{cat}</span>
                    <span
                      className={`${styles.riskPill} ${styles[RISK_CLASS[r.level]]}`}
                    >
                      <span className={styles.riskDot} aria-hidden="true" />
                      {RISK_LABEL[r.level]}
                    </span>
                    <span className={styles.riskWhy} title={r.why}>
                      <Info size={11} strokeWidth={1.8} />
                      {r.why}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className={styles.mapCol}>
            <span className={styles.mapColLabel}>
              <Layers size={12} strokeWidth={1.8} />
              AMLR articles in plan
            </span>
            <div className={styles.articleGrid}>
              {coverage.map((c) => (
                <div key={c.article} className={styles.articleCard}>
                  <div className={styles.articleHead}>
                    <span className={styles.articleId}>{c.article}</span>
                    <span className={styles.articleTitle}>{c.title}</span>
                  </div>
                  <p className={styles.articleBlurb}>{c.blurb}</p>
                  <div className={styles.articleRisks}>
                    {c.risks.map((rsk) => (
                      <span key={rsk} className={styles.articleRiskChip}>
                        triggered by {rsk}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── STEP 3: Quarterly plan ─── */}
      <section className={styles.step}>
        <header className={styles.stepHead}>
          <span className={styles.stepBadge}>3</span>
          <div className={styles.stepHeadText}>
            <h2 className={styles.stepTitle}>Auto-generated training plan</h2>
            <p className={styles.stepSub}>
              Q1 → Q4 progression: foundation, application, deepening,
              embedding. Every module shows{" "}
              <strong>why it was included</strong>.
            </p>
          </div>
        </header>

        <div className={styles.quarters}>
          {plan.map((q) => (
            <div key={q.id} className={styles.quarter}>
              <div className={styles.quarterHead}>
                <div className={styles.quarterTitle}>{q.name}</div>
                <div className={styles.quarterHint}>{q.hint}</div>
              </div>
              <div className={styles.modules}>
                {q.modules.map((m) => (
                  <article key={m.id} className={styles.module}>
                    <div className={styles.moduleTop}>
                      <span className={styles.moduleName}>{m.name}</span>
                      <span className={styles.moduleMinutes}>
                        <Clock size={11} strokeWidth={1.8} />
                        {m.minutes}m
                      </span>
                    </div>
                    <div className={styles.moduleMeta}>
                      <span className={styles.moduleArticle}>{m.article}</span>
                      <span className={styles.moduleArticleTitle}>
                        {m.articleTitle}
                      </span>
                    </div>
                    <div className={styles.moduleWhy}>
                      <Sparkles size={11} strokeWidth={1.8} />
                      <span>{m.why}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── STEP 4: Publish ─── */}
      <section className={styles.publish}>
        <div className={styles.publishLeft}>
          <span className={styles.publishEyebrow}>Ready to publish</span>
          <h3 className={styles.publishTitle}>
            {totalModules} modules · {Math.floor(totalMinutes / 60)}h{" "}
            {totalMinutes % 60}m · covers {coverage.length} AMLR articles
          </h3>
          <p className={styles.publishSub}>
            Every module is justified against the role&apos;s risk profile.
            Publishing sends it to all <strong>{role}</strong> learners in the
            client&apos;s portal.
          </p>
        </div>
        <button
          type="button"
          className={`${styles.publishBtn} ${published ? styles.publishBtnDone : ""}`.trim()}
          onClick={onPublish}
        >
          {published ? (
            <>
              <CheckCircle2 size={14} strokeWidth={2.2} />
              Published to client
            </>
          ) : (
            <>
              <Send size={14} strokeWidth={1.8} />
              Publish to client portal
            </>
          )}
        </button>
      </section>
    </div>
  );
}
