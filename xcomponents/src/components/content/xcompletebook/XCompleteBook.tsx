"use client";

import { useState, useEffect, useRef } from "react";
import XInteractivePhrase from "../xinteractivephrase/XInteractivePhrase";
import type { WordConfig } from "../xinteractivephrase/XInteractivePhrase";
import XZigZagLayout from "../../layout/xzigzaglayout/XZigZagLayout";
import styles from "./XCompleteBook.module.css";

type Labels = {
  prev: string;
  next: string;
  pageOf: string;
  index: string;
};

export type XCompleteBookProps = {
  rawText: string;
  coverImage?: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  locale?: string;
  overlayColor?: string;
  labels?: Partial<Labels>;
  messages?: Record<string, Partial<Labels>>;
  indexHeaders?: Record<string, string>;
  sectionNames?: Record<string, string[]>;
  onPageChange?: (page: number) => void;
};

const BUILTIN_LABELS: Record<string, Labels> = {
  es: { prev: "Anterior", next: "Siguiente", pageOf: "Página {current} de {total}", index: "Índice" },
  en: { prev: "Previous", next: "Next", pageOf: "Page {current} of {total}", index: "Index" },
  de: { prev: "Zurück", next: "Weiter", pageOf: "Seite {current} von {total}", index: "Inhalt" },
};

const BUILTIN_SECTION_NAMES: Record<string, string[]> = {
  es: ["CURVA", "PLANO CARTESIANO", "RECTA", "I", "II", "III", "IV", "V"],
  en: ["CURVE", "CARTESIAN PLANE", "LINE", "I", "II", "III", "IV", "V"],
  de: ["KURVE", "KARTESISCHES KOORDINATENSYSTEM", "GERADE", "I", "II", "III", "IV", "V"],
};

const BUILTIN_INDEX_HEADERS: Record<string, string> = {
  es: "Índice",
  en: "Index",
  de: "Inhalt",
};

interface IndexEntry {
  text: string;
  isSection: boolean;
}

interface PageItem {
  type: "section_title" | "content" | "image" | "index";
  content: string;
  entries?: IndexEntry[];
  alt?: string;
  src?: string;
}

