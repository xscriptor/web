"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import XZigZagLayout from "../../layout/xzigzaglayout/XZigZagLayout";
import type { WordConfig } from "../xinteractivephrase/XInteractivePhrase";
import styles from "./XBookColors.module.css";

type Locale = "es" | "en" | "de" | "it" | "fr";

export type XBookColorsProps = {
  rawText: string;
  coverImage?: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  bgConfig?: {
    basePath: string;
    total: number;
    digits?: number;
    format?: string;
  };
  locale?: Locale;
  overlayColor?: string;
  labels?: { prev?: string; next?: string; pageOf?: string; index?: string };
  onPageChange?: (page: number) => void;
  sectionNames?: Record<Locale, string[]>;
};

const DEFAULT_LABELS: Record<Locale, { prev: string; next: string; pageOf: string; index: string }> = {
  es: { prev: "Anterior", next: "Siguiente", pageOf: "Página {current} de {total}", index: "Índice" },
  en: { prev: "Previous", next: "Next", pageOf: "Page {current} of {total}", index: "Index" },
  de: { prev: "Zurück", next: "Weiter", pageOf: "Seite {current} von {total}", index: "Inhalt" },
  it: { prev: "Precedente", next: "Successivo", pageOf: "Pagina {current} di {total}", index: "Indice" },
  fr: { prev: "Précédent", next: "Suivant", pageOf: "Page {current} sur {total}", index: "Index" },
};

const DEFAULT_SECTION_NAMES: Record<Locale, string[]> = {
  es: ["LUCIÉRNAGAS", "UNIVERSO", "CONSTELACIONES", "INSTANTES", "AUTOPSIA", "I", "II", "III", "IV", "V"],
  en: ["FIREFLIES", "UNIVERSE", "CONSTELLATIONS", "INSTANTS", "AUTOPSY", "I", "II", "III", "IV", "V"],
  de: ["LEUCHTKÄFER", "UNIVERSUM", "KONSTELLATIONEN", "AUGENBLICKE", "AUTOPSIE", "I", "II", "III", "IV", "V"],
  it: ["LUCCIOLE", "UNIVERSO", "COSTELLAZIONI", "ISTANTI", "AUTOPSIA", "I", "II", "III", "IV", "V"],
  fr: ["LUCIOLES", "UNIVERS", "CONSTELLATIONS", "INSTANTS", "AUTOPSIE", "I", "II", "III", "IV", "V"],
};

const INDEX_HEADERS: Record<Locale, string> = {
  es: "Índice", en: "Index", de: "Inhalt", it: "Indice", fr: "Index",
};

interface IndexEntry { text: string; isSection: boolean; }

interface PageItem {
  type: "section_title" | "content" | "image" | "index";
  content: string;
  entries?: IndexEntry[];
  alt?: string;
  src?: string;
}

function parseContent(rawText: string, locale: Locale, customSectionNames?: string[]): PageItem[] {
  const sectionNames = new Set(customSectionNames || DEFAULT_SECTION_NAMES[locale]);
  const text = rawText.replace(new RegExp(`\\n*${INDEX_HEADERS[locale]}[\\s\\S]*$`), "").trim();
  const normalized = text.split("\n").map((l) => (/^\s*$/.test(l) ? "" : l)).join("\n");
  const blocks = normalized.split(/\n{2,}/).map((b) => b.trim()).filter((b) => b.length > 0);
  const items: PageItem[] = [];

  for (const block of blocks) {
    const firstLine = block.split("\n").filter((l) => l.trim().length > 0)[0]?.trim() || "";
    if (firstLine && sectionNames.has(firstLine.toUpperCase())) {
      items.push({ type: "section_title", content: firstLine });
      continue;
    }
    const imgMatch = block.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      items.push({ type: "image", content: "", alt: imgMatch[1], src: imgMatch[2] });
      continue;
    }
    items.push({ type: "content", content: block });
  }

  const idx = rawText.match(new RegExp(`\\n*${INDEX_HEADERS[locale]}\\n[\\s\\S]*$`));
  if (idx) {
    const entries: IndexEntry[] = [];
    const lines = idx[0].split("\n");
    for (const line of lines) {
      const t = line.trim();
      if (!t || t === INDEX_HEADERS[locale]) continue;
      if (/^\d+$/.test(t)) continue;
      if (/(\.{4,}\s*\d+|-\s*\d+)/.test(t)) {
        entries.push({ text: t, isSection: false });
      } else {
        entries.push({ text: t, isSection: true });
      }
    }
    if (entries.length > 0) items.push({ type: "index", content: "", entries });
  }
  return items;
}

