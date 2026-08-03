"use client";

import { motion } from "framer-motion";
import { memo, useMemo } from "react";

interface Point { x: number; y: number }

function generateAestheticPath(index: number, position: number, type: "primary" | "secondary" | "accent"): string {
  const baseAmplitude = type === "primary" ? 150 : type === "secondary" ? 100 : 60;
  const phase = index * 0.2;
  const points: Point[] = [];
  const segments = type === "primary" ? 10 : type === "secondary" ? 8 : 6;

  const startX = 2400;
  const startY = 800;
  const endX = -2400;
  const endY = -800 + index * 25;

  for (let i = 0; i <= segments; i++) {
    const progress = i / segments;
    const eased = 1 - (1 - progress) ** 2;
    const baseX = startX + (endX - startX) * eased;
    const baseY = startY + (endY - startY) * eased;
    const amplitudeFactor = 1 - eased * 0.3;
    const wave1 = Math.sin(progress * Math.PI * 3 + phase) * (baseAmplitude * 0.7 * amplitudeFactor);
    const wave2 = Math.cos(progress * Math.PI * 4 + phase) * (baseAmplitude * 0.3 * amplitudeFactor);
    const wave3 = Math.sin(progress * Math.PI * 2 + phase) * (baseAmplitude * 0.2 * amplitudeFactor);
    points.push({ x: baseX * position, y: baseY + wave1 + wave2 + wave3 });
  }

  return points.map((p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const tension = 0.4;
    const cp1x = prev.x + (p.x - prev.x) * tension;
    const cp2x = prev.x + (p.x - prev.x) * (1 - tension);
    return `C ${cp1x} ${prev.y}, ${cp2x} ${p.y}, ${p.x} ${p.y}`;
  }).join(" ");
}

const FloatingPaths = memo(function FloatingPaths({ position }: { position: number }) {
  const primaryPaths = useMemo(
    () => Array.from({ length: 12 }, (_, i) => ({
      d: generateAestheticPath(i, position, "primary"),
      opacity: 0.15 + i * 0.02,
      width: 4 + i * 0.3,
      duration: 8,
    })),
    [position]
  );

  const secondaryPaths = useMemo(
    () => Array.from({ length: 15 }, (_, i) => ({
      d: generateAestheticPath(i, position, "secondary"),
      opacity: 0.12 + i * 0.015,
      width: 3 + i * 0.25,
      duration: 6,
    })),
    [position]
  );

  const accentPaths = useMemo(
    () => Array.from({ length: 10 }, (_, i) => ({
      d: generateAestheticPath(i, position, "accent"),
      opacity: 0.08 + i * 0.12,
      width: 2 + i * 0.2,
      duration: 4,
    })),
    [position]
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="w-full h-full"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        viewBox="-2400 -800 4800 1600"
      >
        <defs>
          <linearGradient id="TerminalBgGradient" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#fc618d" />
            <stop offset="50%" stopColor="#948ae3" />
            <stop offset="100%" stopColor="#5ad4e6" />
          </linearGradient>
        </defs>

        <g>
          {primaryPaths.map((path, i) => (
            <motion.path
              key={i}
              d={path.d}
              stroke="url(#TerminalBgGradient)"
              strokeLinecap="round"
              strokeWidth={path.width}
              style={{ opacity: path.opacity }}
              animate={{ y: [0, -15, 0] }}
              transition={{
                y: {
                  duration: path.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatType: "reverse",
                },
              }}
            />
          ))}
        </g>

        <g style={{ opacity: 0.8 }}>
          {secondaryPaths.map((path, i) => (
            <motion.path
              key={i}
              d={path.d}
              stroke="url(#TerminalBgGradient)"
              strokeLinecap="round"
              strokeWidth={path.width}
              style={{ opacity: path.opacity }}
              animate={{ y: [0, -10, 0] }}
              transition={{
                y: {
                  duration: path.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatType: "reverse",
                },
              }}
            />
          ))}
        </g>

        <g style={{ opacity: 0.6 }}>
          {accentPaths.map((path, i) => (
            <motion.path
              key={i}
              d={path.d}
              stroke="url(#TerminalBgGradient)"
              strokeLinecap="round"
              strokeWidth={path.width}
              style={{ opacity: path.opacity }}
              animate={{ y: [0, -5, 0] }}
              transition={{
                y: {
                  duration: path.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatType: "reverse",
                },
              }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
});

export default function TerminalBgPaths() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <FloatingPaths position={1} />
    </div>
  );
}
