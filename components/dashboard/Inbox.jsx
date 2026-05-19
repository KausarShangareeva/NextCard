"use client";

import { useState } from "react";
import { useDemoRequests } from "./DemoRequestsProvider";
import { useCourseRequests } from "@/components/course-requests/CourseRequestsProvider";
import DemoRequestsList from "./DemoRequestsList";
import CourseRequestsList from "./CourseRequestsList";
import styles from "./Inbox.module.css";

const TABS = [
  { value: "demos",   label: "Demo requests"   },
  { value: "courses", label: "Course requests" },
];

export default function Inbox() {
  const [active, setActive] = useState("demos");
  const { newRequests }   = useDemoRequests();
  const { pending }       = useCourseRequests();

  const counts = {
    demos:   newRequests.length,
    courses: pending.length,
  };

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <div className={styles.eyebrow}>Team workspace</div>
        <h1 className={styles.title}>Inbox</h1>
        <p className={styles.sub}>
          Everything that needs a human eye — first-contact demo requests
          and existing-customer course requests in one queue.
        </p>
      </header>

      <div className={styles.tabs}>
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setActive(t.value)}
            className={`${styles.tab} ${
              active === t.value ? styles.tabActive : ""
            }`.trim()}
          >
            {t.label}
            {counts[t.value] > 0 && (
              <span className={styles.tabCount}>{counts[t.value]}</span>
            )}
          </button>
        ))}
      </div>

      {active === "demos" ? <DemoRequestsList /> : <CourseRequestsList />}
    </div>
  );
}
