"use client";

import { LogOut } from "lucide-react";
import { useLearnerAuth } from "./LearnerGate";
import styles from "../dashboard-shell/DashboardShell.module.css";

export default function LearnerNavActions() {
  const { session, signOut } = useLearnerAuth();

  if (!session) return null;

  const initials = session.username
    .split(".")
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2) || "?";

  return (
    <>
      <span className={styles.adminPill}>
        <span className={styles.adminAv}>{initials}</span>
        <span className={styles.adminInfo}>
          <span className={styles.adminName}>{session.username}</span>
          <span className={styles.adminRole}>{session.role}</span>
        </span>
      </span>
      <button type="button" className={styles.action} onClick={signOut}>
        <LogOut size={13} strokeWidth={1.8} />
        Sign out
      </button>
    </>
  );
}
