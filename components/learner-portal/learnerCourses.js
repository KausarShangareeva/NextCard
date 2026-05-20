import { planFor } from "@/components/dashboard-courses/builderData";

// Deterministic per-(role,module) progress so the demo feels real without a backend.
function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function progressFor(role, moduleId) {
  const h = hashStr(`${role}::${moduleId}`);
  return h % 101;
}

// Return the learner's quarterly plan with per-module progress.
export function planWithProgress(role) {
  return planFor(role).map((q) => ({
    ...q,
    modules: q.modules.map((m) => ({
      ...m,
      progress: progressFor(role, m.id),
    })),
  }));
}

// Flat list of modules for the role — used by the Overview stat cards.
export function modulesFor(role) {
  return planFor(role).flatMap((q) =>
    q.modules.map((m) => ({
      ...m,
      quarter: q.id,
      progress: progressFor(role, m.id),
    }))
  );
}
