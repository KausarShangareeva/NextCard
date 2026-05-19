"use client";

import { ArrowUpRight } from "lucide-react";
import { useDemoModal } from "@/components/demo-modal/DemoModalProvider";
import styles from "./BookDemoButton.module.css";

const ICON_SIZE = { md: 13, lg: 15 };

export default function BookDemoButton({
  label = "Book a demo",
  size = "md",
  variant,
  className = "",
  ...rest
}) {
  const { openDemo } = useDemoModal();
  const sizeClass = styles[`size_${size}`] ?? styles.size_md;
  const variantClass = variant ? styles[`variant_${variant}`] ?? "" : "";
  const iconSize = ICON_SIZE[size] ?? ICON_SIZE.md;

  return (
    <button
      type="button"
      onClick={openDemo}
      className={`${styles.btn} ${sizeClass} ${variantClass} ${className}`.trim()}
      {...rest}
    >
      {label}
      <span className={styles.iconCircle} aria-hidden="true">
        <ArrowUpRight size={iconSize} strokeWidth={2.4} />
      </span>
    </button>
  );
}
