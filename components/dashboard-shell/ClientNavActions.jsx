"use client";

import { Bell } from "lucide-react";
import styles from "./DashboardShell.module.css";

export default function ClientNavActions() {
  return (
    <>
      <button type="button" className={styles.action} aria-label="Notifications">
        <Bell size={14} strokeWidth={1.8} />
      </button>
      <span className={styles.adminPill}>
        <span className={styles.adminAv}>LA</span>
        <span className={styles.adminInfo}>
          <span className={styles.adminName}>Linnéa Andersson</span>
          <span className={styles.adminRole}>Compliance Officer · Admin</span>
        </span>
      </span>
    </>
  );
}
