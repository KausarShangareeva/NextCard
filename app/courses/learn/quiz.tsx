"use client";

import { useState } from "react";
import styles from "./page.module.css";

type Question = {
  q: string;
  opts: string[];
  cor: number;
  exp: string;
};

const QUIZ: Question[] = [
  {
    q: "What is a React component?",
    opts: [
      "A CSS class that styles the DOM",
      "A JavaScript function that returns markup",
      "A database query method",
      "An HTML template file",
    ],
    cor: 1,
    exp: "A React component is a JavaScript function that returns JSX markup.",
  },
  {
    q: 'In JSX, what replaces the HTML "class" attribute?',
    opts: ["cssClass", "classList", "className", "styleClass"],
    cor: 2,
    exp: '"class" is reserved in JS, so JSX uses className instead.',
  },
  {
    q: "What are React props used for?",
    opts: [
      "Styling with CSS",
      "Passing data from parent to child",
      "Managing global state",
      "Querying a database",
    ],
    cor: 1,
    exp: "Props let a parent component pass data down to its child components.",
  },
  {
    q: "How do you embed a JS expression inside JSX?",
    opts: [
      "${ } template literals",
      "{{ }} double braces",
      "{ } single curly braces",
      "<js> tags",
    ],
    cor: 2,
    exp: 'Single curly braces { } open a "window to JavaScript" inside JSX.',
  },
  {
    q: "Why split components into separate files?",
    opts: [
      "React enforces it",
      "Easier navigation & maintenance",
      "Better performance",
      "Enables CSS modules",
    ],
    cor: 1,
    exp: "Splitting keeps each file focused and easy to navigate as the app grows.",
  },
];

const PASS_THRESHOLD = 3;

export function QuizPhase({
  onPass,
  onFail,
}: {
  onPass: () => void;
  onFail: () => void;
}) {
  const [qi, setQi] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = QUIZ[qi];

  const pick = (i: number) => {
    if (revealed) return;
    setChosen(i);
    setRevealed(true);
    if (i === q.cor) setScore((s) => s + 1);
  };

  const next = () => {
    if (qi < QUIZ.length - 1) {
      setQi(qi + 1);
      setChosen(null);
      setRevealed(false);
    } else {
      setDone(true);
    }
  };

  if (done) {
    const passed = score >= PASS_THRESHOLD;
    return (
      <div className={styles.qzDone}>
        <div className={styles.qzdEmoji}>{passed ? "🎉" : "💪"}</div>
        <div className={styles.qzdScore}>
          {score}
          <span className={styles.qzdTotal}>/{QUIZ.length}</span>
        </div>
        <div className={styles.qzdLbl}>
          {passed ? "Excellent work!" : "Almost there!"}
        </div>
        <p className={styles.qzdSub}>
          {passed
            ? "You've mastered Describing the UI. Ready for the next chapter!"
            : "Let's review the cards once more to lock it in — you've got this."}
        </p>
        <div className={styles.qzdBtns}>
          {passed ? (
            <button className={styles.ctaBtn} onClick={onPass}>
              Next chapter →
            </button>
          ) : (
            <>
              <button className={styles.ctaBtn} onClick={onFail}>
                Review cards
              </button>
              <button className={styles.skipBtn} onClick={onPass}>
                Skip anyway
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.qzWrap} key={qi}>
      <div className={styles.qzTop}>
        <span className={styles.qzBadge}>Mini Quiz</span>
        <span className={styles.qzProg}>
          Question {qi + 1} of {QUIZ.length}
        </span>
      </div>

      <div className={styles.qzQ}>{q.q}</div>

      <div className={styles.qzOpts}>
        {q.opts.map((opt, i) => {
          const classes = [styles.qopt];
          if (revealed) {
            if (i === q.cor) classes.push(styles.qoptOk);
            else if (i === chosen) classes.push(styles.qoptBad);
            else classes.push(styles.qoptDim);
          }
          return (
            <button
              key={i}
              className={classes.join(" ")}
              onClick={() => pick(i)}
              disabled={revealed}
            >
              <span className={styles.qoptL}>{String.fromCharCode(65 + i)}</span>
              {opt}
            </button>
          );
        })}
      </div>

      {revealed && (
        <div
          className={`${styles.qzExp} ${
            chosen === q.cor ? styles.qzeOk : styles.qzeErr
          }`}
        >
          {chosen === q.cor ? "✓ Correct! " : "✗ Not quite. "}
          {q.exp}
        </div>
      )}

      {revealed && (
        <button
          className={styles.ctaBtn}
          style={{ marginTop: "20px" }}
          onClick={next}
        >
          {qi < QUIZ.length - 1 ? "Next question →" : "See results"}
        </button>
      )}
    </div>
  );
}
