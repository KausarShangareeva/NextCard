"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import ExplainabilityPanel, {
  type TrainingModule,
} from "@/components/training/ExplainabilityPanel";
import HumanReviewPanel, {
  type AuditEntry,
  type ReviewModule,
} from "@/components/training/HumanReviewPanel";
import styles from "./page.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

type RiskLevel = "CRITICAL" | "HIGH" | "MEDIUM";
type PageStage = "select" | "review" | "human-review" | "finalised";

interface RoleCard {
  id: string;
  name: string;
  description: string;
  overallRisk: RiskLevel;
}

interface TrainingPlanResponse {
  roleId: string;
  roleName: string;
  modules: TrainingModule[];
  ragArticlesUsed: string[];
  generatedAt: string;
}

// ─── Static data ──────────────────────────────────────────────────────────────

const ROLES: RoleCard[] = [
  {
    id: "kyc-analyst",
    name: "KYC Analyst",
    description:
      "Conducts enhanced due diligence on high-risk customers and validates ownership structures.",
    overallRisk: "CRITICAL",
  },
  {
    id: "customer-advisor",
    name: "Customer Advisor",
    description:
      "First point of contact during onboarding; recognises and escalates suspicious behaviour.",
    overallRisk: "HIGH",
  },
  {
    id: "tm-analyst",
    name: "TM Analyst",
    description:
      "Reviews transaction monitoring alerts and prepares SAR-ready investigation records.",
    overallRisk: "CRITICAL",
  },
  {
    id: "aml-ddi-manager",
    name: "AML DDI Manager",
    description:
      "Manages KYC/AML searches on third-party partners and coaches the analyst team.",
    overallRisk: "HIGH",
  },
  {
    id: "mlro",
    name: "MLRO",
    description:
      "Holds ultimate accountability for SAR submissions and the entire financial crime framework.",
    overallRisk: "CRITICAL",
  },
];

const RISK_CLASS: Record<RiskLevel, string> = {
  CRITICAL: styles.riskCritical,
  HIGH:     styles.riskHigh,
  MEDIUM:   styles.riskMedium,
};

const STEPS = [
  { key: "select",       label: "Select Role"        },
  { key: "review",       label: "Review AI Plan"     },
  { key: "human-review", label: "Compliance Review"  },
  { key: "finalised",    label: "Finalised"           },
] as const;

const STAGE_INDEX: Record<PageStage, number> = {
  "select":       0,
  "review":       1,
  "human-review": 2,
  "finalised":    3,
};

const AUDIT_ACTION_CLASS: Record<AuditEntry["action"], string> = {
  APPROVED: styles.auditApproved,
  EDITED:   styles.auditEdited,
  REMOVED:  styles.auditRemoved,
  ADDED:    styles.auditAdded,
};

// ─── Page ─────────────────────────────────────────────────────────────────────

