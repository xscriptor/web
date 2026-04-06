import React, { Children, HTMLAttributes } from "react";
import styles from "./XZigZagLayout.module.css";

type XZigZagLayoutProps = HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  startSide?: "left" | "right";
  gap?: number | string;
  offset?: number | string;
  textAlign?: "inherit" | "side" | "left" | "right";
};

export default function XZigZagLayout({
  children,
  className,
  style,
  startSide = "left",
  gap,
  offset,
  textAlign = "inherit",
  ...rest
}: XZigZagLayoutProps) {
  const items = Children.toArray(children).filter(Boolean);

  const cssVars: Record<string, string> = {};

  if (gap !== undefined) {
    cssVars["--x-zigzag-gap"] = typeof gap === "number" ? `${gap}px` : gap;
  }

  if (offset !== undefined) {
    cssVars["--x-zigzag-offset"] =
      typeof offset === "number" ? `${offset}px` : offset;
  }

  const mergedStyle: React.CSSProperties = {
    ...style,
    ...(cssVars as React.CSSProperties),
  };

  return (
    <div
      {...rest}
      className={[styles.layout, className].filter(Boolean).join(" ")}
      style={mergedStyle}
    >
      {items.map((child, index) => {
        const isStartLeft = startSide === "left";
        const alignLeft = isStartLeft ? index % 2 === 0 : index % 2 !== 0;
        const alignmentClass =
          textAlign === "side"
            ? alignLeft
              ? styles.textLeft
              : styles.textRight
            : textAlign === "left"
              ? styles.textLeft
              : textAlign === "right"
                ? styles.textRight
                : "";

        return (
          <div
            key={index}
            className={`${styles.item} ${alignLeft ? styles.left : styles.right} ${alignmentClass}`}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}