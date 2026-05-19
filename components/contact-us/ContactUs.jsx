import Container from "@/components/ui/Container";
import ContactForm from "@/components/contact-form/ContactForm";
import styles from "./ContactUs.module.css";

export default function ContactUs() {
  return (
    <section className={styles.section} id="contact">
      <Container>
        <div className={styles.topGrid}>
          <div className={styles.label}>
            <span className={styles.bullet} aria-hidden="true" />
            Contact us
          </div>
          <h2 className={styles.headline}>
            The right partner at the right moment changes everything.
          </h2>
        </div>

        <div className={styles.card}>
          <div className={styles.leftCol}>
            <div>
              <div className={styles.startPill}>Start a conversation</div>
              <h3 className={styles.cardHeading}>
                Tell us about your next stage.
              </h3>
            </div>
          </div>

          <ContactForm idPrefix="contact" submitLabel="Submit" />
        </div>
      </Container>
    </section>
  );
}
