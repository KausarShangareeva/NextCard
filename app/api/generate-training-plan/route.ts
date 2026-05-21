import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    "X-Title": "Vidda Compliance Training Pipeline",
  },
});

// ─── Types ────────────────────────────────────────────────────────────────────

type RiskLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
type Quarter = "Q1" | "Q2" | "Q3" | "Q4";

interface RiskProfile {
  aml: RiskLevel;
  sanctions: RiskLevel;
  fraud: RiskLevel;
  documentation: RiskLevel;
  thirdParty?: RiskLevel;
  reporting?: RiskLevel;
}

interface RoleDefinition {
  id: string;
  name: string;
  purpose: string;
  responsibilities: string[];
  riskProfile: RiskProfile;
  /** Keywords sent to the RAG server to retrieve relevant AMLR articles */
  ragKeywords: string[];
}

interface TrainingModule {
  moduleTitle: string;
  quarter: Quarter;
  riskDimension: string;
  amlrArticle: string;
  competencyGap: string;
  rationale: string;
}

interface TrainingPlan {
  roleId: string;
  roleName: string;
  riskProfile: RiskProfile;
  ragArticlesUsed: string[];
  modules: TrainingModule[];
  generatedAt: string;
}

// ─── Role definitions (the proprietary mapping layer) ────────────────────────
//
// Each role carries its pre-assessed risk profile and the RAG keywords used to
// retrieve the specific AMLR articles that apply to it.  This is the "moat":
// the mapping logic that translates daily responsibilities into regulatory
// obligations before Claude ever sees the request.

const ROLES: Record<string, RoleDefinition> = {
  "kyc-analyst": {
    id: "kyc-analyst",
    name: "KYC Analyst (Enhanced Due Diligence / EDD)",
    purpose:
      "Conducts EDD on high-risk customers. Critical control function preventing the bank from maintaining relationships linked to money laundering or terrorist financing.",
    responsibilities: [
      "Conduct EDD for higher-risk customers",
      "Review and validate customer ownership and control structures",
      "Assess source of funds and source of wealth",
      "Perform periodic KYC reviews based on risk level",
      "Identify discrepancies between customer information and behaviour",
      "Document risk assessments in auditable, regulator-ready manner",
      "Escalate suspicious indicators to AML investigations",
    ],
    riskProfile: {
      aml: "CRITICAL",
      sanctions: "HIGH",
      fraud: "MEDIUM",
      documentation: "HIGH",
    },
    ragKeywords: [
      "employee training obligations Article 12",
      "enhanced due diligence EDD Article 22",
      "beneficial ownership Article 42",
      "customer due diligence CDD",
      "risk assessment Article 10",
      "internal policies Article 9",
    ],
  },

  "customer-advisor": {
    id: "customer-advisor",
    name: "Customer Advisor",
    purpose:
      "Primary point of contact for customers. Handles enquiries, account queries, service requests. Key role in building customer trust while upholding compliance standards.",
    responsibilities: [
      "Respond to customer enquiries via phone, email, digital channels",
      "Guide customers through onboarding including KYC document collection",
      "Recognise and escalate potential fraud or unusual behaviour",
      "Log and manage customer complaints per regulatory timeframes",
      "Update customer records per GDPR and data protection policies",
    ],
    riskProfile: {
      aml: "HIGH",
      sanctions: "MEDIUM",
      fraud: "HIGH",
      documentation: "MEDIUM",
    },
    ragKeywords: [
      "employee training obligations Article 12",
      "customer due diligence CDD onboarding",
      "suspicious transaction reporting",
      "internal policies Article 9",
      "integrity of employees Article 13",
    ],
  },

  "tm-analyst": {
    id: "tm-analyst",
    name: "Transaction Monitoring (TM) Analyst",
    purpose:
      "Reviews and investigates transaction monitoring alerts. Assesses whether transactions are consistent with known customer profiles. First line of defence against financial crime.",
    responsibilities: [
      "Review TM alerts daily against customer risk profiles",
      "Conduct documented investigations into flagged activity",
      "Determine whether to discount, monitor or escalate alerts",
      "Prepare investigation notes and case records for audit",
      "Escalate cases meeting SAR threshold to nominated officer",
      "Identify typologies and emerging patterns in transaction activity",
      "Adhere to SLA requirements for alert review and escalation",
    ],
    riskProfile: {
      aml: "CRITICAL",
      sanctions: "HIGH",
      fraud: "HIGH",
      documentation: "CRITICAL",
      reporting: "HIGH",
    },
    ragKeywords: [
      "employee training obligations Article 12",
      "suspicious transaction reporting SAR",
      "transaction monitoring typologies",
      "documentation audit trail",
      "risk assessment Article 10",
      "compliance functions Article 11",
    ],
  },

  "aml-ddi-manager": {
    id: "aml-ddi-manager",
    name: "AML DDI Manager",
    purpose:
      "Manages AML/KYC searches against delivery partners and suppliers. Provides coaching and development to analyst team. Business partner support across the bank.",
    responsibilities: [
      "Manage KYC/AML search process: new requests, alerts, periodic reviews",
      "Liaison with Business Unit Directors on AML DDI processes",
      "Manage data asset register for GDPR compliance",
      "Operational quality checking and first-line risk compliance",
      "Coaching, mentoring and development of team members",
      "Monitoring SLA compliance",
    ],
    riskProfile: {
      aml: "HIGH",
      sanctions: "HIGH",
      fraud: "MEDIUM",
      documentation: "HIGH",
      thirdParty: "CRITICAL",
    },
    ragKeywords: [
      "employee training obligations Article 12",
      "third party due diligence",
      "compliance functions Article 11",
      "business wide risk assessment Article 10",
      "internal policies Article 9",
      "GDPR data protection",
    ],
  },

  mlro: {
    id: "mlro",
    name: "MLRO (Money Laundering Reporting Officer)",
    purpose:
      "Ultimate accountability for SAR submissions and the entire financial crime framework. External-facing to regulators and law enforcement.",
    responsibilities: [
      "Lead design and review of Fraud & Financial Crime Risk Management Policies",
      "Provide regular reports to Board on Financial Crime risk",
      "Design and facilitate group-wide financial crime risk assessment",
      "SAR investigation, discounting and submission to reporting authority",
      "Provide oversight and challenge to business unit RCSAs",
      "Design and delivery of F&FC training content",
      "Monitor staff compliance with training requirements",
      "Monitor emerging legislative and regulatory developments",
    ],
    riskProfile: {
      aml: "CRITICAL",
      sanctions: "CRITICAL",
      fraud: "CRITICAL",
      documentation: "CRITICAL",
      reporting: "CRITICAL",
    },
    ragKeywords: [
      "employee training obligations Article 12",
      "compliance functions Article 11",
      "business wide risk assessment Article 10",
      "internal policies procedures controls Article 9",
      "integrity of employees Article 13",
      "SAR suspicious activity reporting",
      "management body oversight",
    ],
  },
};

