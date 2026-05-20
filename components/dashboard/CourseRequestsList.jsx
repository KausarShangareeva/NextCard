"use client";

import { useMemo, useState } from "react";
import { useCourseRequests } from "@/components/course-requests/CourseRequestsProvider";
import {
  STATUS_LABEL,
  STATUS_PILL_CLASS,
} from "@/components/course-requests/courseRequestsData";
import CourseRequestModal from "./CourseRequestModal";
import styles from "./CourseRequestsList.module.css";

export default function CourseRequestsList() {
  const { requests, updateStatus } = useCourseRequests();
  const [selectedId, setSelectedId] = useState(null);

  const selected = requests.find((r) => r.id === selectedId) ?? null;

  // Done items sink to the bottom; everything else keeps its order.
  const sorted = useMemo(
    () =>
      [...requests].sort((a, b) => {
        const aDone = a.status === "done" ? 1 : 0;
        const bDone = b.status === "done" ? 1 : 0;
        return aDone - bDone;
      }),
    [requests]
  );

  if (requests.length === 0) {
    return (
      <div className={styles.panel}>
        <div className={styles.empty}>No course requests yet.</div>
      </div>
    );
  }

  return (
    <section className={styles.panel}>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Client</th>
              <th>Role &amp; scope</th>
              <th>Submitted</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr
                key={r.id}
                onClick={() => setSelectedId(r.id)}
                className={r.status === "done" ? styles.rowDone : undefined}
              >
                <td>
                  <div className={styles.clientCell}>
                    <span
                      className={`fi fi-${r.clientCountryCode} ${styles.flag}`}
                      aria-hidden="true"
                    />
                    {r.client}
                  </div>
                  <div className={styles.requesterName}>{r.requestedBy}</div>
                </td>
                <td>
                  <div className={styles.roleCell}>
                    <span className={styles.roleName}>{r.role}</span>
                    <span className={styles.roleScope}>
                      {r.regulatoryScope?.join(" · ") || "—"}
                    </span>
                  </div>
                </td>
                <td>{r.submittedAt}</td>
                <td>
                  <span
                    className={`${styles.pill} ${styles[STATUS_PILL_CLASS[r.status]]}`}
                  >
                    <span className={styles.pillDot} aria-hidden="true" />
                    {STATUS_LABEL[r.status]}
                  </span>
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
            ))}
          </tbody>
        </table>
      </div>

      <CourseRequestModal
        request={selected}
        onClose={() => setSelectedId(null)}
        onStatusChange={updateStatus}
      />
    </section>
  );
}
