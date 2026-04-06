"use client";

import React, { useState, KeyboardEvent } from "react";
import styles from "./XInteractivePhrase.module.css";

export interface WordConfig {
  text: string;
  // Solo comportamientos de interacción
  type: "normal" | "underline" | "button" | "blur1" | "blur2"; 
  breakAfter?: boolean;
  italic?: boolean; // Esto controla el <em>
  bold?: boolean;   // Esto controla el <strong>
}

interface XInteractivePhraseProps {
  words: WordConfig[];
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  className?: string;
}

export default function XInteractivePhrase({ 
  words, 
  as: Tag = "p", 
  className = "" 
}: XInteractivePhraseProps) {
  const [active1, setActive1] = useState<boolean>(false);
  const [active2, setActive2] = useState<boolean>(false);

  const handleAction = (type: "underline" | "button") => {
    if (type === "underline") setActive1(!active1);
    if (type === "button") setActive2(!active2);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLSpanElement>, type: "underline" | "button") => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleAction(type);
    }
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <Tag className={styles.title}>
        {words.map((word, index) => {
          let dynamicClass = "";
          let clickHandler: (() => void) | undefined = undefined;
          let keyHandler: ((e: KeyboardEvent<HTMLSpanElement>) => void) | undefined = undefined;

          // Gestión de lógica por tipo
          if (word.type === "underline") {
            dynamicClass = styles.underlineEffect;
            clickHandler = () => handleAction("underline");
            keyHandler = (e) => onKeyDown(e, "underline");
          } 
          else if (word.type === "button") {
            dynamicClass = styles.buttonEffect;
            clickHandler = () => handleAction("button");
            keyHandler = (e) => onKeyDown(e, "button");
          } 
          else if (word.type === "blur1") {
            dynamicClass = `${styles.blurEffect} ${active1 ? styles.isVisible : styles.isHidden}`;
          } 
          else if (word.type === "blur2") {
            dynamicClass = `${styles.blurEffect} ${active2 ? styles.isVisible : styles.isHidden}`;
          }

          // Renderizado del contenido con estilos combinables
          let content: React.ReactNode = word.text;
          if (word.italic) content = <em>{content}</em>;
          if (word.bold) content = <strong>{content}</strong>;

          return (
            <React.Fragment key={index}>
              <span
                className={dynamicClass}
                onClick={clickHandler}
                onKeyDown={keyHandler}
                role={clickHandler ? "button" : undefined}
                tabIndex={clickHandler ? 0 : undefined}
              >
                {content}
              </span>
              {word.breakAfter ? <span className={styles.lineBreak} /> : " "}
            </React.Fragment>
          );
        })}
      </Tag>
    </div>
  );
}