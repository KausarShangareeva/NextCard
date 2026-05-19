'use client';

import BrandMark from '@/components/ui/BrandMark';
import BookDemoButton from '@/components/ui/BookDemoButton';
import Container from '@/components/ui/Container';
import styles from './Navigation.module.css';

const I = {
  Caret: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 5v14M5 12l7 7 7-7" />
    </svg>
  ),
  Menu: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  ),
};

const NAV_LINKS = [
  { label: 'Product',    hasCaret: true,  href: '#' },
  { label: 'Solutions',  hasCaret: true,  href: '#' },
  { label: 'Compliance', hasCaret: true,  href: '#' },
  { label: 'Resources',  hasCaret: true,  href: '#' },
  { label: 'Pricing',    hasCaret: false, href: '#' },
];

export default function Navigation() {
  return (
    <nav className={styles.nav}>
      <Container className={styles.inner}>
        <BrandMark />

        <div className={styles.navMid}>
          {NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href} className={styles.navLink}>
              {link.label}
              {link.hasCaret && <I.Caret width={10} height={10} className={styles.caret} />}
            </a>
          ))}
        </div>

        <div className={styles.navRight}>
          <button className={styles.iconBtn} aria-label="Menu">
            <I.Menu width={16} height={16} />
          </button>
          <BookDemoButton size="md" />
        </div>
      </Container>
    </nav>
  );
}
