"use client";

import { useMemo, useState } from "react";
import {
  Shield,
  ScanLine,
  AlertTriangle,
  FileText,
  Users,
  Plus,
  Coins,
} from "lucide-react";
import { useCourseRequests } from "@/components/course-requests/CourseRequestsProvider";
import { STATUS_LABEL } from "@/components/course-requests/courseRequestsData";
import RequestCourseModal from "./RequestCourseModal";
import styles from "./ClientCourses.module.css";

const ICON = { size: 18, strokeWidth: 1.8 };

const PROGRAMS = [
  {
    id: "amlr-core",
    icon: <Shield {...ICON} />,
    name: "AMLR core",
    articles: "Art. 20 · 42 · 51 · 69 · +8",
    roles: "AML Officer, KYC Analyst, Branch Manager",
    completion: 94,
  },
  {
    id: "kyc",
    icon: <ScanLine {...ICON} />,
    name: "KYC & Customer Due Diligence",
    articles: "Art. 20 · 22 · 30",
    roles: "KYC Analyst, Customer Onboarding",
    completion: 88,
  },
  {
    id: "sanctions",
    icon: <AlertTriangle {...ICON} />,
    name: "Sanctions screening",
    articles: "Art. 51 · EU restrictive measures",
    roles: "AML Officer, Branch Manager, Risk Officer",
    completion: 91,
  },
  {
    id: "sar",
    icon: <FileText {...ICON} />,
    name: "SAR documentation",
    articles: "Art. 69 · 70",
    roles: "AML Officer, Compliance Lead",
    completion: 97,
  },
  {
    id: "bo",
    icon: <Users {...ICON} />,
    name: "Beneficial ownership",
    articles: "Art. 42 · 45",
    roles: "KYC Analyst, Customer Onboarding",
    completion: 100,
  },
  {
    id: "crypto",
    icon: <Coins {...ICON} />,
    name: "Crypto compliance",
    articles: "Art. 20 · MiCAR Art. 38",
    roles: "Crypto Compliance Officer · awaiting course",
    completion: 0,
  },
];

const STATUS_PILL = {
  pending:       "statusPending",
  approved:      "statusApproved",
  "in-progress": "statusInProgress",
  done:          "statusDone",
};

export default function ClientCourses() {
  const { requests, addRequest } = useCourseRequests();
  const [isOpen, setIsOpen] = useState(false);

  // For demo: show only requests from "Swedbank" (this client portal)
  const myRequests = useMemo(
    () => requests.filter((r) => r.client === "Swedbank"),
    [requests]
  );

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <div className={styles.headLeft}>
          <div className={styles.eyebrow}>Workspace</div>
          <h1 className={styles.title}>Compliance programs</h1>
          <p className={styles.sub}>
            {PROGRAMS.length} programs assigned to your 6 role profiles.
            Missing something? Request a new course tailored to a specific
            role — our compliance team builds it from your documents.
          </p>
        </div>
        <button
          type="button"
          className={styles.requestBtn}
          onClick={() => setIsOpen(true)}
        >
          <Plus size={14} strokeWidth={2.2} />
          Request new course
        </button>
      </header>

      {myRequests.length > 0 && (
        <section className={styles.pendingPanel}>
          <header className={styles.pendingHead}>
            <div className={styles.pendingTitle}>
              <span className={styles.pendingDot} aria-hidden="true" />
              Your course requests
            </div>
            <span className={styles.pendingMeta}>
              {myRequests.length} total
            </span>
          </header>
          <div className={styles.pendingList}>
            {myRequests.map((r) => (
              <div key={r.id} className={styles.pendingItem}>
                <span className={styles.pendingRole}>{r.role}</span>
                <span
                  className={`${styles.pendingStatus} ${styles[STATUS_PILL[r.status]]}`}
                >
                  <span className={styles.pendingStatusDot} aria-hidden="true" />
                  {STATUS_LABEL[r.status]}
                </span>
                <span className={styles.pendingTime}>{r.submittedAt}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <header className={styles.gridHead}>
        <h2 className={styles.gridTitle}>Active programs</h2>
        <span className={styles.gridMeta}>
          {PROGRAMS.length} programs · 1,250 seats
        </span>
      </header>

      <div className={styles.grid}>
        {PROGRAMS.map((p) => (
          <article key={p.id} className={styles.card}>
            <div className={styles.cardTop}>
              <div className={styles.cardIcon}>{p.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 className={styles.cardName}>{p.name}</h3>
                <div className={styles.cardArticles}>{p.articles}</div>
              </div>
            </div>

            <div className={styles.cardRoles}>
              <div className={styles.cardRolesLabel}>Assigned roles</div>
              {p.roles}
            </div>

            <div className={styles.cardFoot}>
              <div className={styles.cardFootTop}>
                <span className={styles.cardFootLabel}>
                  {p.completion === 0 ? "Status" : "Avg completion"}
                </span>
                <span className={styles.cardFootValue}>
                  {p.completion === 0 ? "Pending" : `${p.completion}%`}
                </span>
              </div>
              <div className={styles.cardBar}>
                <div
                  className={`${styles.cardBarFill} ${
                    p.completion === 100 ? styles.cardBarFillDone : ""
                  }`.trim()}
                  style={{ width: `${Math.max(p.completion, 4)}%` }}
                />
              </div>
            </div>
          </article>
        ))}
      </div>

      <RequestCourseModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={(data) =>
          addRequest({
            client: "Swedbank",
            clientCountryCode: "se",
            requestedBy: "Linnéa Andersson",
            requestedByEmail: "linnea@swedbank.se",
            ...data,
          })
        }
      />
    </div>
  );
}
