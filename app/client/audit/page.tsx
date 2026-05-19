import ComingSoon from "@/components/dashboard-shell/ComingSoon";

export const metadata = { title: "Audit log · Client portal · NextCard" };

export default function ClientAuditPage() {
  return (
    <ComingSoon
      eyebrow="Workspace"
      title="Audit log"
      sub="Tamper-evident record of every compliance-relevant action across your workspace."
      bullets={[
        "Filter by actor, role, module, AMLR article",
        "Date-range exports as PDF for regulators",
        "Hash-chained entries — provable to auditors",
        "Webhook firehose to your SIEM",
        "Retention policy aligned with AMLR 2024/1624 record-keeping rules",
      ]}
    />
  );
}
