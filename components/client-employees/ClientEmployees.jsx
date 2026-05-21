"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Mail, Phone, MoreVertical, Search, Plus } from "lucide-react";
import AddEmployeeModal from "./AddEmployeeModal";
import styles from "./ClientEmployees.module.css";

// ─── AMLR Regulated Roles (the 5 hackathon roles) ────────────────────────────

const AMLR_ROLES = [
  {
    id: "amlr-1",
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
    id: "amlr-2",
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
    id: "amlr-3",
    initials: "PN",
    name: "Priya Nair",
    role: "Transaction Monitoring Analyst",
    department: "Fraud & Financial Crime",
    riskLevel: "CRITICAL",
    trainingStatus: "in-progress",
    modulesCompleted: 7,
    modulesTotal: 18,
    currentModule: "SAR Submission Process",
    dueDate: "2026-09-30",
  },
  {
    id: "amlr-4",
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
    id: "amlr-5",
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

// Summary stats — derived from AMLR_ROLES
const TODAY = new Date("2026-05-20");
const SIX_MONTHS_MS = 6 * 30 * 24 * 60 * 60 * 1000;
const isAtRisk = (r) =>
  r.trainingStatus === "not-started" &&
  new Date(r.dueDate) - TODAY <= SIX_MONTHS_MS;

const SUMMARY = {
  total:     AMLR_ROLES.length,
  completed: AMLR_ROLES.filter((r) => r.trainingStatus === "completed").length,
  atRisk:    AMLR_ROLES.filter(isAtRisk).length,
};

// ─── Styling maps ─────────────────────────────────────────────────────────────

const RISK_CLASS = {
  CRITICAL: styles.riskCritical,
  HIGH:     styles.riskHigh,
  MEDIUM:   styles.riskMedium,
  LOW:      styles.riskLow,
};

const TRAINING_STATUS_CLASS = {
  "completed":   styles.tsCompleted,
  "in-progress": styles.tsInProgress,
  "not-started": styles.tsNotStarted,
};

const TRAINING_STATUS_LABEL = {
  "completed":   "Completed",
  "in-progress": "In Progress",
  "not-started": "Not Started",
};

// ─── Existing employees (unchanged) ──────────────────────────────────────────

const INITIAL_EMPLOYEES = [
  { id: 1,  initials: "LJ", name: "Lars Johansson",   role: "AML Officer",         email: "lars.j@swedbank.se",      phone: "+46 70 123 45 67", status: "active",     programs: "AMLR · KYC",      progress: 92 },
  { id: 2,  initials: "KA", name: "Klara Andersson",  role: "KYC Analyst",         email: "klara.a@swedbank.se",     phone: "+46 70 234 56 78", status: "active",     programs: "AMLR core",       progress: 78 },
  { id: 3,  initials: "EH", name: "Erik Hellström",   role: "Compliance Lead",     email: "erik.h@swedbank.se",      phone: "+46 70 345 67 89", status: "active",     programs: "AMLR · SAR",      progress: 100 },
  { id: 4,  initials: "ML", name: "Maria Lindberg",   role: "KYC Analyst",         email: "maria.l@swedbank.se",     phone: "+46 70 456 78 90", status: "onboarding", programs: "AMLR onboard",    progress: 18 },
  { id: 5,  initials: "AB", name: "Anders Bergström", role: "Branch Manager",      email: "a.bergstrom@swedbank.se", phone: "+46 70 567 89 01", status: "active",     programs: "AMLR · Sanctions", progress: 86 },
  { id: 6,  initials: "SO", name: "Sofia Olsson",     role: "Customer Onboarding", email: "sofia.o@swedbank.se",     phone: "+46 70 678 90 12", status: "active",     programs: "AMLR core",       progress: 64 },
  { id: 7,  initials: "JN", name: "Johan Nilsson",    role: "Risk Officer",        email: "johan.n@swedbank.se",     phone: "+46 70 789 01 23", status: "active",     programs: "AMLR · Risk",     progress: 100 },
  { id: 8,  initials: "EP", name: "Elsa Pettersson",  role: "Operations Support",  email: "elsa.p@swedbank.se",      phone: "+46 70 890 12 34", status: "inactive",   programs: "AMLR core",       progress: 42 },
  { id: 9,  initials: "MK", name: "Mikael Karlsson",  role: "Branch Manager",      email: "m.karlsson@swedbank.se",  phone: "+46 70 901 23 45", status: "active",     programs: "AMLR · Sanctions", progress: 91 },
  { id: 10, initials: "AS", name: "Astrid Svensson",  role: "AML Officer",         email: "astrid.s@swedbank.se",    phone: "+46 70 012 34 56", status: "active",     programs: "AMLR · KYC",      progress: 73 },
  { id: 11, initials: "OL", name: "Oskar Lindqvist",  role: "Customer Onboarding", email: "oskar.l@swedbank.se",     phone: "+46 70 111 22 33", status: "onboarding", programs: "AMLR onboard",    progress: 8  },
  { id: 12, initials: "FA", name: "Freja Åkesson",    role: "KYC Analyst",         email: "freja.a@swedbank.se",     phone: "+46 70 222 33 44", status: "active",     programs: "AMLR core",       progress: 55 },
];

const FILTERS = [
  { value: "all",        label: "All" },
  { value: "active",     label: "Active" },
  { value: "onboarding", label: "Onboarding" },
  { value: "inactive",   label: "Inactive" },
];

const STATUS_CLASS = {
  active:     "statusActive",
  onboarding: "statusOnboarding",
  inactive:   "statusInactive",
};

const STATUS_LABEL = {
  active:     "Active",
  onboarding: "Onboarding",
  inactive:   "Inactive",
};

const initialsFrom = (first, last) =>
  `${(first?.[0] ?? "").toUpperCase()}${(last?.[0] ?? "").toUpperCase()}` || "?";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

// ─── Component ────────────────────────────────────────────────────────────────

export default function ClientEmployees() {
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return employees.filter((e) => {
      if (filter !== "all" && e.status !== filter) return false;
      if (!q) return true;
      return (
        e.name.toLowerCase().includes(q) ||
        e.role.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q)
      );
    });
  }, [employees, filter, query]);

  const addEmployee = (data) => {
    setEmployees((list) => [
      {
        id: Date.now(),
        initials: initialsFrom(data.firstName, data.lastName),
        name: `${data.firstName} ${data.lastName}`.trim(),
        role: data.role,
        email: data.email,
        phone: data.phone,
        status: "onboarding",
        programs: data.programs ?? "AMLR core",
        progress: 0,
      },
      ...list,
    ]);
  };

  return (
    <div className={styles.page}>

      {/* ── Page header ── */}
      <header className={styles.head}>
        <div className={styles.headLeft}>
          <div className={styles.eyebrow}>Workspace</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <h1 className={styles.title}>Employees</h1>
            <span className={styles.amlrBadge}>AMLR 2024/1624 Compliant Framework</span>
          </div>
          <p className={styles.sub}>
            {employees.length + AMLR_ROLES.length} people across{" "}
            {AMLR_ROLES.length} regulated roles + {employees.length} additional staff.
            Track AMLR training compliance per role.
          </p>
        </div>
        <div className={styles.headActions}>
          <button
            type="button"
            className={styles.addBtn}
            onClick={() => setIsAddOpen(true)}
          >
            <Plus size={14} strokeWidth={2.2} />
            Add employee
          </button>
        </div>
      </header>

      {/* ── AMLR Compliance Summary ── */}
      <div className={styles.summaryRow}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryValue}>{SUMMARY.total}</div>
          <div className={styles.summaryLabel}>Roles Registered</div>
          <div className={styles.summarySub}>under AMLR framework</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={`${styles.summaryValue} ${styles.summaryValueGreen}`}>
            {SUMMARY.completed}
          </div>
          <div className={styles.summaryLabel}>Completed</div>
          <div className={styles.summarySub}>on track</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={`${styles.summaryValue} ${styles.summaryValueRed}`}>
            {SUMMARY.atRisk}
          </div>
          <div className={styles.summaryLabel}>At Risk</div>
          <div className={styles.summarySub}>not started · due &lt;6 months</div>
        </div>
      </div>

      {/* ── AMLR Regulated Roles Table ── */}
      <section>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>AMLR Regulated Roles</h2>
          <span className={styles.sectionMeta}>
            {AMLR_ROLES.length} roles · AI training plans available
          </span>
        </div>

        <div className={styles.rolesTable}>
          {/* Table header */}
          <div className={styles.rolesTableHeader}>
            <span>Employee</span>
            <span>Risk</span>
            <span>Status</span>
            <span>Progress</span>
            <span>Current Module</span>
            <span>Due</span>
            <span />
          </div>

          {/* Table rows */}
          {AMLR_ROLES.map((r) => {
            const pct = r.modulesTotal > 0
              ? Math.round((r.modulesCompleted / r.modulesTotal) * 100)
              : 0;
            return (
              <div key={r.id} className={styles.rolesTableRow}>

                {/* Employee */}
                <div className={styles.roleEmployee}>
                  <div className={styles.roleAvatar}>{r.initials}</div>
                  <div className={styles.roleInfo}>
                    <div className={styles.roleName}>{r.name}</div>
                    <div className={styles.roleTitle}>{r.role}</div>
                    <div className={styles.roleDept}>{r.department}</div>
                  </div>
                </div>

                {/* Risk */}
                <span className={`${styles.riskBadge} ${RISK_CLASS[r.riskLevel]}`}>
                  <span className={styles.riskDot} aria-hidden="true" />
                  {r.riskLevel}
                </span>

                {/* Training status */}
                <span className={`${styles.trainingStatus} ${TRAINING_STATUS_CLASS[r.trainingStatus]}`}>
                  <span className={styles.tsDot} aria-hidden="true" />
                  {TRAINING_STATUS_LABEL[r.trainingStatus]}
                </span>

                {/* Progress */}
                <div className={styles.roleProgress}>
                  <div className={styles.roleProgressTop}>
                    <span className={styles.roleProgressFraction}>
                      {r.modulesCompleted}/{r.modulesTotal}
                    </span>
                    <span className={styles.roleProgressPct}>{pct}%</span>
                  </div>
                  <div className={styles.roleProgressBar}>
                    <div
                      className={[
                        styles.roleProgressFill,
                        r.trainingStatus === "completed" ? styles.roleProgressFillDone : "",
                      ].filter(Boolean).join(" ")}
                      style={{ width: `${Math.max(pct, pct > 0 ? 4 : 0)}%` }}
                    />
                  </div>
                </div>

                {/* Current module */}
                <span className={styles.currentModule}>
                  {r.currentModule ?? "—"}
                </span>

                {/* Due date */}
                <span className={[
                  styles.dueDate,
                  isAtRisk(r) ? styles.dueDateAtRisk : "",
                ].filter(Boolean).join(" ")}>
                  {formatDate(r.dueDate)}
                </span>

                {/* Action */}
                <Link
                  href="/dashboard/training-pipeline"
                  className={styles.viewPlanBtn}
                >
                  View Training Plan →
                </Link>

              </div>
            );
          })}
        </div>
      </section>

      {/* ── Existing employees ── */}
      <section>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>All Staff</h2>
        </div>

        <div className={styles.filters}>
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={`${styles.chip} ${
                f.value === filter ? styles.chipActive : ""
              }`.trim()}
            >
              {f.label}
            </button>
          ))}
          <div className={styles.search}>
            <Search size={13} strokeWidth={1.8} color="var(--ink-3)" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, role, email…"
              className={styles.searchInput}
            />
          </div>
        </div>

        <div className={styles.grid} style={{ marginTop: 14 }}>
          {filtered.map((e) => (
            <article key={e.id} className={styles.card}>
              <button type="button" className={styles.cardMenu} aria-label="More">
                <MoreVertical size={14} strokeWidth={1.8} />
              </button>

              <div className={styles.cardTop}>
                <div className={styles.avatar}>{e.initials}</div>
                <div className={styles.cardName}>{e.name}</div>
                <div className={styles.cardRole}>{e.role}</div>
                <span className={`${styles.statusPill} ${styles[STATUS_CLASS[e.status]]}`}>
                  <span className={styles.statusDot} aria-hidden="true" />
                  {STATUS_LABEL[e.status]}
                </span>
              </div>

              <div className={styles.detailBox}>
                <div className={styles.detailRow}>
                  <Mail size={13} strokeWidth={1.8} className={styles.detailIcon} />
                  <span className={styles.detailText}>{e.email}</span>
                </div>
                <div className={styles.detailRow}>
                  <Phone size={13} strokeWidth={1.8} className={styles.detailIcon} />
                  <span className={styles.detailText}>{e.phone}</span>
                </div>
              </div>

              <div className={styles.metaBox}>
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>Programs</span>
                  <span className={styles.metaValue}>{e.programs}</span>
                </div>
                <div className={styles.progressWrap}>
                  <div className={styles.progressTop}>
                    <span className={styles.progressLabel}>Training progress</span>
                    <span className={styles.progressValue}>{e.progress}%</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div
                      className={`${styles.progressFill} ${
                        e.progress === 100 ? styles.progressFillDone : ""
                      }`.trim()}
                      style={{ width: `${e.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <AddEmployeeModal
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={addEmployee}
      />
    </div>
  );
}