function groupIntoPages(items: PageItem[], withCover: boolean): PageItem[][] {
  const pages: PageItem[][] = [];
  if (withCover) pages.push([]);
  let page: PageItem[] = [];
  for (const item of items) {
    if (item.type === "section_title" || item.type === "index") {
      if (page.length > 0) { pages.push(page); page = []; }
      pages.push([item]);
      continue;
    }
    page.push(item);
    const maxPerPage = pages.length % 2 === 0 ? 4 : 5;
    if (page.length >= maxPerPage) { pages.push(page); page = []; }
  }
  if (page.length > 0) pages.push(page);
  return pages;
}

type XDecryptedTextProps = {
  text: string;
  speed?: number;
  maxIterations?: number;
  useOriginalCharsOnly?: boolean;
  characters?: string;
  animateOn?: "view";
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

  return (
    <motion.span ref={containerRef} className="inline-block whitespace-pre-wrap">
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

  const total = wordConfigs.length;
  if (total <= 3) {
    if (total === 1) {
      wordConfigs[0].type = "underline";
    } else if (total === 2) {
      wordConfigs[0].type = "underline";
      wordConfigs[1].type = "blur1";
    } else {
      wordConfigs[0].type = "underline";
      wordConfigs[1].type = "blur1";
      wordConfigs[2].type = "button";
    }
  } else {
    const requiredTypes: WordType[] = ["underline", "button", "blur1", "blur2"];
    requiredTypes.forEach((reqType) => {
      if (!wordConfigs.some((w) => w.type === reqType)) {
        const normalIdx = wordConfigs.findIndex((w) => w.type === "normal");
        if (normalIdx !== -1) {
          wordConfigs[normalIdx].type = reqType;
        } else {
          for (let i = wordConfigs.length - 1; i >= 0; i--) {
            if (wordConfigs[i].type !== reqType) { wordConfigs[i].type = reqType; break; }
          }
        }
      }
    });
  }

  return wordConfigs;
}

const WORD_COLORS: (string | null)[] = [
  "c1", null, null, "c2", null, null,
  "c3", null, null, "c4", null, null,
  "c5", null, null,
];
const COLOR_INTERVAL = 2;

function XBookFullDecrypt({ content, wordHex }: { content: string; wordHex: Record<string, string> }) {
  const [active1, setActive1] = useState(false);
  const [active2, setActive2] = useState(false);
  const words = parseWords(content);

  const handleAction = (type: string) => {
    if (type === "underline") setActive1((v) => !v);
    if (type === "button") setActive2((v) => !v);
  };

  const onKeyDown = (e: React.KeyboardEvent, type: string) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleAction(type); }
  };

  return (
    <span>
      {words.map((word, i) => {
        let clickHandler: (() => void) | undefined;
        let keyHandler: ((e: React.KeyboardEvent) => void) | undefined;
        if (word.type === "underline") { clickHandler = () => handleAction("underline"); keyHandler = (e) => onKeyDown(e, "underline"); }
        else if (word.type === "button") { clickHandler = () => handleAction("button"); keyHandler = (e) => onKeyDown(e, "button"); }

        let contentEl: ReactNode = <XDecryptedText text={word.text} speed={50} animateOn="view" />;
        if (word.italic) contentEl = <em>{contentEl}</em>;
        if (word.bold) contentEl = <strong>{contentEl}</strong>;

        const wordKey = WORD_COLORS[Math.floor(i / COLOR_INTERVAL) % WORD_COLORS.length];
        const wordHexColor = wordKey ? wordHex[wordKey] : undefined;

        const isBlur = word.type === "blur1" || word.type === "blur2";
        const blurHidden = isBlur && (word.type === "blur1" ? !active1 : !active2);

        const combinedStyle: React.CSSProperties = {
          ...(wordHexColor ? { color: wordHexColor, "--c-word": wordHexColor } as React.CSSProperties : {}),
          ...(blurHidden ? { filter: "blur(10px)", opacity: 0.3, userSelect: "none" } as React.CSSProperties : {}),
        };

        let cls = styles.wordBase;
        if (word.type === "underline") cls += " " + styles.underline;
        else if (word.type === "button") cls += " " + styles.button;
        else if (!isBlur) cls += " " + styles.normal;

        return (
          <span key={i}>
            <span className={cls} style={combinedStyle}
              onClick={clickHandler} onKeyDown={keyHandler}
              role={clickHandler ? "button" : undefined} tabIndex={clickHandler ? 0 : undefined}>
              {contentEl}
            </span>
            {word.breakAfter ? <span className={styles.breakLine} /> : " "}
          </span>
        );
      })}
    </span>
  );
}

