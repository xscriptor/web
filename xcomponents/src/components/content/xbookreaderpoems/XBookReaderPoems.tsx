"use client";

import { useState, useEffect, useRef } from "react";
import XZigZagLayout from "../../layout/xzigzaglayout/XZigZagLayout";
import XInteractivePhrase from "../xinteractivephrase/XInteractivePhrase";
import type { WordConfig } from "../xinteractivephrase/XInteractivePhrase";
import styles from "./XBookReaderPoems.module.css";

type Labels = {
  prev: string;
  next: string;
  pageOf: string;
  index: string;
  coverAlt: string;
};

const BUILTIN_INDEX_HEADERS: Record<string, string> = {
  es: "Índice",
  en: "Index",
  de: "Inhaltsverzeichnis",
};

const BUILTIN_SECTION_NAMES: Record<string, string[]> = {
  es: ["TACTO", "TRANSFUSIONES", "PERSPICACIA", "INTERSECCIÓN", "INCERTIDUMBRE"],
  en: ["TOUCH", "TRANSFUSIONS", "PERSPICACITY", "INTERSECTION", "UNCERTAINTY"],
  de: ["TASTSINN", "TRANSFUSIONEN", "SCHÄRFSINN", "SCHNITTPUNKT", "UNSICHERHEIT"],
};

const BUILTIN_LABELS: Record<string, Labels> = {
  es: { prev: "Anterior", next: "Siguiente", pageOf: "Página {current} de {total}", index: "Índice", coverAlt: "Portada" },
  en: { prev: "Previous", next: "Next", pageOf: "Page {current} of {total}", index: "Index", coverAlt: "Cover" },
  de: { prev: "Zurück", next: "Weiter", pageOf: "Seite {current} von {total}", index: "Inhalt", coverAlt: "Titelbild" },
};

interface IndexEntry {
  text: string;
  isSection: boolean;
}

interface PageItem {
  type: "section_title" | "poem_block" | "content" | "image" | "index";
  title?: string;
  content: string;
  entries?: IndexEntry[];
  alt?: string;
  src?: string;
}

function normalizeWS(s: string): string {
  return s.replace(/\s+/g, " ");
}

function parseIndex(rawText: string, indexHeader: string, sectionNames: string[]): {
  knownTitles: Map<string, string>;
  sectionTitles: Set<string>;
  orderedTitles: Map<string, string[]>;
} {
  const idx = rawText.match(new RegExp(`\\n*${indexHeader}\\n[\\s\\S]*$`));
  const knownTitles = new Map<string, string>();
  const sectionTitles = new Set<string>();
  const orderedTitles = new Map<string, string[]>();
  if (!idx) return { knownTitles, sectionTitles, orderedTitles };

  const knownSections = new Set(sectionNames);

  let currentSection = "";
  const lines = idx[0].split("\n");
  for (const line of lines) {
    const t = line.trim();
    if (!t || t === indexHeader) continue;
    if (/^\d+$/.test(t)) continue;

    const upperT = t.toUpperCase().replace(/\.$/, "").trim();
    if (knownSections.has(upperT)) {
      currentSection = upperT;
      orderedTitles.set(currentSection, []);
      sectionTitles.add(upperT);
      continue;
    }

    if (/\.{4,}\s*\d+/.test(t)) {
      const entryRegex = /(.*?)\.{4,}\s*\d+/g;
      let m: RegExpExecArray | null;
      while ((m = entryRegex.exec(t)) !== null) {
        const title = m[1].trim();
        if (title) {
          const key = normalizeWS(title.toLowerCase());
          knownTitles.set(key, title);
          if (currentSection) {
            orderedTitles.get(currentSection)!.push(key);
          }
        }
      }
    }
  }

  return { knownTitles, sectionTitles, orderedTitles };
}

