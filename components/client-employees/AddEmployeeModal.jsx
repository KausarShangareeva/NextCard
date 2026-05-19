"use client";

import { useEffect, useState } from "react";
import {
  Shield,
  ScanLine,
  Building,
  UserCheck,
  Headphones,
  AlertTriangle,
  Sparkles,
  UserPlus,
} from "lucide-react";
import Dropdown from "@/components/ui/Dropdown";
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
  { value: "AML Officer",         label: "AML Officer",         icon: <Shield        {...ICON} />, programs: "AMLR · KYC" },
  { value: "KYC Analyst",         label: "KYC Analyst",         icon: <ScanLine      {...ICON} />, programs: "AMLR core" },
  { value: "Branch Manager",      label: "Branch Manager",      icon: <Building      {...ICON} />, programs: "AMLR · Sanctions" },
  { value: "Customer Onboarding", label: "Customer Onboarding", icon: <UserCheck     {...ICON} />, programs: "AMLR onboard" },
  { value: "Operations Support",  label: "Operations Support",  icon: <Headphones    {...ICON} />, programs: "AMLR core" },
  { value: "Risk Officer",        label: "Risk Officer",        icon: <AlertTriangle {...ICON} />, programs: "AMLR · Risk" },
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

  if (!open) return null;

  const selectedRole = ROLE_OPTIONS.find((r) => r.value === role);
  const isValid = firstName && lastName && email && phone && role;

  const reset = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setRole("");
    setBranch("");
    setStartDate(todayISO());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    onAdd?.({
      firstName,
      lastName,
      email,
      phone,
      role,
      branch,
      startDate,
      programs: selectedRole?.programs ?? "AMLR core",
    });
    reset();
    onClose?.();
  };

  const handleClose = () => {
    reset();
    onClose?.();
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

        <div className={styles.header}>
          <div className={styles.eyebrow}>Workspace</div>
          <h2 id="add-employee-title" className={styles.title}>
            Add employee
          </h2>
          <p className={styles.sub}>
            We&apos;ll auto-assign the matching AMLR program based on the
            role you pick.
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
                <strong>{selectedRole.programs}</strong> program will be
                auto-assigned. Training starts {startDate === todayISO() ? "today" : `on ${startDate}`}.
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
      </div>
    </div>
  );
}
