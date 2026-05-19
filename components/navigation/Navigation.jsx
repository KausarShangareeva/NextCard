"use client";

import BrandMark from "@/components/ui/BrandMark";
import BookDemoButton from "@/components/ui/BookDemoButton";
import { useSignInModal } from "@/components/signin-modal/SignInModalProvider";
import styles from "./Navigation.module.css";

const I = {
  SignIn: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
  ),
  Menu: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      {...p}
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  ),
};

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Customers", href: "#customers" },
  { label: "Contact", href: "#contact" },
];

export default function Navigation() {
  const { openSignIn } = useSignInModal();

  return (
    <nav className={styles.nav}>
      <div className={styles.pill}>
        <div className={styles.navLeft}>
          <BrandMark />
        </div>

        <div className={styles.navMid}>
          {NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href} className={styles.navLink}>
              {link.label}
            </a>
          ))}
        </div>

        <div className={styles.navRight}>
          <button type="button" onClick={openSignIn} className={styles.signIn}>
            <I.SignIn width={15} height={15} />
            Sign In
          </button>
          <BookDemoButton
            size="md"
            label="Book Demo"
            variant="dark"
            className={styles.bookBtn}
          />
          <button
            type="button"
            className={styles.iconBtn}
            aria-label="Menu"
          >
            <I.Menu width={18} height={18} />
          </button>
        </div>
      </div>
    </nav>
  );
}
