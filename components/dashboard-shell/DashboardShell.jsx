"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandMark from "@/components/ui/BrandMark";
import styles from "./DashboardShell.module.css";

/**
 * @typedef {{ label: string, href: string, icon?: React.ReactNode, badge?: React.ReactNode }} NavItem
 *
 * @param {{
 *   context?: { label?: string, initials?: string, brandHref?: string },
 *   navItems?: NavItem[],
 *   navFooterItems?: NavItem[],
 *   rightSlot?: React.ReactNode,
 *   children?: React.ReactNode,
 * }} props
 */
export default function DashboardShell({
  context,
  navItems = [],
  navFooterItems = [],
  rightSlot = null,
  children,
}) {
  const pathname = usePathname() ?? "";

  const isActive = (href) => {
    if (href === "/dashboard" || href === "/client") return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const renderItem = (item) => (
    <Link
      key={item.href}
      href={item.href}
      className={`${styles.sidebarItem} ${
        isActive(item.href) ? styles.sidebarItemActive : ""
      }`.trim()}
      aria-current={isActive(item.href) ? "page" : undefined}
    >
      <span className={styles.sidebarIcon} aria-hidden="true">
        {item.icon}
      </span>
      <span>{item.label}</span>
      {item.badge != null && (
        <span className={styles.sidebarBadge}>{item.badge}</span>
      )}
    </Link>
  );

  return (
    <div className={styles.shell}>
      <header className={styles.nav}>
        <div className={styles.navLeft}>
          <BrandMark href={context?.brandHref ?? "/dashboard"} />
          {context?.label && (
            <span className={styles.navContext}>
              <span className={styles.navContextIc}>{context.initials}</span>
              {context.label}
            </span>
          )}
        </div>
        <div className={styles.navRight}>{rightSlot}</div>
      </header>

      <div className={styles.body}>
        <aside className={styles.sidebar} aria-label="Section navigation">
          <div className={styles.sidebarSection}>
            <div className={styles.sidebarLabel}>Workspace</div>
            {navItems.map(renderItem)}
          </div>

          {navFooterItems.length > 0 && (
            <div className={`${styles.sidebarSection} ${styles.sidebarFooter}`}>
              {navFooterItems.map(renderItem)}
            </div>
          )}
        </aside>

        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
