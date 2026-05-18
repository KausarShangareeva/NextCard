"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Instrument_Serif } from "next/font/google";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Box,
  Check,
  Code,
  Compass,
  ExternalLink,
  GraduationCap,
  Layers,
  Lightbulb,
  Link2,
  Plus,
  Settings,
  Sparkles,
  Users,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { ParseResult, Topic } from "@/lib/parse";
import { STORAGE_KEYS } from "@/lib/storage";
import styles from "./page.module.css";

const serif = Instrument_Serif({
  weight: "400",
  style: ["italic"],
  subsets: ["latin"],
  display: "swap",
});

/* ─────────────────────────── Site metadata ──────────────────────────────── */

const SITE_META: Record<string, { name: string; tagline: string }> = {
  "react.dev": {
    name: "React",
    tagline:
      "The official guide to building interfaces with React — from first component to production app.",
  },
  "nextjs.org": {
    name: "Next.js",
    tagline:
      "Full-stack React apps with routing, server components, and instant deployments.",
  },
  "stripe.com": {
    name: "Stripe",
    tagline:
      "Integrate payments, subscriptions, and financial infrastructure into any product.",
  },
  "vercel.com": {
    name: "Vercel",
    tagline:
      "Deploy, preview, and ship — the complete platform for frontend developers.",
  },
  "tailwindcss.com": {
    name: "Tailwind",
    tagline:
      "Utility-first CSS for building beautiful, responsive interfaces at speed.",
  },
  "docs.github.com": {
    name: "GitHub",
    tagline:
      "Collaborate, automate CI/CD, and ship code with GitHub's developer platform.",
  },
  "vuejs.org": {
    name: "Vue.js",
    tagline:
      "The progressive JavaScript framework for building interactive user interfaces.",
  },
  "svelte.dev": {
    name: "Svelte",
    tagline:
      "Write less code and ship smaller bundles — UI that compiles away the framework.",
  },
  "docs.astro.build": {
    name: "Astro",
    tagline:
      "Build blazing-fast websites with your favourite UI components and zero JS by default.",
  },
  "supabase.com": {
    name: "Supabase",
    tagline:
      "Open-source Firebase alternative: Postgres, auth, storage, and realtime in one.",
  },
};

function getSiteMeta(sourceUrl: string) {
  const raw = sourceUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const domain = raw.split("/")[0].toLowerCase();
  const path = raw.includes("/") ? raw.slice(raw.indexOf("/")) : "";

  const known = SITE_META[domain];
  if (known) return { ...known, domain, path, fullUrl: raw };

  const base = domain.split(".")[0];
  const name = base.charAt(0).toUpperCase() + base.slice(1);
  return {
    name,
    tagline: `Explore and master ${name} — broken into bite-sized cards you'll actually retain.`,
    domain,
    path,
    fullUrl: raw,
  };
}

/* ─────────────────────── Icon + palette picker ──────────────────────────── */

const PALETTES = [
  "var(--icon-violet-bg)",
  "var(--icon-orange-bg)",
  "var(--icon-green-bg)",
  "var(--icon-blue-bg)",
  "var(--icon-pink-bg)",
  "var(--icon-teal-bg)",
  "var(--icon-yellow-bg)",
  "var(--icon-rose-bg)",
] as const;

const FALLBACK_ICONS: LucideIcon[] = [
  BookOpen,
  Layers,
  Code,
  Sparkles,
  Wrench,
  Compass,
  Box,
  Lightbulb,
  Zap,
  GraduationCap,
];

