import type { CSSProperties, ReactNode } from "react";
import { CodeBlock } from "./code-block";
import styles from "./page.module.css";

/* ─── Highlight marks ─── */
// Y/G/B/P/R = Yellow/Green/Blue/Purple/Red — semantic color names for the
// reader, not for the type system. Keeps lesson bodies readable.

const Y = ({ children }: { children: ReactNode }) => (
  <mark className={`${styles.mk} ${styles.mkY}`}>{children}</mark>
);
const G = ({ children }: { children: ReactNode }) => (
  <mark className={`${styles.mk} ${styles.mkG}`}>{children}</mark>
);
const B = ({ children }: { children: ReactNode }) => (
  <mark className={`${styles.mk} ${styles.mkB}`}>{children}</mark>
);
const P = ({ children }: { children: ReactNode }) => (
  <mark className={`${styles.mk} ${styles.mkP}`}>{children}</mark>
);
const R = ({ children }: { children: ReactNode }) => (
  <mark className={`${styles.mk} ${styles.mkR}`}>{children}</mark>
);

/* ─── Warning callout ─── */
const Warn = ({ children }: { children: ReactNode }) => (
  <div className={styles.lcWarn}>
    <span className={styles.lcWarnIc}>⚠</span>
    <span>{children}</span>
  </div>
);

/* ─── Lesson shape ─── */
export type Note = {
  text: string;
  style: CSSProperties;
  color?: string;
};

export type Lesson = {
  id: number;
  title: string;
  topicLabel: string;
  notes?: Note[];
  Body: React.ComponentType;
};

/* ─── Sample lessons (demo content — TODO: replace with AI-generated) ─── */

export const LESSONS: Lesson[] = [
  {
    id: 1,
    title: "Your First Component",
    topicLabel: "Describing the UI",
    notes: [
      { text: "Building blocks! 🧱", style: { top: "-30px", right: "32px", transform: "rotate(2deg)" } },
      { text: "↑ remember this", style: { bottom: "160px", left: "-8px", transform: "rotate(-5deg)" }, color: "#6c5ce7" },
    ],
    Body: () => (
      <>
        <p>
          React applications are built from <Y>isolated pieces of UI called components</Y>. A React
          component is a <B>JavaScript function</B> that you can sprinkle with markup. Components can
          be as small as a button, or as large as an entire page.
        </p>
        <CodeBlock
          label="App.js"
          code={`function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3A.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}`}
        />
        <p>
          <G>Gallery renders three Profile components</G> — each one is reusable and
          self-contained. <P>Components can be nested inside other components to build complex UIs.</P>
        </p>
      </>
    ),
  },
  {
    id: 2,
    title: "Importing & Exporting Components",
    topicLabel: "Describing the UI",
    notes: [
      { text: "One file,\none job ✨", style: { top: "-30px", right: "40px", transform: "rotate(-2deg)" } },
      { text: "keep it clean →", style: { bottom: "100px", right: "-10px", transform: "rotate(4deg)" }, color: "#00b894" },
    ],
    Body: () => (
      <>
        <p>
          You can declare many components in one file, but <Y>large files get difficult to
          navigate</Y>. The solution: <B>export a component into its own file</B> and import it
          elsewhere.
        </p>
        <CodeBlock
          label="Gallery.js"
          code={`import Profile from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}`}
        />
        <p>
          <G>One component per file keeps code organized.</G>{" "}
          <P>This pattern is the foundation of every scalable React codebase — you&apos;ll see it everywhere.</P>
        </p>
      </>
    ),
  },
  {
    id: 3,
    title: "Writing Markup with JSX",
    topicLabel: "Describing the UI",
    notes: [
      { text: "JSX ≠ HTML!\nclose every tag 🔒", style: { top: "-34px", left: "16px", transform: "rotate(-3deg)" } },
      { text: "Watch out! ⚠️", style: { bottom: "180px", right: "-6px", transform: "rotate(4deg)" }, color: "#e17055" },
    ],
    Body: () => (
      <>
        <p>
          Each React component contains{" "}
          <Y>JSX — a syntax extension that looks like HTML but is stricter</Y>. React uses JSX to
          describe what the UI should look like.
        </p>
        <Warn>
          <R>Pasting plain HTML into JSX won&apos;t always work!</R> Tags must be closed, and{" "}
          <code>class</code> becomes <code>className</code>.
        </Warn>
        <CodeBlock
          label="✓ Correct JSX"
          code={`export default function TodoList() {
  return (
    <>
      <h1>Hedy Lamarr's Todos</h1>
      <img
        src="https://i.imgur.com/yXOvdOSs.jpg"
        alt="Hedy Lamarr"
        className="photo"     // not "class"!
      />
      <ul>
        <li>Invent new traffic lights</li>
        <li>Rehearse a movie scene</li>
      </ul>
    </>                        // wrap in fragment
  );
}`}
        />
        <p>
          <B>
            Rules: every tag closes; use <code>className</code> not <code>class</code>; wrap siblings
            in <code>{"<>…</>"}</code>.
          </B>
        </p>
      </>
    ),
  },
  {
    id: 4,
    title: "JavaScript in JSX with { }",
    topicLabel: "Describing the UI",
    notes: [
      { text: "{ } = window\nto JavaScript 🪟", style: { top: "-34px", right: "28px", transform: "rotate(1deg)" } },
      { text: "↑ any JS expression", style: { bottom: "130px", left: "-6px", transform: "rotate(-4deg)" }, color: "#0984e3" },
    ],
    Body: () => (
      <>
        <p>
          Sometimes you want to{" "}
          <Y>add JavaScript logic or reference dynamic values inside your markup</Y>. In JSX, use{" "}
          <B>curly braces {`{ }`} to &quot;open a window&quot; to JavaScript</B>.
        </p>
        <CodeBlock
          label="App.js"
          code={`const person = {
  name: 'Gregorio Y. Zara',
  theme: { backgroundColor: 'black', color: 'pink' }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        alt={person.name}     // JS expression in { }
      />
    </div>
  );
}`}
        />
        <p>
          <G>Any JS expression goes inside {`{ }`} — variables, function calls, ternaries.</G>{" "}
          <P>This is how data flows from your logic into the rendered markup.</P>
        </p>
      </>
    ),
  },
  {
    id: 5,
    title: "Passing Props to a Component",
    topicLabel: "Describing the UI",
    notes: [
      { text: "Like function\narguments! 📦", style: { top: "-34px", left: "24px", transform: "rotate(-3deg)" } },
      { text: "parent → child", style: { bottom: "140px", right: "-4px", transform: "rotate(3deg)" }, color: "#6c5ce7" },
    ],
    Body: () => (
      <>
        <p>
          React components use <Y>props to communicate with each other</Y>. A parent passes data to
          its children via props. <B>Props work exactly like function arguments</B> — you can pass
          any JavaScript value: objects, arrays, functions, even JSX.
        </p>
        <CodeBlock
          label="App.js"
          code={`function Avatar({ person, size }) {
  return (
    <img
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <Avatar
      size={100}
      person={{ name: 'Katsuko Saruhashi' }}
    />
  );
}`}
        />
        <p>
          <G>The parent owns the data; the child reads it as destructured params.</G>{" "}
          <P>This one-way data flow makes React apps predictable and easy to debug — you always know where data comes from.</P>
        </p>
      </>
    ),
  },
];
