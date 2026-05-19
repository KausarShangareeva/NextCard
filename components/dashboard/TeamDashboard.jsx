"use client";

import { useTeamAuth } from "./DashboardGate";
import { useDemoRequests } from "./DemoRequestsProvider";
import DemoRequestsTable from "./DemoRequestsTable";
import styles from "./TeamDashboard.module.css";

const STATS = [
  { label: "Pending demos",      value: "12",  delta: "+3 this week",   positive: true },
  { label: "Active clients",     value: "47",  delta: "+2 this month",  positive: true },
  { label: "Courses generated",  value: "284", delta: "+24 this month", positive: true },
  { label: "AMLR coverage avg",  value: "91%", delta: "+1.2% vs Q1",    positive: true },
];

const ACTIVE_CLIENTS = [
  { initials: "SB", name: "Swedbank",      countryCode: "se", country: "Sweden",  employees: "1,250",  coverage: 96,  lastActivity: "1d ago" },
  { initials: "KL", name: "Klarna",        countryCode: "se", country: "Sweden",  employees: "4,500",  coverage: 88,  lastActivity: "3d ago" },
  { initials: "SE", name: "SEB",           countryCode: "se", country: "Sweden",  employees: "12,800", coverage: 92,  lastActivity: "1d ago" },
  { initials: "AV", name: "Avanza",        countryCode: "se", country: "Sweden",  employees: "540",    coverage: 100, lastActivity: "5h ago" },
  { initials: "NO", name: "Nordea",        countryCode: "fi", country: "Finland", employees: "18,500", coverage: 89,  lastActivity: "2d ago" },
  { initials: "HB", name: "Handelsbanken", countryCode: "se", country: "Sweden",  employees: "11,200", coverage: 87,  lastActivity: "6h ago" },
];

export default function TeamDashboard() {
  const { user } = useTeamAuth();
  const { requests, newRequests } = useDemoRequests();
  const newCount = newRequests.length;
  const otherCount = requests.length - newCount;

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <div className={styles.headLeft}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowDot} aria-hidden="true" />
            Overview
          </div>
          <h1 className={styles.title}>
            {user ? `Welcome back, ${user.name}.` : "Back-office"}
          </h1>
          <p className={styles.sub}>
            {newCount} new demo request{newCount === 1 ? "" : "s"} ·
            3 courses in generation queue · everything&apos;s green.
          </p>
        </div>
      </header>

      <div className={styles.statsRow}>
        {STATS.map((s) => (
          <div key={s.label} className={styles.statCard}>
            <div className={styles.statLabel}>{s.label}</div>
            <div className={styles.statValue}>{s.value}</div>
            <div className={`${styles.statDelta} ${s.positive ? styles.statDeltaPos : ""}`.trim()}>
              {s.delta}
            </div>
          </div>
        ))}
      </div>

      <DemoRequestsTable
        title="New demo requests"
        meta={
          otherCount > 0
            ? `${newCount} new · ${otherCount} in progress`
            : `${newCount} new`
        }
        viewAllHref="/dashboard/demos"
        viewAllLabel="View all"
        requests={newRequests}
        emptyText="No new requests right now — nice work."
      />

      <section className={styles.panel}>
        <header className={styles.panelHead}>
          <h2 className={styles.panelTitle}>Active clients</h2>
          <span className={styles.panelMeta}>{ACTIVE_CLIENTS.length} · 48,790 seats</span>
        </header>
        <div className={styles.clientGrid}>
          {ACTIVE_CLIENTS.map((c) => (
            <div key={c.name} className={styles.clientCard}>
              <div className={styles.clientHead}>
                <span className={styles.clientLogo}>{c.initials}</span>
                <div>
                  <div className={styles.clientName}>{c.name}</div>
                  <div className={styles.clientCountry}>
                    <span
                      className={`fi fi-${c.countryCode} ${styles.countryFlag}`}
                      aria-hidden="true"
                    />
                    {c.country}
                  </div>
                </div>
              </div>

              <div className={styles.clientStats}>
                <div className={styles.clientStat}>
                  <div className={styles.clientStatValue}>{c.employees}</div>
                  <div className={styles.clientStatLabel}>Employees</div>
                </div>
                <div className={styles.clientStat}>
                  <div className={styles.clientStatValue}>{c.coverage}%</div>
                  <div className={styles.clientStatLabel}>AMLR coverage</div>
                </div>
              </div>

              <div>
                <div className={styles.clientBar}>
                  <div
                    className={styles.clientBarFill}
                    style={{ width: `${c.coverage}%` }}
                  />
                </div>
              </div>

              <div className={styles.clientFoot}>
                <span>Last activity</span>
                <span>{c.lastActivity}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
