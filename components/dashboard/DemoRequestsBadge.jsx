"use client";

import { useDemoRequests } from "./DemoRequestsProvider";

export default function DemoRequestsBadge() {
  const { newRequests } = useDemoRequests();
  if (newRequests.length === 0) return null;
  return <>{newRequests.length}</>;
}
