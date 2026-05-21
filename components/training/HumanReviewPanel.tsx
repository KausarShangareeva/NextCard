"use client";

import { useState } from "react";
import styles from "./HumanReviewPanel.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ReviewModule {
  moduleTitle: string;
  quarter: "Q1" | "Q2" | "Q3" | "Q4";
  riskDimension: string;
  amlrArticle: string;
  competencyGap: string;
  rationale: string;
}

export interface AuditEntry {
  timestamp: string;
  actor: "Compliance Expert";
  action: "APPROVED" | "EDITED" | "REMOVED" | "ADDED";
  moduleTitle: string;
  justification?: string;
}

export interface HumanReviewPanelProps {
  modules: ReviewModule[];
  roleName: string;
  onReviewComplete: (
    approvedModules: ReviewModule[],
    auditLog: AuditEntry[]
  ) => void;
}

// ─── Internal working module (adds stable ID + actioned flag) ─────────────────

interface WorkingModule extends ReviewModule {
  _id: string;
  _actioned: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

let idSeq = 0;
const nextId = () => `m_${++idSeq}`;

function makeWorking(mod: ReviewModule, actioned = false): WorkingModule {
  return { ...mod, _id: nextId(), _actioned: actioned };
}

function riskClass(dim: string): string {
  const u = dim.toUpperCase();
  if (u.includes("CRITICAL")) return styles.riskCritical;
  if (u.includes("HIGH"))     return styles.riskHigh;
  if (u.includes("MEDIUM"))   return styles.riskMedium;
  return styles.riskLow;
}

const AUDIT_ACTION_CLASS: Record<AuditEntry["action"], string> = {
  APPROVED: styles.auditApproved,
  EDITED:   styles.auditEdited,
  REMOVED:  styles.auditRemoved,
  ADDED:    styles.auditAdded,
};

const ACTIONED_BADGE: Record<string, { cls: string; label: string }> = {
  APPROVED: { cls: styles.actionedApproved, label: "Approved" },
  EDITED:   { cls: styles.actionedEdited,   label: "Edited"   },
  ADDED:    { cls: styles.actionedAdded,    label: "Added"    },
};

const QUARTERS = ["Q1", "Q2", "Q3", "Q4"] as const;

// Empty add-form state
const EMPTY_ADD: ReviewModule = {
  moduleTitle: "",
  quarter: "Q1",
  riskDimension: "",
  amlrArticle: "",
  competencyGap: "",
  rationale: "",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function HumanReviewPanel({
  modules: initialModules,
  roleName,
  onReviewComplete,
}: HumanReviewPanelProps) {
  const [working, setWorking] = useState<WorkingModule[]>(() =>
    initialModules.map((m) => makeWorking(m))
  );
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);

  // Which module is open for edit / remove
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Inline edit form fields
  const [editTitle,         setEditTitle]         = useState("");
  const [editRationale,     setEditRationale]     = useState("");
  const [editJustification, setEditJustification] = useState("");

  // Inline remove
  const [removeReason, setRemoveReason] = useState("");

  // Add-above: stores the index AFTER which to insert, null = hidden
  const [addAtIndex, setAddAtIndex] = useState<number | null>(null);
  const [addForm,    setAddForm]    = useState<ReviewModule>(EMPTY_ADD);

  // Progress
  const actionedCount = working.filter((m) => m._actioned).length;
  const totalCount    = working.length;
  const pct           = totalCount === 0 ? 100 : Math.round((actionedCount / totalCount) * 100);
  const allActioned   = actionedCount === totalCount && totalCount > 0;

  // ── Audit helper ──
  function log(entry: Omit<AuditEntry, "timestamp" | "actor">) {
    setAuditLog((prev) => [
      ...prev,
      { timestamp: new Date().toISOString(), actor: "Compliance Expert", ...entry },
    ]);
  }

  // ── APPROVE ──
  function handleApprove(id: string) {
    const mod = working.find((m) => m._id === id);
    if (!mod) return;
    setWorking((prev) =>
      prev.map((m) => (m._id === id ? { ...m, _actioned: true } : m))
    );
    log({ action: "APPROVED", moduleTitle: mod.moduleTitle });
    closeInlineForms(id);
  }

  // ── EDIT — open form ──
  function openEdit(id: string) {
    const mod = working.find((m) => m._id === id);
    if (!mod) return;
    setEditTitle(mod.moduleTitle);
    setEditRationale(mod.rationale);
    setEditJustification("");
    setEditingId(id);
    setRemovingId(null);
    setAddAtIndex(null);
  }

  // ── EDIT — save ──
  function handleEditSave(id: string) {
    if (!editTitle.trim() || !editJustification.trim()) return;
    setWorking((prev) =>
      prev.map((m) =>
        m._id === id
          ? { ...m, moduleTitle: editTitle.trim(), rationale: editRationale.trim(), _actioned: true }
          : m
      )
    );
    log({
      action: "EDITED",
      moduleTitle: editTitle.trim(),
      justification: editJustification.trim(),
    });
    setEditingId(null);
  }

  // ── REMOVE — open ──
  function openRemove(id: string) {
    setRemoveReason("");
    setRemovingId(id);
    setEditingId(null);
    setAddAtIndex(null);
  }

  // ── REMOVE — confirm ──
  function handleRemoveConfirm(id: string) {
    if (!removeReason.trim()) return;
    const mod = working.find((m) => m._id === id);
    if (!mod) return;
    log({ action: "REMOVED", moduleTitle: mod.moduleTitle, justification: removeReason.trim() });
    setWorking((prev) => prev.filter((m) => m._id !== id));
    setRemovingId(null);
  }

  // ── ADD ──
  function openAdd(afterIndex: number) {
    setAddForm(EMPTY_ADD);
    setAddAtIndex(afterIndex);
    setEditingId(null);
    setRemovingId(null);
  }

  function handleAddSave() {
    if (!addForm.moduleTitle.trim() || !addForm.rationale.trim()) return;
    const newMod = makeWorking(addForm, true); // auto-actioned — expert added it
    setWorking((prev) => {
      const next = [...prev];
      next.splice((addAtIndex ?? prev.length - 1) + 1, 0, newMod);
      return next;
    });
    log({ action: "ADDED", moduleTitle: addForm.moduleTitle.trim(), justification: "Manually added by compliance expert" });
    setAddAtIndex(null);
    setAddForm(EMPTY_ADD);
  }

  function closeInlineForms(exceptId?: string) {
    if (editingId && editingId !== exceptId) setEditingId(null);
    if (removingId && removingId !== exceptId) setRemovingId(null);
  }

  // ── FINALISE ──
  function handleFinalise() {
    const approved = working.map(({ _id: _i, _actioned: _a, ...rest }) => rest);
    onReviewComplete(approved, auditLog);
  }

  return (
    <div className={styles.root}>

      {/* ── Header ── */}
      <div className={styles.header}>
        <span className={styles.eyebrow}>Human-in-the-Loop</span>
        <h2 className={styles.title}>Compliance Expert Review</h2>
        <p className={styles.sub}>
          Review each AI-generated module for <strong>{roleName}</strong> before
          finalising. Every action is logged for regulatory audit.
        </p>
      </div>

      {/* ── Progress ── */}
      <div className={styles.progress}>
        <div className={styles.progressRow}>
          <span className={styles.progressLabel}>Review progress</span>
          <span className={styles.progressCount}>
            {actionedCount} of {totalCount} modules reviewed
          </span>
        </div>
        <div className={styles.progressTrack} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div className={styles.progressFill} style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* ── Module list ── */}
      {working.map((mod, idx) => {
        const isEditing  = editingId  === mod._id;
        const isRemoving = removingId === mod._id;
        const auditAction = auditLog.findLast?.(e => e.moduleTitle === mod.moduleTitle)?.action
          ?? (mod._actioned ? "APPROVED" : undefined);

        return (
          <div key={mod._id}>

            {/* ── Add form ABOVE this card (when triggered at idx-1) ── */}
            {addAtIndex === idx - 1 && (
              <AddModuleForm
                form={addForm}
                onChange={setAddForm}
                onSave={handleAddSave}
                onCancel={() => setAddAtIndex(null)}
              />
            )}

            <div
              className={[
                styles.moduleCard,
                mod._actioned ? styles.moduleCardActioned : "",
                auditAction === "APPROVED" ? styles.moduleCardApproved : "",
                auditAction === "EDITED"   ? styles.moduleCardEdited   : "",
              ].filter(Boolean).join(" ")}
            >
              <div className={styles.moduleBody}>

                {/* Meta row */}
                <div className={styles.moduleMeta}>
                  <span className={styles.quarterBadge}>{mod.quarter}</span>
                  <span className={`${styles.riskBadge} ${riskClass(mod.riskDimension)}`}>
                    <span className={styles.riskDot} aria-hidden="true" />
                    {mod.riskDimension}
                  </span>
                  {mod._actioned && auditAction && ACTIONED_BADGE[auditAction] && (
                    <span className={`${styles.actionedBadge} ${ACTIONED_BADGE[auditAction].cls}`}>
                      ✓ {ACTIONED_BADGE[auditAction].label}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className={styles.moduleTitle}>{mod.moduleTitle}</h3>

                {/* Article */}
                <div className={styles.moduleField}>
                  <span className={styles.moduleFieldLabel}>AMLR Article</span>
                  <span className={styles.articlePill}>{mod.amlrArticle}</span>
                </div>

                {/* Competency gap */}
                <div className={styles.moduleField}>
                  <span className={styles.moduleFieldLabel}>Competency Gap</span>
                  <span className={styles.moduleFieldValue}>{mod.competencyGap}</span>
                </div>

                {/* Rationale */}
                <div className={styles.rationale}>{mod.rationale}</div>

              </div>

              {/* ── Action buttons ── */}
              {!mod._actioned && (
                <div className={styles.actions}>
                  <button
                    type="button"
                    className={styles.btnApprove}
                    onClick={() => handleApprove(mod._id)}
                  >
                    ✅ Approve
                  </button>
                  <button
                    type="button"
                    className={styles.btnEdit}
                    onClick={() => openEdit(mod._id)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    type="button"
                    className={styles.btnRemove}
                    onClick={() => openRemove(mod._id)}
                  >
                    🗑️ Remove
                  </button>
                  <button
                    type="button"
                    className={styles.btnAdd}
                    onClick={() => openAdd(idx - 1)}
                  >
                    ➕ Add Above
                  </button>
                </div>
              )}

              {/* ── Inline edit form ── */}
              {isEditing && (
                <div className={styles.inlineForm}>
                  <div className={styles.inlineFormTitle}>Edit module</div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Module title*</label>
                    <input
                      type="text"
                      className={styles.fieldInput}
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Module title"
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Rationale</label>
                    <textarea
                      className={styles.fieldTextarea}
                      value={editRationale}
                      onChange={(e) => setEditRationale(e.target.value)}
                      placeholder="Why is this module needed for this role?"
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Justification for edit* (logged)</label>
                    <input
                      type="text"
                      className={styles.fieldInput}
                      value={editJustification}
                      onChange={(e) => setEditJustification(e.target.value)}
                      placeholder="e.g. Updated to reflect Q2 2026 EBA guidance"
                    />
                  </div>

                  <div className={styles.inlineFormFooter}>
                    <button type="button" className={styles.btnCancel} onClick={() => setEditingId(null)}>Cancel</button>
                    <button
                      type="button"
                      className={styles.btnSave}
                      disabled={!editTitle.trim() || !editJustification.trim()}
                      onClick={() => handleEditSave(mod._id)}
                    >
                      Save edit
                    </button>
                  </div>
                </div>
              )}

              {/* ── Inline remove form ── */}
              {isRemoving && (
                <div className={styles.inlineForm}>
                  <div className={styles.inlineFormTitle}>Remove module</div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Reason for removal* (logged)</label>
                    <input
                      type="text"
                      className={styles.fieldInput}
                      value={removeReason}
                      onChange={(e) => setRemoveReason(e.target.value)}
                      placeholder="e.g. Covered by mandatory induction already completed"
                    />
                  </div>

                  <div className={styles.inlineFormFooter}>
                    <button type="button" className={styles.btnCancel} onClick={() => setRemovingId(null)}>Cancel</button>
                    <button
                      type="button"
                      className={styles.btnSave}
                      style={{ background: "#a5302a" }}
                      disabled={!removeReason.trim()}
                      onClick={() => handleRemoveConfirm(mod._id)}
                    >
                      Confirm removal
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        );
      })}

      {/* ── Add form at the very end ── */}
      {addAtIndex === working.length - 1 && (
        <AddModuleForm
          form={addForm}
          onChange={setAddForm}
          onSave={handleAddSave}
          onCancel={() => setAddAtIndex(null)}
        />
      )}

      {/* ── Add at end button (always visible) ── */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          type="button"
          className={styles.btnAdd}
          onClick={() => openAdd(working.length - 1)}
        >
          ➕ Add module at end
        </button>
      </div>

      {/* ── Finalise ── */}
      <div className={styles.finaliseRow}>
        <span className={styles.finaliseHint}>
          {allActioned
            ? "All modules reviewed — ready to finalise."
            : `${totalCount - actionedCount} module${totalCount - actionedCount !== 1 ? "s" : ""} still need review.`}
        </span>
        <button
          type="button"
          className={styles.btnFinalise}
          disabled={!allActioned}
          onClick={handleFinalise}
        >
          Finalise Training Plan →
        </button>
      </div>

      {/* ── Audit log ── */}
      <div className={styles.auditSection}>
        <div className={styles.auditHead}>
          <h3 className={styles.auditTitle}>Review Audit Trail</h3>
          <span className={styles.auditCount}>{auditLog.length} entries</span>
        </div>

        <div className={styles.auditPanel}>
          {auditLog.length === 0 ? (
            <div className={styles.auditEmpty}>
              No actions logged yet. Approve, edit, or remove a module to begin.
            </div>
          ) : (
            auditLog.map((entry, i) => (
              <div key={i} className={styles.auditRow}>
                <span className={styles.auditTime}>
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </span>
                <span className={`${styles.auditAction} ${AUDIT_ACTION_CLASS[entry.action]}`}>
                  {entry.action}
                </span>
                <div>
                  <div className={styles.auditModule}>{entry.moduleTitle}</div>
                  {entry.justification && (
                    <div className={styles.auditJustification}>{entry.justification}</div>
                  )}
                </div>
                <span className={styles.auditActor}>{entry.actor}</span>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}

// ─── Add module inline form ───────────────────────────────────────────────────

function AddModuleForm({
  form,
  onChange,
  onSave,
  onCancel,
}: {
  form: ReviewModule;
  onChange: (f: ReviewModule) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const isValid =
    form.moduleTitle.trim() &&
    form.riskDimension.trim() &&
    form.amlrArticle.trim() &&
    form.competencyGap.trim() &&
    form.rationale.trim();

  return (
    <div className={styles.addForm}>
      <div className={styles.addFormTitle}>➕ Add module manually</div>

      <div className={styles.addFormGrid}>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Module title*</label>
          <input
            type="text"
            className={styles.fieldInput}
            value={form.moduleTitle}
            onChange={(e) => onChange({ ...form, moduleTitle: e.target.value })}
            placeholder="e.g. PEP Screening Advanced Workshop"
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Quarter*</label>
          <select
            className={styles.fieldSelect}
            value={form.quarter}
            onChange={(e) => onChange({ ...form, quarter: e.target.value as ReviewModule["quarter"] })}
          >
            <option value="Q1">Q1 — Foundation</option>
            <option value="Q2">Q2 — Application</option>
            <option value="Q3">Q3 — Deepening</option>
            <option value="Q4">Q4 — Embedding</option>
          </select>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Risk dimension*</label>
          <input
            type="text"
            className={styles.fieldInput}
            value={form.riskDimension}
            onChange={(e) => onChange({ ...form, riskDimension: e.target.value })}
            placeholder="e.g. AML – CRITICAL"
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>AMLR article*</label>
          <input
            type="text"
            className={styles.fieldInput}
            value={form.amlrArticle}
            onChange={(e) => onChange({ ...form, amlrArticle: e.target.value })}
            placeholder="e.g. Art. 12 – Training obligations"
          />
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel}>Competency gap*</label>
        <input
          type="text"
          className={styles.fieldInput}
          value={form.competencyGap}
          onChange={(e) => onChange({ ...form, competencyGap: e.target.value })}
          placeholder="What specific knowledge or skill gap does this module close?"
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel}>Rationale* (your manual justification — logged)</label>
        <textarea
          className={styles.fieldTextarea}
          value={form.rationale}
          onChange={(e) => onChange({ ...form, rationale: e.target.value })}
          placeholder="Explain why this role needs this module and which regulatory obligation it addresses."
        />
      </div>

      <div className={styles.inlineFormFooter}>
        <button type="button" className={styles.btnCancel} onClick={onCancel}>Cancel</button>
        <button
          type="button"
          className={styles.btnSave}
          disabled={!isValid}
          onClick={onSave}
        >
          Add module
        </button>
      </div>
    </div>
  );
}
