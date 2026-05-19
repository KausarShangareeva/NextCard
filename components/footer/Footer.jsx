import { ExternalLink, Github, Linkedin } from 'lucide-react';
import BrandMark from '@/components/ui/BrandMark';
import BookDemoButton from '@/components/ui/BookDemoButton';
import Container from '@/components/ui/Container';
import styles from './Footer.module.css';

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#' },
      { label: 'Role library', href: '#' },
      { label: 'AMLR coverage', href: '#' },
      { label: 'Pricing', href: '#' },
    ],
  },
  {
    title: 'Compliance',
    links: [
      { label: 'Regulation map', href: '#' },
      { label: 'Risk domains', href: '#' },
      { label: 'Audit trail', href: '#' },
      { label: 'SOC 2 · ISO 27001', href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '#' },
      { label: 'AMLR explainers', href: '#' },
      { label: 'Webinars', href: '#' },
      { label: 'Changelog', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Customers', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '#contact' },
    ],
  },
];

const LEGAL = [
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
  { label: 'Security', href: '#' },
  { label: 'DPA', href: '#' },
];

const TEAM = [
  {
    name: 'Kausyar',
    initial: 'K',
    role: 'Frontend',
    photo: '/team/kausyar.jpg',
    linkedin: 'https://www.linkedin.com/in/kausyar-s-312a8b27a/',
  },
  {
    name: 'Begimai',
    initial: 'B',
    role: 'Backend',
    photo: '/team/begimai.jpg',
    linkedin: 'https://www.linkedin.com/in/begimai-satarova-725237200/',
  },
  {
    name: 'Salim',
    initial: 'S',
    role: 'AI search',
    photo: '/team/salim.jpg',
    linkedin: 'https://www.linkedin.com/in/salim-s-319727252/',
  },
  {
    name: 'Aakash',
    initial: 'A',
    role: 'AI Engineer',
    photo: '/team/aakash.jpg',
    linkedin: 'https://www.linkedin.com/in/aakash-doli-51424a228',
  },
  {
    name: 'Shansa',
    initial: 'Sh',
    role: 'Senior Dev',
    photo: '/team/shansa.jpg',
    linkedin: 'https://www.linkedin.com/in/shansa-akbar',
  },
];

const REPO_URL = 'https://github.com/KausarShangareeva/NextCard';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container>
        {/* ─── Top: brand + CTA card ─── */}
        <div className={styles.top}>
          <div className={styles.brandCol}>
            <BrandMark className={styles.brand} />
            <p className={styles.tagline}>
              Role-based, AMLR&nbsp;2024/1624-aligned compliance training,
              generated automatically for every employee.
            </p>
            <div className={styles.status}>
              <span className={styles.statusDot} aria-hidden="true" />
              184 AMLR articles mapped · last sync 6 May 2026
            </div>
          </div>

          <div className={styles.ctaCard}>
            <div className={styles.ctaEyebrow}>Ready to roll out?</div>
            <h3 className={styles.ctaTitle}>
              Get a 30-min demo with our compliance team.
            </h3>
            <BookDemoButton size="lg" />
          </div>
        </div>

        {/* ─── Link columns ─── */}
        <div className={styles.linksRow}>
          {COLUMNS.map((col) => (
            <div key={col.title} className={styles.linkGroup}>
              <div className={styles.linkHead}>{col.title}</div>
              <ul className={styles.linkList}>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className={styles.link}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.divider} />

        {/* ─── Built-by team strip ─── */}
        <div className={styles.team}>
          <div className={styles.teamLabel}>Built by</div>
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
                <span
                  className={styles.avatar}
                  style={{ '--photo': `url(${m.photo})` }}
                  aria-hidden="true"
                >
                  <span className={styles.avatarInitial}>{m.initial}</span>
                  <span className={styles.linkedinBadge} aria-hidden="true">
                    <Linkedin size={9} strokeWidth={1.5} fill="currentColor" />
                  </span>
                </span>
                <span className={styles.memberInfo}>
                  <span className={styles.memberName}>{m.name}</span>
                  <span className={styles.memberRole}>{m.role}</span>
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className={styles.divider} />

        {/* ─── Bottom row ─── */}
        <div className={styles.bottom}>
          <div className={styles.copy}>
            © {year} NextCard. All rights reserved.
          </div>

          <ul className={styles.legal}>
            {LEGAL.map((l) => (
              <li key={l.label}>
                <a href={l.href} className={styles.legalLink}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.repoBtn}
            aria-label="View source on GitHub"
          >
            <Github size={14} strokeWidth={1.8} />
            <span>Source</span>
            <ExternalLink size={11} strokeWidth={2.2} />
          </a>
        </div>
      </Container>
    </footer>
  );
}
