import ComingSoon from "@/components/dashboard-shell/ComingSoon";

export const metadata = { title: "Documents · Client portal · NextCard" };

export default function ClientDocumentsPage() {
  return (
    <ComingSoon
      eyebrow="Workspace"
      title="Documents"
      sub="Source-of-truth files we use to generate your training programs."
      bullets={[
        "Drag-drop upload zone (role descriptions, risk-exposure docs, policies)",
        "Files grouped by category: HR · Compliance · Risk · Legal",
        "Version history with diff view",
        "Re-trigger course generation when a key document changes",
        "Secure sharing link for auditors with expiry",
      ]}
    />
  );
}
