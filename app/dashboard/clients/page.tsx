import ComingSoon from "@/components/dashboard-shell/ComingSoon";

export const metadata = { title: "Clients · NextCard" };

export default function DashboardClientsPage() {
  return (
    <ComingSoon
      eyebrow="Team workspace"
      title="Clients"
      sub="Active accounts with deployed programs. Drill into each to see seats, coverage and renewal status."
      bullets={[
        "Account health score (coverage trend, last activity, support tickets)",
        "Seat utilisation per client",
        "Renewal calendar with auto-reminders",
        "Notes & meeting history per account",
        "Per-client AMLR article coverage gap analysis",
      ]}
    />
  );
}
