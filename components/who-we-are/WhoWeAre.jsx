import Container from "@/components/ui/Container";
import styles from "./WhoWeAre.module.css";

const PlayIcon = () => (
  <svg
    className={styles.playIcon}
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M8 5v14l11-7z" />
  </svg>
);

const LogoMark = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <rect x="3" y="4" width="13" height="17" rx="2.5" opacity="0.4" />
    <rect x="8" y="3" width="13" height="17" rx="2.5" />
  </svg>
);

export default function WhoWeAre() {
  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.card}>
          <div className={styles.grid}>
            <div className={styles.left}>
              <div className={styles.label}>
                <span className={styles.bullet} aria-hidden="true" />
                Who we are
              </div>

              <div className={styles.videoCard}>
                <div className={styles.videoFrame}>
                  <button
                    type="button"
                    className={styles.playBtn}
                    aria-label="Play showreel"
                  >
                    <PlayIcon />
                  </button>
                  <span className={styles.videoCaption}>
                    Hi, we&apos;re NextCard
                  </span>
                </div>
                <div className={styles.videoFooter}>
                  <span className={styles.videoTitle}>NextCard Showreel</span>
                  <span className={styles.videoLogo}>
                    <LogoMark />
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.right}>
              <h2 className={styles.heading}>
                Most of our clients experience the same gap — between what
                they are and how they&apos;re perceived.
              </h2>
              <p className={styles.copy}>
                NextCard is a compliance-training platform for banks, fintech
                and real-estate firms at turning points — new licence,
                cross-border expansion, AMLR rollout, or a full risk
                reassessment. We&apos;ve seen what happens when training lags
                behind regulation. Regulators notice. Audits stall. Risk
                exposure grows.
              </p>
              <p className={styles.copy}>
                We close that gap by turning role definitions and risk
                exposure into AMLR-aligned learning programs — through
                clarity, role mapping, article coverage, evidence, and
                continuous reinforcement.
              </p>
              <a href="#" className={styles.aboutBtn}>
                About us
                <span className={styles.aboutWave} aria-hidden="true">👋</span>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
