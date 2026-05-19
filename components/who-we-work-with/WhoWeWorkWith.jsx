import Container from "@/components/ui/Container";
import styles from "./WhoWeWorkWith.module.css";

const SWEDISH_BRANDS = [
  "Swedbank",
  "SEB",
  "Handelsbanken",
  "Nordea",
  "Svea Bank",
  "Klarna",
  "Avanza",
  "Resurs Bank",
  "Länsförsäkringar",
  "ICA Banken",
];

function MarqueeRow() {
  return (
    <>
      {SWEDISH_BRANDS.map((name, i) => (
        <span key={`${name}-${i}`} className={styles.marqueeItem}>
          {name}
          <span className={styles.marqueeDot} aria-hidden="true" />
        </span>
      ))}
    </>
  );
}

export default function WhoWeWorkWith() {
  return (
    <section className={styles.section} id="customers">
      <Container>
        <div className={styles.card}>
          <div className={styles.top}>
            <div className={styles.label}>
              <span className={styles.bullet} aria-hidden="true" />
              Who we work with
            </div>
            <p className={styles.copy}>
              We work with ambitious B2B tech companies whose ambition is ahead
              of how the market reads them — and where that gap is becoming
              commercial.
            </p>
          </div>

          <div className={styles.clientsHead}>OUR CLIENTS</div>

          <div className={styles.marquee}>
            <div className={styles.marqueeTrack}>
              <MarqueeRow />
              <MarqueeRow />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
