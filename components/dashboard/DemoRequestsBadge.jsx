"use client";

import { useDemoRequests } from "./DemoRequestsProvider";
import { useCourseRequests } from "@/components/course-requests/CourseRequestsProvider";

// Combined badge for the Inbox sidebar item — counts pending demo
// requests + pending course requests.
export default function DemoRequestsBadge() {
  const { newRequests } = useDemoRequests();
  const { pending }     = useCourseRequests();
  const total = newRequests.length + pending.length;
  if (total === 0) return null;
  return <>{total}</>;
}
