import {
  LayoutGrid,
  Inbox,
  Building2,
  BookOpen,
  Settings,
  BrainCircuit,
  GraduationCap,
  ClipboardList,
} from "lucide-react";
import DashboardGate from "@/components/dashboard/DashboardGate";
import DashboardShell from "@/components/dashboard-shell/DashboardShell";
import TeamNavActions from "@/components/dashboard-shell/TeamNavActions";
import { DemoRequestsProvider } from "@/components/dashboard/DemoRequestsProvider";
import DemoRequestsBadge from "@/components/dashboard/DemoRequestsBadge";

const ICON = { size: 16, strokeWidth: 1.8 };

const NAV_ITEMS = [
  { label: "Overview",          href: "/dashboard",                    icon: <LayoutGrid  {...ICON} /> },
  { label: "Inbox",             href: "/dashboard/inbox",              icon: <Inbox       {...ICON} />, badge: <DemoRequestsBadge /> },
  { label: "Clients",           href: "/dashboard/clients",            icon: <Building2   {...ICON} /> },
  { label: "Courses",           href: "/dashboard/courses",            icon: <BookOpen    {...ICON} /> },
  { label: "Training Pipeline", href: "/dashboard/training-pipeline",  icon: <BrainCircuit   {...ICON} /> },
  { label: "LMS",               href: "/dashboard/lms",               icon: <GraduationCap  {...ICON} /> },
  { label: "My Training",       href: "/dashboard/my-training",       icon: <ClipboardList  {...ICON} /> },
];

const NAV_FOOTER = [
  { label: "Settings", href: "/dashboard/settings", icon: <Settings {...ICON} /> },
];

const CONTEXT = {
  label: "Internal · back-office",
  initials: "NC",
  brandHref: "/dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardGate>
      <DemoRequestsProvider>
        <DashboardShell
          context={CONTEXT}
          navItems={NAV_ITEMS}
          navFooterItems={NAV_FOOTER}
          rightSlot={<TeamNavActions />}
        >
          {children}
        </DashboardShell>
      </DemoRequestsProvider>
    </DashboardGate>
  );
}
