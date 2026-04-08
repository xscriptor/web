import React, { Children, HTMLAttributes, useEffect, useRef, useState, useCallback } from "react";
import styles from "./XZigZagLayout.module.css";

export type XZigZagLayoutProps = HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  startSide?: "left" | "right";
  gap?: number | string;
  offset?: number | string;
  textAlign?: "inherit" | "side" | "left" | "right";
  showLine?: boolean;
  lineColor?: string;
  lineThickness?: number | string;
};

export default function XZigZagLayout({
  children,
  className,
  style,
  startSide = "left",
  gap,
  offset,
  textAlign = "inherit",
  showLine = false,
  lineColor = "#cccccc",
  lineThickness = 2,
  ...rest
}: XZigZagLayoutProps) {
  const items = Children.toArray(children).filter(Boolean);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const pathRef = useRef<SVGPathElement>(null);

  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const [pathLength, setPathLength] = useState(0);
  const [drawProgress, setDrawProgress] = useState(0);

  // Calcula el centro de cada elemento para dibujar los puntos
  const calculatePoints = useCallback(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();

    const newPoints = itemsRef.current.filter(Boolean).map((el) => {
      const rect = el!.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2 - containerRect.left,
        y: rect.top + rect.height / 2 - containerRect.top,
      };
    });

    if (newPoints.length > 0) {
      newPoints.unshift({ x: newPoints[0].x, y: 0 }); // Inicia arriba
      newPoints.push({ x: newPoints[newPoints.length - 1].x, y: containerRect.height }); // Termina abajo
    }

    setPoints(newPoints);
  }, []);

  useEffect(() => {
    if (!showLine || !containerRef.current) return;
    const observer = new ResizeObserver(() => calculatePoints());
    observer.observe(containerRef.current);
    calculatePoints();
    return () => observer.disconnect();
  }, [showLine, calculatePoints]);

  useEffect(() => {
    if (pathRef.current) setPathLength(pathRef.current.getTotalLength());
  }, [points]);

  useEffect(() => {
    if (!showLine) return;
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { top, height } = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const start = windowHeight / 2;
      const progress = (start - top) / height;

      setDrawProgress(Math.min(Math.max(progress, 0), 1));
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showLine]);

  const cssVars: Record<string, string> = {};
  if (gap !== undefined) cssVars["--x-zigzag-gap"] = typeof gap === "number" ? `${gap}px` : gap;
  if (offset !== undefined) cssVars["--x-zigzag-offset"] = typeof offset === "number" ? `${offset}px` : offset;

  const mergedStyle: React.CSSProperties = { ...style, ...cssVars };

  const pathD = points.length > 0
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map((p) => `L ${p.x} ${p.y}`).join(" ")
    : "";

  return (
    <div
      ref={containerRef}
      {...rest}
      className={[styles.layout, className].filter(Boolean).join(" ")}
      style={mergedStyle}
    >
      {showLine && points.length > 0 && (
        <svg className={styles.svgLine} xmlns="http://www.w3.org/2000/svg">
          <path
            ref={pathRef}
            d={pathD}
            fill="none"
            stroke={lineColor}
            strokeWidth={lineThickness}
            strokeDasharray={pathLength}
            strokeDashoffset={pathLength - pathLength * drawProgress}
            style={{ transition: "stroke-dashoffset 0.1s ease-out" }}
          />
        </svg>
      )}

      {items.map((child, index) => {
        const isStartLeft = startSide === "left";
        const alignLeft = isStartLeft ? index % 2 === 0 : index % 2 !== 0;
        const alignmentClass =
          textAlign === "side"
            ? alignLeft ? styles.textLeft : styles.textRight
            : textAlign === "left" ? styles.textLeft : textAlign === "right" ? styles.textRight : "";

        return (
          <div key={index} className={`${styles.item} ${alignLeft ? styles.left : styles.right} ${alignmentClass}`}>
            {/* El wrapper interno nos permite medir exactamente dónde queda el contenido */}
            <div ref={(el) => { itemsRef.current[index] = el; }} className={styles.contentWrapper}>
              {child}
            </div>
          </div>
        );
      })}
    </div>
  );
}