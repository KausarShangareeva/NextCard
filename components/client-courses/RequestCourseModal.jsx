"use client";

import { useEffect, useRef, useState } from "react";
import { Check, X } from "lucide-react";
import styles from "./RequestCourseModal.module.css";

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

export default function RequestCourseModal({ open, onClose, onSubmit, initialRole = "" }) {
  const [role, setRole] = useState("");
  const [scope, setScope] = useState([]);
  const [scopeInput, setScopeInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const wasOpen = useRef(false);

  // Pre-fill the Role field from selected employees every time the modal opens.
  // Reset the success view only on the closed→open transition (not on every
  // initialRole change), otherwise clearSelection after Submit would wipe
  // the success view via this effect.
  useEffect(() => {
    const justOpened = open && !wasOpen.current;
    wasOpen.current = open;
    if (justOpened) {
      setRole(initialRole);
      setSubmitted(false);
    }
  }, [open, initialRole]);

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

  const reset = () => {
    setRole("");
    setScope([]);
    setScopeInput("");
  };

  const handleClose = () => {
    reset();
    onClose?.();
  };

  const addScope = (raw) => {
    const v = raw.trim().replace(/,$/, "");
    if (!v) return;
    if (scope.includes(v)) return;
    setScope((s) => [...s, v]);
    setScopeInput("");
  };

  const handleScopeKey = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addScope(scopeInput);
    } else if (e.key === "Backspace" && !scopeInput && scope.length > 0) {
      setScope((s) => s.slice(0, -1));
    }
  };

  const isValid = role.trim().length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    onSubmit?.({
      role,
      regulatoryScope: scope,
    });
    reset();
    setSubmitted(true);
  };

  return (
    <div
      className={styles.backdrop}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="request-course-title"
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

        {submitted ? (
          <div className={styles.success}>
            <span className={styles.successIcon} aria-hidden="true">
              <Check size={28} strokeWidth={3} />
            </span>
            <h2 id="request-course-title" className={styles.successTitle}>
              Request sent
            </h2>
            <p className={styles.successText}>
              A manager will get back to you within two business days.
            </p>
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={handleClose}
            >
              Done
            </button>
          </div>
        ) : (
        <>
        <div className={styles.header}>
          <span className={styles.eyebrow}>
            <span className={styles.eyebrowDot} aria-hidden="true" />
            Request a new course
          </span>
          <h2 id="request-course-title" className={styles.title}>
            Tell us about the role.
          </h2>
          <p className={styles.sub}>
            Our compliance team turns this into an AMLR-aligned program in
            ~5 business days.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label htmlFor="rc-role" className={styles.label}>
              Role*
            </label>
            <input
              id="rc-role"
              type="text"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={styles.input}
              placeholder="Crypto Compliance Officer · digital-asset desk"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="rc-scope" className={styles.label}>
              Regulatory scope
            </label>
            <div className={styles.chipsWrap}>
              {scope.map((s) => (
                <span key={s} className={styles.chip}>
                  {s}
                  <button
                    type="button"
                    onClick={() => setScope((arr) => arr.filter((x) => x !== s))}
                    className={styles.chipRemove}
                    aria-label={`Remove ${s}`}
                  >
                    <X size={10} strokeWidth={2.4} />
                  </button>
                </span>
              ))}
              <input
                id="rc-scope"
                type="text"
                value={scopeInput}
                onChange={(e) => setScopeInput(e.target.value)}
                onKeyDown={handleScopeKey}
                onBlur={() => scopeInput && addScope(scopeInput)}
                className={styles.chipsInput}
                placeholder={
                  scope.length === 0
                    ? "AMLR Art. 20, MiCAR Art. 38…"
                    : ""
                }
              />
            </div>
            <div className={styles.chipsHint}>
              Press Enter or comma to add. Backspace removes the last tag.
            </div>
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.btnGhost} onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className={styles.btnPrimary} disabled={!isValid}>
              Submit request
            </button>
          </div>
        </form>
        </>
        )}
      </div>
    </div>
  );
}
