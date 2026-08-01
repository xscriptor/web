"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function useIsDark() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const check = () => setDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return dark;
}

interface LightLinesProps {
  className?: string;
  lineCount?: number;
  color?: string;
}

export default function LightLines({ className = "", lineCount = 12 }: LightLinesProps) {
  const isDark = useIsDark();

  const lines = Array.from({ length: lineCount }, (_, i) => {
    const y = 5 + (i / (lineCount - 1)) * 90;
    const spread = 8 + (i % 5) * 3;
    const tilt = (i % 3 - 1) * 0.15;
    return {
      id: i,
      y1: `${y - spread}%`,
      y2: `${y + spread}%`,
      x1: `${-5 - i * 2}%`,
      x2: `${105 + i * 2}%`,
      tilt,
      width: 0.6 + (i % 4) * 0.4,
      opacity: 0.3 + (i % lineCount) * 0.06,
    };
  });

  const strokeColor = isDark
    ? "url(#lightGradDark)"
    : "url(#lightGradLight)";

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        height: "100%",
        top: 0,
      }}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 1000 400"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="lightGradDark" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fc618d" stopOpacity="0" />
            <stop offset="20%" stopColor="#fc618d" stopOpacity="0.5" />
            <stop offset="40%" stopColor="#fce566" stopOpacity="0.65" />
            <stop offset="60%" stopColor="#948ae3" stopOpacity="0.7" />
            <stop offset="80%" stopColor="#5ad4e6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#5ad4e6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lightGradLight" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fc618d" stopOpacity="0" />
            <stop offset="20%" stopColor="#fc618d" stopOpacity="0.35" />
            <stop offset="40%" stopColor="#fce566" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#948ae3" stopOpacity="0.55" />
            <stop offset="80%" stopColor="#5ad4e6" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#5ad4e6" stopOpacity="0" />
          </linearGradient>
        </defs>
        {lines.map((line) => (
          <motion.line
            key={line.id}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={strokeColor}
            strokeWidth={line.width}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 0],
              opacity: [0, line.opacity, 0],
            }}
            transition={{
              duration: 6 + (line.id % 5) * 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
              delay: (line.id * 1.8) % 12,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
