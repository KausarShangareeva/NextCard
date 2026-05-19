import ComingSoon from "@/components/dashboard-shell/ComingSoon";

export const metadata = { title: "Reports · Client portal · NextCard" };

export default function ClientReportsPage() {
  return (
    <ComingSoon
      eyebrow="Workspace"
      title="Reports"
      sub="Compliance posture in numbers — for your board, your auditors, and the regulator."
      bullets={[
        "Quarterly compliance dashboard (PDF, ready for board pack)",
        "Per-role completion heatmap",
        "AMLR article coverage trend over time",
        "Risk-domain breakdown (AML · Sanctions · Fraud · Documentation)",
        "Auditor-ready evidence bundle (1 click export)",
      ]}
    />
  );
}
