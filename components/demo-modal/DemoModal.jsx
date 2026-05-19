"use client";

import { useEffect } from "react";
import { useDemoModal } from "./DemoModalProvider";
import ContactForm from "@/components/contact-form/ContactForm";
import styles from "./DemoModal.module.css";

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

export default function DemoModal() {
  const { open, closeDemo } = useDemoModal();

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeDemo();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeDemo]);

  if (!open) return null;

  return (
    <div
      className={styles.backdrop}
      onClick={closeDemo}
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-modal-title"
    >
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={closeDemo}
          aria-label="Close"
        >
          <CloseIcon />
        </button>

        <div className={styles.header}>
          <span className={styles.eyebrow}>
            <span className={styles.eyebrowDot} aria-hidden="true" />
            Book a demo
          </span>
          <h2 id="demo-modal-title" className={styles.heading}>
            Tell us about your next stage.
          </h2>
          <p className={styles.sub}>
            30-minute walkthrough · we&apos;ll reply within 24 hours.
          </p>
        </div>

        <ContactForm
          idPrefix="demo"
          submitLabel="Book a demo"
          onSuccess={closeDemo}
        />
      </div>
    </div>
  );
}
