"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import type { WordConfig } from "../xinteractivephrase/XInteractivePhrase";
import styles from "./XHomeColors.module.css";

const DARK_COLORS = {
  "--c0": "#0a0a0a",
  "--c1": "#fc618d",
  "--c2": "#7eddc9",
  "--c3": "#8eeca3",
  "--c4": "#fce566",
  "--c5": "#b8a8ff",
} as const;

const LIGHT_COLORS = {
  "--c0": "#ffffff",
  "--c1": "#8f002a",
  "--c2": "#007052",
  "--c3": "#265731",
  "--c4": "#7a6e14",
  "--c5": "#5a4e9e",
} as const;

const DARK_WORD_HEX: Record<string, string> = {
  c1: "#fc618d",
  c2: "#7eddc9",
  c3: "#8eeca3",
  c4: "#fce566",
  c5: "#b8a8ff",
};

const LIGHT_WORD_HEX: Record<string, string> = {
  c1: "#8f002a",
  c2: "#007052",
  c3: "#265731",
  c4: "#7a6e14",
  c5: "#5a4e9e",
};

const WORD_COLORS: (string | null)[] = [
  "c1", null, null,
  "c2", null, null,
  "c3", null, null,
  "c4", null, null,
  "c5", null, null,
];

const COLOR_INTERVAL = 2;

function useDetectTheme(): "dark" | "light" {
  const [theme, setTheme] = useState<"dark" | "light">("light");

  useEffect(() => {
    const check = () => {
      const attr = document.documentElement.getAttribute("data-theme");
      setTheme(attr === "dark" ? "dark" : "light");
    };
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return theme;
}

type XDecryptedTextProps = {
  text: string;
  speed?: number;
  animateOn?: "view" | "hover";
};

function XDecryptedText({ text, speed = 50, animateOn = "view" }: XDecryptedTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  const shuffleText = (original: string, revealed: Set<number>) =>
    original.split("").map((c, i) => {
      if (c === " " || revealed.has(i)) return c;
      return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 52)];
    }).join("");

  useEffect(() => {
    if (!isHovering) {
      setDisplayText(text);
      setRevealedIndices(new Set());
      setIsScrambling(false);
      return;
    }
    setIsScrambling(true);
    const revealed = new Set<number>();
    let interval: ReturnType<typeof setInterval> | null = null;
    interval = setInterval(() => {
      if (revealed.size < text.length) {
        revealed.add(revealed.size);
        setRevealedIndices(new Set(revealed));
        setDisplayText(shuffleText(text, revealed));
      } else {
        if (interval != null) clearInterval(interval);
        setDisplayText(text);
        setRevealedIndices(new Set());
        setIsScrambling(false);
      }
    }, speed);
    return () => { if (interval != null) clearInterval(interval); };
  }, [isHovering, text, speed]);

  useEffect(() => {
    if (animateOn !== "view") return;
    const cb = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((e) => { if (e.isIntersecting && !hasAnimated) { setIsHovering(true); setHasAnimated(true); } });
    };
    const obs = new IntersectionObserver(cb, { threshold: 0.1 });
    const el = containerRef.current;
    if (el) obs.observe(el);
    return () => { if (el) obs.unobserve(el); };
  }, [animateOn, hasAnimated]);

  const hoverProps = animateOn === "hover"
    ? { onMouseEnter: () => setIsHovering(true), onMouseLeave: () => setIsHovering(false) }
    : {};

  return (
    <motion.span ref={containerRef} className="inline-block whitespace-pre-wrap" {...hoverProps}>
      <span className="sr-only">{displayText}</span>
      <span aria-hidden="true">
        {displayText.split("").map((char, index) => {
          const done = revealedIndices.has(index) || !isScrambling || !isHovering;
          return <span key={index}>{char}</span>;
        })}
      </span>
    </motion.span>
  );
}

type WordType = "underline" | "button" | "blur1" | "blur2" | "normal";

export type XHomeColorsProps = {
  words: WordConfig[];
  tag?: "h1" | "h2" | "h3" | "p" | "span";
};

export default function XHomeColors({ words, tag = "p" }: XHomeColorsProps) {
  const theme = useDetectTheme();
  const wordHex = theme === "dark" ? DARK_WORD_HEX : LIGHT_WORD_HEX;
  const baseVars = theme === "dark" ? DARK_COLORS : LIGHT_COLORS;
  const [active1, setActive1] = useState(false);
  const [active2, setActive2] = useState(false);
  let wordIndex = 0;

  const handleAction = (type: string) => {
    if (type === "underline") setActive1((v) => !v);
    if (type === "button") setActive2((v) => !v);
  };

  const onKeyDown = (e: React.KeyboardEvent, type: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleAction(type);
    }
  };

  const classForType = (type: WordType) => {
    if (type === "underline") return `${styles.wordBase} ${styles.underline}`;
    if (type === "button") return `${styles.wordBase} ${styles.button}`;
    if (type === "blur1") return `${styles.wordBase} ${styles.blur} ${active1 ? styles.blurVisible : styles.blurHidden}`;
    if (type === "blur2") return `${styles.wordBase} ${styles.blur} ${active2 ? styles.blurVisible : styles.blurHidden}`;
    return `${styles.wordBase} ${styles.normal}`;
  };

  const Tag = tag;

  return (
    <Tag style={{ ...baseVars } as React.CSSProperties}>
      {words.map((word, i) => {
        let clickHandler: (() => void) | undefined;
        let keyHandler: ((e: React.KeyboardEvent) => void) | undefined;

        if (word.type === "underline") {
          clickHandler = () => handleAction("underline");
          keyHandler = (e) => onKeyDown(e, "underline");
        } else if (word.type === "button") {
          clickHandler = () => handleAction("button");
          keyHandler = (e) => onKeyDown(e, "button");
        }

        let contentEl: ReactNode = (
          <XDecryptedText
            text={word.text}
            speed={50}
            animateOn="view"
          />
        );

        if (word.italic) contentEl = <em>{contentEl}</em>;
        if (word.bold) contentEl = <strong>{contentEl}</strong>;

        const isEmpty = !word.text.trim();

        const wordKey = WORD_COLORS[Math.floor(wordIndex / COLOR_INTERVAL) % WORD_COLORS.length];
        const wordHexColor = wordKey ? wordHex[wordKey] : undefined;
        const wordStyle = wordHexColor
          ? { color: wordHexColor, "--c-word": wordHexColor } as React.CSSProperties
          : undefined;

        wordIndex++;

        if (isEmpty) {
          return <span key={i} className={styles.breakLine} />;
        }

        return (
          <span key={i}>
            <span
              className={classForType(word.type)}
              style={wordStyle}
              onClick={clickHandler}
              onKeyDown={keyHandler}
              role={clickHandler ? "button" : undefined}
              tabIndex={clickHandler ? 0 : undefined}
            >
              {contentEl}
            </span>
            {word.breakAfter ? <span className={styles.breakLine} /> : " "}
          </span>
        );
      })}
    </Tag>
  );
}
