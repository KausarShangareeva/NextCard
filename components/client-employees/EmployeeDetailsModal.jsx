"use client";

import { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  Briefcase,
  ShieldAlert,
  CheckCircle2,
  User,
  KeyRound,
  Copy,
  Check,
} from "lucide-react";
import { ROLE_PROFILES } from "./roleProfiles";
import styles from "./EmployeeDetailsModal.module.css";

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

const STATUS_LABEL = {
  active: "Active",
  onboarding: "Onboarding",
  inactive: "Inactive",
};

const STATUS_CLASS = {
  active: "statusActive",
  onboarding: "statusOnboarding",
  inactive: "statusInactive",
};

export default function EmployeeDetailsModal({ employee, onClose }) {
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    if (!employee) return;
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
  }, [employee, onClose]);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(null), 1400);
    return () => clearTimeout(t);
  }, [copied]);

  if (!employee) return null;

  const profile = ROLE_PROFILES[employee.role];
  const accessKey = profile?.key ?? "";

  const copy = (label, value) => {
    if (!value) return;
    try {
      navigator.clipboard?.writeText(value);
    } catch {
      /* ignore */
    }
    setCopied(label);
  };

  return (
    <div
      className={styles.backdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="emp-details-title"
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

        <header className={styles.header}>
          <div className={styles.avatar}>{employee.initials}</div>
          <div className={styles.headerText}>
            <h2 id="emp-details-title" className={styles.name}>
              {employee.name}
            </h2>
            <div className={styles.role}>{employee.role}</div>
            <span
              className={`${styles.statusPill} ${styles[STATUS_CLASS[employee.status]]}`}
            >
              <span className={styles.statusDot} aria-hidden="true" />
              {STATUS_LABEL[employee.status]}
            </span>
          </div>
        </header>

        {(employee.username || accessKey) && (
          <section className={styles.credsCard}>
            <div className={styles.credsHead}>
              <span className={styles.credsEyebrow}>Learner portal access</span>
              <span className={styles.credsHint}>
                Share both with {employee.name.split(" ")[0]} to sign in at
                {" "}<code className={styles.credsRoute}>/learner</code>
              </span>
            </div>

            <div className={styles.credsGrid}>
              <div className={styles.credRow}>
                <span className={styles.credLabel}>
                  <User size={12} strokeWidth={1.8} />
                  Username
                </span>
                <span className={styles.credValue}>{employee.username}</span>
                <button
                  type="button"
                  className={styles.credCopyBtn}
                  onClick={() => copy("username", employee.username)}
                  aria-label="Copy username"
                >
                  {copied === "username" ? (
                    <Check size={12} strokeWidth={2.2} />
                  ) : (
                    <Copy size={12} strokeWidth={1.8} />
                  )}
                </button>
              </div>

              <div className={styles.credRow}>
                <span className={styles.credLabel}>
                  <KeyRound size={12} strokeWidth={1.8} />
                  Access key
                </span>
                <span className={`${styles.credValue} ${styles.credKey}`}>
                  {accessKey}
                </span>
                <button
                  type="button"
                  className={styles.credCopyBtn}
                  onClick={() => copy("key", accessKey)}
                  aria-label="Copy access key"
                >
                  {copied === "key" ? (
                    <Check size={12} strokeWidth={2.2} />
                  ) : (
                    <Copy size={12} strokeWidth={1.8} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="button"
              className={styles.credCopyAll}
              onClick={() =>
                copy(
                  "all",
                  `Sign in at /learner\nUsername: ${employee.username}\nAccess key: ${accessKey}`
                )
              }
            >
              {copied === "all" ? (
                <>
                  <Check size={12} strokeWidth={2.2} />
                  Copied to clipboard
                </>
              ) : (
                <>
                  <Copy size={12} strokeWidth={1.8} />
                  Copy sign-in details
                </>
              )}
            </button>
          </section>
        )}

        <section className={styles.contactCard}>
          <a href={`mailto:${employee.email}`} className={styles.contactRow}>
            <Mail size={14} strokeWidth={1.8} className={styles.contactIcon} />
            <span className={styles.contactValue}>{employee.email}</span>
          </a>
          <span className={styles.contactDivider} aria-hidden="true" />
          <a href={`tel:${employee.phone.replace(/\s/g, "")}`} className={styles.contactRow}>
            <Phone size={14} strokeWidth={1.8} className={styles.contactIcon} />
            <span className={styles.contactValue}>{employee.phone}</span>
          </a>
        </section>

        {profile && (
          <section className={styles.profile}>
            <header className={styles.profileHead}>
              <span className={styles.profileEyebrow}>Role profile</span>
              <div className={styles.profileMeta}>
                <span className={styles.metaItem}>
                  <span className={styles.metaLabel}>Team</span>
                  <span className={styles.metaValue}>{profile.team}</span>
                </span>
                <span className={styles.metaDot} aria-hidden="true" />
                <span className={styles.metaItem}>
                  <span className={styles.metaLabel}>Band</span>
                  <span className={styles.metaValue}>{profile.band}</span>
                </span>
                <span className={styles.metaDot} aria-hidden="true" />
                <span className={styles.metaItem}>
                  <span className={styles.metaLabel}>Reports to</span>
                  <span className={styles.metaValue}>{profile.reports}</span>
                </span>
              </div>
            </header>

            <p className={styles.purpose}>{profile.purpose}</p>

            <div className={styles.lists}>
              <div className={styles.listBlock}>
                <div className={styles.listTitle}>
                  <Briefcase size={13} strokeWidth={1.8} />
                  Main duties
                </div>
                <ul className={styles.list}>
                  {profile.duties.map((d, i) => (
                    <li key={i} className={styles.listItem}>
                      <CheckCircle2
                        size={12}
                        strokeWidth={2}
                        className={styles.listIconCheck}
                      />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.listBlock}>
                <div className={`${styles.listTitle} ${styles.listTitleRisk}`}>
                  <ShieldAlert size={13} strokeWidth={1.8} />
                  Inherent AML risk exposure
                </div>
                <ul className={styles.list}>
                  {profile.risk.map((r, i) => (
                    <li key={i} className={styles.listItem}>
                      <span className={styles.listIconRisk} aria-hidden="true" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
