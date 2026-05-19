import ComingSoon from "@/components/dashboard-shell/ComingSoon";

export const metadata = { title: "Courses · Client portal · NextCard" };

export default function ClientCoursesPage() {
  return (
    <ComingSoon
      eyebrow="Workspace"
      title="Courses"
      sub="All compliance programs assigned to your roles, with deep-dive analytics."
      bullets={[
        "Programs grouped by role: AML Officer, KYC Analyst, Branch Manager…",
        "Module-level completion analytics",
        "AMLR article ↔ module coverage map",
        "Re-certification reminders before regulatory deadlines",
        "Custom assignments outside of role-based defaults",
      ]}
    />
  );
}
