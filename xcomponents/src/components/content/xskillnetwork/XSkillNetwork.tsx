"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import styles from "./XSkillNetwork.module.css";

export interface XSkillNode {
  name: string;
  x: number;
  y: number;
  description: string;
  connections: number[];
  category: "frontend" | "backend" | "tool" | "core";
}

export interface XSkillNetworkProps {
  skills: XSkillNode[];
  constellationLabel?: string;
}

interface NodePos {
  x: number;
  y: number;
}

const CATEGORY_CLASS_MAP: Record<string, string> = {
  frontend: styles.catFrontend,
  backend: styles.catBackend,
  tool: styles.catTool,
  core: styles.catCore,
};

const CATEGORY_RING_MAP: Record<string, string> = {
  frontend: styles.ringFrontend,
  backend: styles.ringBackend,
  tool: styles.ringTool,
  core: styles.ringCore,
};

const XSkillNetwork: React.FC<XSkillNetworkProps> = ({
  skills,
  constellationLabel = "constellation_view",
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [positions, setPositions] = useState<NodePos[]>(() =>
    skills.map(s => ({ x: s.x, y: s.y }))
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    index: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  useEffect(() => {
    setPositions(skills.map(s => ({ x: s.x, y: s.y })));
  }, [skills]);

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d) return;
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      setPositions(prev => {
        const next = [...prev];
        next[d.index] = {
          x: d.originX + ((e.clientX - d.startX) / rect.width) * 100,
          y: d.originY + ((e.clientY - d.startY) / rect.height) * 100,
        };
        return next;
      });
    };
    const handleUp = () => { dragRef.current = null; };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <div
        ref={containerRef}
        className={styles.canvas}
      >
        <div className={styles.glow} />

        <svg className={styles.svg}>
          {skills.map((skill, i) =>
            skill.connections.map(targetIndex => {
              if (targetIndex < i) return null;
              const isConnected = hoveredIndex === i || hoveredIndex === targetIndex;
              const isDimmed = hoveredIndex !== null && !isConnected;
              let opacity = "0.12";
              let className = styles.lineDefault;
              if (isDimmed) { opacity = "0.03"; }
              if (isConnected) { opacity = "0.7"; className = styles.lineActive; }

              return (
                <line
                  key={`${i}-${targetIndex}`}
                  x1={`${positions[i].x}%`}
                  y1={`${positions[i].y}%`}
                  x2={`${positions[targetIndex].x}%`}
                  y2={`${positions[targetIndex].y}%`}
                  stroke="currentColor"
                  className={className}
                  style={{ opacity }}
                />
              );
            })
          )}
        </svg>

        {skills.map((skill, index) => {
          const isHovered = hoveredIndex === index;
          const isConnected = hoveredIndex !== null && skill.connections.includes(hoveredIndex);
          const isDimmed = hoveredIndex !== null && !isHovered && !isConnected;

          const catClass = CATEGORY_CLASS_MAP[skill.category] ?? styles.catDefault;
          const ringClass = CATEGORY_RING_MAP[skill.category] ?? "";

          const nodeClasses = [
            styles.node,
            catClass,
            ringClass,
            isHovered ? styles.nodeHovered : "",
            isDimmed ? styles.nodeDimmed : "",
          ].filter(Boolean).join(" ");

          return (
            <div
              key={index}
              className={styles.nodeWrapper}
              style={{ left: `${positions[index].x}%`, top: `${positions[index].y}%` }}
              onPointerDown={(e) => {
                const container = containerRef.current;
                if (!container) return;
                const rect = container.getBoundingClientRect();
                dragRef.current = {
                  index,
                  startX: e.clientX,
                  startY: e.clientY,
                  originX: positions[index].x,
                  originY: positions[index].y,
                };
                e.currentTarget.setPointerCapture(e.pointerId);
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              tabIndex={0}
              role="button"
              aria-label={`${skill.name}: ${skill.description}`}
              onFocus={() => setHoveredIndex(index)}
              onBlur={() => setHoveredIndex(null)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setHoveredIndex(hoveredIndex === index ? null : index); }}
            >
              <div className={nodeClasses}>
                {isHovered && (
                  <div className={styles.tooltip}>
                    <div className={styles.tooltipName}>{skill.name}</div>
                    <div className={styles.tooltipDesc}>{skill.description}</div>
                  </div>
                )}
              </div>
              <span className={[
                styles.label,
                isHovered ? styles.labelHidden : "",
                isDimmed ? styles.labelDimmed : "",
              ].filter(Boolean).join(" ")}>
                {skill.name}
              </span>
            </div>
          );
        })}

        <div className={styles.footer}>
          {constellationLabel}
        </div>
      </div>

      <div className={styles.mobileGrid}>
        {skills.map((skill, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.03 }}
            className={styles.mobileCard}
          >
            <div className={[styles.mobileDot, CATEGORY_CLASS_MAP[skill.category] ?? styles.catDefault].filter(Boolean).join(" ")} />
            <div>
              <h3 className={styles.mobileName}>{skill.name}</h3>
              <p className={styles.mobileDesc}>{skill.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default XSkillNetwork;
