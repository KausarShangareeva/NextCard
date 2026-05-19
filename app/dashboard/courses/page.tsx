import ComingSoon from "@/components/dashboard-shell/ComingSoon";

export const metadata = { title: "Courses · NextCard" };

export default function DashboardCoursesPage() {
  return (
    <ComingSoon
      eyebrow="Team workspace"
      title="Courses"
      sub="The course-generation pipeline and library. Quality review happens here before programs ship to clients."
      bullets={[
        "Generation queue with live status (parsing docs · drafting modules · review)",
        "Course templates and reusable AMLR module library",
        "Internal QA review workflow before publishing to client",
        "Versioning and changelog per course",
        "Export to LMS / SCORM / xAPI",
      ]}
    />
  );
}