function iconFor(title: string, index: number): LucideIcon {
  const t = title.toLowerCase();
  if (/start|begin|intro|quick|tutorial/.test(t)) return GraduationCap;
  if (/concept|theor|fundament|principle|think/.test(t)) return Lightbulb;
  if (/install|setup|config/.test(t)) return Wrench;
  if (/component|element|ui|describ|layout/.test(t)) return Box;
  if (/state|store|manag|data/.test(t)) return Layers;
  if (/route|navigat|link/.test(t)) return Compass;
  if (/api|reference|spec/.test(t)) return Code;
  if (/hook|effect|advanced|escape|interactiv/.test(t)) return Zap;
  if (/tool|utility|helper|build|resource/.test(t)) return Settings;
  if (/community|team|contribu/.test(t)) return Users;
  if (/feature|new|recent/.test(t)) return Sparkles;
  if (/compiler|cpu|engine/.test(t)) return Sparkles;
  return FALLBACK_ICONS[index % FALLBACK_ICONS.length];
}

const paletteFor = (index: number) => PALETTES[index % PALETTES.length];

/* ─────────────────────────────── Page root ─────────────────────────────── */

export default function NewCoursePage() {
  const router = useRouter();
  const [result, setResult] = useState<ParseResult | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Load parse result from sessionStorage (set by Hero before navigation).
  // If missing OR stale from a previous schema (no `urls` field), bounce home.
  useEffect(() => {
    let parsed: ParseResult | null = null;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEYS.parseResult);
      if (raw) parsed = JSON.parse(raw) as ParseResult;
    } catch {
      /* malformed JSON — treat as missing */
    }

    const valid =
      parsed &&
      Array.isArray(parsed.topics) &&
      parsed.topics.every(
        (t) =>
          t &&
          typeof t.id === "string" &&
          typeof t.title === "string" &&
          typeof t.depth === "number",
      );

    if (!valid) {
      try {
        sessionStorage.removeItem(STORAGE_KEYS.parseResult);
      } catch {
        /* ignore */
      }
      router.replace("/");
      return;
    }
    setResult(parsed);
  }, [router]);

  if (!result) return null;

  return (
    <TopicsView
      result={result}
      selected={selected}
      setSelected={setSelected}
      onBack={() => router.push("/")}
    />
  );
}

/* ─────────────────────────────── Topics view ────────────────────────────── */

function TopicsView({
  result,
  selected,
  setSelected,
  onBack,
}: {
  result: ParseResult;
  selected: Set<string>;
  setSelected: (next: Set<string>) => void;
  onBack: () => void;
}) {
  const meta = useMemo(() => getSiteMeta(result.source), [result.source]);

  const allIds = useMemo(() => result.topics.map((t) => t.id), [result.topics]);
  const allSelected = selected.size === allIds.length && allIds.length > 0;

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(allIds));
  };

  const router = useRouter();
  const onContinue = () => {
    if (selected.size === 0) return;
    try {
      sessionStorage.setItem(
        STORAGE_KEYS.selectedTopicIds,
        JSON.stringify(Array.from(selected)),
      );
    } catch {
      /* private mode — ignore */
    }
    router.push("/courses/learn");
  };

  return (
    <div className={styles.page}>
      <TopRow fullUrl={meta.fullUrl} onBack={onBack} />

      <HeroHeader meta={meta} topicCount={result.topics.length} />

      <ul className={styles.cardGrid}>
        {result.topics.map((t, i) => (
          <TopicCard
            key={t.id}
            topic={t}
            index={i}
            checked={selected.has(t.id)}
            onToggle={() => toggle(t.id)}
          />
        ))}
      </ul>

      <StickyBar
        selectedCount={selected.size}
        allSelected={allSelected}
        onToggleAll={toggleAll}
        onContinue={onContinue}
      />
    </div>
  );
}

/* ──────────────────────────────── Top row ───────────────────────────────── */