function reorderPoems(
  items: PageItem[],
  orderedTitles: Map<string, string[]>
): PageItem[] {
  const result: PageItem[] = [];
  let i = 0;

  while (i < items.length) {
    result.push(items[i]);
    i++;

    if (items[i - 1].type === "section_title") {
      const sectionName = items[i - 1].content.toUpperCase();
      const desiredOrder = orderedTitles.get(sectionName);
      if (!desiredOrder || desiredOrder.length === 0) continue;

      const sectionItems: PageItem[] = [];
      while (i < items.length && items[i].type !== "section_title") {
        sectionItems.push(items[i]);
        i++;
      }

      const poemBlocks: PageItem[] = [];
      const nonPoems: PageItem[] = [];
      for (const it of sectionItems) {
        if (it.type === "poem_block") poemBlocks.push(it);
        else nonPoems.push(it);
      }

      const titleOrder = new Map<string, number>();
      desiredOrder.forEach((key, idx) => titleOrder.set(key, idx));

      const origIndex = new Map<PageItem, number>();
      sectionItems.forEach((it, idx) => origIndex.set(it, idx));

      poemBlocks.sort((a, b) => {
        const ka = normalizeWS((a.title || "").toLowerCase());
        const kb = normalizeWS((b.title || "").toLowerCase());
        const oa = titleOrder.get(ka) ?? 999;
        const ob = titleOrder.get(kb) ?? 999;
        if (oa !== ob) return oa - ob;
        return (origIndex.get(a) ?? 0) - (origIndex.get(b) ?? 0);
      });

      const newSection: PageItem[] = [];
      const poemUsed = new Set<PageItem>();
      const lastPoemForNonPoem = new Map<PageItem, PageItem | null>();
      let lastPoem: PageItem | null = null;
      for (const it of sectionItems) {
        if (it.type === "poem_block") {
          lastPoem = it;
        } else {
          lastPoemForNonPoem.set(it, lastPoem);
        }
      }

      for (const poem of poemBlocks) {
        poemUsed.add(poem);
        newSection.push(poem);
        for (const np of nonPoems) {
          if (lastPoemForNonPoem.get(np) === poem) {
            newSection.push(np);
          }
        }
      }

      for (const np of nonPoems) {
        if (lastPoemForNonPoem.get(np) === null) {
          newSection.unshift(np);
        }
      }

      result.push(...newSection);
    }
  }

  return result;
}

