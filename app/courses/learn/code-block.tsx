import styles from "./page.module.css";

/**
 * Tiny single-pass syntax highlighter.
 * - Pre-encodes `<` / `>` to placeholders so the regex can match tag names
 *   without touching the markup we're about to generate (avoids re-processing).
 * - Single regex with multiple alternations keeps it one pass.
 * - Returns HTML to be injected via dangerouslySetInnerHTML.
 *
 * Tokens (passed in as class names so CSS Modules stay scoped):
 *   ck    — comment
 *   cs    — string / template literal
 *   ckw   — keyword (function, return, const, etc.)
 *   ctg   — JSX component tag (PascalCase)
 *   chtml — HTML tag (lowercase)
 */
type SyntaxClasses = {
  ck: string;
  cs: string;
  ckw: string;
  ctg: string;
  chtml: string;
};

function hilite(raw: string, c: SyntaxClasses): string {
  const s = raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "\x00L")
    .replace(/>/g, "\x00G");

  return s
    .replace(
      /(\/\/[^\n]*)|(`[^`\n]*`|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|(\b(?:function|return|export|import|default|const|let|var|from|if|else|true|false|null)\b)|\x00L(\/?)([A-Z][a-zA-Z]*)|\x00L(\/?)([a-z][a-z-]*)/g,
      (_m, cm, st, kw, cc, tc, ch, th) => {
        if (cm !== undefined) return `<em class="${c.ck}">${cm}</em>`;
        if (st !== undefined) return `<em class="${c.cs}">${st}</em>`;
        if (kw !== undefined) return `<em class="${c.ckw}">${kw}</em>`;
        if (tc !== undefined) return `&lt;${cc || ""}<em class="${c.ctg}">${tc}</em>`;
        if (th !== undefined) return `&lt;${ch || ""}<em class="${c.chtml}">${th}</em>`;
        return _m;
      },
    )
    .replace(/\x00L/g, "&lt;")
    .replace(/\x00G/g, "&gt;");
}

export function CodeBlock({
  code,
  label,
  lang = "JSX",
}: {
  code: string;
  label?: string;
  lang?: string;
}) {
  const html = hilite(code, {
    ck: styles.ck,
    cs: styles.cs,
    ckw: styles.ckw,
    ctg: styles.ctg,
    chtml: styles.chtml,
  });

  return (
    <div className={styles.cblock}>
      <div className={styles.cblockBar}>
        <span className={styles.cbd} style={{ background: "#ff5f57" }} />
        <span className={styles.cbd} style={{ background: "#febc2e" }} />
        <span className={styles.cbd} style={{ background: "#28c840" }} />
        {label && <span className={styles.cblabel}>{label}</span>}
        <span className={styles.cblang}>{lang}</span>
      </div>
      <pre className={styles.cblockPre}>
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  );
}
