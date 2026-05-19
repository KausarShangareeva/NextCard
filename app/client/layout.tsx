import {
  LayoutGrid,
  Users,
  BookOpen,
  FileText,
  ShieldCheck,
  BarChart3,
  Settings,
} from "lucide-react";
import DashboardShell from "@/components/dashboard-shell/DashboardShell";
import ClientNavActions from "@/components/dashboard-shell/ClientNavActions";

const ICON = { size: 16, strokeWidth: 1.8 };

const NAV_ITEMS = [
  { label: "Overview",   href: "/client",           icon: <LayoutGrid  {...ICON} /> },
  { label: "Employees",  href: "/client/employees", icon: <Users       {...ICON} />, badge: 1250 },
  { label: "Courses",    href: "/client/courses",   icon: <BookOpen    {...ICON} /> },
  { label: "Documents",  href: "/client/documents", icon: <FileText    {...ICON} /> },
  { label: "Audit log",  href: "/client/audit",     icon: <ShieldCheck {...ICON} /> },
  { label: "Reports",    href: "/client/reports",   icon: <BarChart3   {...ICON} /> },
];

const NAV_FOOTER = [
  { label: "Settings", href: "/client/settings", icon: <Settings {...ICON} /> },
];

const CONTEXT = {
  label: "Swedbank · Compliance portal",
  initials: "SB",
  brandHref: "/client",
};

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell
      context={CONTEXT}
      navItems={NAV_ITEMS}
      navFooterItems={NAV_FOOTER}
      rightSlot={<ClientNavActions />}
    >
      {children}
    </DashboardShell>
  );
}
