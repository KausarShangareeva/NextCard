"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useDemoRequests } from "./DemoRequestsProvider";
import DemoRequestModal from "./DemoRequestModal";
import { STATUS_LABEL, STATUS_PILL_CLASS } from "./demoRequestsData";
import styles from "./DemoRequestsTable.module.css";

/**
 * @param {{
 *   title?: string,
 *   meta?: React.ReactNode,
 *   viewAllHref?: string,
 *   viewAllLabel?: string,
 *   requests: Array<{ id: number, [k: string]: any }>,
 *   emptyText?: string,
 * }} props
 */
export default function DemoRequestsTable({
  title,
  meta,
  viewAllHref,
  viewAllLabel = "View all",
  requests,
  emptyText = "No demo requests yet.",
}) {
  const { requests: allRequests, updateStatus } = useDemoRequests();
  const [selectedId, setSelectedId] = useState(null);

  // Look up the selected request from the full list, not the filtered prop —
  // otherwise changing status to one that's filtered out closes the modal.
  const selected = allRequests.find((r) => r.id === selectedId) ?? null;

  return (
    <section className={styles.panel}>
      {(title || viewAllHref) && (
        <header className={styles.panelHead}>
          <div className={styles.panelHeadLeft}>
            {title && <h2 className={styles.panelTitle}>{title}</h2>}
            {meta && <span className={styles.panelMeta}>{meta}</span>}
          </div>
          {viewAllHref && (
            <Link href={viewAllHref} className={styles.panelLink}>
              {viewAllLabel}
              <ArrowRight size={12} strokeWidth={2} />
            </Link>
          )}
        </header>
      )}

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Contact</th>
              <th>Company</th>
              <th>Country</th>
              <th>Received</th>
              <th>Status</th>
              <th>Assigned to</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan={7} className={styles.empty}>{emptyText}</td>
              </tr>
            ) : (
              requests.map((r) => (
                <tr key={r.id} onClick={() => setSelectedId(r.id)}>
                  <td>
                    <div className={styles.contact}>
                      <span className={styles.contactAv}>{r.initials}</span>
                      <span className={styles.contactInfo}>
                        <span className={styles.contactName}>{r.name}</span>
                        <span className={styles.contactEmail}>{r.email}</span>
                      </span>
                    </div>
                  </td>
                  <td>{r.company}</td>
                  <td>
                    <span className={styles.countryCell}>
                      <span
                        className={`fi fi-${r.countryCode} ${styles.countryFlag}`}
                        aria-hidden="true"
                      />
                      {r.country}
                    </span>
                  </td>
                  <td>{r.received}</td>
                  <td>
                    <span className={`${styles.pill} ${styles[STATUS_PILL_CLASS[r.status]]}`}>
                      <span className={styles.pillDot} aria-hidden="true" />
                      {STATUS_LABEL[r.status]}
                    </span>
                  </td>
                  <td>
                    {r.assignedTo ? (
                      <span className={styles.assigned} title={`${r.assignedTo.name} · ${r.assignedTo.role}`}>
                        <span
                          className={styles.assignedAv}
                          style={r.assignedTo.photo ? { "--photo": `url(${r.assignedTo.photo})` } : undefined}
                        >
                          {r.assignedTo.name?.[0] ?? "?"}
                        </span>
                        <span className={styles.assignedName}>{r.assignedTo.name}</span>
                      </span>
                    ) : (
                      <span className={styles.unassigned}>—</span>
                    )}
                  </td>
                  <td>
                    <button
                      type="button"
                      className={styles.actionBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedId(r.id);
                      }}
                    >
                      Open
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <DemoRequestModal
        request={selected}
        onClose={() => setSelectedId(null)}
        onStatusChange={updateStatus}
      />
    </section>
  );
}