function parseContent(rawText: string, indexHeader: string, sectionNames: string[]): PageItem[] {
  const { knownTitles, sectionTitles, orderedTitles } = parseIndex(rawText, indexHeader, sectionNames);

  const text = rawText.replace(new RegExp(`\\n*${indexHeader}[\\s\\S]*$`), "").trim();

  const normalized = text
    .split("\n")
    .map((l) => (/^\s*$/.test(l) ? "" : l))
    .join("\n");

  const blocks = normalized
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter((b) => b.length > 0);

  const sortedKeys = [...knownTitles.keys()].sort(
    (a, b) => b.length - a.length
  );

  function findKnownTitle(text: string): string | null {
    const n = normalizeWS(text.toLowerCase());
    for (const key of sortedKeys) {
      if (n.startsWith(key)) return key;
    }
    return null;
  }

  const items: PageItem[] = [];
  let insidePoemSection = false;

  for (const block of blocks) {
    const nonEmpty = block.split("\n").filter((l) => l.trim().length > 0);
    const firstLine = nonEmpty[0]?.trim() || "";

    if (firstLine && sectionTitles.has(firstLine.toUpperCase())) {
      items.push({ type: "section_title", content: firstLine });
      insidePoemSection = true;
      continue;
    }

    const imgMatch = block.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      items.push({
        type: "image",
        content: "",
        alt: imgMatch[1],
        src: imgMatch[2],
      });
      continue;
    }

    if (insidePoemSection) {
      let curTitle: string | null = null;
      let curContent: string[] = [];

      for (const line of nonEmpty) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        const sectMatch = sectionTitles.has(trimmed.toUpperCase());
        if (sectMatch && line === line.trim()) {
          if (curTitle) {
            items.push({
              type: "poem_block",
              title: curTitle,
              content: curContent.join("\n"),
            });
          } else if (curContent.length > 0) {
            items.push({
              type: "content",
              content: curContent.join("\n"),
            });
          }
          items.push({ type: "section_title", content: trimmed });
          curTitle = null;
          curContent = [];
          continue;
        }

        const matchedKey = findKnownTitle(trimmed);
        if (matchedKey && line === line.trim()) {
          if (curTitle) {
            items.push({
              type: "poem_block",
              title: curTitle,
              content: curContent.join("\n"),
            });
          } else if (curContent.length > 0) {
            items.push({
              type: "content",
              content: curContent.join("\n"),
            });
          }
          curTitle = knownTitles.get(matchedKey)!;
          curContent = [];
          const afterTitle = trimmed.substring(matchedKey.length).trim();
          if (afterTitle) curContent.push(afterTitle);
        } else {
          curContent.push(line);
        }
      }

      if (curTitle) {
        items.push({
          type: "poem_block",
          title: curTitle,
          content: curContent.join("\n"),
        });
      } else if (curContent.length > 0) {
        items.push({
          type: "content",
          content: curContent.join("\n"),
        });
      }
    } else {
      if (
        nonEmpty.length === 1 &&
        /^[A-ZÁÉÍÓÚÑ\s]{2,}$/.test(firstLine)
      ) {
        items.push({ type: "poem_block", title: firstLine, content: "" });
      } else {
        items.push({ type: "content", content: block });
      }
    }
  }

  const merged: PageItem[] = [];
  for (let i = 0; i < items.length; i++) {
    if (
      items[i].type === "poem_block" &&
      !items[i].content &&
      i + 1 < items.length &&
      items[i + 1].type === "content"
    ) {
      merged.push({
        type: "poem_block",
        title: items[i].title,
        content: items[i + 1].content,
      });
      i++;
    } else {
      merged.push(items[i]);
    }
  }

  const reordered = reorderPoems(merged, orderedTitles);

  const idx = rawText.match(new RegExp(`\\n*${indexHeader}\\n[\\s\\S]*$`));
  if (idx) {
    const entries: IndexEntry[] = [];
    const lines = idx[0].split("\n");
    for (const line of lines) {
      const t = line.trim();
      if (!t || t === indexHeader) continue;
      if (/^\d+$/.test(t)) continue;
      if (/\.{4,}\s*\d+/.test(t)) {
        entries.push({ text: t, isSection: false });
      } else {
        entries.push({ text: t, isSection: true });
      }
    }
    if (entries.length > 0) {
      reordered.push({ type: "index", content: "", entries });
    }
  }

  return reordered;
}

function groupIntoPages(items: PageItem[], withCover: boolean): PageItem[][] {
  const pages: PageItem[][] = [];
  if (withCover) pages.push([]);

  let page: PageItem[] = [];
  for (const item of items) {
    if (item.type === "section_title" || item.type === "index") {
      if (page.length > 0) {
        pages.push(page);
        page = [];
      }
      pages.push([item]);
      continue;
    }
    page.push(item);
    const maxPerPage = pages.length % 2 === 0 ? 4 : 5;
    if (page.length >= maxPerPage) {
      pages.push(page);
      page = [];
    }
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
    if (
      !wordConfigs.some((w) => w.type === reqType) &&
      wordConfigs.length > requiredTypes.length
    ) {
      let idx = (poemText.length * 2) % wordConfigs.length;
      let attempts = 0;
      while (
        wordConfigs[idx].type !== "normal" &&
        attempts < wordConfigs.length
      ) {
        idx = (idx + 1) % wordConfigs.length;
        attempts++;
      }
      wordConfigs[idx].type = reqType;
    }
  });

  return wordConfigs;
}

export type XBookReaderPoemsProps = {
  rawText: string;
  coverImage?: string;
  locale?: string;
  labels?: Partial<Labels>;
  messages?: Record<string, Partial<Labels>>;
  indexHeaders?: Record<string, string>;
  sectionNames?: Record<string, string[]>;
};

