"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BrandMark from "@/components/ui/BrandMark";
import { useSignInModal } from "@/components/signin-modal/SignInModalProvider";
import { ROLE_BY_KEY, ROLE_PROFILES } from "@/components/client-employees/roleProfiles";
import styles from "./LearnerGate.module.css";

const STORAGE_KEY = "nextcard_learner_session";

const LearnerAuthContext = createContext({ session: null, signOut: () => {} });
export const useLearnerAuth = () => useContext(LearnerAuthContext);

export default function LearnerGate({ children }) {
  const router = useRouter();
  const { openSignIn } = useSignInModal();
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.username && parsed?.role && ROLE_PROFILES[parsed.role]) {
          setSession(parsed);
        }
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const signOut = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setSession(null);
    router.push("/");
  }, [router]);

  if (!ready) return null;

  if (session) {
    return (
      <LearnerAuthContext.Provider value={{ session, signOut }}>
        {children}
      </LearnerAuthContext.Provider>
    );
  }

  return (
    <section className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <BrandMark href="/" />
        </div>

        <div className={styles.eyebrow}>
          <span className={styles.eyebrowDot} aria-hidden="true" />
          Learner portal
        </div>

        <h1 className={styles.title}>Sign in to start your training.</h1>
        <p className={styles.sub}>
          Use the username and role access key your compliance admin sent you.
          One key works for everyone in the same role.
        </p>

        <button
          type="button"
          className={styles.submit}
          onClick={openSignIn}
        >
          Open sign-in
        </button>

        <p className={styles.hint}>
          Looking for the admin portal?{" "}
          <a href="/client">Client sign-in</a>.
        </p>
      </div>
    </section>
  );
}
