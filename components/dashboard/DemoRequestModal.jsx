"use client";

import { useEffect } from "react";
import Link from "next/link";
import { STATUSES_WITH_DETAILS } from "./demoRequestsData";
import styles from "./DemoRequestModal.module.css";

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

const ArrowRight = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

const STATUSES = [
  { value: "new",       label: "New",       cls: "statusNew" },
  { value: "contacted", label: "Contacted", cls: "statusContacted" },
  { value: "booked",    label: "Booked",    cls: "statusBooked" },
];

export default function DemoRequestModal({ request, onClose, onStatusChange }) {
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

  return (
    <div
      className={styles.backdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-request-title"
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
          <span className={styles.headAv}>{request.initials}</span>
          <div className={styles.headInfo}>
            <div id="demo-request-title" className={styles.headName}>
              {request.name}
            </div>
            <div className={styles.headMeta}>
              <span
                className={`fi fi-${request.countryCode} ${styles.headFlag}`}
                aria-hidden="true"
              />
              {request.company} · received {request.received}
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
                } ${active ? styles[s.cls] : ""}`.trim()}
              >
                <span className={styles.statusBtnDot} aria-hidden="true" />
                {s.label}
              </button>
            );
          })}
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLabel}>Contact</div>
          <div className={styles.detailGrid}>
            <span className={styles.detailLabel}>Email</span>
            <span className={styles.detailValue}>{request.email}</span>
            <span className={styles.detailLabel}>Phone</span>
            <span className={styles.detailValue}>{request.phone}</span>
            <span className={styles.detailLabel}>Country</span>
            <span className={styles.detailValue}>
              <span
                className={`fi fi-${request.countryCode} ${styles.headFlag}`}
                aria-hidden="true"
              />
              {request.country}
            </span>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLabel}>Company</div>
          <div className={styles.detailGrid}>
            <span className={styles.detailLabel}>Name</span>
            <span className={styles.detailValue}>{request.company}</span>
            <span className={styles.detailLabel}>Size</span>
            <span className={styles.detailValue}>{request.companySize}</span>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLabel}>How they heard about us</div>
          <div className={styles.sectionText}>{request.heardAbout}</div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLabel}>Documents</div>
          <div className={styles.placeholder}>
            No documents attached yet. Ask the client to send role
            descriptions or risk-exposure docs after the call.
          </div>
        </div>

        <div className={styles.footer}>
          <button type="button" className={styles.btnGhost} onClick={onClose}>
            Close
          </button>
          {STATUSES_WITH_DETAILS.includes(request.status) ? (
            <Link
              href={`/dashboard/demo/${request.id}`}
              className={styles.btnPrimary}
              onClick={onClose}
            >
              View details
              <ArrowRight />
            </Link>
          ) : (
            <span className={styles.footerHint}>
              Workspace unlocks once you mark this request as Contacted.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
