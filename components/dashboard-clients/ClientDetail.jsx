"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  FileText,
  Mail,
  Phone,
} from "lucide-react";
import styles from "./ClientDetail.module.css";

const TABS = [
  { value: "profile",   label: "Profile" },
  { value: "employees", label: "Employees" },
  { value: "courses",   label: "Courses" },
  { value: "billing",   label: "Billing" },
  { value: "documents", label: "Documents" },
  { value: "notes",     label: "Notes & timeline" },
];

const formatDate = (iso) => {
  if (!iso || iso === "—") return "—";
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
};

export default function ClientDetail({ client }) {
  const [active, setActive] = useState("profile");

  const tabCounts = {
    profile:   null,
    employees: client.seats?.used || null,
    courses:   client.programs?.length || null,
    billing:   client.invoices?.length || null,
    documents: client.documents?.length || null,
    notes:     client.notes?.length || null,
  };

  return (
    <div className={styles.page}>
      <Link href="/dashboard/clients" className={styles.back}>
        <ArrowLeft size={13} strokeWidth={2} />
        All clients
      </Link>

      <header className={styles.head}>
        <div className={styles.headLeft}>
          <span className={styles.headLogo}>{client.initials}</span>
          <div>
            <h1 className={styles.headTitle}>{client.name}</h1>
            <div className={styles.headMeta}>
              <span
                className={`fi fi-${client.countryCode} ${styles.headFlag}`}
                aria-hidden="true"
              />
              {client.country} · {client.industry} · {client.plan} plan
            </div>
          </div>
        </div>
        <div className={styles.headRight}>
          <a
            href="/client"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.portalLink}
          >
            Visit client portal
            <ExternalLink size={12} strokeWidth={2} />
          </a>
        </div>
      </header>

      <div className={styles.tabs}>
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setActive(t.value)}
            className={`${styles.tab} ${
              active === t.value ? styles.tabActive : ""
            }`.trim()}
          >
            {t.label}
            {tabCounts[t.value] != null && (
              <span className={styles.tabCount}>
                {typeof tabCounts[t.value] === "number"
                  ? tabCounts[t.value].toLocaleString()
                  : tabCounts[t.value]}
              </span>
            )}
          </button>
        ))}
      </div>

      {active === "profile" && <ProfileTab client={client} />}
      {active === "employees" && <EmployeesTab client={client} />}
      {active === "courses" && <CoursesTab client={client} />}
      {active === "billing" && <BillingTab client={client} />}
      {active === "documents" && <DocumentsTab client={client} />}
      {active === "notes" && <NotesTab client={client} />}
    </div>
  );
}

/* ─── tabs ─── */

function ProfileTab({ client }) {
  return (
    <>
      <section className={styles.panel}>
        <header className={styles.panelHead}>
          <h2 className={styles.panelTitle}>Contract</h2>
        </header>
        <div className={styles.profileGrid}>
          <div className={styles.profileCard}>
            <div className={styles.profileLabel}>Plan</div>
            <div className={styles.profileValue}>{client.plan}</div>
            <div className={styles.profileSub}>
              {client.seats?.used?.toLocaleString() ?? "—"} /{" "}
              {client.seats?.total?.toLocaleString() ?? "—"} seats used
            </div>
          </div>
          <div className={styles.profileCard}>
            <div className={styles.profileLabel}>Annual value</div>
            <div className={styles.profileValue}>{client.contractValue}</div>
            <div className={styles.profileSub}>
              Started {formatDate(client.contractStart)} ·
              renews {formatDate(client.contractEnd)}
            </div>
          </div>
          <div className={styles.profileCard}>
            <div className={styles.profileLabel}>Industry</div>
            <div className={styles.profileValue}>{client.industry}</div>
            <div className={styles.profileSub}>{client.size}</div>
          </div>
          <div className={styles.profileCard}>
            <div className={styles.profileLabel}>Location</div>
            <div className={styles.profileValue}>{client.city || client.country}</div>
            <div className={styles.profileSub}>{client.domain}</div>
          </div>
        </div>
      </section>

      <section className={styles.panel}>
        <header className={styles.panelHead}>
          <h2 className={styles.panelTitle}>Contacts</h2>
        </header>
        <div className={styles.profileGrid}>
          <ContactCard contact={client.primaryContact} label="Primary contact" />
          <ContactCard contact={client.billingContact} label="Billing contact" />
        </div>
      </section>
    </>
  );
}

