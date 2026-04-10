"use client";

import React, { useState, useEffect } from "react";
import { XInteractivePhrase, XZigZagLayout } from "@xscriptor/xcomponents";
import type { WordConfig } from "@xscriptor/xcomponents/content";

import styles from "./XBookReader.module.css";

interface XBookReaderProps {
  rawText: string;
  coverImage?: string;
}

export default function XBookReader({ rawText, coverImage }: XBookReaderProps) {
  const [pages, setPages] = useState<string[][]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    // 1. Identificar longitudes extensas de saltos de línea (3 o más) para separar poemas
    const poems = rawText
      .split(/\n{3,}/)
      .map(p => p.trim())
      .filter(p => p.length > 0);
    
    // 2. Agrupar poemas en páginas (cada 4 y 5 poemas alternando)
    const newPages: string[][] = [];
    let i = 0;
    let isEvenPage = true;
    while (i < poems.length) {
      const poemsPerPage = isEvenPage ? 4 : 5;
      newPages.push(poems.slice(i, i + poemsPerPage));
      i += poemsPerPage;
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

  const currentPoems = pages[currentPage];

  // Función de parseo que convierte el texto en WordConfig[]
  const parsePoemToWords = (poemText: string): WordConfig[] => {
    const lines = poemText.split('\n').filter(l => l.trim().length > 0);
    const wordConfigs: WordConfig[] = [];
    
    lines.forEach((line, lineIndex) => {
      const words = line.split(' ').filter(w => w.trim().length > 0);
      
      const chunks = [];
      let currentChunk: string[] = [];
      words.forEach(w => {
        currentChunk.push(w);
        // Semilla basada en la longitud para agrupar de 1 a 3 palabras
        if (currentChunk.length >= 1 + (w.length % 3)) {
          chunks.push(currentChunk.join(' '));
          currentChunk = [];
        }
      });
      if (currentChunk.length > 0) chunks.push(currentChunk.join(' '));

      chunks.forEach((chunkText, chunkIndex) => {
        const isLastInLine = chunkIndex === chunks.length - 1;
        // Hash rápido para generar estilos pseudo-aleatorios e interactividad
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
    
    // Garantizar que haya al menos un "underline", "button", "blur1" y "blur2" 
    // en cada poema para que la interactividad siempre esté disponible completa.
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
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
            <img 
              src={coverImage} 
              alt="Book Cover" 
              style={{ 
                borderRadius: '12px', 
                maxWidth: '300px', 
                width: '100%', 
                height: 'auto', 
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
              }} 
            />
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
          {currentPoems.map((poem, index) => (
            <div key={index} className={styles.poemWrapper}>
               <XInteractivePhrase words={parsePoemToWords(poem)} as="p" />
            </div>
          ))}
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
