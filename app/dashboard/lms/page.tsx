"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

type RiskLevel = "CRITICAL" | "HIGH";
type TrainingStatus = "completed" | "in-progress" | "not-started";

interface Learner {
  id: string;
  initials: string;
  name: string;
  role: string;
  department: string;
  riskLevel: RiskLevel;
  trainingStatus: TrainingStatus;
  modulesCompleted: number;
  modulesTotal: number;
  currentModule: string | null;
  dueDate: string;
  awaitingPlan?: boolean;
}

// ─── Static data ──────────────────────────────────────────────────────────────

const SEED_LEARNERS: Learner[] = [
  {
    id: "lms-1",
    initials: "SC",
    name: "Sarah Chen",
    role: "KYC Analyst",
    department: "Financial Crime",
    riskLevel: "CRITICAL",
    trainingStatus: "in-progress",
    modulesCompleted: 4,
    modulesTotal: 18,
    currentModule: "Enhanced Due Diligence for High-Risk Customers",
    dueDate: "2026-09-30",
  },
  {
    id: "lms-2",
    initials: "JO",
    name: "James Okafor",
    role: "Customer Advisor",
    department: "Customer Operations",
    riskLevel: "HIGH",
    trainingStatus: "not-started",
    modulesCompleted: 0,
    modulesTotal: 14,
    currentModule: "AML/KYC Awareness for Customer Staff",
    dueDate: "2026-09-30",
  },
  {
    id: "lms-3",
    initials: "PN",
    name: "Priya Nair",
    role: "TM Analyst",
    department: "Fraud & Financial Crime",
    riskLevel: "CRITICAL",
    trainingStatus: "in-progress",
    modulesCompleted: 7,
    modulesTotal: 18,
    currentModule: "SAR Submission Process",
    dueDate: "2026-09-30",
  },
  {
    id: "lms-4",
    initials: "MW",
    name: "Marcus Webb",
    role: "AML DDI Manager",
    department: "AML Due Diligence & Investigations",
    riskLevel: "HIGH",
    trainingStatus: "completed",
    modulesCompleted: 16,
    modulesTotal: 16,
    currentModule: null,
    dueDate: "2026-06-30",
  },
  {
    id: "lms-5",
    initials: "DK",
    name: "Diana Kowalski",
    role: "MLRO",
    department: "Risk & Compliance",
    riskLevel: "CRITICAL",
    trainingStatus: "not-started",
    modulesCompleted: 0,
    modulesTotal: 20,
    currentModule: "AMLR 2024/1624 Overview for Senior Officers",
    dueDate: "2026-06-30",
  },
];

const ROLE_OPTIONS = [
  { label: "KYC Analyst",        value: "KYC Analyst",        risk: "CRITICAL" as RiskLevel, id: "kyc-analyst" },
  { label: "Customer Advisor",   value: "Customer Advisor",   risk: "HIGH"     as RiskLevel, id: "customer-advisor" },
  { label: "TM Analyst",         value: "TM Analyst",         risk: "CRITICAL" as RiskLevel, id: "tm-analyst" },
  { label: "AML DDI Manager",    value: "AML DDI Manager",    risk: "HIGH"     as RiskLevel, id: "aml-ddi-manager" },
  { label: "MLRO",               value: "MLRO",               risk: "CRITICAL" as RiskLevel, id: "mlro" },
];

const ROLE_SLUG: Record<string, string> = {
  "KYC Analyst":     "kyc-analyst",
  "Customer Advisor":"customer-advisor",
  "TM Analyst":      "tm-analyst",
  "AML DDI Manager": "aml-ddi-manager",
  "MLRO":            "mlro",
};

const LS_KEY = "lms-custom-employees";

const RISK_CLASS: Record<RiskLevel, string> = {
  CRITICAL: "riskCritical",
  HIGH:     "riskHigh",
};

const STATUS_CLASS: Record<TrainingStatus, string> = {
  "completed":   "tsCompleted",
  "in-progress": "tsInProgress",
  "not-started": "tsNotStarted",
};

