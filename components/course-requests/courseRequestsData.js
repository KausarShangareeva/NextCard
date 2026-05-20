// Course requests sit at the root layout so both /client (HR submits)
// and /dashboard (NextCard team approves + generates) share state.

export const INITIAL_COURSE_REQUESTS = [
  {
    id: 1001,
    client: "Swedbank",
    clientCountryCode: "se",
    requestedBy: "Linnéa Andersson",
    requestedByEmail: "linnea@swedbank.se",
    role: "Crypto Compliance Officer",
    roleDescription:
      "Oversees AML for the new digital-asset desk launching Q3 2026.",
    tasks:
      "Monitor on-chain transactions, file SAR for crypto activity, run KYC for crypto onboarding.",
    responsibilities:
      "Sign-off on crypto customer onboarding, escalate to MLRO, train branch staff on red flags.",
    regulatoryScope: ["AMLR Art. 20", "MiCAR Art. 38", "FATF travel rule"],
    files: [
      { name: "Crypto-desk role description.pdf", size: "1.2 MB" },
      { name: "MiCAR internal policy v3.docx",    size: "640 KB" },
      { name: "Risk matrix Q1 2026.xlsx",         size: "210 KB" },
    ],
    submittedAt: "4h ago",
    status: "pending",
    assignee: null,
    cost: null,
  },
  {
    id: 1002,
    client: "SEB",
    clientCountryCode: "se",
    requestedBy: "Emma Larsson",
    requestedByEmail: "e.larsson@seb.se",
    role: "Wealth Manager · UHNW desk",
    roleDescription:
      "Manages portfolios for ultra-high-net-worth clients. Source-of-funds risk is heavy.",
    tasks:
      "Source-of-funds checks, PEP screening, enhanced due diligence on offshore structures.",
    responsibilities:
      "Quarterly EDD refresh, escalate complex SoF cases, sign-off on PEP onboarding.",
    regulatoryScope: ["AMLR Art. 22 (EDD)", "AMLR Art. 28 (PEPs)", "AMLR Art. 30 (SoF)"],
    files: [
      { name: "UHNW desk org chart.pdf",            size: "480 KB" },
      { name: "PEP screening procedure.pdf",        size: "320 KB" },
    ],
    submittedAt: "2d ago",
    status: "approved",
    assignee: "Kausyar",
    cost: "€4,800",
  },
  {
    id: 1003,
    client: "Klarna",
    clientCountryCode: "se",
    requestedBy: "Jonas Lindgren",
    requestedByEmail: "j.lindgren@klarna.com",
    role: "BNPL Risk Analyst",
    roleDescription:
      "Reviews Buy-Now-Pay-Later applications for fraud and AML signals.",
    tasks:
      "Score applications, escalate suspected synthetic-identity fraud, monitor merchant categories.",
    responsibilities:
      "Daily review of flagged BNPL applications, weekly fraud report to MLRO.",
    regulatoryScope: ["AMLR Art. 20", "AMLR Art. 51", "EBA fraud guidance"],
    files: [
      { name: "BNPL fraud policy.pdf",     size: "850 KB" },
      { name: "Merchant risk matrix.xlsx", size: "190 KB" },
    ],
    submittedAt: "5d ago",
    status: "in-progress",
    assignee: "Aakash",
    cost: "€3,600",
  },
  {
    id: 1004,
    client: "Avanza",
    clientCountryCode: "se",
    requestedBy: "Sofia Lund",
    requestedByEmail: "sofia@avanza.se",
    role: "Securities Custody Officer",
    roleDescription: "Handles custody arrangements for institutional clients.",
    tasks: "KYB on institutional clients, segregation of assets review, sanctions checks.",
    responsibilities: "Approve new institutional accounts, quarterly sanctions re-screen.",
    regulatoryScope: ["AMLR Art. 20", "AMLR Art. 51", "MiFID II Art. 16"],
    files: [{ name: "Custody onboarding flow.pdf", size: "720 KB" }],
    submittedAt: "1w ago",
    status: "done",
    assignee: "Begimai",
    cost: "€2,400",
  },
];

export const STATUS_LABEL = {
  pending:       "Pending review",
  approved:      "Approved",
  rejected:      "Rejected",
  "in-progress": "In progress",
  done:          "Done",
};

export const STATUS_PILL_CLASS = {
  pending:       "pillPending",
  approved:      "pillApproved",
  rejected:      "pillRejected",
  "in-progress": "pillInProgress",
  done:          "pillDone",
};

// Only "in-progress" requests appear in the /dashboard/courses generation queue.
// "approved" sits in Inbox until the team flips it to "in-progress".
export const IN_PRODUCTION_STATUSES = ["in-progress"];