const DARK_COLORS = {
  "--c0": "#0a0a0a", "--c1": "#fc618d", "--c2": "#7eddc9", "--c3": "#8eeca3",
  "--c4": "#fce566", "--c5": "#b8a8ff", "--c6": "#f7f1ff", "--c7": "#f7f1ff",
} as const;

const LIGHT_COLORS = {
  "--c0": "#ffffff", "--c1": "#8f002a", "--c2": "#007052", "--c3": "#265731",
  "--c4": "#7a6e14", "--c5": "#5a4e9e", "--c6": "#2d2d4a", "--c7": "#2d2d4a",
} as const;

const DARK_WORD_HEX: Record<string, string> = {
  c1: "#fc618d", c2: "#7eddc9", c3: "#8eeca3", c4: "#fce566", c5: "#b8a8ff",
};
const LIGHT_WORD_HEX: Record<string, string> = {
  c1: "#8f002a", c2: "#007052", c3: "#265731", c4: "#7a6e14", c5: "#5a4e9e",
};
const BLOCK_COLORS = ["c1", "c2", "c3", "c4", "c5"];

function useDetectTheme(): "dark" | "light" {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  useEffect(() => {
    const check = () => setTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);
  return theme;
}

export default function XBookColors({
  rawText, coverImage, backgroundImage, backgroundVideo, bgConfig,
  locale = "es", overlayColor, labels, onPageChange, sectionNames,
}: XBookColorsProps) {
  const [pages, setPages] = useState<PageItem[][]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageInput, setPageInput] = useState("1");
  const [bgIndex, setBgIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const bookContentRef = useRef<HTMLDivElement>(null);
  const mergedLabels = { ...DEFAULT_LABELS[locale], ...labels };
  const theme = useDetectTheme();
  const wordHex = theme === "dark" ? DARK_WORD_HEX : LIGHT_WORD_HEX;
  const baseVars = theme === "dark" ? DARK_COLORS : LIGHT_COLORS;
  const themeVars = { ...baseVars } as const;
  const resolvedSectionNames = sectionNames ? sectionNames[locale] : undefined;

  useEffect(() => {
    const items = parseContent(rawText, locale, resolvedSectionNames);
    const grouped = groupIntoPages(items, !!coverImage);
    setPages(grouped);
    setCurrentPage(0); setPageInput("1"); setBgIndex(0);
  }, [rawText, coverImage, locale]);

  const goToPage = (page: number) => {
    setCurrentPage(page); setPageInput(String(page + 1));
    if (bgConfig) setBgIndex(page);
    onPageChange?.(page);
  };

  const totalPages = pages.length;
  if (totalPages === 0) return null;

  const currentItems = pages[currentPage];
  const isSectionTitlePage = currentItems.length === 1 && currentItems[0].type === "section_title";
  const isIndexPage = currentItems.length === 1 && currentItems[0].type === "index";
  const isCoverPage = currentPage === 0 && !!coverImage;

  const resolvedBg = bgConfig
    ? `${bgConfig.basePath}${String((bgIndex % bgConfig.total) + 1).padStart(bgConfig.digits ?? 2, "0")}.${bgConfig.format ?? "webp"}`
    : backgroundImage;

  const handlePrev = () => goToPage(Math.max(0, currentPage - 1));
  const handleNext = () => {
    const next = Math.min(totalPages - 1, currentPage + 1);
    goToPage(next);
    requestAnimationFrame(() => bookContentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };
  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setPageInput(e.target.value.replace(/\D/g, ""));
  const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter") jumpToPage(); };
  const jumpToPage = () => {
    const num = parseInt(pageInput, 10);
    if (num >= 1 && num <= totalPages) goToPage(num - 1);
    else setPageInput(String(currentPage + 1));
  };

  const showBg = resolvedBg || backgroundVideo;
  const overlayBg = overlayColor || "rgba(0, 0, 0, 0.45)";

  return (
    <div className={styles.wrapper} style={themeVars as React.CSSProperties}>
      {showBg && (
        <div className={styles.bgContainer}>
          {backgroundVideo
            ? <video src={backgroundVideo} autoPlay muted loop playsInline className={styles.bgMedia} />
            : <img src={resolvedBg!} alt="" className={styles.bgMedia} />}
          <div className={styles.bgOverlay} style={{ background: overlayBg }} />
        </div>
      )}
      <div className={styles.readerContainer}>
        <div ref={bookContentRef} className={styles.bookContent}>
          {isCoverPage && coverImage && (
            <div className={styles.coverWrapper}>
              <img src={coverImage} alt="Cover" className={styles.coverImage} />
            </div>
          )}
          {isSectionTitlePage && (
            <div className={styles.sectionTitlePage}>
              <h2 className={styles.sectionTitle}>{currentItems[0].content}</h2>
            </div>
          )}
          {isIndexPage && currentItems[0].entries && (
            <div className={styles.indexPage}>
              <h2 className={styles.indexTitle}>{mergedLabels.index}</h2>
              <div className={styles.indexList}>
                {currentItems[0].entries.map((entry, i) => (
                  <span key={i} className={entry.isSection ? styles.indexEntrySection : styles.indexEntry}>
                    {entry.text}
                  </span>
                ))}
              </div>
            </div>
          )}
          {!isCoverPage && !isSectionTitlePage && !isIndexPage && (
            <XZigZagLayout startSide="left" gap={6} offset="clamp(1rem, 4vw, 4rem)" textAlign="side"
              showLine={true} lineColor={wordHex[BLOCK_COLORS[currentPage % BLOCK_COLORS.length]]} lineThickness={0.5}>
              {currentItems.map((item, index) => {
                if (item.type === "image") {
                  return (
                    <div key={index} className={styles.imageBlock}>
                      <img src={item.src} alt={item.alt || ""} className={styles.inlineImage} />
                    </div>
                  );
                }
                return (
                  <div key={index} className={styles.poemBlock}>
                    <XBookFullDecrypt content={item.content} wordHex={wordHex} />
                  </div>
                );
              })}
            </XZigZagLayout>
          )}
        </div>
        <div className={styles.pagination}>
          <button onClick={handlePrev} disabled={currentPage === 0} className={styles.pageButton} aria-label={mergedLabels.prev}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <span className={styles.pageIndicator}>
            {mergedLabels.pageOf.split("{current}")[0]}
            <input ref={inputRef} type="text" inputMode="numeric" className={styles.pageInput}
              value={pageInput} onChange={handlePageInputChange} onKeyDown={handlePageInputKeyDown} onBlur={jumpToPage} />
            {mergedLabels.pageOf.split("{current}")[1].split("{total}")[0]}{totalPages}
          </span>
          <button onClick={handleNext} disabled={currentPage === totalPages - 1} className={styles.pageButton} aria-label={mergedLabels.next}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