function TopRow({
  fullUrl,
  onBack,
}: {
  fullUrl: string;
  onBack: () => void;
}) {
  return (
    <div className={styles.tphToprow}>
      <button className={styles.tphBack} onClick={onBack}>
        <ArrowLeft size={13} strokeWidth={2.4} /> New link
      </button>
      <a
        className={styles.tphUrlbadge}
        href={`https://${fullUrl}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Link2 size={12} strokeWidth={2} />
        <span>{fullUrl}</span>
        <ExternalLink size={11} strokeWidth={2.2} />
      </a>
    </div>
  );
}

/* ────────────────────────────── Hero header ─────────────────────────────── */

function HeroHeader({
  meta,
  topicCount,
}: {
  meta: { name: string; tagline: string };
  topicCount: number;
}) {
  return (
    <div className={styles.tphHero}>
      <div className={styles.tphAnalysed}>
        <Check size={10} strokeWidth={3} /> Analysed
      </div>
      <h2 className={`${styles.tphTitle} ${serif.className}`}>{meta.name}</h2>
      <p className={styles.tphTagline}>{meta.tagline}</p>
      <div className={styles.tphStats}>
        <div className={styles.tphStat}>
          <Layers size={14} strokeWidth={2} />
          <strong>{topicCount}</strong>{" "}
          {topicCount === 1 ? "section" : "sections"}
        </div>
      </div>
      <div className={styles.tphHint}>Pick the topics you want to cover ↓</div>
    </div>
  );
}

/* ──────────────────────────────── Topic card ────────────────────────────── */

function TopicCard({
  topic,
  index,
  checked,
  onToggle,
}: {
  topic: Topic;
  index: number;
  checked: boolean;
  onToggle: () => void;
}) {
  const Icon = iconFor(topic.title, index);
  const bg = paletteFor(index);

  return (
    <div
      className={`${styles.card} ${checked ? styles.cardSel : ""}`}
      style={{ animationDelay: `${Math.min(index * 55, 440)}ms` }}
      onClick={onToggle}
      role="checkbox"
      tabIndex={0}
      aria-checked={checked}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onToggle();
        }
      }}
    >
      {checked && (
        <div className={styles.cardTick} aria-hidden>
          <Check size={10} strokeWidth={3} />
        </div>
      )}

      <div className={styles.cardHead}>
        <div className={styles.cardIcon} style={{ background: bg }} aria-hidden>
          <Icon size={20} strokeWidth={1.8} />
        </div>
        {topic.depth === 0 && (
          <span className={styles.cardLevel}>Section</span>
        )}
      </div>

      <div className={styles.cardTitle}>{topic.title}</div>
      {topic.description && (
        <div className={styles.cardDesc}>{topic.description}</div>
      )}

      <button
        className={`${styles.cardSelBtn} ${checked ? styles.cardSelBtnOn : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        aria-label={checked ? `Deselect ${topic.title}` : `Select ${topic.title}`}
      >
        {checked ? (
          <>
            <Check size={12} strokeWidth={2.5} /> Selected
          </>
        ) : (
          <>
            <Plus size={11} strokeWidth={2.4} /> Select
          </>
        )}
      </button>
    </div>
  );
}

/* ─────────────────────────── Sticky bottom bar ──────────────────────────── */

function StickyBar({
  selectedCount,
  allSelected,
  onToggleAll,
  onContinue,
}: {
  selectedCount: number;
  allSelected: boolean;
  onToggleAll: () => void;
  onContinue: () => void;
}) {
  return (
    <div className={styles.sbar}>
      <div className={styles.sbarInfo}>
        <div className={styles.sbarCount}>
          {selectedCount > 0 ? (
            <>
              <strong>{selectedCount}</strong>{" "}
              {selectedCount === 1 ? "topic" : "topics"} selected
            </>
          ) : (
            <span className={styles.sbarHintMuted}>Select topics to begin</span>
          )}
        </div>
      </div>

      <div className={styles.sbarMid}>
        <button className={styles.sbarAll} onClick={onToggleAll}>
          {allSelected ? "Deselect all" : "Select all"}
        </button>
      </div>

      <button
        className={styles.sbarCta}
        onClick={onContinue}
        disabled={selectedCount === 0}
      >
        Start Learning <ArrowUpRight size={14} strokeWidth={2.4} />
      </button>
    </div>
  );
}
