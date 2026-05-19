"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import BrandMark from "@/components/ui/BrandMark";
import styles from "./DashboardGate.module.css";

const STORAGE_KEY = "nextcard_team_user";

// Hackathon-grade auth: each team member has their own personal key.
// To change a key or add a teammate, edit this array.
export const TEAM_MEMBERS = [
  { key: "kausyar-2026", slug: "kausyar", name: "Kausyar", role: "Frontend",    photo: "/team/kausyar.jpg" },
  { key: "begimai-2026", slug: "begimai", name: "Begimai", role: "Backend",     photo: "/team/begimai.jpg" },
  { key: "salim-2026",   slug: "salim",   name: "Salim",   role: "AI search",   photo: "/team/salim.jpg"   },
  { key: "aakash-2026",  slug: "aakash",  name: "Aakash",  role: "AI Engineer", photo: "/team/aakash.jpg"  },
  { key: "shansa-2026",  slug: "shansa",  name: "Shansa",  role: "Senior Dev",  photo: "/team/shansa.jpg"  },
];

const TeamAuthContext = createContext({ user: null, signOut: () => {} });
export const useTeamAuth = () => useContext(TeamAuthContext);

export default function DashboardGate({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      const slug = localStorage.getItem(STORAGE_KEY);
      if (slug) {
        const m = TEAM_MEMBERS.find((x) => x.slug === slug);
        if (m) setUser(m);
      }
    } catch {
      /* localStorage may throw in private mode — keep going */
    }
    setReady(true);
  }, []);

  const signOut = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setUser(null);
    setValue("");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const member = TEAM_MEMBERS.find((m) => m.key === value.trim());
    if (!member) {
      setError(true);
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, member.slug);
    } catch {}
    setError(false);
    setUser(member);
  };

  if (!ready) return null;

  if (user) {
    return (
      <TeamAuthContext.Provider value={{ user, signOut }}>
        {children}
      </TeamAuthContext.Provider>
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
          Internal access
        </div>

        <h1 className={styles.title}>Enter your team key</h1>
        <p className={styles.sub}>
          This back-office is for the NextCard team only. Each teammate has a
          personal key — ask in the team chat if you don&apos;t have yours.
        </p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <label htmlFor="team-key" className={styles.label}>
            Team key
          </label>
          <input
            id="team-key"
            type="password"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError(false);
            }}
            placeholder="••••••••••"
            autoComplete="off"
            className={`${styles.input} ${error ? styles.inputError : ""}`.trim()}
          />
          {error && (
            <div className={styles.error}>
              That key isn&apos;t recognised. Try again or ping the team.
            </div>
          )}
          <button type="submit" className={styles.submit}>
            Continue
          </button>
        </form>

        <p className={styles.hint}>
          If you&apos;re a customer or evaluating NextCard,{" "}
          <a href="/">go back to the main site</a> and book a demo.
        </p>
      </div>
    </section>
  );
}
