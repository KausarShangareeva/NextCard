"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSignInModal } from "./SignInModalProvider";
import styles from "./SignInModal.module.css";

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

const KeyIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="7.5" cy="15.5" r="4.5" />
    <path d="m21 2-9.6 9.6" />
    <path d="m15.5 7.5 3 3" />
  </svg>
);

// Demo client → portal mapping. In production this would hit an auth endpoint.
const CLIENT_KEYS = {
  "SWEDBANK-2026": { portal: "/client", name: "Swedbank" },
};

export default function SignInModal() {
  const { open, closeSignIn } = useSignInModal();
  const router = useRouter();
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeSignIn();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeSignIn]);

  useEffect(() => {
    if (!open) {
      setKey("");
      setError("");
      setPending(false);
    }
  }, [open]);

  if (!open) return null;

  const onSubmit = (e) => {
    e.preventDefault();
    const normalized = key.trim().toUpperCase();
    const match = CLIENT_KEYS[normalized];
    if (!match) {
      setError("Invalid access key. Check with your admin.");
      return;
    }
    setError("");
    setPending(true);
    router.push(match.portal);
  };

  return (
    <div
      className={styles.backdrop}
      onClick={closeSignIn}
      role="dialog"
      aria-modal="true"
      aria-labelledby="signin-modal-title"
    >
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={closeSignIn}
          aria-label="Close"
        >
          <CloseIcon />
        </button>

        <div className={styles.header}>
          <span className={styles.eyebrow}>
            <span className={styles.eyebrowDot} aria-hidden="true" />
            Client portal
          </span>
          <h2 id="signin-modal-title" className={styles.heading}>
            Sign in to your portal.
          </h2>
          <p className={styles.sub}>
            Enter the personal access key your NextCard admin sent you.
          </p>
        </div>

        <form onSubmit={onSubmit} className={styles.form} noValidate>
          <label htmlFor="signin-key" className={styles.label}>
            Access key
          </label>
          <div
            className={`${styles.inputWrap} ${error ? styles.inputWrapErr : ""}`.trim()}
          >
            <KeyIcon />
            <input
              id="signin-key"
              type="text"
              autoComplete="off"
              autoFocus
              spellCheck={false}
              placeholder="e.g. SWEDBANK-2026"
              value={key}
              onChange={(e) => {
                setKey(e.target.value);
                if (error) setError("");
              }}
              className={styles.input}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button
            type="submit"
            className={styles.submit}
            disabled={pending || !key.trim()}
          >
            {pending ? "Signing in…" : "Sign in"}
          </button>

          <div className={styles.demoHint}>
            Demo key:{" "}
            <button
              type="button"
              className={styles.demoKeyBtn}
              onClick={() => {
                setKey("SWEDBANK-2026");
                setError("");
              }}
            >
              SWEDBANK-2026
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