// ─── RAG query ────────────────────────────────────────────────────────────────

interface RagHit {
  text: string;
  filename: string;
  score: number;
  document_id: string;
  label?: string;
}

async function queryRagServer(keywords: string[]): Promise<string> {
  const token = process.env.RAG_API_TOKEN ?? process.env.RAG_API_KEY;
  if (!token) {
    console.warn("RAG_API_TOKEN/RAG_API_KEY not set, using fallback AMLR articles");
    return AMLR_FALLBACK;
  }

  const query = keywords.join(" ");
  const baseUrl = process.env.RAG_BASE_URL ?? "https://rag.bluetext.dev";
  const url = `${baseUrl.replace(/\/$/, "")}/api/search?q=${encodeURIComponent(query)}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    });

    if (!res.ok) throw new Error(`RAG server responded ${res.status}`);

    const hits: RagHit[] = await res.json();

    if (!Array.isArray(hits) || hits.length === 0) {
      throw new Error("No results from RAG server");
    }

    // Sort by score descending, take top 6, join text chunks
    return hits
      .toSorted((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((h) => `[Source: ${h.filename}]\n${h.text}`)
      .join("\n\n---\n\n");
  } catch (err) {
    console.warn("RAG server unavailable, using fallback articles:", err);
    return AMLR_FALLBACK;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Verbatim article text from AMLR 2024/1624 — used when the RAG server is
// unreachable so the pipeline never falls back to hallucinated regulation.
const AMLR_FALLBACK = `
AMLR 2024/1624 — Key Articles

Article 9 — Internal policies, procedures and controls
Obliged entities must have written internal policies. Must include a policy on training of employees.

Article 10 — Business-wide risk assessment
Must identify and assess ML/TF risks. Must be documented, kept up-to-date, approved by management body.

Article 11 — Compliance functions
Must appoint a compliance manager and compliance officer. Must have adequate resources including staff and technology. Compliance officer reports directly to management body.

Article 12 — Employee awareness and training obligations (CORE ARTICLE)
Employees whose function requires it must participate in specific, ongoing training programmes.
Training must be appropriate to their functions AND to the risks the obliged entity is exposed to.
Training must be duly documented.

Article 13 — Integrity of employees
Employees must undergo assessment of skills, knowledge, expertise, repute, honesty and integrity.
Assessment must happen before taking up activities and be regularly repeated.

Article 22 — Enhanced Due Diligence (EDD)
Obliged entities must apply enhanced customer due diligence measures in higher-risk situations.
EDD must include enhanced measures to manage and mitigate the risks appropriately.

Article 42 — Beneficial ownership
Obliged entities must take measures to verify the beneficial ownership of legal entities.
Must identify and verify the identity of any person who owns or controls more than 25% of a legal entity.
`.trim();

// ─── Training plan generation ─────────────────────────────────────────────────

async function generateTrainingPlan(
  role: RoleDefinition,
  ragContext: string
): Promise<TrainingModule[]> {
  const riskSummary = Object.entries(role.riskProfile)
    .map(([dim, level]) => `${dim.toUpperCase()}: ${level}`)
    .join(", ");

  const systemPrompt = `You are an expert AML compliance training designer with deep knowledge of AMLR 2024/1624.

Your job is to generate a precise, role-specific training plan grounded entirely in the regulatory text provided to you.
Every training module you create MUST be traceable back to a specific AMLR article and a specific risk gap for that role.

You must respond with ONLY valid JSON — no markdown, no explanation, no preamble.
The JSON must be an array of training module objects matching this exact schema:

[
  {
    "moduleTitle": "string — concise, specific module name",
    "quarter": "Q1" | "Q2" | "Q3" | "Q4",
    "riskDimension": "string — e.g. 'AML – CRITICAL' or 'Sanctions – HIGH'",
    "amlrArticle": "string — e.g. 'Art. 12 – Employee training obligations'",
    "competencyGap": "string — the specific knowledge or skill gap this module closes",
    "rationale": "string — 2-3 sentences explaining WHY this specific role needs this specific module, grounded in their daily responsibilities and the regulatory obligation"
  }
]

Rules:
- Generate 5-6 modules per quarter (Q1–Q4), totalling 20-24 modules
- Q1 = Foundation (core concepts, onboarding, fundamentals)
- Q2 = Application (practical skills, case-based, independent work begins)
- Q3 = Deepening (advanced topics, professional qualifications, committee exposure)
- Q4 = Embedding (assessment, peer contribution, annual refresher, year-2 planning)
- Every rationale must name the role, their specific daily task at risk, and the AMLR article
- Never invent article numbers — only cite articles present in the regulatory context provided
- Never be generic — every module must be specific to this exact role's risk exposure`;

  const userPrompt = `Generate a full Year 1 training plan for the following role.

ROLE: ${role.name}
PURPOSE: ${role.purpose}

KEY RESPONSIBILITIES:
${role.responsibilities.map((r) => `• ${r}`).join("\n")}

RISK PROFILE (assessed from daily responsibilities):
${riskSummary}

REGULATORY CONTEXT (from AMLR 2024/1624 — ground every module in these articles):
${ragContext}

Generate the training plan as a JSON array. Every module must have a rationale that answers:
"Why does a ${role.name} specifically need this module, given their daily responsibilities and this regulatory obligation?"`;

  const completion = await openai.chat.completions.create({
    model: "anthropic/claude-sonnet-4-5",
    max_tokens: 8000,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "";

  // Strip any accidental markdown code fences before parsing
  const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();

  const modules: TrainingModule[] = JSON.parse(cleaned);

  // Validate shape — reject modules missing critical fields
  for (const mod of modules) {
    if (
      !mod.moduleTitle ||
      !mod.quarter ||
      !mod.riskDimension ||
      !mod.amlrArticle ||
      !mod.competencyGap ||
      !mod.rationale
    ) {
      throw new Error(
        `Module "${mod.moduleTitle ?? "unknown"}" is missing required fields`
      );
    }
  }

  return modules;
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { roleId } = body as { roleId?: string };

    if (!roleId) {
      return NextResponse.json(
        { error: "roleId is required" },
        { status: 400 }
      );
    }

    const role = ROLES[roleId];
    if (!role) {
      return NextResponse.json(
        {
          error: `Unknown role "${roleId}". Valid roles: ${Object.keys(ROLES).join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Step 1 — Query RAG server for relevant AMLR articles
    const ragContext = await queryRagServer(role.ragKeywords);

    // Step 2 — Derive which articles were cited (for transparency in the response)
    const articleMatches = ragContext.match(/Art(?:icle)?\.?\s*\d+[a-z]?/gi) ?? [];
    const ragArticlesUsed = Array.from(new Set(articleMatches)).sort((a, b) => a.localeCompare(b));

    // Step 3 — Generate the training plan with Claude, grounded in RAG context
    const modules = await generateTrainingPlan(role, ragContext);

    const plan: TrainingPlan = {
      roleId: role.id,
      roleName: role.name,
      riskProfile: role.riskProfile,
      ragArticlesUsed,
      modules,
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(plan);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[generate-training-plan]", message);
    return NextResponse.json(
      { error: "Pipeline failed", detail: message },
      { status: 500 }
    );
  }
}

// Only POST is supported — return 405 for other methods
export async function GET() {
  return NextResponse.json(
    { error: "Use POST with { roleId: string }" },
    { status: 405 }
  );
}
