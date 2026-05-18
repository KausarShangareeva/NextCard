'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navigation.module.css';

const I = {
  ArrowUR: (p) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  ),
  Plus: (p) => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  Logo: (p) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" {...p}>
      <rect x="3" y="4" width="13" height="17" rx="2.5" opacity="0.4" />
      <rect x="8" y="3" width="13" height="17" rx="2.5" />
    </svg>
  ),
};

export default function Navigation() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.brand}>
        <div className={styles.brandMark}><I.Logo /></div>
        NextCard
      </Link>

      <div className={styles.navMid}>
        <Link
          href="/"
          className={`${styles.navLink} ${isHome ? styles.navLinkActive : ''}`}
        >
          Home
        </Link>
        <a href="#" className={styles.navLink}>For learners <I.Plus /></a>
        <a href="#" className={styles.navLink}>For teams <I.Plus /></a>
      </div>

      <button className={styles.navCta}>Let&apos;s Talk <I.ArrowUR /></button>
    </nav>
  );
}
