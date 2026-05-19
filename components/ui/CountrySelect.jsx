"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./CountrySelect.module.css";

const COUNTRIES = [
  { code: "AT", name: "Austria" },
  { code: "BE", name: "Belgium" },
  { code: "BG", name: "Bulgaria" },
  { code: "HR", name: "Croatia" },
  { code: "CY", name: "Cyprus" },
  { code: "CZ", name: "Czech Republic" },
  { code: "DK", name: "Denmark" },
  { code: "EE", name: "Estonia" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "GR", name: "Greece" },
  { code: "HU", name: "Hungary" },
  { code: "IE", name: "Ireland" },
  { code: "IT", name: "Italy" },
  { code: "LV", name: "Latvia" },
  { code: "LT", name: "Lithuania" },
  { code: "LU", name: "Luxembourg" },
  { code: "MT", name: "Malta" },
  { code: "NL", name: "Netherlands" },
  { code: "NO", name: "Norway" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "RO", name: "Romania" },
  { code: "SK", name: "Slovakia" },
  { code: "SI", name: "Slovenia" },
  { code: "ES", name: "Spain" },
  { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "SG", name: "Singapore" },
  { code: "JP", name: "Japan" },
];

const ChevronIcon = ({ className }) => (
  <svg
    className={className}
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const SearchIcon = () => (
  <svg
    className={styles.searchIcon}
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const CheckIcon = () => (
  <svg
    className={styles.optionCheck}
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export default function CountrySelect({
  id,
  value,
  onChange,
  placeholder = "Please select",
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const [panelStyle, setPanelStyle] = useState(null);
  const [mounted, setMounted] = useState(false);

  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter((c) => c.name.toLowerCase().includes(q));
  }, [query]);

  const selected = useMemo(
    () => COUNTRIES.find((c) => c.code === value),
    [value]
  );

  // ─── positioning the portal panel
  const positionPanel = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPanelStyle({
      top: rect.bottom + 6,
      left: rect.left,
      width: rect.width,
    });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    positionPanel();
    window.addEventListener("scroll", positionPanel, true);
    window.addEventListener("resize", positionPanel);
    return () => {
      window.removeEventListener("scroll", positionPanel, true);
      window.removeEventListener("resize", positionPanel);
    };
  }, [open, positionPanel]);

  // ─── focus search when opening, reset query when closing
  useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => searchRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
    setQuery("");
    setHighlight(0);
  }, [open]);

  // ─── close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (
        triggerRef.current?.contains(e.target) ||
        panelRef.current?.contains(e.target)
      ) {
        return;
      }
      setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // reset highlight when filter changes
  useEffect(() => {
    setHighlight(0);
  }, [query]);

  const pick = useCallback(
    (code) => {
      onChange?.(code);
      setOpen(false);
    },
    [onChange]
  );

  const onSearchKey = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const c = filtered[highlight];
      if (c) pick(c.code);
    }
  };

  return (
    <div className={styles.root}>
      <button
        id={id}
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`${styles.trigger} ${open ? styles.triggerOpen : ""} ${
          !selected ? styles.triggerEmpty : ""
        }`.trim()}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selected ? (
          <>
            <span
              className={`fi fi-${selected.code.toLowerCase()} ${styles.triggerFlag}`}
              aria-hidden="true"
            />
            <span className={styles.triggerLabel}>{selected.name}</span>
          </>
        ) : (
          <span className={styles.triggerLabel}>{placeholder}</span>
        )}
        <ChevronIcon
          className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
        />
      </button>

      {mounted && open && panelStyle &&
        createPortal(
          <div
            ref={panelRef}
            className={styles.panel}
            style={panelStyle}
            role="listbox"
          >
            <div className={styles.searchWrap}>
              <SearchIcon />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onSearchKey}
                placeholder="Search country…"
                className={styles.searchInput}
                aria-label="Search country"
              />
            </div>

            {filtered.length > 0 ? (
              <ul className={styles.list}>
                {filtered.map((c, i) => (
                  <li key={c.code}>
                    <button
                      type="button"
                      onClick={() => pick(c.code)}
                      onMouseEnter={() => setHighlight(i)}
                      className={`${styles.option} ${
                        c.code === value ? styles.optionActive : ""
                      } ${i === highlight ? styles.optionHighlighted : ""}`.trim()}
                    >
                      <span
                        className={`fi fi-${c.code.toLowerCase()} ${styles.optionFlag}`}
                        aria-hidden="true"
                      />
                      <span className={styles.optionLabel}>{c.name}</span>
                      {c.code === value && <CheckIcon />}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles.empty}>No countries match</div>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}
