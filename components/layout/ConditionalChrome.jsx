"use client";

import { usePathname } from "next/navigation";
import Navigation from "@/components/navigation/Navigation";
import Footer from "@/components/footer/Footer";

const APP_ROUTE_PREFIXES = ["/dashboard", "/client", "/learner"];

export default function ConditionalChrome({ children }) {
  const pathname = usePathname() ?? "/";
  const isAppRoute = APP_ROUTE_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  if (isAppRoute) return <>{children}</>;

  return (
    <>
      <Navigation />
      <main>{children}</main>
      <Footer />
    </>
  );
}