const STATUS_LABEL: Record<TrainingStatus, string> = {
  "completed":   "Completed",
  "in-progress": "In Progress",
  "not-started": "Not Started",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const toInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// ─── Add Employee Modal ───────────────────────────────────────────────────────

interface FormState {
  name: string;
  role: string;
  department: string;
  dueDate: string;
}

interface FormErrors {
  name?: string;
  role?: string;
  department?: string;
  dueDate?: string;
}

function AddEmployeeModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (learner: Learner) => void;
}) {
  const [form, setForm] = useState<FormState>({
    name: "",
    role: "",
    department: "",
    dueDate: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const firstInputRef = useRef<HTMLInputElement>(null);

  const selectedRoleOption = ROLE_OPTIONS.find((o) => o.value === form.role) ?? null;
  const todayISO = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    firstInputRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const set = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((err) => ({ ...err, [field]: undefined }));
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (form.name.trim().length < 2)  errs.name       = "Name must be at least 2 characters.";
    if (!form.role)                    errs.role       = "Please select a role.";
    if (!form.department.trim())       errs.department = "Department is required.";
    if (!form.dueDate)                 errs.dueDate    = "Due date is required.";
    else if (form.dueDate <= todayISO) errs.dueDate    = "Due date must be in the future.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !selectedRoleOption) return;
    onAdd({
      id: `lms-new-${Date.now()}`,
      initials: toInitials(form.name),
      name: form.name.trim(),
      role: form.role,
      department: form.department.trim(),
      riskLevel: selectedRoleOption.risk,
      trainingStatus: "not-started",
      modulesCompleted: 0,
      modulesTotal: 0,
      currentModule: null,
      dueDate: form.dueDate,
      awaitingPlan: true,
    });
    onClose();
  };

  const isValid =
    form.name.trim().length >= 2 &&
    !!form.role &&
    !!form.department.trim() &&
    !!form.dueDate &&
    form.dueDate > todayISO;

  return (
    <div
      className={styles.backdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-emp-title"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

        {/* Modal header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalEyebrow}>AMLR 2024/1624</div>
          <h2 id="add-emp-title" className={styles.modalTitle}>Add Employee</h2>
          <p className={styles.modalSub}>
            Risk level is auto-assigned based on role. A training plan can
            be generated from the Training Pipeline after saving.
          </p>
        </div>

        <form className={styles.modalForm} onSubmit={handleSubmit} noValidate>

          {/* Full name */}
          <div className={styles.fieldGroup}>
            <label htmlFor="emp-name" className={styles.fieldLabel}>
              Full Name <span aria-hidden="true">*</span>
            </label>
            <input
              ref={firstInputRef}
              id="emp-name"
              type="text"
              value={form.name}
              onChange={set("name")}
              placeholder="e.g. Anna Lindqvist"
              className={`${styles.fieldInput} ${errors.name ? styles.fieldInputError : ""}`}
            />
            {errors.name && <span className={styles.fieldError}>{errors.name}</span>}
          </div>

          {/* Role */}
          <div className={styles.fieldGroup}>
            <label htmlFor="emp-role" className={styles.fieldLabel}>
              Role <span aria-hidden="true">*</span>
            </label>
            <select
              id="emp-role"
              value={form.role}
              onChange={set("role")}
              className={`${styles.fieldSelect} ${errors.role ? styles.fieldInputError : ""}`}
            >
              <option value="">Select a compliance role…</option>
              {ROLE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            {errors.role && <span className={styles.fieldError}>{errors.role}</span>}

            {/* Live risk preview */}
            {selectedRoleOption && (
              <div className={styles.riskPreview}>
                <span className={styles.riskPreviewLabel}>Risk level auto-assigned:</span>
                <span className={`${styles.riskBadge} ${styles[RISK_CLASS[selectedRoleOption.risk]]}`}>
                  <span className={styles.riskDot} aria-hidden="true" />
                  {selectedRoleOption.risk}
                </span>
              </div>
            )}
          </div>

          {/* Department */}
          <div className={styles.fieldGroup}>
            <label htmlFor="emp-dept" className={styles.fieldLabel}>
              Department <span aria-hidden="true">*</span>
            </label>
            <input
              id="emp-dept"
              type="text"
              value={form.department}
              onChange={set("department")}
              placeholder="e.g. Financial Crime"
              className={`${styles.fieldInput} ${errors.department ? styles.fieldInputError : ""}`}
            />
            {errors.department && <span className={styles.fieldError}>{errors.department}</span>}
          </div>

          {/* Due date */}
          <div className={styles.fieldGroup}>
            <label htmlFor="emp-due" className={styles.fieldLabel}>
              Training Due Date <span aria-hidden="true">*</span>
            </label>
            <input
              id="emp-due"
              type="date"
              value={form.dueDate}
              min={todayISO}
              onChange={set("dueDate")}
              className={`${styles.fieldInput} ${errors.dueDate ? styles.fieldInputError : ""}`}
            />
            {errors.dueDate && <span className={styles.fieldError}>{errors.dueDate}</span>}
          </div>

          {/* Footer */}
          <div className={styles.modalFooter}>
            <button type="button" className={styles.btnCancel} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.btnSave} disabled={!isValid}>
              Save Employee
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LMSPage() {
  const [customLearners, setCustomLearners] = useState<Learner[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  // Bug 2 — load persisted employees from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_KEY);
      if (stored) setCustomLearners(JSON.parse(stored) as Learner[]);
    } catch {}
  }, []);

  const learners = [...SEED_LEARNERS, ...customLearners];

  // Bug 3 — dynamic summary: On Track = completed | in-progress; At Risk = not-started
  const onTrackCount = learners.filter(
    (r) => r.trainingStatus === "completed" || r.trainingStatus === "in-progress"
  ).length;
  const atRiskCount = learners.filter(
    (r) => r.trainingStatus === "not-started"
  ).length;

  // Bug 2 — persist new employee to localStorage
  const addLearner = (l: Learner) => {
    setCustomLearners((prev) => {
      const next = [...prev, l];
      try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  return (
    <div className={styles.page}>

      {/* ── Header ── */}
      <header className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <div className={styles.eyebrow}>AMLR 2024/1624</div>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>Learning Management</h1>
            <span className={styles.amlrBadge}>AMLR 2024/1624 Compliant Framework</span>
          </div>
          <p className={styles.sub}>
            Role-specific training progress for every regulated position.
            Plans are AI-generated, grounded in regulatory articles, and
            reviewed by compliance experts before assignment.
          </p>
        </div>
        <button
          type="button"
          className={styles.addBtn}
          onClick={() => setModalOpen(true)}
        >
          + Add Employee
        </button>
      </header>

      {/* ── Summary bar ── */}
      <div className={styles.summaryRow}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryValue}>{learners.length}</div>
          <div className={styles.summaryLabel}>Roles Registered</div>
          <div className={styles.summarySub}>under AMLR framework</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={`${styles.summaryValue} ${styles.summaryValueGreen}`}>
            {onTrackCount}
          </div>
          <div className={styles.summaryLabel}>On Track</div>
          <div className={styles.summarySub}>completed or progressing</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={`${styles.summaryValue} ${styles.summaryValueRed}`}>
            {atRiskCount}
          </div>
          <div className={styles.summaryLabel}>At Risk</div>
          <div className={styles.summarySub}>not started · deadline approaching</div>
        </div>
      </div>

      {/* ── Learner table ── */}
      <section>
        <div className={styles.tableWrap}>

          {/* Header row */}
          <div className={styles.tableHead}>
            <span>Employee</span>
            <span>Risk</span>
            <span>Status</span>
            <span>Progress</span>
            <span>Current Module</span>
            <span>Due</span>
            <span />
          </div>

          {/* Data rows */}
          {learners.map((r) => {
            const pct =
              r.modulesTotal > 0
                ? Math.round((r.modulesCompleted / r.modulesTotal) * 100)
                : 0;

            return (
              <div key={r.id} className={styles.tableRow}>

                {/* Employee */}
                <div className={styles.employee}>
                  <div className={styles.avatar}>{r.initials}</div>
                  <div className={styles.employeeInfo}>
                    <div className={styles.employeeName}>{r.name}</div>
                    <div className={styles.employeeRole}>{r.role}</div>
                    <div className={styles.employeeDept}>{r.department}</div>
                  </div>
                </div>

                {/* Risk */}
                <span className={`${styles.riskBadge} ${styles[RISK_CLASS[r.riskLevel]]}`}>
                  <span className={styles.riskDot} aria-hidden="true" />
                  {r.riskLevel}
                </span>

                {/* Status */}
                <span className={`${styles.statusBadge} ${styles[STATUS_CLASS[r.trainingStatus]]}`}>
                  <span className={styles.statusDot} aria-hidden="true" />
                  {STATUS_LABEL[r.trainingStatus]}
                </span>

                {/* Progress */}
                <div className={styles.progress}>
                  <div className={styles.progressTop}>
                    <span className={styles.progressFraction}>
                      {r.modulesCompleted}/{r.modulesTotal || "—"}
                    </span>
                    {r.modulesTotal > 0 && (
                      <span className={styles.progressPct}>{pct}%</span>
                    )}
                  </div>
                  <div className={styles.progressTrack}>
                    <div
                      className={[
                        styles.progressFill,
                        r.trainingStatus === "completed" ? styles.progressFillDone : "",
                      ].filter(Boolean).join(" ")}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Current module */}
                <span className={r.awaitingPlan ? styles.awaitingModule : styles.currentModule}>
                  {r.awaitingPlan
                    ? "Awaiting training plan generation"
                    : (r.currentModule ?? "—")}
                </span>

                {/* Due date */}
                <span className={styles.dueDate}>{formatDate(r.dueDate)}</span>

                {/* Action */}
                {r.awaitingPlan ? (
                  <Link
                    href={`/dashboard/training-pipeline?role=${ROLE_SLUG[r.role] ?? ""}`}
                    className={styles.generateBtn}
                  >
                    Generate Plan →
                  </Link>
                ) : (
                  <Link
                    href="/dashboard/training-pipeline"
                    className={styles.viewBtn}
                  >
                    View Training Plan →
                  </Link>
                )}

              </div>
            );
          })}
        </div>
      </section>

      {/* ── Modal ── */}
      {modalOpen && (
        <AddEmployeeModal
          onClose={() => setModalOpen(false)}
          onAdd={addLearner}
        />
      )}

    </div>
  );
}
