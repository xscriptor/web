"use client";

import React, { useState, KeyboardEvent } from "react";
import styles from "./XInteractivePhrase.module.css";

// Definición de tipos para las palabras
export interface WordConfig {
  text: string;
  type: "normal" | "underline" | "button" | "blur1" | "blur2";
  breakAfter?: boolean;
}

interface XInteractivePhraseProps {
  words: WordConfig[];
}

export default function XInteractivePhrase({ words }: XInteractivePhraseProps) {
  const [active1, setActive1] = useState<boolean>(false);
  const [active2, setActive2] = useState<boolean>(false);

  // Manejador de teclado para accesibilidad
  const handleAction = (type: "underline" | "button") => {
    if (type === "underline") setActive1(!active1);
    if (type === "button") setActive2(!active2);
  };

  const onKeyDown = (e: KeyboardEvent, type: "underline" | "button") => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleAction(type);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {words.map((word, index) => {
          let dynamicClass = "";
          let clickHandler = undefined;
          let keyHandler = undefined;

          // Asignación de estilos y lógica según el tipo de palabra
          if (word.type === "underline") {
            dynamicClass = styles.underlineEffect;
            clickHandler = () => handleAction("underline");
            keyHandler = (e: KeyboardEvent) => onKeyDown(e, "underline");
          } 
          else if (word.type === "button") {
            dynamicClass = styles.buttonEffect;
            clickHandler = () => handleAction("button");
            keyHandler = (e: KeyboardEvent) => onKeyDown(e, "button");
          } 
          else if (word.type === "blur1") {
            dynamicClass = `${styles.blurEffect} ${active1 ? styles.isVisible : styles.isHidden}`;
          } 
          else if (word.type === "blur2") {
            dynamicClass = `${styles.blurEffect} ${active2 ? styles.isVisible : styles.isHidden}`;
          }

          return (
            <React.Fragment key={index}>
              <span
                className={dynamicClass}
                onClick={clickHandler}
                onKeyDown={keyHandler}
                role={clickHandler ? "button" : undefined}
                tabIndex={clickHandler ? 0 : undefined}
              >
                {word.text}
              </span>
              {word.breakAfter ? <span className={styles.lineBreak} /> : " "}
            </React.Fragment>
          );
        })}
      </h1>
    </div>
  );
}