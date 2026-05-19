import ComingSoon from "@/components/dashboard-shell/ComingSoon";

export const metadata = { title: "Settings · NextCard" };

export default function DashboardSettingsPage() {
  return (
    <ComingSoon
      eyebrow="Team workspace"
      title="Settings"
      sub="Workspace-level configuration for the NextCard team."
      bullets={[
        "Team members & roles (invite, suspend, change permissions)",
        "Auth provider (Clerk / Supabase / Auth0)",
        "API keys for the course-generation pipeline",
        "Slack / email notification rules",
        "Audit log of internal actions",
      ]}
    />
  );
}
