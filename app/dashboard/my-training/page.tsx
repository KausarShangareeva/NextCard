"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

type RiskLevel = "CRITICAL" | "HIGH";
type ModuleStatus = "completed" | "in-progress" | "locked";

interface Module {
  title: string;
  article: string;
  rationale: string;
}

interface QuarterPlan {
  label: string;
  modules: Module[];
}

interface Employee {
  id: string;
  name: string;
  initials: string;
  role: string;
  department: string;
  riskLevel: RiskLevel;
  completed: number;
  total: number;
  dueDate: string;
  assignedOn: string;
  quarters: QuarterPlan[];
}

// ─── Employee data ────────────────────────────────────────────────────────────

const EMPLOYEES: Employee[] = [
  {
    id: "sarah-chen",
    name: "Sarah Chen",
    initials: "SC",
    role: "KYC Analyst",
    department: "Financial Crime",
    riskLevel: "CRITICAL",
    completed: 4,
    total: 18,
    dueDate: "30 Sept 2026",
    assignedOn: "20 May 2026",
    quarters: [
      {
        label: "Q1 — Foundation",
        modules: [
          {
            title: "AMLR Framework Overview",
            article: "Art. 9",
            rationale: "As a KYC Analyst you must understand the full AMLR regulatory framework before applying any customer-facing procedure.",
          },
          {
            title: "Customer Risk Assessment Fundamentals",
            article: "Art. 10",
            rationale: "Your role requires you to risk-profile every customer before onboarding — this establishes the scoring criteria you will use daily.",
          },
          {
            title: "Standard Customer Due Diligence",
            article: "Art. 10",
            rationale: "Core CDD procedures apply to every customer you handle, covering identity verification, source-of-funds checks, and documentation standards.",
          },
          {
            title: "Beneficial Ownership Verification",
            article: "Art. 42",
            rationale: "KYC Analysts are required under Art. 42 to verify and document the UBOs of every corporate entity using the look-through methodology.",
          },
          {
            title: "Enhanced Due Diligence for High-Risk Customers",
            article: "Art. 22",
            rationale: "Your case portfolio includes CRITICAL-rated customers. Art. 22 EDD is mandatory for each one — this covers the escalated verification steps you must follow.",
          },
        ],
      },
      {
        label: "Q2 — Application",
        modules: [
          {
            title: "PEP Identification and Screening",
            article: "Art. 22",
            rationale: "PEPs represent heightened risk. You will learn how to screen, flag, and escalate PEP cases correctly in your daily queue.",
          },
          {
            title: "Adverse Media Screening",
            article: "Art. 22",
            rationale: "Adverse media checks complement sanctions screening — this covers the tools and escalation triggers used in your team.",
          },
          {
            title: "Document Verification Techniques",
            article: "Art. 10",
            rationale: "Detecting fraudulent identity documents is a core KYC Analyst skill — passports, corporate registries, and ownership certificates.",
          },
          {
            title: "SAR Indicators for KYC Staff",
            article: "Art. 12",
            rationale: "Art. 12 obligates all staff to recognise and report suspicious activity. As KYC Analyst you are often the first to spot red flags.",
          },
          {
            title: "Ongoing Monitoring Obligations",
            article: "Art. 9",
            rationale: "KYC is not a one-time event — this covers periodic review triggers, refresh timelines, and documentation requirements.",
          },
        ],
      },
      {
        label: "Q3 — Deepening",
        modules: [
          {
            title: "Complex Ownership Structures",
            article: "Art. 42",
            rationale: "Shell companies and layered ownership appear frequently in your CRITICAL-rated portfolio — this builds skills to map multi-layer structures.",
          },
          {
            title: "Third-Party Reliance and Outsourcing",
            article: "Art. 11",
            rationale: "When relying on third-party KYC you remain liable. Art. 11 sets strict conditions — this clarifies your obligations and documentation duties.",
          },
          {
            title: "High-Risk Jurisdictions and Sanctions",
            article: "Art. 10",
            rationale: "Several customers in your portfolio operate in FATF-listed jurisdictions. This covers geographic risk overlays and escalation procedures.",
          },
          {
            title: "KYC Refresh and Re-Screening",
            article: "Art. 10",
            rationale: "Periodic re-screening is a regulatory requirement — triggers, timelines, and re-verification steps for your customer segments.",
          },
        ],
      },
      {
        label: "Q4 — Embedding",
        modules: [
          {
            title: "MLRO Escalation Procedures",
            article: "Art. 11",
            rationale: "Knowing when and how to escalate to the MLRO is a critical KYC Analyst responsibility — maps the decision tree and documentation trail.",
          },
          {
            title: "Regulatory Reporting Obligations",
            article: "Art. 12",
            rationale: "Art. 12 requires timely, accurate reporting — covers the reporting chain, deadlines, and your personal responsibilities as a frontline analyst.",
          },
          {
            title: "Mock KYC Review Assessment",
            article: "Art. 9",
            rationale: "A simulated case assessment tests your ability to apply the full framework — including EDD decisions and SAR triggers — under realistic conditions.",
          },
          {
            title: "Annual Compliance Certification",
            article: "Art. 12",
            rationale: "Art. 12 mandates documented annual training. Completing this module certifies your AMLR compliance for the current regulatory cycle.",
          },
        ],
      },
    ],
  },

  {
    id: "james-okafor",
    name: "James Okafor",
    initials: "JO",
    role: "Customer Advisor",
    department: "Customer Operations",
    riskLevel: "HIGH",
    completed: 0,
    total: 14,
    dueDate: "30 Sept 2026",
    assignedOn: "20 May 2026",
    quarters: [
      {
        label: "Q1 — Foundation",
        modules: [
          {
            title: "AMLR Awareness for Customer-Facing Staff",
            article: "Art. 9",
            rationale: "As a Customer Advisor you are the first point of contact. Understanding your AMLR obligations is the foundation of your compliance duties.",
          },
          {
            title: "Recognising Suspicious Behaviour",
            article: "Art. 12",
            rationale: "Art. 12 requires you to recognise and report suspicious customer behaviour during onboarding and everyday interactions.",
          },
          {
            title: "Customer Onboarding Compliance Checks",
            article: "Art. 10",
            rationale: "You are responsible for gathering initial customer information. This module covers what to collect, verify, and escalate at the point of onboarding.",
          },
          {
            title: "Basic Identity Verification",
            article: "Art. 10",
            rationale: "Basic ID checks are your first line of defence against fraud and money laundering — this covers the minimum verification standards for your role.",
          },
        ],
      },
      {
        label: "Q2 — Application",
        modules: [
          {
            title: "Escalation Pathways for Frontline Staff",
            article: "Art. 11",
            rationale: "When something doesn't feel right, you must know exactly who to call and what to document. Art. 11 sets the escalation obligations.",
          },
          {
            title: "Red Flags in Customer Conversations",
            article: "Art. 12",
            rationale: "Verbal and behavioural red flags are often spotted by advisors before formal checks. This trains you to identify and record them correctly.",
          },
          {
            title: "Sanctions and PEP Awareness",
            article: "Art. 22",
            rationale: "You may encounter PEPs and sanctioned individuals at the first point of contact — this covers what to do and what not to do.",
          },
          {
            title: "Customer Risk Categories Explained",
            article: "Art. 10",
            rationale: "Understanding why customers are classified HIGH or CRITICAL risk helps you apply the right level of scrutiny during interactions.",
          },
        ],
      },
      {
        label: "Q3 — Deepening",
        modules: [
          {
            title: "Handling Difficult Customer Situations",
            article: "Art. 12",
            rationale: "When customers push back on due diligence requests, you need clear guidance. This module covers how to handle objections while maintaining compliance.",
          },
          {
            title: "Data Protection and KYC Records",
            article: "Art. 9",
            rationale: "Customer data collected during onboarding must be handled lawfully. This covers your obligations under AMLR and data protection frameworks.",
          },
          {
            title: "Internal Reporting Procedures",
            article: "Art. 12",
            rationale: "You are required to report suspicions internally without tipping off the customer. This covers the internal disclosure process step by step.",
          },
        ],
      },
      {
        label: "Q4 — Embedding",
        modules: [
          {
            title: "Mock Customer Onboarding Assessment",
            article: "Art. 9",
            rationale: "A simulated onboarding scenario tests your ability to apply red-flag identification and escalation procedures under realistic conditions.",
          },
          {
            title: "Refresher: Escalation and Reporting",
            article: "Art. 12",
            rationale: "A consolidation module covering your reporting duties, escalation pathways, and documentation standards as a Customer Advisor.",
          },
          {
            title: "Annual Compliance Certification",
            article: "Art. 12",
            rationale: "Art. 12 mandates documented annual training. Completing this module certifies your AMLR compliance for the current regulatory cycle.",
          },
        ],
      },
    ],
  },

  {
    id: "priya-nair",
    name: "Priya Nair",
    initials: "PN",
    role: "TM Analyst",
    department: "Fraud & Financial Crime",
    riskLevel: "CRITICAL",
    completed: 7,
    total: 18,
    dueDate: "30 Sept 2026",
    assignedOn: "20 May 2026",
    quarters: [
      {
        label: "Q1 — Foundation",
        modules: [
          {
            title: "AMLR Framework and TM Obligations",
            article: "Art. 9",
            rationale: "As a TM Analyst you operate at the heart of the detection function. Understanding your specific AMLR obligations is the starting point.",
          },
          {
            title: "Transaction Monitoring Systems Overview",
            article: "Art. 9",
            rationale: "Your daily work involves reviewing alerts generated by TM systems — this covers how the systems are configured and what drives alert generation.",
          },
          {
            title: "Risk-Based Approach to Alert Triage",
            article: "Art. 10",
            rationale: "Not all alerts are equal. Art. 10 risk-based principles guide how you prioritise and dismiss alerts systematically.",
          },
          {
            title: "Typologies: Layering and Structuring",
            article: "Art. 10",
            rationale: "Layering and structuring are the most common patterns in your alert queue. This module trains you to recognise both in transaction data.",
          },
          {
            title: "Documenting Investigation Records",
            article: "Art. 12",
            rationale: "Every alert you review must be documented to SAR-ready standard. Art. 12 specifies what that record must contain.",
          },
        ],
      },
      {
        label: "Q2 — Application",
        modules: [
          {
            title: "SAR Drafting and Submission",
            article: "Art. 12",
            rationale: "Drafting a SAR is your core output. This module covers the structure, required fields, and submission process in your jurisdiction.",
          },
          {
            title: "SAR Submission Process",
            article: "Art. 12",
            rationale: "End-to-end submission workflow — from internal escalation to MLRO sign-off and onward reporting to the FIU.",
          },
          {
            title: "Complex Transaction Pattern Analysis",
            article: "Art. 10",
            rationale: "Multi-account and cross-border patterns require deeper analytical techniques — this builds your ability to trace complex money flows.",
          },
          {
            title: "Correspondent Banking Risk",
            article: "Art. 22",
            rationale: "Correspondent banking introduces elevated ML risk. Your CRITICAL-risk designation means you will encounter these cases regularly.",
          },
          {
            title: "Sanctions Screening in TM Workflows",
            article: "Art. 22",
            rationale: "Sanctions hits within transaction monitoring require specific handling. This covers the escalation and freeze procedures you must follow.",
          },
        ],
      },
      {
        label: "Q3 — Deepening",
        modules: [
          {
            title: "Trade-Based Money Laundering",
            article: "Art. 10",
            rationale: "TBML patterns are increasingly common in CRITICAL-risk customer portfolios — this develops your ability to identify them in payment data.",
          },
          {
            title: "Virtual Asset and Crypto Indicators",
            article: "Art. 10",
            rationale: "Crypto-related flows are a growing category in TM alerts — this covers the red flags, typologies, and reporting requirements.",
          },
          {
            title: "Cross-Border Payment Monitoring",
            article: "Art. 22",
            rationale: "International payments crossing high-risk jurisdictions require enhanced monitoring — this covers your Art. 22 obligations.",
          },
          {
            title: "Liaison with MLRO and Legal",
            article: "Art. 11",
            rationale: "Effective escalation to the MLRO requires structured communication. This module covers how to brief the MLRO and manage handoffs.",
          },
        ],
      },
      {
        label: "Q4 — Embedding",
        modules: [
          {
            title: "Mock SAR Investigation Exercise",
            article: "Art. 12",
            rationale: "A end-to-end simulated investigation tests your ability to triage, document, and submit a SAR under realistic time pressure.",
          },
          {
            title: "Quality Assurance in TM Reviews",
            article: "Art. 9",
            rationale: "Your investigation records are subject to internal QA and regulatory inspection — this covers the quality standards you are held to.",
          },
          {
            title: "Regulatory Expectations for TM Functions",
            article: "Art. 9",
            rationale: "Regulators assess TM functions specifically. This module prepares you for what examiners look for in your documentation and decisions.",
          },
          {
            title: "Annual Compliance Certification",
            article: "Art. 12",
            rationale: "Art. 12 mandates documented annual training. Completing this certifies your AMLR compliance for the current regulatory cycle.",
          },
        ],
      },
    ],
  },

  {
    id: "marcus-webb",
    name: "Marcus Webb",
    initials: "MW",
    role: "AML DDI Manager",
    department: "AML Due Diligence & Investigations",
    riskLevel: "HIGH",
    completed: 16,
    total: 16,
    dueDate: "30 Jun 2026",
    assignedOn: "20 May 2026",
    quarters: [
      {
        label: "Q1 — Foundation",
        modules: [
          {
            title: "AMLR Leadership Obligations",
            article: "Art. 9",
            rationale: "As DDI Manager you hold supervisory accountability for your team's AMLR compliance — this sets out your specific obligations under the regulation.",
          },
          {
            title: "Team Risk Oversight and Governance",
            article: "Art. 11",
            rationale: "Art. 11 requires you to maintain an effective compliance function. This covers governance frameworks, team oversight, and escalation management.",
          },
          {
            title: "Third-Party KYC Partner Management",
            article: "Art. 11",
            rationale: "You manage relationships with third-party due diligence providers. This covers the Art. 11 obligations that remain with you even when outsourcing.",
          },
          {
            title: "AML Search Quality Standards",
            article: "Art. 10",
            rationale: "The quality of AML searches conducted by your team determines the organisation's risk exposure — this sets the standards you must enforce.",
          },
        ],
      },
      {
        label: "Q2 — Application",
        modules: [
          {
            title: "Coaching Analysts on EDD Cases",
            article: "Art. 22",
            rationale: "You are responsible for coaching your analyst team through complex EDD cases — this covers supervisory review and sign-off obligations.",
          },
          {
            title: "Managing High-Risk Customer Portfolios",
            article: "Art. 22",
            rationale: "Your team handles HIGH and CRITICAL risk customers. This covers the management controls and oversight cadence required at your level.",
          },
          {
            title: "Beneficial Ownership: Manager Responsibilities",
            article: "Art. 42",
            rationale: "As manager, you are accountable for the accuracy of UBO records held by your team — this covers review, sign-off, and escalation duties.",
          },
          {
            title: "Regulatory Examination Preparation",
            article: "Art. 9",
            rationale: "Regulators examine due diligence functions closely. This module prepares you for inspection readiness, document production, and examiner interviews.",
          },
        ],
      },
      {
        label: "Q3 — Deepening",
        modules: [
          {
            title: "Advanced Typologies for DDI Managers",
            article: "Art. 10",
            rationale: "As a manager you must recognise patterns your analysts may miss — this covers advanced ML typologies relevant to your investigation portfolio.",
          },
          {
            title: "Cross-Border Investigation Coordination",
            article: "Art. 22",
            rationale: "Your team coordinates with international partners on complex cases. This covers the legal gateways, documentation, and escalation requirements.",
          },
          {
            title: "Sanctions Compliance for Managers",
            article: "Art. 22",
            rationale: "Manager-level sanctions obligations extend beyond screening — this covers your duty to ensure your team's controls are operationally effective.",
          },
          {
            title: "Policy Review and Updates",
            article: "Art. 9",
            rationale: "You are responsible for keeping your team's AML policies current with regulatory change — this covers the review cycle and approval process.",
          },
        ],
      },
      {
        label: "Q4 — Embedding",
        modules: [
          {
            title: "Performance Management and Compliance KPIs",
            article: "Art. 11",
            rationale: "Measuring your team's compliance performance requires the right KPIs. This covers the metrics regulators expect DDI managers to track and report.",
          },
          {
            title: "Incident Management and Breach Reporting",
            article: "Art. 12",
            rationale: "When a compliance incident occurs in your team, you are accountable for timely reporting and remediation — this covers the full incident lifecycle.",
          },
          {
            title: "Mock Regulatory Interview",
            article: "Art. 9",
            rationale: "A simulated examiner interview tests your ability to articulate your team's controls, decisions, and documentation under scrutiny.",
          },
          {
            title: "Annual Compliance Certification",
            article: "Art. 12",
            rationale: "Art. 12 mandates documented annual training. Completing this certifies your AMLR compliance as DDI Manager for the current regulatory cycle.",
          },
        ],
      },
    ],
  },

  {
    id: "diana-kowalski",
    name: "Diana Kowalski",
    initials: "DK",
    role: "MLRO",
    department: "Risk & Compliance",
    riskLevel: "CRITICAL",
    completed: 0,
    total: 20,
    dueDate: "30 Jun 2026",
    assignedOn: "20 May 2026",
    quarters: [
      {
        label: "Q1 — Foundation",
        modules: [
          {
            title: "AMLR 2024/1624 Overview for Senior Officers",
            article: "Art. 9",
            rationale: "As MLRO you hold ultimate accountability for the institution's AML framework. This module establishes your obligations at the most senior level.",
          },
          {
            title: "MLRO Statutory Duties and Personal Liability",
            article: "Art. 11",
            rationale: "Art. 11 creates personal legal obligations for the MLRO. This module is mandatory first reading — you need to understand where liability sits.",
          },
          {
            title: "SAR Submission: MLRO Decision-Making",
            article: "Art. 12",
            rationale: "Every SAR submission is your decision. Art. 12 requires you to assess, approve, and submit — this covers the legal standard you must meet.",
          },
          {
            title: "Designing the Firm-Wide AML Framework",
            article: "Art. 9",
            rationale: "You are responsible for the architecture of the institution's AML programme. This covers the regulatory requirements for framework design and documentation.",
          },
          {
            title: "Risk Appetite and Tolerance Setting",
            article: "Art. 10",
            rationale: "Setting the firm's ML risk appetite is an MLRO function. This covers how to document, communicate, and enforce risk tolerance across business lines.",
          },
        ],
      },
      {
        label: "Q2 — Application",
        modules: [
          {
            title: "Board and Senior Management Reporting",
            article: "Art. 11",
            rationale: "You report directly to the Board on AML matters. This covers the content, frequency, and regulatory expectations for MLRO board reporting.",
          },
          {
            title: "FIU Engagement and Liaison",
            article: "Art. 12",
            rationale: "As MLRO you are the named point of contact for the Financial Intelligence Unit — this covers engagement protocols, feedback loops, and information sharing.",
          },
          {
            title: "Regulatory Examination Leadership",
            article: "Art. 9",
            rationale: "You lead regulatory examinations of the AML function. This covers pre-examination preparation, document production, and managing examiner findings.",
          },
          {
            title: "Correspondent Banking Oversight",
            article: "Art. 22",
            rationale: "Senior oversight of correspondent banking relationships is an MLRO obligation under Art. 22 — this covers your sign-off and monitoring duties.",
          },
          {
            title: "EDD Sign-Off for Highest-Risk Customers",
            article: "Art. 22",
            rationale: "CRITICAL-rated customers require MLRO-level sign-off on their EDD files. This covers the review standard and documentation obligations.",
          },
        ],
      },
      {
        label: "Q3 — Deepening",
        modules: [
          {
            title: "Sanctions Programme Ownership",
            article: "Art. 22",
            rationale: "As MLRO you own the institution's sanctions programme. This covers programme design, controls testing, and breach response procedures.",
          },
          {
            title: "Terrorist Financing: Detection and Reporting",
            article: "Art. 12",
            rationale: "TF detection requires specific typology knowledge and a separate reporting chain — this covers your obligations distinct from standard AML.",
          },
          {
            title: "Proliferation Financing Controls",
            article: "Art. 10",
            rationale: "Proliferation financing is a growing regulatory focus. As MLRO you must embed PF controls alongside AML — this covers the framework requirements.",
          },
          {
            title: "Culture and Training Programme Ownership",
            article: "Art. 12",
            rationale: "Art. 12 makes you accountable for the firm's AML training programme. This covers curriculum requirements, record-keeping, and staff competency assessment.",
          },
          {
            title: "Managing Compliance Incidents",
            article: "Art. 12",
            rationale: "Compliance incidents require MLRO-level response — triage, internal escalation, regulatory notification, and root-cause remediation.",
          },
        ],
      },
      {
        label: "Q4 — Embedding",
        modules: [
          {
            title: "MLRO Annual Report to the Board",
            article: "Art. 11",
            rationale: "You are required to produce an annual MLRO report. This covers the regulatory content requirements, drafting standards, and sign-off process.",
          },
          {
            title: "De-Risking Decisions: Legal and Ethical Framework",
            article: "Art. 10",
            rationale: "Exit decisions on high-risk customers carry legal risk. This covers how to document de-risking rationale to withstand regulatory and legal scrutiny.",
          },
          {
            title: "Cross-Jurisdiction AMLR Compliance",
            article: "Art. 9",
            rationale: "As MLRO of a multi-jurisdiction institution you must reconcile AMLR with local law — this covers the conflict resolution principles and compliance obligations.",
          },
          {
            title: "Mock Regulatory Enforcement Scenario",
            article: "Art. 9",
            rationale: "A simulated enforcement action tests your ability to respond, evidence controls, and manage remediation — the highest-stakes scenario in your role.",
          },
          {
            title: "Annual MLRO Certification",
            article: "Art. 12",
            rationale: "Art. 12 mandates documented annual training. As MLRO your certification is the most scrutinised in the organisation — completing this closes the loop.",
          },
        ],
      },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const RISK_CLASS: Record<RiskLevel, string> = {
  CRITICAL: styles.riskCritical,
  HIGH:     styles.riskHigh,
};

const STATUS_META: Record<ModuleStatus, { label: string; icon: string; cls: string }> = {
  "completed":   { label: "Completed",   icon: "✅", cls: "statusCompleted"  },
  "in-progress": { label: "In Progress", icon: "🔵", cls: "statusInProgress" },
  "locked":      { label: "Locked",      icon: "🔒", cls: "statusLocked"     },
};

// ─── Stored learner shape (written by the LMS Add Employee form) ──────────────

interface StoredLearner {
  id: string;
  initials: string;
  name: string;
  role: string;
  department: string;
  riskLevel: RiskLevel;
  dueDate: string;   // ISO "YYYY-MM-DD"
}

const LS_KEY = "lms-custom-employees";

function moduleStatus(flatIndex: number, completed: number): ModuleStatus {
  if (flatIndex < completed)    return "completed";
  if (flatIndex === completed)  return "in-progress";
  return "locked";
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MyTrainingPage() {
  const [selectedId, setSelectedId]         = useState(EMPLOYEES[0].id);
  const [extras, setExtras]                 = useState<StoredLearner[]>([]);

  // Load manually added employees from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setExtras(JSON.parse(raw) as StoredLearner[]);
    } catch {}
  }, []);

  // Resolve which employee is currently selected
  const emp   = EMPLOYEES.find((e) => e.id === selectedId) ?? null;
  const extra = emp ? null : (extras.find((e) => e.id === selectedId) ?? null);
  const active = emp ?? extra;   // always non-null once hydrated

  const hasPlan = !!emp;
  const pct     = emp ? Math.round((emp.completed / emp.total) * 100) : 0;

  let flatIndex = 0;

  return (
    <div className={styles.page}>

      {/* ── View-switcher banner ── */}
      <div className={styles.viewSwitcher}>
        <div className={styles.viewSwitcherLeft}>
          <span className={styles.viewSwitcherIcon}>👁</span>
          <span className={styles.viewSwitcherText}>
            You are viewing the <strong>employee perspective.</strong>{" "}
            In production, employees log in separately and see only their own training plan.
          </span>
        </div>
        <Link href="/dashboard/lms" className={styles.switchBtn}>
          Switch to Manager View →
        </Link>
      </div>

      {/* ── Header ── */}
      <header>
        <div className={styles.eyebrow}>Employee Training View</div>
        <h1 className={styles.title}>My Training Plan</h1>
        <p className={styles.sub}>
          Your personalised AMLR-compliant training plan — assigned by your compliance team.
        </p>
      </header>

      {/* ── Employee picker — hardcoded 5 + any extras from localStorage ── */}
      <div className={styles.pickerRow}>
        <span className={styles.pickerLabel}>Viewing training for:</span>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className={styles.pickerSelect}
          aria-label="Select employee"
        >
          {EMPLOYEES.map((e) => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
          {extras.length > 0 && (
            <optgroup label="Recently added">
              {extras.map((e) => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </optgroup>
          )}
        </select>
      </div>

      {/* ── Notification banner — only when a plan exists ── */}
      {hasPlan && emp && (
        <div className={styles.notifBanner} role="alert">
          <span className={styles.notifIcon}>🔔</span>
          <div>
            <span className={styles.notifText}>
              Your compliance manager has assigned you a new training plan.
            </span>{" "}
            <span className={styles.notifSub}>
              Please complete all modules by <strong>{emp.dueDate}</strong>.
            </span>
          </div>
        </div>
      )}

      {/* ── Employee info card ── */}
      {active && (
        <div className={styles.employeeCard}>
          <div className={styles.employeeLeft}>
            <div className={styles.avatar}>{active.initials}</div>
            <div className={styles.employeeInfo}>
              <div className={styles.employeeName}>{active.name}</div>
              <div className={styles.employeeRole}>{active.role} · {active.department}</div>
              <div className={styles.employeeMeta}>
                {hasPlan
                  ? <>Assigned by <strong>Compliance Team</strong> on {emp?.assignedOn}</>
                  : "Awaiting plan assignment by Compliance Team"}
              </div>
            </div>
          </div>
          <span className={`${styles.riskBadge} ${RISK_CLASS[active.riskLevel]}`}>
            <span className={styles.riskDot} aria-hidden="true" />
            {active.riskLevel} Risk
          </span>
        </div>
      )}

      {/* ── Progress summary (plan exists) / No-plan state (new employee) ── */}
      {hasPlan && emp !== null ? (
        <>
          <div className={styles.progressCard}>
            <div className={styles.progressTop}>
              <div>
                <div className={styles.progressHeading}>
                  {emp.completed} of {emp.total} modules completed
                </div>
                <div className={styles.progressSub}>Due: {emp.dueDate}</div>
              </div>
              <div className={styles.progressPct}>{pct}%</div>
            </div>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${pct}%` }} />
            </div>
          </div>

          {/* ── Module list by quarter ── */}
          {emp.quarters.map((q) => (
            <section key={q.label}>
              <div className={styles.quarterHead}>
                <h2 className={styles.quarterTitle}>{q.label}</h2>
                <span className={styles.quarterCount}>{q.modules.length} modules</span>
              </div>
              <div className={styles.moduleList}>
                {q.modules.map((m) => {
                  const idx    = flatIndex++;
                  const status = moduleStatus(idx, emp.completed);
                  const meta   = STATUS_META[status];
                  return (
                    <div
                      key={m.title}
                  className={[
                    styles.moduleCard,
                    status === "locked" ? styles.moduleCardLocked : "",
                  ].filter(Boolean).join(" ")}
                >
                  <div className={styles.moduleContent}>
                    <div className={styles.moduleTop}>
                      <span className={styles.articlePill}>{m.article}</span>
                      <span className={`${styles.statusBadge} ${styles[meta.cls]}`}>
                        <span aria-hidden="true">{meta.icon}</span>
                        {meta.label}
                      </span>
                    </div>
                    <div className={styles.moduleTitle}>{m.title}</div>
                    <div className={styles.moduleRationale}>
                      <span className={styles.rationaleLabel}>Why this module:</span>{" "}
                      {m.rationale}
                    </div>
                  </div>

                  <div className={styles.moduleAction}>
                    {status === "in-progress" && (
                      <button type="button" className={styles.btnStart}>Start Module</button>
                    )}
                    {status === "completed" && (
                      <button type="button" className={styles.btnReview}>Review</button>
                    )}
                    {status === "locked" && (
                      <span className={styles.lockedHint}>Complete previous modules first</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
        </>
      ) : (
        <div className={styles.noPlanCard}>
          <div className={styles.noPlanIcon}>📋</div>
          <div className={styles.noPlanTitle}>No training plan assigned yet</div>
          <div className={styles.noPlanSub}>
            Your compliance manager will generate your personalised AMLR-compliant plan soon.
            Once assigned, your modules will appear here.
          </div>
        </div>
      )}

    </div>
  );
}
