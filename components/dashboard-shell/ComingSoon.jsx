import { Sparkles } from "lucide-react";
import styles from "./ComingSoon.module.css";

/**
 * @param {{
 *   eyebrow?: string,
 *   title: string,
 *   sub?: string,
 *   bullets?: string[],
 * }} props
 */
export default function ComingSoon({ eyebrow, title, sub, bullets = [] }) {
  return (
    <div className={styles.page}>
      <header className={styles.head}>
        {eyebrow && <div className={styles.eyebrow}>{eyebrow}</div>}
        <h1 className={styles.title}>{title}</h1>
        {sub && <p className={styles.sub}>{sub}</p>}
      </header>

      <div className={styles.card}>
        <div className={styles.icon}>
          <Sparkles size={20} strokeWidth={1.8} />
        </div>
        <div className={styles.cardTitle}>Coming next</div>
        {bullets.length > 0 && (
          <ul className={styles.list}>
            {bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
