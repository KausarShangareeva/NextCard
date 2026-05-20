"use client";

import { useMemo, useState } from "react";
import { MoreVertical, Search, Plus, Check, ArrowRight, AlertCircle } from "lucide-react";
import { useCourseRequests } from "@/components/course-requests/CourseRequestsProvider";
import RequestCourseModal from "@/components/client-courses/RequestCourseModal";
import AddEmployeeModal from "./AddEmployeeModal";
import EmployeeDetailsModal from "./EmployeeDetailsModal";
import { ROLE_LIST, ROLE_PROFILES, usernameFrom } from "./roleProfiles";
import styles from "./ClientEmployees.module.css";

const INITIAL_EMPLOYEES = [
  { id: 1,  initials: "LJ", name: "Lars Johansson",   username: "lars.johansson",    role: "AML DDI Manager",                     email: "lars.j@swedbank.se",      phone: "+46 70 123 45 67", status: "active",     programs: "AMLR · KYC",       progress: 92  },
  { id: 2,  initials: "KA", name: "Klara Andersson",  username: "klara.andersson",   role: "Transaction Monitoring (TM) Analyst", email: "klara.a@swedbank.se",     phone: "+46 70 234 56 78", status: "active",     programs: "AMLR core",        progress: 78  },
  { id: 3,  initials: "EH", name: "Erik Hellström",   username: "erik.hellstrom",    role: "Money Laundering Reporting Officer",  email: "erik.h@swedbank.se",      phone: "+46 70 345 67 89", status: "active",     programs: "AMLR · SAR",       progress: 100 },
  { id: 4,  initials: "ML", name: "Maria Lindberg",   username: "maria.lindberg",    role: "Customer Advisor",                    previousRole: "AML DDI Manager", email: "maria.l@swedbank.se",     phone: "+46 70 456 78 90", status: "onboarding", programs: "AMLR onboard",     progress: 18  },
  { id: 5,  initials: "AB", name: "Anders Bergström", username: "anders.bergstrom",  role: "Customer Advisor",                    previousRole: "AML DDI Manager", email: "a.bergstrom@swedbank.se", phone: "+46 70 567 89 01", status: "active",     programs: "AMLR · KYC",       progress: 86  },
  { id: 6,  initials: "SO", name: "Sofia Olsson",     username: "sofia.olsson",      role: "Transaction Monitoring (TM) Analyst", email: "sofia.o@swedbank.se",     phone: "+46 70 678 90 12", status: "active",     programs: "AMLR core",        progress: 64  },
  { id: 7,  initials: "JN", name: "Johan Nilsson",    username: "johan.nilsson",     role: "Money Laundering Reporting Officer",  email: "johan.n@swedbank.se",     phone: "+46 70 789 01 23", status: "active",     programs: "AMLR · Sanctions", progress: 100 },
  { id: 8,  initials: "EP", name: "Elsa Pettersson",  username: "elsa.pettersson",   role: "Customer Advisor",                    email: "elsa.p@swedbank.se",      phone: "+46 70 890 12 34", status: "inactive",   programs: "AMLR core",        progress: 42  },
  { id: 9,  initials: "MK", name: "Mikael Karlsson",  username: "mikael.karlsson",   role: "AML DDI Manager",                     email: "m.karlsson@swedbank.se",  phone: "+46 70 901 23 45", status: "active",     programs: "AMLR · Sanctions", progress: 91  },
  { id: 10, initials: "AS", name: "Astrid Svensson",  username: "astrid.svensson",   role: "Transaction Monitoring (TM) Analyst", email: "astrid.s@swedbank.se",    phone: "+46 70 012 34 56", status: "active",     programs: "AMLR · KYC",       progress: 73  },
  { id: 11, initials: "OL", name: "Oskar Lindqvist",  username: "oskar.lindqvist",   role: "Customer Advisor",                    email: "oskar.l@swedbank.se",     phone: "+46 70 111 22 33", status: "onboarding", programs: "AMLR onboard",     progress: 8   },
  { id: 12, initials: "FA", name: "Freja Åkesson",    username: "freja.akesson",     role: "Transaction Monitoring (TM) Analyst", email: "freja.a@swedbank.se",     phone: "+46 70 222 33 44", status: "active",     programs: "AMLR core",        progress: 55  },
];

