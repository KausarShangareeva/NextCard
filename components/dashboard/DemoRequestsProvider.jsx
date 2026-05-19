"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { INITIAL_DEMO_REQUESTS } from "./demoRequestsData";

const DemoRequestsContext = createContext({
  requests: [],
  newRequests: [],
  updateStatus: () => {},
  getById: () => undefined,
});

export function DemoRequestsProvider({ children }) {
  const [requests, setRequests] = useState(INITIAL_DEMO_REQUESTS);

  const updateStatus = useCallback((id, status) => {
    setRequests((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
  }, []);

  const getById = useCallback(
    (id) => requests.find((r) => r.id === Number(id)),
    [requests]
  );

  const newRequests = useMemo(
    () => requests.filter((r) => r.status === "new"),
    [requests]
  );

  const value = useMemo(
    () => ({ requests, newRequests, updateStatus, getById }),
    [requests, newRequests, updateStatus, getById]
  );

  return (
    <DemoRequestsContext.Provider value={value}>
      {children}
    </DemoRequestsContext.Provider>
  );
}

export function useDemoRequests() {
  return useContext(DemoRequestsContext);
}