function parseContent(rawText: string, indexHeader: string, sectionNamesList: string[]): PageItem[] {
  const sectionNames = new Set(sectionNamesList);
  const text = rawText
    .replace(new RegExp(`\\n*${indexHeader}[\\s\\S]*$`), "")
    .trim();
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

  const idx = rawText.match(new RegExp(`\\n*${indexHeader}\\n[\\s\\S]*$`));
  if (idx) {
    const entries: IndexEntry[] = [];
    const lines = idx[0].split("\n");
    for (const line of lines) {
      const t = line.trim();
      if (!t || t === indexHeader) continue;
      if (/^\d+$/.test(t)) continue;
      if (/(\.{4,}\s*\d+|-\s*\d+)/.test(t)) {
        entries.push({ text: t, isSection: false });
      } else {
        entries.push({ text: t, isSection: true });
      }
    }
    if (entries.length > 0) {
      items.push({ type: "index", content: "", entries });
    }
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

type WordType = "underline" | "button" | "blur1" | "blur2" | "normal";

function parsePoemToWords(poemText: string): WordConfig[] {
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
      const isLastInLine = chunkIndex === chunks.length - 1;
      const hash = chunkText.length + chunkIndex * 3 + lineIndex * 5;
      let type: WordType = "normal";
      if (hash % 7 === 0) type = "underline";
      else if (hash % 11 === 0) type = "button";
      else if (hash % 13 === 0) type = "blur1";
      else if (hash % 17 === 0) type = "blur2";
      wordConfigs.push({
        text: chunkText,
        type,
        breakAfter: isLastInLine,
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
  return wordConfigs;
}

export default function XCompleteBook({
  rawText,
  coverImage,
  backgroundImage,
  backgroundVideo,
  locale = "es",
  overlayColor,
  labels,
  messages,
  indexHeaders,
  sectionNames,
  onPageChange,
}: XCompleteBookProps) {
  const resolvedLabels = { ...BUILTIN_LABELS[locale], ...messages?.[locale], ...labels } as Labels;
  const resolvedIndexHeader = indexHeaders?.[locale] ?? BUILTIN_INDEX_HEADERS[locale] ?? "Index";
  const resolvedSectionNames = sectionNames?.[locale] ?? BUILTIN_SECTION_NAMES[locale] ?? [];
  const [pages, setPages] = useState<PageItem[][]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageInput, setPageInput] = useState("1");
  const inputRef = useRef<HTMLInputElement>(null);
  const bookContentRef = useRef<HTMLDivElement>(null);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    setPageInput(String(page + 1));
    onPageChange?.(page);
  };

  useEffect(() => {
    const items = parseContent(rawText, resolvedIndexHeader, resolvedSectionNames);
    const grouped = groupIntoPages(items, !!coverImage);
    setPages(grouped);
    setCurrentPage(0);
    setPageInput("1");
  }, [rawText, coverImage, locale]);

  const totalPages = pages.length;
  if (totalPages === 0) return null;

  const currentItems = pages[currentPage];
  const isSectionTitlePage = currentItems.length === 1 && currentItems[0].type === "section_title";
  const isIndexPage = currentItems.length === 1 && currentItems[0].type === "index";
  const isCoverPage = currentPage === 0 && !!coverImage;

  const handlePrev = () => {
    goToPage(Math.max(0, currentPage - 1));
  };

  const handleNext = () => {
    const next = Math.min(totalPages - 1, currentPage + 1);
    goToPage(next);
    requestAnimationFrame(() => {
      bookContentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value.replace(/\D/g, ""));
  };

  const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") jumpToPage();
  };

  const jumpToPage = () => {
    const num = parseInt(pageInput, 10);
    if (num >= 1 && num <= totalPages) {
      goToPage(num - 1);
    } else {
      setPageInput(String(currentPage + 1));
    }
  };

  const showBg = backgroundImage || backgroundVideo;
  const overlayBg = overlayColor || "rgba(0, 0, 0, 0.45)";

  return (
    <div className={styles.wrapper}>
      {showBg && (
        <div className={styles.bgContainer}>
          {backgroundVideo ? (
            <video src={backgroundVideo} autoPlay muted loop playsInline className={styles.bgMedia} />
          ) : (
            <img src={backgroundImage!} alt="" className={styles.bgMedia} />
          )}
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
              <h2 className={styles.indexTitle}>{resolvedLabels.index}</h2>
              <div className={styles.indexList}>
                {currentItems[0].entries.map((entry, i) => (
                  <span
                    key={i}
                    className={entry.isSection ? styles.indexEntrySection : styles.indexEntry}
                  >
                    {entry.text}
                  </span>
                ))}
              </div>
            </div>
          )}

          {!isCoverPage && !isSectionTitlePage && !isIndexPage && (
            <XZigZagLayout
              startSide="left"
              gap={6}
              offset="clamp(1rem, 4vw, 4rem)"
              textAlign="side"
              showLine={true}
              lineColor="var(--accent)"
              lineThickness={0.2}
            >
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
                    <XInteractivePhrase
                      words={parsePoemToWords(item.content)}
                      as="p"
                    />
                  </div>
                );
              })}
            </XZigZagLayout>
          )}
        </div>

        <div className={styles.pagination}>
          <button
            onClick={handlePrev}
            disabled={currentPage === 0}
            className={styles.pageButton}
            aria-label={resolvedLabels.prev}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <span className={styles.pageIndicator}>
            {resolvedLabels.pageOf.split("{current}")[0]}
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              className={styles.pageInput}
              value={pageInput}
              onChange={handlePageInputChange}
              onKeyDown={handlePageInputKeyDown}
              onBlur={jumpToPage}
            />
            {resolvedLabels.pageOf.split("{current}")[1].split("{total}")[0]}
            {totalPages}
          </span>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages - 1}
            className={styles.pageButton}
            aria-label={resolvedLabels.next}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
