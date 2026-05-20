// Single source of truth for the role-based course Builder.
// All explainability strings live here — they are what gets surfaced
// in the Builder, the client portal, and the learner portal.

export const AMLR_ARTICLES = {
  "Art. 8":  { title: "Risk assessment",            blurb: "Apply a risk-based approach across the firm." },
  "Art. 11": { title: "Training obligation",        blurb: "Ongoing AML training proportionate to role." },
  "Art. 20": { title: "Customer Due Diligence",     blurb: "Standard CDD — identify and verify the customer." },
  "Art. 22": { title: "Enhanced Due Diligence",     blurb: "EDD for higher-risk relationships." },
  "Art. 30": { title: "Record-keeping",             blurb: "Retain CDD evidence and transaction records." },
  "Art. 42": { title: "Beneficial ownership",       blurb: "Identify the UBO behind corporate customers." },
  "Art. 51": { title: "Sanctions screening",        blurb: "Screen against EU restrictive measures + PEPs." },
  "Art. 56": { title: "Retention",                  blurb: "7-year retention of records and audit trail." },
  "Art. 69": { title: "Suspicious Activity Reports",blurb: "Report suspicions to the FIU without delay." },
  "Art. 70": { title: "Confidentiality of reports", blurb: "Do not tip off the subject of a SAR." },
};

const RISK_LEVEL = { high: "high", medium: "medium", low: "low" };

// Each role gets a risk score in the 4 hackathon-rubric categories,
// driven from the inherent risk exposure in roleProfiles.js.
export const ROLE_RISKS = {
  "AML DDI Manager": {
    AML:           { level: RISK_LEVEL.high,   why: "Manages KYC/AML searches against delivery partners — third-party risk is a known ML vulnerability." },
    Sanctions:     { level: RISK_LEVEL.medium, why: "Oversight role for sanctions hits flagged by the team." },
    Fraud:         { level: RISK_LEVEL.medium, why: "First-line operational risk compliance on partner DDI." },
    Documentation: { level: RISK_LEVEL.high,   why: "Owns the data-asset register — GDPR/AML dual exposure." },
  },
  "Customer Advisor": {
    AML:           { level: RISK_LEVEL.high,   why: "First point of contact during onboarding — weak ID verification admits illegitimate customers." },
    Sanctions:     { level: RISK_LEVEL.low,    why: "Escalates rather than decides; sanctions calls sit with 2LoD." },
    Fraud:         { level: RISK_LEVEL.high,   why: "High interaction volume; social engineering targets front-line staff." },
    Documentation: { level: RISK_LEVEL.medium, why: "Captures CDD evidence at onboarding — must be GDPR-clean." },
  },
  "Money Laundering Reporting Officer": {
    AML:           { level: RISK_LEVEL.high,   why: "Personal criminal liability for SAR submission decisions." },
    Sanctions:     { level: RISK_LEVEL.high,   why: "Final approval on PEP / sanctions escalations from 1LoD." },
    Fraud:         { level: RISK_LEVEL.high,   why: "Oversees the entire F&FC framework — blind spots cascade." },
    Documentation: { level: RISK_LEVEL.high,   why: "Board-level MI must be accurate and audit-ready." },
  },
  "Transaction Monitoring (TM) Analyst": {
    AML:           { level: RISK_LEVEL.high,   why: "Missed alerts directly enable layering and integration." },
    Sanctions:     { level: RISK_LEVEL.medium, why: "Reviews alerts that overlap sanctions typologies." },
    Fraud:         { level: RISK_LEVEL.high,   why: "Detection point for transaction-based fraud patterns." },
    Documentation: { level: RISK_LEVEL.high,   why: "Investigation notes feed SAR quality and audit trail." },
  },
};

// Which AMLR articles a given risk category triggers.
export const RISK_TO_AMLR = {
  AML:           ["Art. 8",  "Art. 11", "Art. 20", "Art. 22", "Art. 42"],
  Sanctions:     ["Art. 51"],
  Fraud:         ["Art. 22", "Art. 69", "Art. 70"],
  Documentation: ["Art. 30", "Art. 56"],
};

// The full module library. Each module references the AMLR article it covers
// and the risk category that justifies it.
export const MODULES = {
  "amlr-essentials":     { name: "AMLR essentials",            minutes: 90, article: "Art. 11", risk: "AML" },
  "risk-based-approach": { name: "Risk-based approach",        minutes: 45, article: "Art. 8",  risk: "AML" },
  "kyc-cdd":             { name: "KYC & Customer Due Diligence", minutes: 75, article: "Art. 20", risk: "AML" },
  "edd-cases":           { name: "Enhanced Due Diligence — live cases", minutes: 60, article: "Art. 22", risk: "AML" },
  "beneficial-ownership":{ name: "Beneficial ownership",       minutes: 45, article: "Art. 42", risk: "AML" },
  "sanctions-practice":  { name: "Sanctions screening in practice", minutes: 60, article: "Art. 51", risk: "Sanctions" },
  "sar-writing":         { name: "Writing a defensible SAR",   minutes: 40, article: "Art. 69", risk: "Fraud" },
  "no-tipping-off":      { name: "Tipping-off & confidentiality", minutes: 25, article: "Art. 70", risk: "Fraud" },
  "record-keeping":      { name: "Record-keeping discipline",  minutes: 30, article: "Art. 30", risk: "Documentation" },
  "retention-audit":     { name: "Retention & audit trail",    minutes: 30, article: "Art. 56", risk: "Documentation" },
  "annual-refresh":      { name: "Annual refresh",             minutes: 30, article: "Art. 11", risk: "AML" },
  "sar-drill":           { name: "Quarterly SAR drill",        minutes: 30, article: "Art. 69", risk: "Fraud" },
};