function TrainingPipelineContent() {
  const [stage,        setStage]        = useState<PageStage>("select");
  const [selectedId,   setSelectedId]   = useState<string | null>(null);
  const [loading,      setLoading]      = useState(false);
  const [plan,         setPlan]         = useState<TrainingPlanResponse | null>(null);
  const [error,        setError]        = useState<string | null>(null);
  const [finalModules, setFinalModules] = useState<ReviewModule[]>([]);
  const [auditLog,     setAuditLog]     = useState<AuditEntry[]>([]);

  const planRef    = useRef<HTMLDivElement>(null);
  const reviewRef  = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const autoFired  = useRef(false);

  const searchParams = useSearchParams();

  const selectedRole   = ROLES.find((r) => r.id === selectedId) ?? null;
  const activeStepIdx  = STAGE_INDEX[stage];

  // ── Select a role & call pipeline ──
  async function handleSelectRole(role: RoleCard) {
    if (loading) return;
    setSelectedId(role.id);
    setStage("select");
    setLoading(true);
    setPlan(null);
    setError(null);
    setFinalModules([]);
    setAuditLog([]);

    try {
      const res  = await fetch("/api/generate-training-plan", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ roleId: role.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail ?? data.error ?? `Server error ${res.status}`);
      setPlan(data);
      setStage("review");
      setTimeout(() => planRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  // ── Bug 1: auto-select role from ?role= URL param ──
  useEffect(() => {
    if (autoFired.current) return;
    const roleId = searchParams.get("role");
    if (!roleId) return;
    const role = ROLES.find((r) => r.id === roleId);
    if (!role) return;
    autoFired.current = true;
    handleSelectRole(role);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Send to human review ──
  function handleSendToReview() {
    setStage("human-review");
    setTimeout(() => reviewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  }

  // ── Human review complete ──
  function handleReviewComplete(approved: ReviewModule[], log: AuditEntry[]) {
    setFinalModules(approved);
    setAuditLog(log);
    setStage("finalised");
    setTimeout(() => summaryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  }

  // ── Reset everything ──
  function handleStartAgain() {
    setStage("select");
    setSelectedId(null);
    setPlan(null);
    setError(null);
    setFinalModules([]);
    setAuditLog([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── Audit summary stats ──
  const countAction = (a: AuditEntry["action"]) => auditLog.filter((e) => e.action === a).length;

  return (
    <div className={styles.page}>

      {/* ── Header ── */}
      <header>
        <div className={styles.eyebrow}>AMLR 2024/1624</div>
        <h1 className={styles.title}>Training Plan Generator</h1>
        <p className={styles.sub}>
          Select a role to generate an AMLR-compliant, role-specific training
          plan. Every module is grounded in regulatory articles — not guessed.
        </p>
      </header>

      {/* ── Step indicator ── */}
      <div className={styles.steps} aria-label="Pipeline steps">
        {STEPS.map((step, idx) => {
          const isActive = idx === activeStepIdx;
          const isDone   = idx < activeStepIdx;
          return (
            <div key={step.key} style={{ display: "contents" }}>
              <div className={styles.stepItem}>
                <span
                  className={[
                    styles.stepCircle,
                    isActive ? styles.stepCircleActive : "",
                    isDone   ? styles.stepCircleDone   : "",
                  ].filter(Boolean).join(" ")}
                  aria-current={isActive ? "step" : undefined}
                >
                  {isDone ? "✓" : idx + 1}
                </span>
                <span
                  className={[
                    styles.stepLabel,
                    isActive ? styles.stepLabelActive : "",
                    isDone   ? styles.stepLabelDone   : "",
                  ].filter(Boolean).join(" ")}
                >
                  {step.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={styles.stepConnector} aria-hidden="true" />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Role selector (always visible so user can restart) ── */}
      <section>
        <p className={styles.gridLabel}>Select a role</p>
        <div className={styles.grid} style={{ marginTop: 10 }}>
          {ROLES.map((role) => (
            <button
              key={role.id}
              type="button"
              onClick={() => handleSelectRole(role)}
              disabled={loading}
              className={[
                styles.card,
                selectedId === role.id ? styles.cardSelected : "",
              ].filter(Boolean).join(" ")}
              aria-pressed={selectedId === role.id}
            >
              <span className={styles.cardName}>{role.name}</span>
              <span className={styles.cardDesc}>{role.description}</span>
              <span className={`${styles.riskBadge} ${RISK_CLASS[role.overallRisk]}`}>
                <span className={styles.riskDot} aria-hidden="true" />
                {role.overallRisk}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Loading ── */}
      {loading && selectedRole && (
        <div className={styles.loadingBox} role="status" aria-live="polite">
          <span className={styles.spinner} aria-hidden="true" />
          <span className={styles.loadingText}>
            Generating training plan for{" "}
            <span className={styles.loadingRole}>{selectedRole.name}</span>
            {" "}— querying AMLR regulation and mapping risk profile…
          </span>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className={styles.errorBox} role="alert">
          <div className={styles.errorTitle}>Pipeline error</div>
          <div className={styles.errorDetail}>{error}</div>
        </div>
      )}

      {/* ── Stage: review — ExplainabilityPanel + send button ── */}
      {stage === "review" && plan && !loading && (
        <div ref={planRef}>
          <div className={styles.planHead}>
            <span className={styles.planEyebrow}>AI-generated training plan</span>
            <h2 className={styles.planTitle}>{plan.roleName}</h2>
            <p className={styles.planMeta}>
              {plan.modules.length} modules across Q1–Q4 ·{" "}
              {plan.ragArticlesUsed.length} AMLR articles cited ·{" "}
              generated {new Date(plan.generatedAt).toLocaleTimeString()}
            </p>
          </div>

          <div style={{ marginTop: 24 }}>
            <ExplainabilityPanel modules={plan.modules} roleName={plan.roleName} />
          </div>

          <div className={styles.sendReviewRow} style={{ marginTop: 24 }}>
            <button type="button" className={styles.btnSendReview} onClick={handleSendToReview}>
              Send to Compliance Review →
            </button>
          </div>
        </div>
      )}

      {/* ── Stage: human-review ── */}
      {stage === "human-review" && plan && (
        <div ref={reviewRef}>
          <HumanReviewPanel
            modules={plan.modules as ReviewModule[]}
            roleName={plan.roleName}
            onReviewComplete={handleReviewComplete}
          />
        </div>
      )}

      {/* ── Stage: finalised — summary screen ── */}
      {stage === "finalised" && (
        <div ref={summaryRef}>

          {/* Compliance banner */}
          <div className={styles.complianceBanner}>
            <span className={styles.bannerIcon}>✅</span>
            <div>
              <div className={styles.bannerText}>
                This training plan is AMLR-compliant and audit-ready
              </div>
              <div className={styles.bannerSub}>
                Every module has been reviewed by a compliance expert and logged
                with a full audit trail — ready to present to regulators.
              </div>
            </div>
          </div>

          {/* Summary header */}
          <div className={styles.summaryHead} style={{ marginTop: 20 }}>
            <span className={styles.eyebrow}>Finalised training plan</span>
            <h2 className={styles.summaryTitle}>{plan?.roleName}</h2>
            <p className={styles.summaryRole}>
              {finalModules.length} modules finalised ·{" "}
              reviewed by Compliance Expert ·{" "}
              {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
            </p>
          </div>

          {/* Stats */}
          <div className={styles.summaryStats} style={{ marginTop: 16 }}>
            <div className={styles.summaryStatCard}>
              <div className={styles.summaryStatLabel}>Modules approved</div>
              <div className={`${styles.summaryStatValue} ${styles.summaryStatValueGreen}`}>
                {countAction("APPROVED")}
              </div>
            </div>
            <div className={styles.summaryStatCard}>
              <div className={styles.summaryStatLabel}>Modules edited</div>
              <div className={`${styles.summaryStatValue} ${styles.summaryStatValueBlue}`}>
                {countAction("EDITED")}
              </div>
            </div>
            <div className={styles.summaryStatCard}>
              <div className={styles.summaryStatLabel}>Modules removed</div>
              <div className={`${styles.summaryStatValue} ${styles.summaryStatValueRed}`}>
                {countAction("REMOVED")}
              </div>
            </div>
            <div className={styles.summaryStatCard}>
              <div className={styles.summaryStatLabel}>Modules added</div>
              <div className={styles.summaryStatValue}>
                {countAction("ADDED")}
              </div>
            </div>
          </div>

          {/* Audit trail */}
          <div style={{ marginTop: 24 }}>
            <div className={styles.auditTableHead}>
              <h3 className={styles.auditTableTitle}>Review Audit Trail</h3>
              <span className={styles.auditTableCount}>{auditLog.length} entries</span>
            </div>
            <div className={styles.auditTable}>
              {auditLog.map((entry) => (
                <div key={`${entry.timestamp}-${entry.action}-${entry.moduleTitle}`} className={styles.auditTableRow}>
                  <span className={styles.auditTime}>
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                  <span className={`${styles.auditAction} ${AUDIT_ACTION_CLASS[entry.action]}`}>
                    {entry.action}
                  </span>
                  <div>
                    <div className={styles.auditModuleTitle}>{entry.moduleTitle}</div>
                    {entry.justification && (
                      <div className={styles.auditJustification}>{entry.justification}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Start again */}
          <div className={styles.startAgainRow} style={{ marginTop: 24 }}>
            <button type="button" className={styles.btnStartAgain} onClick={handleStartAgain}>
              ← Generate plan for another role
            </button>
          </div>

        </div>
      )}

    </div>
  );
}

export default function TrainingPipelinePage() {
  return (
    <Suspense>
      <TrainingPipelineContent />
    </Suspense>
  );
}
