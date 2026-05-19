"use client";

import { useState } from "react";
import {
  Share2,
  Globe,
  Sparkles,
  Users,
  Calendar,
  Briefcase,
  Mail,
  MoreHorizontal,
  Building2,
} from "lucide-react";
import CountrySelect from "@/components/ui/CountrySelect";
import Dropdown from "@/components/ui/Dropdown";
import styles from "./ContactForm.module.css";

const ICON_PROPS = { size: 16, strokeWidth: 1.8 };

const COMPANY_SIZE_OPTIONS = [
  { value: "1-50",       label: "1–50 employees",         icon: <Users {...ICON_PROPS} /> },
  { value: "51-250",     label: "51–250 employees",       icon: <Users {...ICON_PROPS} /> },
  { value: "251-1000",   label: "251–1,000 employees",    icon: <Building2 {...ICON_PROPS} /> },
  { value: "1001-5000",  label: "1,001–5,000 employees",  icon: <Building2 {...ICON_PROPS} /> },
  { value: "5001+",      label: "5,001+ employees",       icon: <Building2 {...ICON_PROPS} /> },
];

const HEARD_ABOUT_OPTIONS = [
  { value: "social",    label: "Social Media",                  icon: <Share2 {...ICON_PROPS} /> },
  { value: "google",    label: "Google",                        icon: <Globe {...ICON_PROPS} /> },
  { value: "ai",        label: "AI Search (like Chat GPT)",     icon: <Sparkles {...ICON_PROPS} /> },
  { value: "colleague", label: "Work colleague or Partner",     icon: <Users {...ICON_PROPS} /> },
  { value: "event",     label: "Event or Webinar",              icon: <Calendar {...ICON_PROPS} /> },
  { value: "network",   label: "HR/Retail/Hospitality Network", icon: <Briefcase {...ICON_PROPS} /> },
  { value: "email",     label: "Email / Newsletter",            icon: <Mail {...ICON_PROPS} /> },
  { value: "other",     label: "Other",                         icon: <MoreHorizontal {...ICON_PROPS} /> },
];

export default function ContactForm({ onSuccess, submitLabel = "Submit", idPrefix = "cf" }) {
  const [country, setCountry] = useState("");
  const [size, setSize] = useState("");
  const [heard, setHeard] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSuccess?.();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor={`${idPrefix}-firstName`} className={styles.fieldLabel}>
            First name*
          </label>
          <input
            id={`${idPrefix}-firstName`}
            name="firstName"
            type="text"
            required
            className={styles.input}
            placeholder="Eva"
            autoComplete="given-name"
          />
        </div>
        <div className={styles.field}>
          <label htmlFor={`${idPrefix}-lastName`} className={styles.fieldLabel}>
            Last name*
          </label>
          <input
            id={`${idPrefix}-lastName`}
            name="lastName"
            type="text"
            required
            className={styles.input}
            placeholder="Petrović"
            autoComplete="family-name"
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor={`${idPrefix}-phone`} className={styles.fieldLabel}>
            Phone*
          </label>
          <input
            id={`${idPrefix}-phone`}
            name="phone"
            type="tel"
            required
            className={styles.input}
            placeholder="+44 20 ..."
            autoComplete="tel"
          />
        </div>
        <div className={styles.field}>
          <label htmlFor={`${idPrefix}-email`} className={styles.fieldLabel}>
            Business email*
          </label>
          <input
            id={`${idPrefix}-email`}
            name="email"
            type="email"
            required
            className={styles.input}
            placeholder="name@company.com"
            autoComplete="email"
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor={`${idPrefix}-company`} className={styles.fieldLabel}>
            Company name*
          </label>
          <input
            id={`${idPrefix}-company`}
            name="company"
            type="text"
            required
            className={styles.input}
            placeholder="Acme Bank"
            autoComplete="organization"
          />
        </div>
        <div className={styles.field}>
          <label htmlFor={`${idPrefix}-country`} className={styles.fieldLabel}>
            Country*
          </label>
          <CountrySelect
            id={`${idPrefix}-country`}
            value={country}
            onChange={setCountry}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor={`${idPrefix}-size`} className={styles.fieldLabel}>
            Company size*
          </label>
          <Dropdown
            id={`${idPrefix}-size`}
            value={size}
            onChange={setSize}
            options={COMPANY_SIZE_OPTIONS}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor={`${idPrefix}-heard`} className={styles.fieldLabel}>
            How did you hear about us?*
          </label>
          <Dropdown
            id={`${idPrefix}-heard`}
            value={heard}
            onChange={setHeard}
            options={HEARD_ABOUT_OPTIONS}
          />
        </div>
      </div>

      <p className={styles.privacy}>
        By clicking &lsquo;{submitLabel}&rsquo; you accept our{" "}
        <a href="#">Privacy Policy</a>.
      </p>

      <button type="submit" className={styles.submit}>
        {submitLabel}
      </button>
    </form>
  );
}
