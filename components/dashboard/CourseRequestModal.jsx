"use client";

import { useEffect } from "react";
import { FileText } from "lucide-react";
import styles from "./CourseRequestModal.module.css";

const CloseIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

const STATUSES = [
  { value: "pending",     label: "Pending",     cls: "" },
  { value: "approved",    label: "Approved",    cls: "statusActiveApproved" },
  { value: "in-progress", label: "In progress", cls: "statusActiveInProgress" },
  { value: "done",        label: "Done",        cls: "statusActiveDone" },
];

const initials = (name = "") =>
  name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

export default function CourseRequestModal({ request, onClose, onStatusChange }) {
  useEffect(() => {
    if (!request) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [request, onClose]);

  if (!request) return null;

  const approve = () => {
    onStatusChange?.(request.id, "approved", {
      assignee: request.assignee ?? "Kausyar",
      cost: request.cost ?? "€4,200",
    });
  };

  const reject = () => {
    onStatusChange?.(request.id, "rejected");
    onClose?.();
  };

  return (
    <div
      className={styles.backdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-request-title"
    >
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close"
        >
          <CloseIcon />
        </button>

        <div className={styles.head}>
          <span className={styles.headAv}>{initials(request.client)}</span>
          <div className={styles.headInfo}>
            <div id="course-request-title" className={styles.headName}>
              {request.role}
            </div>
            <div className={styles.headMeta}>
              <span
                className={`fi fi-${request.clientCountryCode} ${styles.headFlag}`}
                aria-hidden="true"
              />
              {request.client} · requested by {request.requestedBy} ·{" "}
              {request.submittedAt}
            </div>
          </div>
        </div>

        <div className={styles.statusGroup}>
          {STATUSES.map((s) => {
            const active = s.value === request.status;
            return (
              <button
                key={s.value}
                type="button"
                onClick={() => onStatusChange?.(request.id, s.value)}
                className={`${styles.statusBtn} ${
                  active ? styles.statusBtnActive : ""
                } ${active && s.cls ? styles[s.cls] : ""}`.trim()}
              >
                <span className={styles.statusBtnDot} aria-hidden="true" />
                {s.label}
              </button>
            );
          })}
        </div>

        {(request.assignee || request.cost) && (
          <div className={styles.section}>
            <div className={styles.sectionLabel}>Production</div>
            <div className={styles.assigneeBox}>
              <div className={styles.assigneeCell}>
                <div className={styles.assigneeLabel}>Assigned to</div>
                <div className={styles.assigneeValue}>
                  {request.assignee ?? "—"}
                </div>
              </div>
              <div className={styles.assigneeCell}>
                <div className={styles.assigneeLabel}>Estimated cost</div>
                <div className={styles.assigneeValue}>
                  {request.cost ?? "—"}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={styles.section}>
          <div className={styles.sectionLabel}>Role description</div>
          <div className={styles.sectionText}>{request.roleDescription}</div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLabel}>Tasks</div>
          <div className={styles.sectionText}>{request.tasks}</div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLabel}>Responsibilities</div>
          <div className={styles.sectionText}>{request.responsibilities}</div>
        </div>

        {request.regulatoryScope?.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionLabel}>Regulatory scope</div>
            <div className={styles.chipsRow}>
              {request.regulatoryScope.map((s) => (
                <span key={s} className={styles.chip}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {request.files?.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionLabel}>
              Attached documents ({request.files.length})
            </div>
            <ul className={styles.fileList}>
              {request.files.map((f, i) => (
                <li key={`${f.name}-${i}`} className={styles.fileItem}>
                  <FileText size={14} strokeWidth={1.8} className={styles.fileIcon} />
                  <span className={styles.fileName}>{f.name}</span>
                  <span className={styles.fileSize}>{f.size}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.footer}>
          {request.status === "pending" ? (
            <>
              <button type="button" className={styles.btnDanger} onClick={reject}>
                Reject
              </button>
              <button type="button" className={styles.btnPrimary} onClick={approve}>
                Approve &amp; assign
              </button>
            </>
          ) : (
            <button type="button" className={styles.btnGhost} onClick={onClose}>
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
