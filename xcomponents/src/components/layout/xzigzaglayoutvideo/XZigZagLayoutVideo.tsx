"use client";

import { Children, useEffect, useRef, useState, useCallback } from "react";
import type { HTMLAttributes } from "react";
import styles from "./XZigZagLayoutVideo.module.css";

export type XZigZagLayoutVideoProps = HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  startSide?: "left" | "right";
  gap?: number | string;
  offset?: number | string;
  textAlign?: "inherit" | "side" | "left" | "right";
  showLine?: boolean;
  lineColor?: string;
  lineThickness?: number | string;
  videoSrc?: string;
  imageSrc?: string;
  overlayColor?: string;
};

export default function XZigZagLayoutVideo({
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
  videoSrc,
  imageSrc,
  overlayColor,
  ...rest
}: XZigZagLayoutVideoProps) {
  const items = Children.toArray(children).filter(Boolean);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const pathRef = useRef<SVGPathElement>(null);
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const [pathLength, setPathLength] = useState(0);
  const [drawProgress, setDrawProgress] = useState(0);
  const [inView, setInView] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const calculatePoints = useCallback(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newPoints = itemsRef.current.filter(Boolean).map((el) => {
      if (!el) return { x: 0, y: 0 };
      const rect = el.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2 - containerRect.left,
        y: rect.top + rect.height / 2 - containerRect.top,
      };
    });
    if (newPoints.length > 0) {
      newPoints.unshift({ x: newPoints[0].x, y: 0 });
      newPoints.push({
        x: newPoints[newPoints.length - 1].x,
        y: containerRect.height,
      });
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
  if (gap !== undefined)
    cssVars["--x-zigzag-gap"] =
      typeof gap === "number" ? `${gap}px` : gap;
  if (offset !== undefined)
    cssVars["--x-zigzag-offset"] =
      typeof offset === "number" ? `${offset}px` : offset;
  if (overlayColor) cssVars["--x-video-overlay"] = overlayColor;

  const mergedStyle = { ...style, ...cssVars };

  const pathD =
    points.length > 0
      ? `M ${points[0].x} ${points[0].y} ` +
        points
          .slice(1)
          .map((p) => `L ${p.x} ${p.y}`)
          .join(" ")
      : "";

  const zigzagContent = (
    <div
      ref={containerRef}
      {...rest}
      className={`XZigZagLayout_layout ${className ?? ""}`}
      style={mergedStyle}
    >
      {showLine && points.length > 0 && (
        <svg
          className="XZigZagLayout_svgLine"
          xmlns="http://www.w3.org/2000/svg"
        >
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
            ? alignLeft
              ? "XZigZagLayout_textLeft"
              : "XZigZagLayout_textRight"
            : textAlign === "left"
              ? "XZigZagLayout_textLeft"
              : textAlign === "right"
                ? "XZigZagLayout_textRight"
                : "";
        return (
          <div
            key={index}
            className={`XZigZagLayout_item ${alignLeft ? "XZigZagLayout_left" : "XZigZagLayout_right"} ${alignmentClass} ${inView ? styles.itemReveal : ""}`}
            style={{ animationDelay: `${index * 0.12}s` }}
          >
            <div
              ref={(el) => {
                itemsRef.current[index] = el;
              }}
              className="XZigZagLayout_contentWrapper"
            >
              {child}
            </div>
          </div>
        );
      })}
    </div>
  );

  if (!videoSrc && !imageSrc) return <div ref={wrapperRef}>{zigzagContent}</div>;

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      {imageSrc ? (
        <img src={imageSrc} alt="" className={styles.image} />
      ) : (
        <video src={videoSrc} autoPlay muted loop playsInline className={styles.video} />
      )}
      <div className={styles.overlay} />
      <div className={styles.content}>{zigzagContent}</div>
    </div>
  );
}