const STATUS_FILTERS = [
  { value: "all",        label: "All" },
  { value: "active",     label: "Active" },
  { value: "onboarding", label: "Onboarding" },
  { value: "inactive",   label: "Inactive" },
];

const ROLE_SHORT = {
  "AML DDI Manager":                     "AML DDI Manager",
  "Customer Advisor":                    "Customer Advisor",
  "Money Laundering Reporting Officer":  "MLRO",
  "Transaction Monitoring (TM) Analyst": "TM Analyst",
};

const STATUS_CLASS = {
  active:     "statusActive",
  onboarding: "statusOnboarding",
  inactive:   "statusInactive",
};

const STATUS_LABEL = {
  active:     "Active",
  onboarding: "Onboarding",
  inactive:   "Inactive",
};

const initialsFrom = (first, last) =>
  `${(first?.[0] ?? "").toUpperCase()}${(last?.[0] ?? "").toUpperCase()}` || "?";

export default function ClientEmployees() {
  const { addRequest } = useCourseRequests();
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [activeEmployee, setActiveEmployee] = useState(null);
  const [selectedIds, setSelectedIds] = useState(() => new Set());

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return employees.filter((e) => {
      if (statusFilter !== "all" && e.status !== statusFilter) return false;
      if (roleFilter !== "all" && e.role !== roleFilter) return false;
      if (!q) return true;
      return (
        e.name.toLowerCase().includes(q) ||
        e.role.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q)
      );
    });
  }, [employees, statusFilter, roleFilter, query]);

  const addEmployee = (data) => {
    setEmployees((list) => [
      {
        id: Date.now(),
        initials: initialsFrom(data.firstName, data.lastName),
        name: `${data.firstName} ${data.lastName}`.trim(),
        username: data.username ?? usernameFrom(data.firstName, data.lastName),
        role: data.role,
        email: data.email,
        phone: data.phone,
        status: "onboarding",
        programs: data.programs ?? ROLE_PROFILES[data.role]?.programs ?? "AMLR core",
        progress: 0,
      },
      ...list,
    ]);
  };

  const toggleSelected = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const selectedEmployees = useMemo(
    () => employees.filter((e) => selectedIds.has(e.id)),
    [employees, selectedIds]
  );

  const selectedUniqueRoles = useMemo(
    () => Array.from(new Set(selectedEmployees.map((e) => e.role))),
    [selectedEmployees]
  );

  const selectedRoleSummary = useMemo(() => {
    if (selectedUniqueRoles.length === 0) return "";
    if (selectedUniqueRoles.length === 1) return selectedUniqueRoles[0];
    return `${selectedUniqueRoles.length} roles`;
  }, [selectedUniqueRoles]);

  // Pre-fill for the Role field in RequestCourseModal: single role once,
  // multiple roles joined with commas.
  const selectedRolesText = useMemo(
    () => selectedUniqueRoles.join(", "),
    [selectedUniqueRoles]
  );

  const handleRequestSubmit = (data) => {
    addRequest({
      client: "Swedbank",
      clientCountryCode: "se",
      requestedBy: "Linnéa Andersson",
      requestedByEmail: "linnea@swedbank.se",
      employees: selectedEmployees.map((e) => ({
        id: e.id,
        name: e.name,
        role: e.role,
        previousRole: e.previousRole ?? null,
      })),
      ...data,
    });
    clearSelection();
  };

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <div className={styles.headLeft}>
          <div className={styles.eyebrow}>Workspace</div>
          <h1 className={styles.title}>Employees</h1>
          <p className={styles.sub}>
            {employees.length} people across {ROLE_LIST.length} role profiles.
            Track AMLR program progress per person.
          </p>
        </div>
        <div className={styles.headActions}>
          <button
            type="button"
            className={styles.addBtn}
            onClick={() => setIsAddOpen(true)}
          >
            <Plus size={14} strokeWidth={2.2} />
            Add employee
          </button>
        </div>
      </header>

      <div className={styles.filters}>
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setStatusFilter(f.value)}
            className={`${styles.chip} ${
              f.value === statusFilter ? styles.chipActive : ""
            }`.trim()}
          >
            {f.label}
          </button>
        ))}
        <div className={styles.search}>
          <Search size={13} strokeWidth={1.8} color="var(--ink-3)" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, role, email…"
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.roleFilters}>
        <span className={styles.roleFiltersLabel}>Role</span>
        <button
          type="button"
          onClick={() => setRoleFilter("all")}
          className={`${styles.roleChip} ${
            roleFilter === "all" ? styles.roleChipActive : ""
          }`.trim()}
        >
          All roles
          <span className={styles.roleChipCount}>{employees.length}</span>
        </button>
        {ROLE_LIST.map((r) => {
          const count = employees.filter((e) => e.role === r).length;
          return (
            <button
              key={r}
              type="button"
              onClick={() => setRoleFilter(r)}
              className={`${styles.roleChip} ${
                roleFilter === r ? styles.roleChipActive : ""
              }`.trim()}
            >
              {ROLE_SHORT[r] ?? r}
              <span className={styles.roleChipCount}>{count}</span>
            </button>
          );
        })}
        {selectedIds.size > 0 && (
          <div className={styles.roleFiltersAction}>
            <span className={styles.selectionMeta}>
              {selectedIds.size} selected · {selectedRoleSummary}
            </span>
            <button
              type="button"
              className={styles.selectionClear}
              onClick={clearSelection}
            >
              Clear
            </button>
            <button
              type="button"
              className={styles.requestBtn}
              onClick={() => setIsRequestOpen(true)}
            >
              <Plus size={14} strokeWidth={2.2} />
              Request new course
            </button>
          </div>
        )}
      </div>

      <div className={styles.grid}>
        {filtered.map((e) => {
          const isSelected = selectedIds.has(e.id);
          const hasRoleChanged = Boolean(e.previousRole);
          return (
            <article
              key={e.id}
              className={`${styles.card} ${
                isSelected ? styles.cardSelected : ""
              } ${hasRoleChanged ? styles.cardRoleChanged : ""}`.trim()}
              onClick={() => toggleSelected(e.id)}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              onKeyDown={(ev) => {
                if (ev.key === "Enter" || ev.key === " ") {
                  ev.preventDefault();
                  toggleSelected(e.id);
                }
              }}
            >
              {isSelected && (
                <span className={styles.selectBadge} aria-hidden="true">
                  <Check size={12} strokeWidth={3} />
                </span>
              )}

              <button
                type="button"
                className={styles.cardMenu}
                aria-label={`More details for ${e.name}`}
                onClick={(ev) => {
                  ev.stopPropagation();
                  setActiveEmployee(e);
                }}
              >
                <MoreVertical size={14} strokeWidth={1.8} />
              </button>

              <div className={styles.cardTop}>
                <div className={styles.avatar}>{e.initials}</div>
                <div className={styles.cardName}>{e.name}</div>
                <div className={styles.cardRole}>{e.role}</div>
                {hasRoleChanged && (
                  <div className={styles.roleChangedBadge}>
                    <AlertCircle size={11} strokeWidth={2} />
                    <span className={styles.roleChangedFrom}>
                      {ROLE_SHORT[e.previousRole] ?? e.previousRole}
                    </span>
                    <ArrowRight size={10} strokeWidth={2.2} />
                    <span className={styles.roleChangedTo}>
                      {ROLE_SHORT[e.role] ?? e.role}
                    </span>
                  </div>
                )}
                <span
                  className={`${styles.statusPill} ${styles[STATUS_CLASS[e.status]]}`}
                >
                  <span className={styles.statusDot} aria-hidden="true" />
                  {STATUS_LABEL[e.status]}
                </span>
              </div>

              {hasRoleChanged && (
                <div className={styles.roleChangedNote}>
                  Role changed — needs a new course program.
                </div>
              )}

              <div className={styles.metaBox}>
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>Programs</span>
                  <span className={styles.metaValue}>{e.programs}</span>
                </div>
                <div className={styles.progressWrap}>
                  <div className={styles.progressTop}>
                    <span className={styles.progressLabel}>Training progress</span>
                    <span className={styles.progressValue}>{e.progress}%</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div
                      className={`${styles.progressFill} ${
                        e.progress === 100 ? styles.progressFillDone : ""
                      }`.trim()}
                      style={{ width: `${e.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <AddEmployeeModal
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={addEmployee}
      />

      <EmployeeDetailsModal
        employee={activeEmployee}
        onClose={() => setActiveEmployee(null)}
      />

      <RequestCourseModal
        open={isRequestOpen}
        onClose={() => setIsRequestOpen(false)}
        onSubmit={handleRequestSubmit}
        initialRole={selectedRolesText}
      />
    </div>
  );
}