function ContactCard({ contact, label }) {
  return (
    <div className={styles.contactRow}>
      <span className={styles.contactAv}>{contact.initials}</span>
      <div className={styles.contactInfo}>
        <span className={styles.contactName}>{contact.name}</span>
        <span className={styles.contactRole}>{label} · {contact.role}</span>
        <div className={styles.contactDetails}>
          {contact.email !== "—" && (
            <a href={`mailto:${contact.email}`}>
              <Mail size={11} strokeWidth={1.8} style={{ marginRight: 4, verticalAlign: "middle" }} />
              {contact.email}
            </a>
          )}
          {contact.phone !== "—" && (
            <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>
              <Phone size={11} strokeWidth={1.8} style={{ marginRight: 4, verticalAlign: "middle" }} />
              {contact.phone}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function EmployeesTab({ client }) {
  return (
    <section className={styles.panel}>
      <header className={styles.panelHead}>
        <h2 className={styles.panelTitle}>Employee enrolment</h2>
        <Link
          href="/client/employees"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.portalLink}
          style={{ background: "var(--pill-light)", color: "var(--ink-2)" }}
        >
          Open employee list <ExternalLink size={12} strokeWidth={2} />
        </Link>
      </header>
      <div className={styles.bigStat}>
        <div className={styles.bigStatCard}>
          <div className={styles.bigStatLabel}>Total enrolled</div>
          <div className={styles.bigStatValue}>
            {client.seats?.used?.toLocaleString() ?? "—"}
          </div>
          <div className={styles.bigStatSub}>
            of {client.seats?.total?.toLocaleString() ?? "—"} seats
          </div>
        </div>
        <div className={styles.bigStatCard}>
          <div className={styles.bigStatLabel}>AMLR coverage</div>
          <div className={styles.bigStatValue}>{client.coverage}%</div>
          <div className={styles.bigStatSub}>across all roles</div>
        </div>
        <div className={styles.bigStatCard}>
          <div className={styles.bigStatLabel}>Last activity</div>
          <div className={styles.bigStatValue}>{client.lastActivity}</div>
          <div className={styles.bigStatSub}>module completion</div>
        </div>
      </div>
    </section>
  );
}

function CoursesTab({ client }) {
  if (!client.programs?.length) {
    return (
      <section className={styles.panel}>
        <div className={styles.empty}>No programs deployed yet.</div>
      </section>
    );
  }
  return (
    <section className={styles.panel}>
      <header className={styles.panelHead}>
        <h2 className={styles.panelTitle}>Active programs</h2>
        <span className={styles.panelMeta}>
          {client.programs.length} programs
        </span>
      </header>
      <div className={styles.programList}>
        {client.programs.map((p) => (
          <div key={p.name} className={styles.programRow}>
            <div className={styles.programName}>{p.name}</div>
            <div className={styles.programRoles}>{p.roles}</div>
            <div className={styles.programProgress}>
              <div className={styles.programBar}>
                <div
                  className={`${styles.programBarFill} ${
                    p.completion === 100 ? styles.programBarFillDone : ""
                  }`.trim()}
                  style={{ width: `${p.completion}%` }}
                />
              </div>
              <div className={styles.programPct}>{p.completion}% complete</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function BillingTab({ client }) {
  return (
    <>
      <section className={styles.panel}>
        <header className={styles.panelHead}>
          <h2 className={styles.panelTitle}>Plan &amp; pricing</h2>
        </header>
        <div className={styles.profileGrid}>
          <div className={styles.profileCard}>
            <div className={styles.profileLabel}>Current plan</div>
            <div className={styles.profileValue}>{client.plan}</div>
            <div className={styles.profileSub}>{client.contractValue}</div>
          </div>
          <div className={styles.profileCard}>
            <div className={styles.profileLabel}>Renewal</div>
            <div className={styles.profileValue}>{formatDate(client.contractEnd)}</div>
            <div className={styles.profileSub}>auto-renews unless cancelled</div>
          </div>
        </div>
      </section>

      <section className={styles.panel}>
        <header className={styles.panelHead}>
          <h2 className={styles.panelTitle}>Invoices</h2>
          <span className={styles.panelMeta}>
            {client.invoices?.length ?? 0} total
          </span>
        </header>
        {client.invoices?.length ? (
          <table className={styles.invoiceTable}>
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Date</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {client.invoices.map((i) => (
                <tr key={i.number}>
                  <td>{i.number}</td>
                  <td>{formatDate(i.date)}</td>
                  <td>
                    <span className={styles.invoicePill}>
                      <span className={styles.invoicePillDot} aria-hidden="true" />
                      {i.status}
                    </span>
                  </td>
                  <td>{i.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.empty}>No invoices yet.</div>
        )}
      </section>
    </>
  );
}

function DocumentsTab({ client }) {
  if (!client.documents?.length) {
    return (
      <section className={styles.panel}>
        <div className={styles.empty}>
          No source documents uploaded for this client yet.
        </div>
      </section>
    );
  }
  return (
    <section className={styles.panel}>
      <header className={styles.panelHead}>
        <h2 className={styles.panelTitle}>Source documents</h2>
        <span className={styles.panelMeta}>
          {client.documents.length} files
        </span>
      </header>
      <div className={styles.docList}>
        {client.documents.map((d) => (
          <div key={d.name} className={styles.docRow}>
            <span className={styles.docIcon}>
              <FileText size={14} strokeWidth={1.8} />
            </span>
            <div className={styles.docInfo}>
              <span className={styles.docName}>{d.name}</span>
              <span className={styles.docMeta}>
                Uploaded by {d.uploadedBy} · {formatDate(d.date)}
              </span>
            </div>
            <span className={styles.docSize}>{d.size}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function NotesTab({ client }) {
  if (!client.notes?.length) {
    return (
      <section className={styles.panel}>
        <div className={styles.empty}>No notes or timeline events yet.</div>
      </section>
    );
  }
  return (
    <section className={styles.panel}>
      <header className={styles.panelHead}>
        <h2 className={styles.panelTitle}>Timeline</h2>
        <span className={styles.panelMeta}>{client.notes.length} entries</span>
      </header>
      <div className={styles.notesList}>
        {client.notes.map((n, i) => (
          <div key={i} className={styles.noteItem}>
            <span className={styles.noteAv}>{n.actor[0]}</span>
            <div className={styles.noteBody}>
              <div className={styles.noteHead}>
                <span className={styles.noteActor}>{n.actor}</span>
                <span className={styles.noteTime}>{n.date}</span>
              </div>
              <div className={styles.noteText}>{n.text}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
