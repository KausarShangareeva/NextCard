"use client";

import { useDemoModal } from "@/components/demo-modal/DemoModalProvider";
import styles from "./BookDemoButton.module.css";

export default function BookDemoButton({
  label = "Book a demo",
  size = "md",
  className = "",
  ...rest
}) {
  const { openDemo } = useDemoModal();
  const sizeClass = styles[`size_${size}`] ?? styles.size_md;

  return (
    <button
      type="button"
      onClick={openDemo}
      className={`${styles.btn} ${sizeClass} ${className}`.trim()}
      {...rest}
    >
      {label}
      <span className={styles.wave} aria-hidden="true">👋</span>
    </button>
  );
}
