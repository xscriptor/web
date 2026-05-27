"use client";

import React, { useState, useEffect } from "react";
import { XInteractivePhrase } from "../xinteractivephrase";
import type { WordConfig } from "../xinteractivephrase";
import { XZigZagLayout } from "../../layout/xzigzaglayout";

import styles from "./XBookReaderIllus.module.css";

interface InlineImage {
  src: string;
  alt: string;
}

type PageItem = string | InlineImage;

const IMAGE_REGEX = /^!\[([^\]]*)\]\(([^)]+)\)$/;

interface XBookReaderIllusProps {
  rawText: string;
  coverImage?: string;
}

export default function XBookReaderIllus({ rawText, coverImage }: XBookReaderIllusProps) {
  const [pages, setPages] = useState<PageItem[][]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const blocks = rawText
      .split(/\n{3,}/)
      .map(b => b.trim())
      .filter(b => b.length > 0);

    const items: PageItem[] = blocks.map(block => {
      const match = block.match(IMAGE_REGEX);
      if (match) {
        return { src: match[2], alt: match[1] || "" };
      }
      return block;
    });

    const newPages: PageItem[][] = [];
    let i = 0;
    let isEvenPage = true;
    while (i < items.length) {
      const itemsPerPage = isEvenPage ? 4 : 5;
      newPages.push(items.slice(i, i + itemsPerPage));
      i += itemsPerPage;
      isEvenPage = !isEvenPage;
    }
    setPages(newPages);
  }, [rawText]);

  if (pages.length === 0) return null;

  const handleNext = () => {
    if (currentPage < pages.length - 1) setCurrentPage(c => c + 1);
  };

  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage(c => c - 1);
  };

  const currentItems = pages[currentPage];

  const parsePoemToWords = (poemText: string): WordConfig[] => {
    const lines = poemText.split('\n').filter(l => l.trim().length > 0);
    const wordConfigs: WordConfig[] = [];

    lines.forEach((line, lineIndex) => {
      const words = line.split(' ').filter(w => w.trim().length > 0);

      const chunks = [];
      let currentChunk: string[] = [];
      words.forEach(w => {
        currentChunk.push(w);
        if (currentChunk.length >= 1 + (w.length % 3)) {
          chunks.push(currentChunk.join(' '));
          currentChunk = [];
        }
      });
      if (currentChunk.length > 0) chunks.push(currentChunk.join(' '));

      chunks.forEach((chunkText, chunkIndex) => {
        const isLastInLine = chunkIndex === chunks.length - 1;
        const hash = chunkText.length + chunkIndex * 3 + lineIndex * 5;

        let type: WordConfig['type'] = "normal";
        if (hash % 7 === 0) type = "underline";
        else if (hash % 11 === 0) type = "button";
        else if (hash % 13 === 0) type = "blur1";
        else if (hash % 17 === 0) type = "blur2";

        wordConfigs.push({
          text: chunkText,
          type: type,
          breakAfter: isLastInLine,
          italic: hash % 4 === 0,
          bold: hash % 9 === 0,
        });
      });
    });

    const requiredTypes: WordConfig['type'][] = ["underline", "button", "blur1", "blur2"];
    requiredTypes.forEach((reqType, i) => {
      if (!wordConfigs.some(w => w.type === reqType) && wordConfigs.length > requiredTypes.length) {
        let idx = (poemText.length * (i + 2)) % wordConfigs.length;
        let attempts = 0;
        while (wordConfigs[idx].type !== "normal" && attempts < wordConfigs.length) {
          idx = (idx + 1) % wordConfigs.length;
          attempts++;
        }
        wordConfigs[idx].type = reqType;
      }
    });

    return wordConfigs;
  };

  return (
    <div className={styles.readerContainer}>
      <div key={currentPage} className={styles.bookContent}>
        {currentPage === 0 && coverImage && (
          <div className={styles.imageCenterWrapper}>
            <img src={coverImage} alt="Cover" className={styles.coverImage} />
          </div>
        )}
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
            if (typeof item === 'string') {
              return (
                <div key={index} className={styles.poemWrapper}>
                  <XInteractivePhrase words={parsePoemToWords(item)} as="p" />
                </div>
              );
            }
            return (
              <div key={index} className={styles.imageBlockWrapper}>
                <img src={item.src} alt={item.alt} className={styles.inlineImage} />
              </div>
            );
          })}
        </XZigZagLayout>
      </div>

      <div className={styles.pagination}>
        <button
          onClick={handlePrev}
          disabled={currentPage === 0}
          className={styles.pageButton}
        >
          Anterior
        </button>
        <span className={styles.pageIndicator}>
          Página {currentPage + 1} de {pages.length}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === pages.length - 1}
          className={styles.pageButton}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
