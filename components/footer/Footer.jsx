import Link from 'next/link';
import { ExternalLink, Github, Linkedin } from 'lucide-react';
import styles from './Footer.module.css';

const Logo = (p) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" {...p}>
    <rect x="3" y="4" width="13" height="17" rx="2.5" opacity="0.4" />
    <rect x="8" y="3" width="13" height="17" rx="2.5" />
  </svg>
);

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#' },
      { label: 'Pricing', href: '#' },
      { label: 'FAQ', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
    ],
  },
];

const TEAM = [
  {
    name: 'Kausyar',
    role: 'Frontend',
    photo: '/team/kausyar.jpg',
    linkedin: 'https://www.linkedin.com/in/kausyar-s-312a8b27a/',
  },
  {
    name: 'Begimai',
    role: 'Backend',
    photo: '/team/begimai.jpg',
    linkedin: 'https://www.linkedin.com/in/begimai-satarova-725237200/',
  },
  {
    name: 'Salim',
    role: 'AI search',
    photo: '/team/salim.jpg',
    linkedin: 'https://www.linkedin.com/in/salim-s-319727252/',
  },
];

const REPO_URL = 'https://github.com/KausarShangareeva/NextCard';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandCol}>
          <Link href="/" className={styles.brand}>
            <div className={styles.brandMark}><Logo /></div>
            NextCard
          </Link>
          <p className={styles.tagline}>
            Turn dense docs into playful, bite-sized cards
            <br />
            you&apos;ll actually finish.
          </p>
        </div>

        <div className={styles.linksGrid}>
          {COLUMNS.map((col) => (
            <div key={col.title} className={styles.linkGroup}>
              <div className={styles.linkHead}>{col.title}</div>
              {col.links.map((l) => (
                <a key={l.label} href={l.href} className={styles.link}>
                  {l.label}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.team}>
        <div className={styles.teamLabel}>
          <span className={styles.teamDot} />
          Built by a team of three
        </div>

        <div className={styles.teamMembers}>
          {TEAM.map((m) => (
            <a
              key={m.name}
              href={m.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.member}
              aria-label={`${m.name} on LinkedIn`}
            >
              <div
                className={styles.avatar}
                style={{ '--photo': `url(${m.photo})` }}
                aria-hidden
              >
                <span className={styles.linkedinBadge} aria-hidden>
                  <Linkedin size={10} strokeWidth={1.5} fill="currentColor" />
                </span>
              </div>
              <div className={styles.memberInfo}>
                <div className={styles.memberName}>{m.name}</div>
                <div className={styles.memberRole}>{m.role}</div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.copy}>© {year} NextCard. All rights reserved.</div>
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.repoBtn}
        >
          <Github size={14} strokeWidth={1.8} />
          <span>View source</span>
          <ExternalLink size={11} strokeWidth={2.2} />
        </a>
      </div>
    </footer>
  );
}
