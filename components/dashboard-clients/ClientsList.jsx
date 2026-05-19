"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ArrowUpRight } from "lucide-react";
import { CLIENTS } from "./clientsData";
import styles from "./ClientsList.module.css";

export default function ClientsList() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CLIENTS;
    return CLIENTS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q)
    );
  }, [query]);

  const totalSeats = CLIENTS.reduce((s, c) => s + (c.seats?.used ?? 0), 0);

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <div className={styles.headLeft}>
          <div className={styles.eyebrow}>Team workspace</div>
          <h1 className={styles.title}>Clients</h1>
          <p className={styles.sub}>
            {CLIENTS.length} active accounts · {totalSeats.toLocaleString()}{" "}
            seats deployed. Click any client to drill into their workspace.
          </p>
        </div>
        <div className={styles.search}>
          <Search size={13} strokeWidth={1.8} color="var(--ink-3)" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, country, industry…"
            className={styles.searchInput}
          />
        </div>
      </header>

      {filtered.length === 0 ? (
        <div className={styles.empty}>No clients match this search.</div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((c) => (
            <Link
              key={c.id}
              href={`/dashboard/clients/${c.id}`}
              className={styles.card}
            >
              <div className={styles.cardHead}>
                <span className={styles.cardLogo}>{c.initials}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className={styles.cardName}>{c.name}</div>
                  <div className={styles.cardMeta}>
                    <span
                      className={`fi fi-${c.countryCode} ${styles.cardFlag}`}
                      aria-hidden="true"
                    />
                    {c.country} · {c.industry}
                  </div>
                </div>
              </div>

              <div className={styles.cardPlanRow}>
                <span className={styles.cardPlanPill}>{c.plan}</span>
                <span className={styles.cardPlanValue}>{c.contractValue}</span>
              </div>

              <div className={styles.cardStatsRow}>
                <div className={styles.cardStat}>
                  <div className={styles.cardStatValue}>
                    {c.seats?.used?.toLocaleString() ?? "—"}
                  </div>
                  <div className={styles.cardStatLabel}>Seats</div>
                </div>
                <div className={styles.cardStat}>
                  <div className={styles.cardStatValue}>{c.coverage}%</div>
                  <div className={styles.cardStatLabel}>Coverage</div>
                </div>
              </div>

              <div className={styles.cardBar}>
                <div
                  className={styles.cardBarFill}
                  style={{ width: `${c.coverage}%` }}
                />
              </div>

              <div className={styles.cardFoot}>
                <span>Last activity · {c.lastActivity}</span>
                <ArrowUpRight
                  size={14}
                  strokeWidth={2}
                  className={styles.cardArrow}
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
