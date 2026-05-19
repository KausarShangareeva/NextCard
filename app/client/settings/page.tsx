import ComingSoon from "@/components/dashboard-shell/ComingSoon";

export const metadata = { title: "Settings · Client portal · NextCard" };

export default function ClientSettingsPage() {
  return (
    <ComingSoon
      eyebrow="Workspace"
      title="Settings"
      sub="Workspace configuration for your organisation."
      bullets={[
        "Admins & permissions (Compliance Officer · Reviewer · Read-only)",
        "SSO via Azure AD / Okta / Google Workspace",
        "HRIS sync (BambooHR / Personio / Workday) to auto-onboard new hires",
        "Notification rules (Slack / email / Teams)",
        "Data residency and retention preferences",
      ]}
    />
  );
}