// Per-role quarterly plan. Each entry has the module id and a role-specific
// "why" — this is the explainability anchor (25% of the rubric).
export const ROLE_PLAN = {
  "AML DDI Manager": {
    Q1: [
      { id: "amlr-essentials",     why: "Foundation — required by Art. 11 for everyone in a 1LoD AML role." },
      { id: "risk-based-approach", why: "Role oversees risk-based DDI decisions on third parties." },
    ],
    Q2: [
      { id: "kyc-cdd",             why: "Daily work involves CDD review of partners and suppliers." },
      { id: "beneficial-ownership",why: "Partner onboarding requires UBO checks under Art. 42." },
    ],
    Q3: [
      { id: "edd-cases",           why: "Higher-risk delivery partners trigger EDD under Art. 22." },
      { id: "record-keeping",      why: "Owns the data-asset register — GDPR/AML dual exposure." },
    ],
    Q4: [
      { id: "annual-refresh",      why: "Ongoing training obligation under Art. 11." },
      { id: "retention-audit",     why: "Quarterly review of retention policy compliance." },
    ],
  },
  "Customer Advisor": {
    Q1: [
      { id: "amlr-essentials",     why: "Foundation — front-line staff must know the regulation." },
      { id: "kyc-cdd",             why: "Role performs ID verification at the onboarding moment." },
    ],
    Q2: [
      { id: "beneficial-ownership",why: "Corporate customer onboarding requires UBO capture." },
      { id: "record-keeping",      why: "CDD evidence must be GDPR-clean and audit-ready." },
    ],
    Q3: [
      { id: "no-tipping-off",      why: "High interaction volume — must know what NOT to say." },
      { id: "sanctions-practice",  why: "Recognise sanctions red flags even when escalation is the action." },
    ],
    Q4: [
      { id: "annual-refresh",      why: "Ongoing training obligation under Art. 11." },
    ],
  },
  "Money Laundering Reporting Officer": {
    Q1: [
      { id: "amlr-essentials",     why: "MLRO must master the regulation that defines the role." },
      { id: "risk-based-approach", why: "Sets the firm's risk-based approach — Art. 8." },
    ],
    Q2: [
      { id: "edd-cases",           why: "Final escalation point for EDD calls under Art. 22." },
      { id: "sanctions-practice",  why: "Approves PEP / sanctions escalations from 1LoD." },
    ],
    Q3: [
      { id: "sar-writing",         why: "Personal liability for SAR submission decisions." },
      { id: "no-tipping-off",      why: "Confidentiality discipline under Art. 70 — criminal offence if breached." },
    ],
    Q4: [
      { id: "sar-drill",           why: "Quarterly drill keeps SAR throughput defensible." },
      { id: "retention-audit",     why: "Board MI must be backed by a clean audit trail." },
    ],
  },
  "Transaction Monitoring (TM) Analyst": {
    Q1: [
      { id: "amlr-essentials",     why: "Foundation — TM operates inside AMLR Art. 8 risk framework." },
      { id: "kyc-cdd",             why: "Alerts must be assessed against expected customer behaviour." },
    ],
    Q2: [
      { id: "edd-cases",           why: "Higher-risk customer alerts trigger EDD escalation." },
      { id: "sanctions-practice",  why: "TM overlaps with sanctions typologies — Art. 51." },
    ],
    Q3: [
      { id: "sar-writing",         why: "Investigation notes flow into the SAR — Art. 69 quality bar." },
      { id: "record-keeping",      why: "Case records are evidence — must be retention-compliant." },
    ],
    Q4: [
      { id: "sar-drill",           why: "Regulators expect throughput consistency on SAR escalations." },
      { id: "annual-refresh",      why: "Ongoing training obligation under Art. 11." },
    ],
  },
};

export const ROLE_LIST = Object.keys(ROLE_PLAN);

export const QUARTERS = [
  { id: "Q1", name: "Q1 · Foundation",   hint: "Regulation literacy and risk-based mindset." },
  { id: "Q2", name: "Q2 · Application",  hint: "Apply AMLR to the day-to-day of the role." },
  { id: "Q3", name: "Q3 · Deepening",    hint: "Live cases and edge-case decision-making." },
  { id: "Q4", name: "Q4 · Embedding",    hint: "Refresh, drills, audit-readiness." },
];

// Helper — assemble the full plan for a role with module names + reasoning.
export function planFor(roleName) {
  const plan = ROLE_PLAN[roleName];
  if (!plan) return [];
  return QUARTERS.map((q) => ({
    ...q,
    modules: plan[q.id].map((entry) => {
      const m = MODULES[entry.id];
      const a = AMLR_ARTICLES[m.article];
      return {
        id: entry.id,
        name: m.name,
        minutes: m.minutes,
        article: m.article,
        articleTitle: a?.title,
        articleBlurb: a?.blurb,
        risk: m.risk,
        why: entry.why,
      };
    }),
  }));
}

// Helper — for a role, return the set of AMLR articles its modules cover
// + the risks that triggered each, so the Builder can show the mapping panel.
export function articleCoverage(roleName) {
  const plan = ROLE_PLAN[roleName];
  if (!plan) return [];
  const seen = new Map();
  for (const q of QUARTERS) {
    for (const entry of plan[q.id]) {
      const m = MODULES[entry.id];
      if (!seen.has(m.article)) {
        seen.set(m.article, {
          article: m.article,
          title: AMLR_ARTICLES[m.article]?.title,
          blurb: AMLR_ARTICLES[m.article]?.blurb,
          risks: new Set([m.risk]),
        });
      } else {
        seen.get(m.article).risks.add(m.risk);
      }
    }
  }
  return Array.from(seen.values()).map((v) => ({
    ...v,
    risks: Array.from(v.risks),
  }));
}
