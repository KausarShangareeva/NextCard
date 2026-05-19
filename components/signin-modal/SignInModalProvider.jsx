"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import SignInModal from "./SignInModal";

const SignInModalContext = createContext({
  open: false,
  openSignIn: () => {},
  closeSignIn: () => {},
});

export function SignInModalProvider({ children }) {
  const [open, setOpen] = useState(false);

  const openSignIn = useCallback(() => setOpen(true), []);
  const closeSignIn = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <SignInModalContext.Provider value={{ open, openSignIn, closeSignIn }}>
      {children}
      <SignInModal />
    </SignInModalContext.Provider>
  );
}

export function useSignInModal() {
  return useContext(SignInModalContext);
}
