"use client";

import { useEffect, useState } from "react";
import {
  Shield,
  ScanLine,
  Headphones,
  AlertTriangle,
  Sparkles,
  UserPlus,
  User,
  KeyRound,
  Copy,
  Check,
  CheckCircle2,
} from "lucide-react";
import Dropdown from "@/components/ui/Dropdown";
import { ROLE_PROFILES, usernameFrom } from "./roleProfiles";
import styles from "./AddEmployeeModal.module.css";

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

const ICON = { size: 16, strokeWidth: 1.8 };

const ROLE_OPTIONS = [
  { value: "AML DDI Manager",                     label: "AML DDI Manager",                     icon: <Shield        {...ICON} />, programs: ROLE_PROFILES["AML DDI Manager"].programs },
  { value: "Customer Advisor",                    label: "Customer Advisor",                    icon: <Headphones    {...ICON} />, programs: ROLE_PROFILES["Customer Advisor"].programs },
  { value: "Money Laundering Reporting Officer",  label: "Money Laundering Reporting Officer",  icon: <AlertTriangle {...ICON} />, programs: ROLE_PROFILES["Money Laundering Reporting Officer"].programs },
  { value: "Transaction Monitoring (TM) Analyst", label: "Transaction Monitoring (TM) Analyst", icon: <ScanLine      {...ICON} />, programs: ROLE_PROFILES["Transaction Monitoring (TM) Analyst"].programs },
];

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function AddEmployeeModal({ open, onClose, onAdd }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [branch, setBranch] = useState("");
  const [startDate, setStartDate] = useState(todayISO());
  const [created, setCreated] = useState(null);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    if (!open) return;
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
  }, [open, onClose]);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(null), 1400);
    return () => clearTimeout(t);
  }, [copied]);

  if (!open) return null;

  const selectedRole = ROLE_OPTIONS.find((r) => r.value === role);
  const selectedProfile = role ? ROLE_PROFILES[role] : null;
  const isValid = firstName && lastName && email && phone && role;

  const reset = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setRole("");
    setBranch("");
    setStartDate(todayISO());
    setCreated(null);
    setCopied(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    const username = usernameFrom(firstName, lastName);
    onAdd?.({
      firstName,
      lastName,
      email,
      phone,
      role,
      branch,
      startDate,
      username,
      programs: selectedProfile?.programs ?? "AMLR core",
    });
    setCreated({
      name: `${firstName} ${lastName}`.trim(),
      role,
      username,
      key: selectedProfile?.key ?? "",
    });
  };

  const handleClose = () => {
    reset();
    onClose?.();
  };

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
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-employee-title"
    >
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={handleClose}
          aria-label="Close"
        >
          <CloseIcon />
        </button>

        {!created ? (
          <>
            <div className={styles.header}>
              <div className={styles.eyebrow}>Workspace</div>
              <h2 id="add-employee-title" className={styles.title}>
                Add employee
              </h2>
              <p className={styles.sub}>
                We&apos;ll generate a learner-portal username and assign the
                role&apos;s shared access key.
              </p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="ae-first" className={styles.label}>
                    First name*
                  </label>
                  <input
                    id="ae-first"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={styles.input}
                    placeholder="Lars"
                    autoComplete="given-name"
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="ae-last" className={styles.label}>
                    Last name*
                  </label>
                  <input
                    id="ae-last"
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={styles.input}
                    placeholder="Johansson"
                    autoComplete="family-name"
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="ae-email" className={styles.label}>
                    Business email*
                  </label>
                  <input
                    id="ae-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                    placeholder="lars@swedbank.se"
                    autoComplete="email"
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="ae-phone" className={styles.label}>
                    Phone*
                  </label>
                  <input
                    id="ae-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={styles.input}
                    placeholder="+46 70 123 45 67"
                    autoComplete="tel"
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="ae-role" className={styles.label}>
                  Role*
                </label>
                <Dropdown
                  id="ae-role"
                  value={role}
                  onChange={setRole}
                  placeholder="Pick a compliance role"
                  options={ROLE_OPTIONS}
                />
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="ae-branch" className={styles.label}>
                    Branch / location
                  </label>
                  <input
                    id="ae-branch"
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className={styles.input}
                    placeholder="Stockholm HQ"
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="ae-start" className={styles.label}>
                    Start date
                  </label>
                  <input
                    id="ae-start"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={`${styles.input} ${styles.dateInput}`}
                  />
                </div>
              </div>

              {selectedRole && (
                <div className={styles.hint}>
                  <Sparkles size={14} strokeWidth={1.8} className={styles.hintIcon} />
                  <span>
                    <strong>{selectedProfile?.programs}</strong> will be
                    auto-assigned. Access key{" "}
                    <code className={styles.hintCode}>{selectedProfile?.key}</code>{" "}
                    is shared by all {selectedRole.label}s.
                  </span>
                </div>
              )}

              <div className={styles.footer}>
                <button type="button" className={styles.btnGhost} onClick={handleClose}>
                  Cancel
                </button>
                <button type="submit" className={styles.btnPrimary} disabled={!isValid}>
                  <UserPlus size={14} strokeWidth={2} />
                  Add employee
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className={styles.successHead}>
              <div className={styles.successIcon} aria-hidden="true">
                <CheckCircle2 size={22} strokeWidth={2} />
              </div>
              <h2 id="add-employee-title" className={styles.title}>
                {created.name} is in.
              </h2>
              <p className={styles.sub}>
                Send these sign-in details so they can start their {created.role}
                {" "}training at <code className={styles.hintCode}>/learner</code>.
              </p>
            </div>

            <div className={styles.credBox}>
              <div className={styles.credRow}>
                <span className={styles.credLabel}>
                  <User size={12} strokeWidth={1.8} />
                  Username
                </span>
                <span className={styles.credValue}>{created.username}</span>
                <button
                  type="button"
                  className={styles.credCopyBtn}
                  onClick={() => copy("username", created.username)}
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
                  {created.key}
                </span>
                <button
                  type="button"
                  className={styles.credCopyBtn}
                  onClick={() => copy("key", created.key)}
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

            <div className={styles.footer}>
              <button
                type="button"
                className={styles.btnGhost}
                onClick={() =>
                  copy(
                    "all",
                    `Sign in at /learner\nUsername: ${created.username}\nAccess key: ${created.key}`
                  )
                }
              >
                {copied === "all" ? "Copied" : "Copy sign-in details"}
              </button>
              <button type="button" className={styles.btnPrimary} onClick={handleClose}>
                Done
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
