"use client";

import { LogOut } from "lucide-react";
import { useTeamAuth } from "@/components/dashboard/DashboardGate";
import styles from "./DashboardShell.module.css";

export default function TeamNavActions() {
  const { user, signOut } = useTeamAuth();

  return (
    <>
      {user && (
        <span className={styles.adminPill}>
          <span className={styles.adminAv}>{user.name?.[0] ?? "?"}</span>
          <span className={styles.adminInfo}>
            <span className={styles.adminName}>{user.name}</span>
            <span className={styles.adminRole}>{user.role}</span>
          </span>
        </span>
      )}
      <button type="button" className={styles.action} onClick={signOut}>
        <LogOut size={13} strokeWidth={1.8} />
        Sign out
      </button>
    </>
  );
}
