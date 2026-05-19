"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import DemoModal from "./DemoModal";

const DemoModalContext = createContext({
  open: false,
  openDemo: () => {},
  closeDemo: () => {},
});

export function DemoModalProvider({ children }) {
  const [open, setOpen] = useState(false);

  const openDemo = useCallback(() => setOpen(true), []);
  const closeDemo = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <DemoModalContext.Provider value={{ open, openDemo, closeDemo }}>
      {children}
      <DemoModal />
    </DemoModalContext.Provider>
  );
}

export function useDemoModal() {
  return useContext(DemoModalContext);
}
