"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import styles from "./Dropdown.module.css";

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

export default function Dropdown({
  id,
  value,
  onChange,
  placeholder = "Please select",
  options = [],
  panelMinWidth,
}) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const [panelStyle, setPanelStyle] = useState(null);
  const [mounted, setMounted] = useState(false);

  const triggerRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => setMounted(true), []);

  const selectable = useMemo(
    () => options.filter((o) => !o.divider),
    [options]
  );

  const hasAnyIcon = useMemo(() => selectable.some((o) => o.icon), [selectable]);

  const selected = useMemo(
    () => selectable.find((o) => o.value === value),
    [selectable, value]
  );

  const positionPanel = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPanelStyle({
      top: rect.bottom + 6,
      left: rect.left,
      minWidth: panelMinWidth ?? rect.width,
    });
  }, [panelMinWidth]);

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

  useEffect(() => {
    if (!open) {
      setHighlight(0);
      return;
    }
    const idx = selectable.findIndex((o) => o.value === value);
    if (idx >= 0) setHighlight(idx);
  }, [open, selectable, value]);

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
      else if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlight((h) => Math.min(h + 1, selectable.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlight((h) => Math.max(h - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const c = selectable[highlight];
        if (c) {
          onChange?.(c.value);
          setOpen(false);
        }
      }
    };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, highlight, selectable, onChange]);

  const pick = (val) => {
    onChange?.(val);
    setOpen(false);
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
            {selected.icon && (
              <span className={styles.triggerIcon} aria-hidden="true">
                {selected.icon}
              </span>
            )}
            <span className={styles.triggerLabel}>{selected.label}</span>
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
            <ul className={styles.list}>
              {options.map((opt, i) => {
                if (opt.divider) {
                  return (
                    <li
                      key={`div-${i}`}
                      className={styles.divider}
                      aria-hidden="true"
                    />
                  );
                }
                const realIdx = selectable.indexOf(opt);
                const isActive = opt.value === value;
                const isHi = realIdx === highlight;
                return (
                  <li key={opt.value}>
                    <button
                      type="button"
                      onClick={() => pick(opt.value)}
                      onMouseEnter={() => setHighlight(realIdx)}
                      className={`${styles.option} ${
                        isActive ? styles.optionActive : ""
                      } ${isHi ? styles.optionHighlighted : ""}`.trim()}
                    >
                      {opt.icon ? (
                        <span className={styles.optionIcon} aria-hidden="true">
                          {opt.icon}
                        </span>
                      ) : (
                        hasAnyIcon && (
                          <span
                            className={styles.optionIconSpacer}
                            aria-hidden="true"
                          />
                        )
                      )}
                      <span className={styles.optionLabel}>{opt.label}</span>
                      {isActive && <CheckIcon />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>,
          document.body
        )}
    </div>
  );
}
