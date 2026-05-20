"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, ArrowRight, Wand2, ListChecks } from "lucide-react";
import { useCourseRequests } from "@/components/course-requests/CourseRequestsProvider";
import CourseBuilder from "./CourseBuilder";
import styles from "./DashboardCourses.module.css";

const initials = (name = "") =>
  name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

const STATUS_PILL = {
  approved:      { cls: "statusApproved",   label: "Approved · queued" },
  "in-progress": { cls: "statusInProgress", label: "In production" },
  done:          { cls: "statusDone",       label: "Done" },
};

const TABS = [
  { id: "builder", label: "Builder", icon: <Wand2 size={13} strokeWidth={1.8} /> },
  { id: "library", label: "Library", icon: <ListChecks size={13} strokeWidth={1.8} /> },
];

export default function DashboardCourses() {
  const { pending, inProduction, done, requests } = useCourseRequests();
  const [tab, setTab] = useState("builder");

  const totalCost = requests
    .filter((r) => r.cost)
    .reduce((sum, r) => sum + Number(r.cost.replace(/[^0-9.]/g, "")) || 0, 0);

  const totalCostStr = totalCost
    ? `€${totalCost.toLocaleString()}`
    : "—";

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <div className={styles.eyebrow}>Team workspace</div>
        <h1 className={styles.title}>Courses</h1>
        <p className={styles.sub}>
          Build AMLR-aligned, role-based training plans — each module
          explained — and track delivery to clients in one place.
        </p>
      </header>

      <div className={styles.tabs} role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`${styles.tab} ${tab === t.id ? styles.tabActive : ""}`.trim()}
          >
            {t.icon}
            {t.label}
            {t.id === "library" && pending.length > 0 && (
              <span className={styles.tabBadge}>{pending.length}</span>
            )}
          </button>
        ))}
      </div>

      {tab === "builder" ? (
        <CourseBuilder />
      ) : (
        <>
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>In production</div>
              <div className={styles.statValue}>{inProduction.length}</div>
              <div className={styles.statSub}>across the team</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Pending approval</div>
              <div className={styles.statValue}>{pending.length}</div>
              <div className={styles.statSub}>waiting in Inbox</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Completed</div>
              <div className={styles.statValue}>{done.length}</div>
              <div className={styles.statSub}>last 30 days</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Production revenue</div>
              <div className={styles.statValue}>{totalCostStr}</div>
              <div className={styles.statSub}>billed to clients</div>
            </div>
          </div>

          {pending.length > 0 && (
            <div className={styles.alert}>
              <span className={styles.alertIcon} aria-hidden="true">
                <Bell size={16} strokeWidth={2} />
              </span>
              <div className={styles.alertBody}>
                <div className={styles.alertTitle}>
                  {pending.length} client request
                  {pending.length === 1 ? "" : "s"} waiting to be approved
                </div>
                <div className={styles.alertSub}>
                  Review them in Inbox · Course requests, then they appear in
                  the production queue below.
                </div>
              </div>
              <Link href="/dashboard/inbox" className={styles.alertLink}>
                Open Inbox
                <ArrowRight size={12} strokeWidth={2.2} />
              </Link>
            </div>
          )}

          <section className={styles.panel}>
            <header className={styles.panelHead}>
              <h2 className={styles.panelTitle}>Generation queue</h2>
              <span className={styles.panelMeta}>
                {inProduction.length} active
              </span>
            </header>
            {inProduction.length === 0 ? (
              <div className={styles.empty}>
                Nothing in production right now. Approve a request from Inbox
                to kick off the pipeline.
              </div>
            ) : (
              <div className={styles.queueList}>
                {inProduction.map((r) => {
                  const status = STATUS_PILL[r.status];
                  return (
                    <div key={r.id} className={styles.queueCard}>
                      <div className={styles.queueRole}>
                        <span className={styles.queueRoleName}>{r.role}</span>
                        <span className={styles.queueClient}>
                          <span
                            className={`fi fi-${r.clientCountryCode} ${styles.queueFlag}`}
                            aria-hidden="true"
                          />
                          {r.client} · requested by {r.requestedBy}
                        </span>
                      </div>
                      <span className={styles.queueAssignee}>
                        <span className={styles.queueAv}>
                          {initials(r.assignee ?? "?")}
                        </span>
                        {r.assignee ?? "Unassigned"}
                      </span>
                      <span className={styles.queueCost}>{r.cost ?? "—"}</span>
                      <span
                        className={`${styles.queueStatus} ${styles[status.cls]}`}
                      >
                        <span className={styles.queueDot} aria-hidden="true" />
                        {status.label}
                      </span>
                      <Link
                        href="/dashboard/inbox"
                        className={styles.queueAction}
                      >
                        Open
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className={styles.panel}>
            <header className={styles.panelHead}>
              <h2 className={styles.panelTitle}>Recently delivered</h2>
              <span className={styles.panelMeta}>{done.length} completed</span>
            </header>
            {done.length === 0 ? (
              <div className={styles.empty}>No completed courses yet.</div>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Role</th>
                      <th>Client</th>
                      <th>Built by</th>
                      <th>Delivered</th>
                      <th>Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {done.map((r) => (
                      <tr key={r.id}>
                        <td>{r.role}</td>
                        <td>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                            <span
                              className={`fi fi-${r.clientCountryCode} ${styles.queueFlag}`}
                              aria-hidden="true"
                            />
                            {r.client}
                          </span>
                        </td>
                        <td>{r.assignee}</td>
                        <td>{r.submittedAt}</td>
                        <td>{r.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
