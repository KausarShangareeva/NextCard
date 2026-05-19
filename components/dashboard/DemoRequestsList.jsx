"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useDemoRequests } from "./DemoRequestsProvider";
import DemoRequestsTable from "./DemoRequestsTable";
import { STATUS_LABEL, STATUSES } from "./demoRequestsData";
import styles from "./DemoRequestsList.module.css";

const FILTERS = [{ value: "all", label: "All" }, ...STATUSES.map((s) => ({ value: s, label: STATUS_LABEL[s] }))];

export default function DemoRequestsList() {
  const { requests } = useDemoRequests();
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const c = { all: requests.length };
    for (const s of STATUSES) c[s] = requests.filter((r) => r.status === s).length;
    return c;
  }, [requests]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return requests.filter((r) => {
      if (filter !== "all" && r.status !== filter) return false;
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        r.company.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.country.toLowerCase().includes(q)
      );
    });
  }, [requests, filter, query]);

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <div className={styles.eyebrow}>Team workspace</div>
        <h1 className={styles.title}>Demo requests</h1>
        <p className={styles.sub}>
          Full pipeline of incoming requests. Click any row to triage, change
          status, or open the workspace.
        </p>
      </header>

      <div className={styles.toolbar}>
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`${styles.chip} ${f.value === filter ? styles.chipActive : ""}`.trim()}
          >
            {f.label}
            <span className={styles.chipCount}>{counts[f.value] ?? 0}</span>
          </button>
        ))}
        <div className={styles.search}>
          <Search size={13} strokeWidth={1.8} color="var(--ink-3)" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, company, email, country…"
            className={styles.searchInput}
          />
        </div>
      </div>

      <DemoRequestsTable
        requests={filtered}
        emptyText="No requests match this filter."
      />
    </div>
  );
}
