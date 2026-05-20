export const ROLE_PROFILES = {
  "AML DDI Manager": {
    key: "AML-DDI-2026",
    programs: "AMLR core · Sanctions · Beneficial ownership",
    team: "AML Due Diligence and Investigations",
    band: "H",
    reports: "Senior Manager, AML DDI",
    purpose:
      "Manages AML/KYC searches against delivery partners and suppliers, and coordinates due diligence across the bank's product teams in line with AMLR and GDPR obligations.",
    duties: [
      "Manage the KYC/AML search process — new requests, alerts, periodic reviews and exits",
      "Oversee the data-asset register to monitor GDPR and AML compliance",
      "Coach and develop analyst-level members of the team",
      "Monitor SLAs and deputise for the Senior Manager when required",
    ],
    risk: [
      "Third-party risk from delivery partners is a known ML vulnerability",
      "Periodic-review oversight failures can let lapsed partners stay active",
      "GDPR mismanagement creates dual regulatory exposure alongside AML",
      "QA errors propagate across the analyst team",
    ],
  },
  "Customer Advisor": {
    key: "ADVISOR-2026",
    programs: "AMLR core · KYC · Beneficial ownership",
    team: "Customer Operations",
    band: "F",
    reports: "Customer Operations Manager",
    purpose:
      "Primary point of contact for customers — handles enquiries, onboarding, KYC verification, complaints, and escalation of unusual activity to the relevant internal team.",
    duties: [
      "Resolve account queries via phone, email and digital channels",
      "Verify ID and supporting documentation during onboarding (KYC)",
      "Recognise and escalate potential fraud or unusual customer behaviour",
      "Maintain accurate, GDPR-compliant customer records",
    ],
    risk: [
      "Weak ID verification at onboarding can admit illegitimate customers",
      "High interaction volume increases risk of missing subtle red flags",
      "Failure to escalate breaks the chain of defence",
      "Vulnerable to social engineering targeting front-line staff",
    ],
  },
  "Money Laundering Reporting Officer": {
    key: "MLRO-2026",
    programs: "AMLR core · Sanctions · SAR documentation",
    team: "Risk and Compliance",
    band: "5",
    reports: "MLRO (SMF17)",
    purpose:
      "Second-line-of-defence lead for fraud and financial crime — designs policies, reviews escalations, submits SARs, and reports the bank's F&FC risk profile to the Board.",
    duties: [
      "Lead design and review of F&FC policies (AML, sanctions, fraud, bribery)",
      "Review and submit Suspicious Activity Reports to the relevant authority",
      "Provide MI and reports to the MLRO, CRO and Board",
      "Deliver F&FC training and 2LoD oversight of business units",
    ],
    risk: [
      "Personal criminal liability for SAR submission decisions",
      "Blind spots cascade across all three lines of defence",
      "Inaccurate Board MI can drive flawed strategic decisions",
      "Externally exposed to regulators and law enforcement",
    ],
  },
  "Transaction Monitoring (TM) Analyst": {
    key: "TM-2026",
    programs: "AMLR core · KYC · Sanctions · SAR documentation",
    team: "Fraud & Financial Crime · AML DDI",
    band: "G",
    reports: "AML DDI Manager",
    purpose:
      "Reviews automated transaction-monitoring alerts to identify suspicious activity and escalate cases to the nominated officer in line with regulatory obligations.",
    duties: [
      "Review daily TM alerts against customer risk profiles and expected behaviour",
      "Document investigations and escalate cases meeting the SAR threshold",
      "Identify typologies and emerging financial-crime patterns",
      "Maintain audit-ready case management records",
    ],
    risk: [
      "Missed alerts directly enable layering and integration",
      "High alert volumes increase fatigue-driven errors",
      "Weak investigation notes undermine SAR quality and audit trail",
      "Delays in escalation can breach regulatory reporting timeframes",
    ],
  },
};

export const ROLE_LIST = Object.keys(ROLE_PROFILES);

export const ROLE_BY_KEY = Object.fromEntries(
  ROLE_LIST.map((name) => [ROLE_PROFILES[name].key, name])
);

const DIACRITICS = /[̀-ͯ]/g;

export function slugify(str) {
  return (str ?? "")
    .normalize("NFD")
    .replace(DIACRITICS, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

export function usernameFrom(first, last) {
  const f = slugify(first);
  const l = slugify(last);
  if (!f && !l) return "";
  if (!l) return f;
  if (!f) return l;
  return `${f}.${l}`;
}