export function XBookReaderPoems({
  rawText,
  coverImage,
  locale = "es",
  labels,
  messages,
  indexHeaders,
  sectionNames,
}: XBookReaderPoemsProps) {
  const resolvedLabels = { ...BUILTIN_LABELS[locale], ...messages?.[locale], ...labels } as Labels;
  const resolvedIndexHeader = indexHeaders?.[locale] ?? BUILTIN_INDEX_HEADERS[locale] ?? "Index";
  const resolvedSectionNames = sectionNames?.[locale] ?? BUILTIN_SECTION_NAMES[locale] ?? [];
  const [pages, setPages] = useState<PageItem[][]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageInput, setPageInput] = useState("1");
  const inputRef = useRef<HTMLInputElement>(null);
  const bookContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const items = parseContent(rawText, resolvedIndexHeader, resolvedSectionNames);
    const grouped = groupIntoPages(items, !!coverImage);
    setPages(grouped);
    setCurrentPage(0);
    setPageInput("1");
  }, [rawText, coverImage]);

  const totalPages = pages.length;
  if (totalPages === 0) return null;

  const currentItems = pages[currentPage];
  const isSectionTitlePage =
    currentItems.length === 1 && currentItems[0].type === "section_title";
  const isIndexPage =
    currentItems.length === 1 && currentItems[0].type === "index";
  const isCoverPage = currentPage === 0 && !!coverImage;

  const handlePrev = () => {
    const next = Math.max(0, currentPage - 1);
    setCurrentPage(next);
    setPageInput(String(next + 1));
  };

  const handleNext = () => {
    const next = Math.min(totalPages - 1, currentPage + 1);
    setCurrentPage(next);
    setPageInput(String(next + 1));
    requestAnimationFrame(() => {
      bookContentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value.replace(/\D/g, ""));
  };

  const handlePageInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") jumpToPage();
  };

  const jumpToPage = () => {
    const num = parseInt(pageInput, 10);
    if (num >= 1 && num <= totalPages) {
      setCurrentPage(num - 1);
    } else {
      setPageInput(String(currentPage + 1));
    }
  };

  return (
    <div className={styles.readerContainer}>
      <div ref={bookContentRef} className={styles.bookContent}>
        {isCoverPage && coverImage && (
          <div className={styles.imageCenterWrapper}>
            <img src={coverImage} alt={resolvedLabels.coverAlt} className={styles.coverImage} />
          </div>
        )}

        {isSectionTitlePage ? (
          <div className={styles.sectionTitlePage}>
            <h2 className={styles.sectionTitle}>
              {currentItems[0].content}
            </h2>
          </div>
        ) : isIndexPage && currentItems[0].entries ? (
          <div className={styles.indexPage}>
            <h2 className={styles.indexTitle}>{resolvedLabels.index}</h2>
            <div className={styles.indexList}>
              {currentItems[0].entries.map((entry, i) => (
                <span
                  key={i}
                  className={
                    entry.isSection
                      ? styles.indexEntrySection
                      : styles.indexEntry
                  }
                >
                  {entry.text}
                </span>
              ))}
            </div>
          </div>
        ) : isCoverPage ? null : (
          <XZigZagLayout
            className="mt-8"
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
                  <div key={index} className={styles.imageBlockWrapper}>
                    <img
                      src={item.src}
                      alt={item.alt || ""}
                      className={styles.inlineImage}
                    />
                  </div>
                );
              }
              if (item.type === "poem_block") {
                return (
                  <div key={index} className={styles.poemWrapper}>
                    {item.title && (
                      <h3 className={styles.poemTitle}>{item.title}</h3>
                    )}
                    {item.content && (
                      <XInteractivePhrase
                        words={parsePoemToWords(item.content)}
                        as="p"
                      />
                    )}
                  </div>
                );
              }
              return (
                <div key={index} className={styles.poemWrapper}>
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
  );
}
