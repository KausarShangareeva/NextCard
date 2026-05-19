"use client";

import { useMemo, useState } from "react";
import { Mail, Phone, MoreVertical, Search, Plus } from "lucide-react";
import AddEmployeeModal from "./AddEmployeeModal";
import styles from "./ClientEmployees.module.css";

const INITIAL_EMPLOYEES = [
  { id: 1,  initials: "LJ", name: "Lars Johansson",       role: "AML Officer",         email: "lars.j@swedbank.se",        phone: "+46 70 123 45 67", status: "active",     programs: "AMLR · KYC",     progress: 92 },
  { id: 2,  initials: "KA", name: "Klara Andersson",      role: "KYC Analyst",         email: "klara.a@swedbank.se",       phone: "+46 70 234 56 78", status: "active",     programs: "AMLR core",      progress: 78 },
  { id: 3,  initials: "EH", name: "Erik Hellström",       role: "Compliance Lead",     email: "erik.h@swedbank.se",        phone: "+46 70 345 67 89", status: "active",     programs: "AMLR · SAR",     progress: 100 },
  { id: 4,  initials: "ML", name: "Maria Lindberg",       role: "KYC Analyst",         email: "maria.l@swedbank.se",       phone: "+46 70 456 78 90", status: "onboarding", programs: "AMLR onboard",   progress: 18 },
  { id: 5,  initials: "AB", name: "Anders Bergström",     role: "Branch Manager",      role2: "Stockholm",  email: "a.bergstrom@swedbank.se",   phone: "+46 70 567 89 01", status: "active",     programs: "AMLR · Sanctions",progress: 86 },
  { id: 6,  initials: "SO", name: "Sofia Olsson",         role: "Customer Onboarding", email: "sofia.o@swedbank.se",       phone: "+46 70 678 90 12", status: "active",     programs: "AMLR core",      progress: 64 },
  { id: 7,  initials: "JN", name: "Johan Nilsson",        role: "Risk Officer",        email: "johan.n@swedbank.se",       phone: "+46 70 789 01 23", status: "active",     programs: "AMLR · Risk",    progress: 100 },
  { id: 8,  initials: "EP", name: "Elsa Pettersson",      role: "Operations Support",  email: "elsa.p@swedbank.se",        phone: "+46 70 890 12 34", status: "inactive",   programs: "AMLR core",      progress: 42 },
  { id: 9,  initials: "MK", name: "Mikael Karlsson",      role: "Branch Manager",      email: "m.karlsson@swedbank.se",    phone: "+46 70 901 23 45", status: "active",     programs: "AMLR · Sanctions",progress: 91 },
  { id: 10, initials: "AS", name: "Astrid Svensson",      role: "AML Officer",         email: "astrid.s@swedbank.se",      phone: "+46 70 012 34 56", status: "active",     programs: "AMLR · KYC",     progress: 73 },
  { id: 11, initials: "OL", name: "Oskar Lindqvist",      role: "Customer Onboarding", email: "oskar.l@swedbank.se",       phone: "+46 70 111 22 33", status: "onboarding", programs: "AMLR onboard",   progress: 8  },
  { id: 12, initials: "FA", name: "Freja Åkesson",        role: "KYC Analyst",         email: "freja.a@swedbank.se",       phone: "+46 70 222 33 44", status: "active",     programs: "AMLR core",      progress: 55 },
];

const FILTERS = [
  { value: "all",        label: "All" },
  { value: "active",     label: "Active" },
  { value: "onboarding", label: "Onboarding" },
  { value: "inactive",   label: "Inactive" },
];

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
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return employees.filter((e) => {
      if (filter !== "all" && e.status !== filter) return false;
      if (!q) return true;
      return (
        e.name.toLowerCase().includes(q) ||
        e.role.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q)
      );
    });
  }, [employees, filter, query]);

  const addEmployee = (data) => {
    setEmployees((list) => [
      {
        id: Date.now(),
        initials: initialsFrom(data.firstName, data.lastName),
        name: `${data.firstName} ${data.lastName}`.trim(),
        role: data.role,
        email: data.email,
        phone: data.phone,
        status: "onboarding",
        programs: data.programs ?? "AMLR core",
        progress: 0,
      },
      ...list,
    ]);
  };

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <div className={styles.headLeft}>
          <div className={styles.eyebrow}>Workspace</div>
          <h1 className={styles.title}>Employees</h1>
          <p className={styles.sub}>
            {employees.length} people across 6 role profiles. Track AMLR
            program progress per person.
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
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`${styles.chip} ${
              f.value === filter ? styles.chipActive : ""
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

      <div className={styles.grid}>
        {filtered.map((e) => (
          <article key={e.id} className={styles.card}>
            <button type="button" className={styles.cardMenu} aria-label="More">
              <MoreVertical size={14} strokeWidth={1.8} />
            </button>

            <div className={styles.cardTop}>
              <div className={styles.avatar}>{e.initials}</div>
              <div className={styles.cardName}>{e.name}</div>
              <div className={styles.cardRole}>{e.role}</div>
              <span
                className={`${styles.statusPill} ${styles[STATUS_CLASS[e.status]]}`}
              >
                <span className={styles.statusDot} aria-hidden="true" />
                {STATUS_LABEL[e.status]}
              </span>
            </div>

            <div className={styles.detailBox}>
              <div className={styles.detailRow}>
                <Mail size={13} strokeWidth={1.8} className={styles.detailIcon} />
                <span className={styles.detailText}>{e.email}</span>
              </div>
              <div className={styles.detailRow}>
                <Phone size={13} strokeWidth={1.8} className={styles.detailIcon} />
                <span className={styles.detailText}>{e.phone}</span>
              </div>
            </div>

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
        ))}
      </div>

      <AddEmployeeModal
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={addEmployee}
      />
    </div>
  );
}
