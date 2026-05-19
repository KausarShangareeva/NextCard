"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import styles from "./RequestCourseModal.module.css";

const CloseIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

const humanSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function RequestCourseModal({ open, onClose, onSubmit }) {
  const [role, setRole] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [tasks, setTasks] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [scope, setScope] = useState([]);
  const [scopeInput, setScopeInput] = useState("");
  const [files, setFiles] = useState([]);
  const [isDrag, setIsDrag] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const reset = () => {
    setRole("");
    setRoleDescription("");
    setTasks("");
    setResponsibilities("");
    setScope([]);
    setScopeInput("");
    setFiles([]);
  };

  const handleClose = () => {
    reset();
    onClose?.();
  };

  const addScope = (raw) => {
    const v = raw.trim().replace(/,$/, "");
    if (!v) return;
    if (scope.includes(v)) return;
    setScope((s) => [...s, v]);
    setScopeInput("");
  };

  const handleScopeKey = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addScope(scopeInput);
    } else if (e.key === "Backspace" && !scopeInput && scope.length > 0) {
      setScope((s) => s.slice(0, -1));
    }
  };

  const addFiles = (fileList) => {
    const newFiles = Array.from(fileList).map((f) => ({
      name: f.name,
      size: humanSize(f.size),
    }));
    setFiles((fs) => [...fs, ...newFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDrag(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const isValid =
    role.trim() && roleDescription.trim() && tasks.trim() && responsibilities.trim();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    onSubmit?.({
      role,
      roleDescription,
      tasks,
      responsibilities,
      regulatoryScope: scope,
      files,
    });
    reset();
    onClose?.();
  };

  return (
    <div
      className={styles.backdrop}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="request-course-title"
    >
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={handleClose}
          aria-label="Close"
        >
          <CloseIcon />
        </button>

        <div className={styles.header}>
          <span className={styles.eyebrow}>
            <span className={styles.eyebrowDot} aria-hidden="true" />
            Request a new course
          </span>
          <h2 id="request-course-title" className={styles.title}>
            Tell us about the role.
          </h2>
          <p className={styles.sub}>
            Our compliance team turns this into an AMLR-aligned program in
            ~5 business days. Attach role descriptions or policies if you have them.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label htmlFor="rc-role" className={styles.label}>
              Role*
            </label>
            <input
              id="rc-role"
              type="text"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={styles.input}
              placeholder="Crypto Compliance Officer · digital-asset desk"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="rc-desc" className={styles.label}>
              Role description*
            </label>
            <textarea
              id="rc-desc"
              required
              value={roleDescription}
              onChange={(e) => setRoleDescription(e.target.value)}
              className={styles.textarea}
              placeholder="What does this person actually do day-to-day?"
              rows={3}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="rc-tasks" className={styles.label}>
              Tasks*
            </label>
            <textarea
              id="rc-tasks"
              required
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              className={styles.textarea}
              placeholder="Monitor on-chain transactions, file SAR, run KYC…"
              rows={3}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="rc-resp" className={styles.label}>
              Responsibilities*
            </label>
            <textarea
              id="rc-resp"
              required
              value={responsibilities}
              onChange={(e) => setResponsibilities(e.target.value)}
              className={styles.textarea}
              placeholder="Sign-off on onboarding, escalate to MLRO, train branch staff…"
              rows={3}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="rc-scope" className={styles.label}>
              Regulatory scope
            </label>
            <div className={styles.chipsWrap}>
              {scope.map((s) => (
                <span key={s} className={styles.chip}>
                  {s}
                  <button
                    type="button"
                    onClick={() => setScope((arr) => arr.filter((x) => x !== s))}
                    className={styles.chipRemove}
                    aria-label={`Remove ${s}`}
                  >
                    <X size={10} strokeWidth={2.4} />
                  </button>
                </span>
              ))}
              <input
                id="rc-scope"
                type="text"
                value={scopeInput}
                onChange={(e) => setScopeInput(e.target.value)}
                onKeyDown={handleScopeKey}
                onBlur={() => scopeInput && addScope(scopeInput)}
                className={styles.chipsInput}
                placeholder={
                  scope.length === 0
                    ? "AMLR Art. 20, MiCAR Art. 38…"
                    : ""
                }
              />
            </div>
            <div className={styles.chipsHint}>
              Press Enter or comma to add. Backspace removes the last tag.
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Supporting documents</label>
            <label
              className={`${styles.upload} ${isDrag ? styles.uploadDrag : ""}`.trim()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDrag(true);
              }}
              onDragLeave={() => setIsDrag(false)}
              onDrop={handleDrop}
            >
              <Upload size={22} strokeWidth={1.8} className={styles.uploadIcon} />
              <span className={styles.uploadText}>
                Drop files here, or click to browse
              </span>
              <span className={styles.uploadHint}>
                Role descriptions, policies, risk-matrix exports — PDF, DOCX, XLSX
              </span>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files?.length) addFiles(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
            {files.length > 0 && (
              <ul className={styles.fileList}>
                {files.map((f, i) => (
                  <li key={`${f.name}-${i}`} className={styles.fileItem}>
                    <FileText size={14} strokeWidth={1.8} className={styles.fileIcon} />
                    <div className={styles.fileMeta}>
                      <span className={styles.fileName}>{f.name}</span>
                      <span className={styles.fileSize}>{f.size}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFiles((arr) => arr.filter((_, j) => j !== i))}
                      className={styles.fileRemove}
                      aria-label={`Remove ${f.name}`}
                    >
                      <X size={12} strokeWidth={2} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.btnGhost} onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className={styles.btnPrimary} disabled={!isValid}>
              Submit request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
