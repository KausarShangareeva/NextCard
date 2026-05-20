"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  INITIAL_COURSE_REQUESTS,
  IN_PRODUCTION_STATUSES,
} from "./courseRequestsData";

const STORAGE_KEY = "nextcard_course_requests";

const CourseRequestsContext = createContext({
  requests: [],
  pending: [],
  inProduction: [],
  done: [],
  addRequest: () => {},
  updateStatus: () => {},
  getById: () => undefined,
});

export function CourseRequestsProvider({ children }) {
  const [requests, setRequests] = useState(INITIAL_COURSE_REQUESTS);
  const hydrated = useRef(false);

  // Hydrate from localStorage on mount so requests survive page reloads
  // and hard navigations between /client/* and /dashboard/*.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setRequests(parsed);
      }
    } catch {}
    hydrated.current = true;
  }, []);

  // Persist after each change — skip the first effect pass so we don't
  // overwrite stored data with the initial seed before hydration finishes.
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    } catch {}
  }, [requests]);

  const addRequest = useCallback((data) => {
    setRequests((rs) => [
      {
        id: Date.now(),
        submittedAt: "just now",
        status: "pending",
        assignee: null,
        cost: null,
        files: [],
        regulatoryScope: [],
        ...data,
      },
      ...rs,
    ]);
  }, []);

  const updateStatus = useCallback((id, status, extras = {}) => {
    setRequests((rs) =>
      rs.map((r) => (r.id === id ? { ...r, status, ...extras } : r))
    );
  }, []);

  const getById = useCallback(
    (id) => requests.find((r) => r.id === Number(id)),
    [requests]
  );

  const pending = useMemo(
    () => requests.filter((r) => r.status === "pending"),
    [requests]
  );
  const inProduction = useMemo(
    () => requests.filter((r) => IN_PRODUCTION_STATUSES.includes(r.status)),
    [requests]
  );
  const done = useMemo(
    () => requests.filter((r) => r.status === "done"),
    [requests]
  );

  const value = useMemo(
    () => ({
      requests,
      pending,
      inProduction,
      done,
      addRequest,
      updateStatus,
      getById,
    }),
    [requests, pending, inProduction, done, addRequest, updateStatus, getById]
  );

  return (
    <CourseRequestsContext.Provider value={value}>
      {children}
    </CourseRequestsContext.Provider>
  );
}

export function useCourseRequests() {
  return useContext(CourseRequestsContext);
}
