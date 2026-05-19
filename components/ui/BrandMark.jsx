import Link from 'next/link';
import styles from './BrandMark.module.css';

const Logo = (p) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" {...p}>
    <rect x="3" y="4" width="13" height="17" rx="2.5" opacity="0.4" />
    <rect x="8" y="3" width="13" height="17" rx="2.5" />
  </svg>
);

export default function BrandMark({ href = '/', className = '' }) {
  return (
    <Link href={href} className={`${styles.brand} ${className}`.trim()}>
      <span className={styles.mark} aria-hidden="true"><Logo /></span>
      NextCard
    </Link>
  );
}
