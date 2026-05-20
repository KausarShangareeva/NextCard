import { LayoutGrid, BookOpen } from "lucide-react";
import DashboardShell from "@/components/dashboard-shell/DashboardShell";
import LearnerGate from "@/components/learner-portal/LearnerGate";
import LearnerNavActions from "@/components/learner-portal/LearnerNavActions";

const ICON = { size: 16, strokeWidth: 1.8 };

const NAV_ITEMS = [
  { label: "Overview",   href: "/learner",         icon: <LayoutGrid {...ICON} /> },
  { label: "My courses", href: "/learner/courses", icon: <BookOpen   {...ICON} /> },
];

const CONTEXT = {
  label: "Learner portal",
  initials: "L",
  brandHref: "/learner",
};

export default function LearnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LearnerGate>
      <DashboardShell
        context={CONTEXT}
        navItems={NAV_ITEMS}
        rightSlot={<LearnerNavActions />}
      >
        {children}
      </DashboardShell>
    </LearnerGate>
  );
}
