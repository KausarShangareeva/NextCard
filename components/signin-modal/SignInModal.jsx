"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSignInModal } from "./SignInModalProvider";
import { ROLE_BY_KEY, ROLE_PROFILES } from "@/components/client-employees/roleProfiles";
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

const UserIcon = () => (
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
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const CLIENT_KEYS = {
  "SWEDBANK-2026": { portal: "/client", name: "Swedbank" },
};

const LEARNER_STORAGE_KEY = "nextcard_learner_session";

export default function SignInModal() {
  const { open, closeSignIn } = useSignInModal();
  const router = useRouter();
  const [mode, setMode] = useState("client");
  const [clientKey, setClientKey] = useState("");
  const [learnerName, setLearnerName] = useState("");
  const [learnerKey, setLearnerKey] = useState("");
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
      setMode("client");
      setClientKey("");
      setLearnerName("");
      setLearnerKey("");
      setError("");
      setPending(false);
    }
  }, [open]);

  if (!open) return null;

  const switchMode = (next) => {
    setMode(next);
    setError("");
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (mode === "client") {
      const normalized = clientKey.trim().toUpperCase();
      const match = CLIENT_KEYS[normalized];
      if (!match) {
        setError("Invalid access key. Check with your admin.");
        return;
      }
      setPending(true);
      router.push(match.portal);
      return;
    }

    const username = learnerName.trim().toLowerCase();
    const normalizedKey = learnerKey.trim().toUpperCase();
    if (!username) {
      setError("Enter the username your admin sent you.");
      return;
    }
    const role = ROLE_BY_KEY[normalizedKey];
    if (!role) {
      setError("That role key isn't recognised. Check with your admin.");
      return;
    }

    try {
      localStorage.setItem(
        LEARNER_STORAGE_KEY,
        JSON.stringify({ username, role, key: normalizedKey })
      );
    } catch {
      /* ignore */
    }

    setPending(true);
    router.push("/learner");
  };

  const isClient = mode === "client";

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
            {isClient ? "Client portal" : "Learner portal"}
          </span>
          <h2 id="signin-modal-title" className={styles.heading}>
            {isClient ? "Sign in to your portal." : "Welcome back, learner."}
          </h2>
          <p className={styles.sub}>
            {isClient
              ? "Enter the personal access key your NextCard admin sent you."
              : "Enter the username and role key your compliance admin sent you."}
          </p>
        </div>

        <div className={styles.tabs} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={isClient}
            className={`${styles.tab} ${isClient ? styles.tabActive : ""}`.trim()}
            onClick={() => switchMode("client")}
          >
            I&apos;m a client
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={!isClient}
            className={`${styles.tab} ${!isClient ? styles.tabActive : ""}`.trim()}
            onClick={() => switchMode("learner")}
          >
            I&apos;m an employee
          </button>
        </div>

        <form onSubmit={onSubmit} className={styles.form} noValidate>
          {isClient ? (
            <>
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
                  value={clientKey}
                  onChange={(e) => {
                    setClientKey(e.target.value);
                    if (error) setError("");
                  }}
                  className={styles.input}
                />
              </div>
            </>
          ) : (
            <>
              <label htmlFor="signin-user" className={styles.label}>
                Username
              </label>
              <div
                className={`${styles.inputWrap} ${error ? styles.inputWrapErr : ""}`.trim()}
              >
                <UserIcon />
                <input
                  id="signin-user"
                  type="text"
                  autoComplete="username"
                  autoFocus
                  spellCheck={false}
                  placeholder="e.g. lars.johansson"
                  value={learnerName}
                  onChange={(e) => {
                    setLearnerName(e.target.value);
                    if (error) setError("");
                  }}
                  className={`${styles.input} ${styles.inputLower}`}
                />
              </div>

              <label
                htmlFor="signin-role-key"
                className={`${styles.label} ${styles.labelStacked}`.trim()}
              >
                Role access key
              </label>
              <div
                className={`${styles.inputWrap} ${error ? styles.inputWrapErr : ""}`.trim()}
              >
                <KeyIcon />
                <input
                  id="signin-role-key"
                  type="text"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="e.g. AML-DDI-2026"
                  value={learnerKey}
                  onChange={(e) => {
                    setLearnerKey(e.target.value);
                    if (error) setError("");
                  }}
                  className={styles.input}
                />
              </div>
            </>
          )}

          {error && <div className={styles.error}>{error}</div>}

          <button
            type="submit"
            className={styles.submit}
            disabled={
              pending ||
              (isClient ? !clientKey.trim() : !learnerName.trim() || !learnerKey.trim())
            }
          >
            {pending ? "Signing in…" : "Sign in"}
          </button>

          <div className={styles.demoHint}>
            {isClient ? (
              <>
                Demo key:{" "}
                <button
                  type="button"
                  className={styles.demoKeyBtn}
                  onClick={() => {
                    setClientKey("SWEDBANK-2026");
                    setError("");
                  }}
                >
                  SWEDBANK-2026
                </button>
              </>
            ) : (
              <div className={styles.demoChipsWrap}>
                <span>Demo logins:</span>
                <div className={styles.demoChips}>
                  {Object.entries(ROLE_PROFILES).map(([roleName, p]) => (
                    <button
                      key={p.key}
                      type="button"
                      className={styles.demoChip}
                      onClick={() => {
                        if (!learnerName.trim()) {
                          setLearnerName(SAMPLE_USERS[roleName] ?? "lars.johansson");
                        }
                        setLearnerKey(p.key);
                        setError("");
                      }}
                    >
                      {p.key}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

const SAMPLE_USERS = {
  "AML DDI Manager": "lars.johansson",
  "Customer Advisor": "maria.lindberg",
  "Money Laundering Reporting Officer": "erik.hellstrom",
  "Transaction Monitoring (TM) Analyst": "klara.andersson",
};
