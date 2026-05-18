/**
 * Topic extraction via LLM.
 *
 * Heuristic-based "find the densest nav" picks the wrong element on many
 * sites (footer with social links often beats the docs sidebar by count).
 * Instead:
 *   1. Use node-html-parser to find candidate <nav>/<aside> elements.
 *   2. Strip noise (svgs, classes, styles) to keep token cost down.
 *   3. Send candidates to the LLM with a sharp prompt. It semantically
 *      identifies the docs sidebar and returns clean JSON.
 *   4. Validate shape, hand back as ParseResult.
 *
 * Cost: ~$0.01-0.03 per parse with Haiku 4.5. Negligible for MVP.
 */

import { parse as parseHtml, type HTMLElement } from "node-html-parser";
import { anthropic, ANTHROPIC_MODEL, isAnthropicConfigured } from "./anthropic";

export type Topic = {
  id: string;
  title: string;
  description?: string;
  depth: number;
  href?: string;
};

export type ParseResult = {
  source: string;
  topics: Topic[];
};

export type ParseErrorCode =
  | "INVALID_URL"
  | "UNSUPPORTED_PROTOCOL"
  | "PRIVATE_URL"
  | "FETCH_FAILED"
  | "NO_NAV_CANDIDATES"
  | "NO_SIDEBAR"
  | "LLM_NOT_CONFIGURED"
  | "LLM_BAD_JSON"
  | "LLM_BAD_SHAPE";

export class ParseError extends Error {
  constructor(
    public code: ParseErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "ParseError";
  }
}

/* ─────────────────────── URL validation (SSRF-safe) ─────────────────────── */

const PRIVATE_HOST_PATTERNS = [
  /^localhost$/i,
  /\.localhost$/i,
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[0-1])\./,
  /^169\.254\./,
  /^::1$/,
  /^fe80::/i,
  /^fc00::/i,
];

export function validateUrl(input: string): URL {
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    throw new ParseError("INVALID_URL", "That doesn't look like a valid URL.");
  }
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new ParseError(
      "UNSUPPORTED_PROTOCOL",
      "Only http(s) URLs are supported.",
    );
  }
  if (PRIVATE_HOST_PATTERNS.some((p) => p.test(url.hostname))) {
    throw new ParseError(
      "PRIVATE_URL",
      "Private or local network URLs aren't allowed.",
    );
  }
  return url;
}

/* ──────────────────────────── HTML fetching ─────────────────────────────── */

const FETCH_TIMEOUT_MS = 12_000;
const UA =
  "Mozilla/5.0 (compatible; NextCardBot/1.0; +https://nextcard.app)";
const MIN_LINKS = 6;
const MAX_CANDIDATES = 6;
const PER_CANDIDATE_HTML_CAP = 12_000; // chars per candidate sent to the LLM

async function fetchHtml(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "text/html, */*" },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      redirect: "follow",
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

/* ──────────────────────── Candidate collection ──────────────────────────── */

function trimForLLM(html: string): string {
  return html
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    // Drop heavy presentational attributes to save tokens; keep semantic ones
    .replace(/\sclass="[^"]*"/gi, "")
    .replace(/\sstyle="[^"]*"/gi, "")
    .replace(/\s(?:srcset|sizes|loading|decoding)="[^"]*"/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function collectCandidates(root: HTMLElement): { html: string; label: string }[] {
  const seen = new Set<HTMLElement>();
  const out: { html: string; label: string; score: number }[] = [];

  for (const sel of ["nav", "aside", "[role=navigation]"]) {
    for (const el of root.querySelectorAll(sel)) {
      if (seen.has(el)) continue;
      seen.add(el);
      const links = el.querySelectorAll("a[href]").length;
      if (links < MIN_LINKS) continue;

      // Build a short label from useful attrs so the model can reference them
      const labelBits = [
        el.tagName?.toLowerCase(),
        el.getAttribute("aria-label") &&
          `aria-label="${el.getAttribute("aria-label")}"`,
        el.getAttribute("data-sidebar-nav") !== null && "data-sidebar-nav",
        el.getAttribute("role") && `role="${el.getAttribute("role")}"`,
      ].filter(Boolean);
      const label = labelBits.join(" ");

      const trimmed = trimForLLM(el.toString()).slice(0, PER_CANDIDATE_HTML_CAP);
      out.push({ html: trimmed, label, score: links });
    }
  }

  out.sort((a, b) => b.score - a.score);
  return out.slice(0, MAX_CANDIDATES).map(({ html, label }) => ({ html, label }));
}

/* ──────────────────────── LLM extraction ────────────────────────────────── */

