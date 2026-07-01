"use client";

import { useEffect, useState } from "react";

// Typewriter headline — phrases lifted verbatim from the design prototype.
// Reduced motion: freezes on the first phrase. aria-label stays stable.
const PHRASES = [
  "Bring them into the room.",
  "Make your dog the guest of honor.",
  "Surprise someone with themselves.",
  "Bring someone who can’t be there.",
  "Your favorite creator, in the room.",
  "Make them larger than life.",
];

export default function HeroHeadline() {
  const [text, setText] = useState(PHRASES[0]);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      setShowCursor(false);
      return;
    }

    let cancelled = false;
    let phraseIdx = 0;
    let charIdx = PHRASES[0].length;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (cancelled) return;
      const phrase = PHRASES[phraseIdx];

      if (!deleting) {
        charIdx++;
        setText(phrase.slice(0, charIdx));
        if (charIdx >= phrase.length) {
          deleting = true;
          timer = setTimeout(tick, 1900); // hold full phrase
          return;
        }
        timer = setTimeout(tick, 55);
      } else {
        charIdx--;
        setText(phrase.slice(0, charIdx));
        if (charIdx <= 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % PHRASES.length;
          timer = setTimeout(tick, 320);
          return;
        }
        timer = setTimeout(tick, 28);
      }
    };

    timer = setTimeout(tick, 1900);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  return (
    <h1
      aria-label="Bring them into the room."
      style={{
        fontSize: "clamp(40px,6.5vw,80px)",
        lineHeight: 1.05,
        letterSpacing: "-0.03em",
        fontWeight: 500,
        margin: "0 auto",
        maxWidth: "20ch",
        minHeight: "2.1em",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span aria-hidden="true">
        {text}
        <span
          style={{
            display: "inline-block",
            width: "0.06em",
            marginLeft: "0.04em",
            alignSelf: "stretch",
            borderRight: "0.06em solid var(--accent)",
            animation: showCursor ? "cosBlink 1s step-end infinite" : "none",
            visibility: showCursor ? "visible" : "hidden",
          }}
        />
      </span>
    </h1>
  );
}
