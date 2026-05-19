import Link from "next/link";
import { ArrowLeft, Upload } from "lucide-react";
import Container from "@/components/ui/Container";
import styles from "./page.module.css";

export const metadata = {
  title: "Demo request · NextCard",
};

export default function DemoDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <Container as="section" className={styles.page}>
      <Link href="/dashboard" className={styles.back}>
        <ArrowLeft size={13} strokeWidth={2} />
        Back to dashboard
      </Link>

      <div className={styles.eyebrow}>Demo request #{params.id}</div>
      <h1 className={styles.title}>Full details</h1>
      <p className={styles.sub}>
        Everything you need to close the loop on this request — contact info,
        documents, status, timeline, and the &ldquo;Generate course&rdquo; pipeline.
      </p>

      <div className={styles.comingCard}>
        <div className={styles.comingIcon}>
          <Upload size={22} strokeWidth={1.8} />
        </div>
        <div className={styles.comingTitle}>Coming next</div>
        <p style={{ fontSize: 13, color: "var(--ink-3)", margin: 0 }}>
          This page will hold the full workspace for a single demo request.
        </p>
        <ul className={styles.comingList}>
          <li>Drag-drop upload zone for role descriptions and risk-exposure docs</li>
          <li>&ldquo;Send upload link to client&rdquo; — secure one-time link to share via email</li>
          <li>List of uploaded files with previews and remove actions</li>
          <li>Status timeline (New → Contacted → Booked → Generated)</li>
          <li>Team notes (&ldquo;Salim spoke to client on 6 May&rdquo;)</li>
          <li>&ldquo;Generate course&rdquo; — kicks off AMLR-aligned program generation from uploaded docs</li>
        </ul>
      </div>
    </Container>
  );
}