const SYSTEM_PROMPT = `You analyze HTML from a documentation website and extract the items of its documentation sidebar.

A documentation sidebar is the left-side navigation panel listing the topics a developer can read about — e.g. "Getting Started", "API Reference", "Routing", "Authentication".

DO NOT include items from:
- The top navigation bar (Home, Products, Pricing, Sign in, etc.)
- The site footer (Privacy, Terms, Legal, GitHub, Twitter, LinkedIn, YouTube, Press, etc.)
- Marketing directory pages (Use Cases, Customers, Partners)
- Locale/language switchers, login/account menus

You will be shown several candidate <nav>/<aside> elements from the page. Pick the ONE that is the docs sidebar. If multiple match, pick the densest. If NONE match, return an empty array.

Rules:
- Preserve the exact text shown on the page. Do NOT paraphrase, abbreviate, or normalize ("Build & Deploy" stays "Build & Deploy", not "Builds and Deployments").
- Preserve the order items appear in the HTML.
- For nested items (a <ul> inside a <li>), use depth: 0 for the parent and depth: 1 for the child. Cap depth at 2.
- Skip items whose text is empty, "Skip to content", "Back to top", or a pure "#" anchor.

For EACH item, also write a short 1-sentence description (max ~12 words) that tells the user what they'll learn — e.g. "Set up your first project and deploy it" or "Configure dynamic URL segments and route parameters". The description should be useful (not just rephrasing the title) and written in the same language as the title.

Return STRICT JSON, no prose, no markdown fences:
{
  "topics": [
    { "title": "Getting Started", "description": "Set up your environment and deploy your first project.", "depth": 0, "href": "/docs/getting-started" },
    { "title": "Routing", "description": "Map URLs to pages and handle navigation.", "depth": 0, "href": "/docs/routing" },
    { "title": "Dynamic Routes", "description": "Capture URL parameters and build flexible page templates.", "depth": 1, "href": "/docs/routing/dynamic" }
  ]
}`;

type LlmTopic = {
  title: unknown;
  description?: unknown;
  depth?: unknown;
  href?: unknown;
};

async function extractWithLlm(
  candidates: { html: string; label: string }[],
  baseUrl: URL,
): Promise<Topic[]> {
  const userContent =
    `Source URL: ${baseUrl.toString()}\n\n` +
    `Below are ${candidates.length} candidate nav/aside elements from the page. Identify the docs sidebar and extract its items as JSON.\n\n` +
    candidates
      .map(
        (c, i) =>
          `=== Candidate ${i + 1} (${c.label}) ===\n${c.html}`,
      )
      .join("\n\n");

  const msg = await anthropic.messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: 4000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userContent }],
  });

  const text =
    msg.content.find((c) => c.type === "text")?.type === "text"
      ? (msg.content.find((c) => c.type === "text") as { text: string }).text
      : "";

  // Response may wrap JSON in fences or prose — grab the first {...} block.
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new ParseError("LLM_BAD_JSON", "The model returned no JSON object.");
  }

  let data: { topics?: unknown };
  try {
    data = JSON.parse(match[0]);
  } catch {
    throw new ParseError("LLM_BAD_JSON", "The model returned malformed JSON.");
  }

  if (!data.topics || !Array.isArray(data.topics)) {
    throw new ParseError(
      "LLM_BAD_SHAPE",
      "Model response missing the topics array.",
    );
  }

  const topics: Topic[] = [];
  let idx = 0;
  for (const raw of data.topics as LlmTopic[]) {
    if (!raw || typeof raw.title !== "string" || !raw.title.trim()) continue;
    topics.push({
      id: `topic-${++idx}`,
      title: raw.title.trim(),
      description:
        typeof raw.description === "string" && raw.description.trim()
          ? raw.description.trim()
          : undefined,
      depth:
        typeof raw.depth === "number" && raw.depth >= 0
          ? Math.min(raw.depth, 2)
          : 0,
      href: typeof raw.href === "string" ? raw.href : undefined,
    });
  }
  return topics;
}

/* ────────────────────────────── Orchestrator ─────────────────────────────── */

export async function parseDocsSite(input: string): Promise<ParseResult> {
  if (!isAnthropicConfigured) {
    throw new ParseError(
      "LLM_NOT_CONFIGURED",
      "Anthropic API key is missing. Add ANTHROPIC_API_KEY to .env.local.",
    );
  }

  const baseUrl = validateUrl(input);

  const html = await fetchHtml(baseUrl.toString());
  if (!html) {
    throw new ParseError(
      "FETCH_FAILED",
      `Couldn't reach ${baseUrl.toString()}. The site may be down or blocking us.`,
    );
  }

  const root = parseHtml(html, { lowerCaseTagName: true, comment: false });
  const candidates = collectCandidates(root);
  if (candidates.length === 0) {
    throw new ParseError(
      "NO_NAV_CANDIDATES",
      "No nav/aside containers with enough links were found — the site may render its navigation with JavaScript.",
    );
  }

  const topics = await extractWithLlm(candidates, baseUrl);
  if (topics.length === 0) {
    throw new ParseError(
      "NO_SIDEBAR",
      "Couldn't identify a docs sidebar among the page's nav elements.",
    );
  }

  return {
    source: baseUrl.toString(),
    topics,
  };
}
