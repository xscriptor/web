"use client";

import { useState, Fragment } from "react";
import XDecryptedText from "../xdecryptedtext/XDecryptedText";

type WordType = "underline" | "button" | "blur1" | "blur2" | "normal";

interface WordConfig {
  text: string;
  type: WordType;
  breakAfter?: boolean;
  italic?: boolean;
  bold?: boolean;
}

const STYLES_ID = "xbfd-styles";

function injectStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLES_ID)) return;
  const style = document.createElement("style");
  style.id = STYLES_ID;
  style.textContent = `
    .xbfd-wordBase {
      background: color-mix(in srgb, var(--bg) 88%, transparent);
      padding: 0.1em 0.35em;
      border-radius: 0.2em;
      box-decoration-break: clone;
      -webkit-box-decoration-break: clone;
    }
    .xbfd-underline {
      position: relative;
      cursor: pointer;
      display: inline;
      transition: color 0.3s ease;
    }
    .xbfd-underline::after {
      content: "";
      position: absolute;
      bottom: -2px;
      left: 0;
      height: 0.15em;
      width: 100%;
      background: repeating-linear-gradient(
        45deg, transparent, transparent 2px,
        var(--accent, #0070f3) 2px, var(--accent, #0070f3) 4px
      );
      transition: opacity 0.3s ease;
    }
    .xbfd-underline:hover::after { opacity: 0; }
    .xbfd-button {
      display: inline;
      padding: 0.1em 0.6em;
      border: 2px dashed var(--accent, #0070f3);
      border-radius: 9999px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .xbfd-button:hover {
      background: var(--accent, #0070f3);
      color: var(--bg, #fff);
    }
    .xbfd-normal { display: inline; }
    .xbfd-blur {
      display: inline;
      transition: filter 0.7s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.7s ease;
    }
    .xbfd-blurHidden {
      filter: blur(10px);
      opacity: 0.3;
      user-select: none;
    }
    .xbfd-blurVisible {
      filter: blur(0);
      opacity: 1;
    }
    .xbfd-breakLine {
      display: block;
      height: 0.8rem;
    }
  `;
  document.head.appendChild(style);
}

function parseWords(poemText: string): WordConfig[] {
  const lines = poemText.split("\n").filter((l) => l.trim().length > 0);
  const wordConfigs: WordConfig[] = [];
  lines.forEach((line, lineIndex) => {
    const words = line.split(" ").filter((w) => w.trim().length > 0);
    const chunks: string[] = [];
    let currentChunk: string[] = [];
    words.forEach((w) => {
      currentChunk.push(w);
      if (currentChunk.length >= 1 + (w.length % 3)) {
        chunks.push(currentChunk.join(" "));
        currentChunk = [];
      }
    });
    if (currentChunk.length > 0) chunks.push(currentChunk.join(" "));
    chunks.forEach((chunkText, chunkIndex) => {
      const hash = chunkText.length + chunkIndex * 3 + lineIndex * 5;
      let type: WordType = "normal";
      if (hash % 7 === 0) type = "underline";
      else if (hash % 11 === 0) type = "button";
      else if (hash % 13 === 0) type = "blur1";
      else if (hash % 17 === 0) type = "blur2";
      wordConfigs.push({
        text: chunkText,
        type,
        breakAfter: chunkIndex === chunks.length - 1,
        italic: hash % 4 === 0,
        bold: hash % 9 === 0,
      });
    });
  });
  const requiredTypes: WordType[] = ["underline", "button", "blur1", "blur2"];
  requiredTypes.forEach((reqType) => {
    if (!wordConfigs.some((w) => w.type === reqType) && wordConfigs.length > requiredTypes.length) {
      let idx = (poemText.length * 2) % wordConfigs.length;
      let attempts = 0;
      while (wordConfigs[idx].type !== "normal" && attempts < wordConfigs.length) {
        idx = (idx + 1) % wordConfigs.length;
        attempts++;
      }
      wordConfigs[idx].type = reqType;
    }
  });
  if (!wordConfigs.some((w) => w.type === "button") && wordConfigs.length >= 2) {
    for (let i = wordConfigs.length - 1; i >= 0; i--) {
      if (wordConfigs[i].type === "normal") {
        wordConfigs[i].type = "button";
        break;
      }
    }
  }
  return wordConfigs;
}

export default function XBookFullDecrypt({
  content,
}: {
  content: string;
}) {
  const [active1, setActive1] = useState(false);
  const [active2, setActive2] = useState(false);

  injectStyles();

  const words = parseWords(content);

  const handleAction = (type: "underline" | "button") => {
    if (type === "underline") setActive1((v) => !v);
    if (type === "button") setActive2((v) => !v);
  };

  const onKeyDown = (e: React.KeyboardEvent, type: "underline" | "button") => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleAction(type);
    }
  };

  function classForType(type: WordType, active1: boolean, active2: boolean): string {
    const base = "xbfd-wordBase";
    if (type === "underline") return `${base} xbfd-underline`;
    if (type === "button") return `${base} xbfd-button`;
    if (type === "blur1") return `${base} xbfd-blur ${active1 ? "xbfd-blurVisible" : "xbfd-blurHidden"}`;
    if (type === "blur2") return `${base} xbfd-blur ${active2 ? "xbfd-blurVisible" : "xbfd-blurHidden"}`;
    return `${base} xbfd-normal`;
  }

  return (
    <span>
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

        let content: React.ReactNode = (
          <XDecryptedText
            text={word.text}
            speed={50}
            maxIterations={5}
            sequential
            revealDirection="start"
            animateOn="view"
          />
        );

        if (word.italic) content = <em>{content}</em>;
        if (word.bold) content = <strong>{content}</strong>;

        return (
          <Fragment key={i}>
            <span
              className={classForType(word.type, active1, active2)}
              onClick={clickHandler}
              onKeyDown={keyHandler}
              role={clickHandler ? "button" : undefined}
              tabIndex={clickHandler ? 0 : undefined}
            >
              {content}
            </span>
            {word.breakAfter ? <span className="xbfd-breakLine" /> : " "}
          </Fragment>
        );
      })}
    </span>
  );
}
