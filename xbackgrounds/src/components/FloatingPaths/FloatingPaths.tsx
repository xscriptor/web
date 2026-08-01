"use client";

import { motion } from "framer-motion";

const PALETTE = ["#fbbf24", "#fc618d", "#7bd88f", "#fce566", "#fd9353", "#948ae3", "#5ad4e6"];

function PathLayer({ position, offset }: { position: number; offset: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => {
    const c = PALETTE[(i + offset) % PALETTE.length];
    return {
      id: i,
      d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
        380 - i * 5 * position
      } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
        152 - i * 5 * position
      } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
        684 - i * 5 * position
      } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
      color: c,
      width: 0.4 + i * 0.02,
    };
  });

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg
        className="w-full h-full"
        viewBox="0 0 696 316"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke={path.color}
            strokeWidth={path.width}
            strokeOpacity={0.06 + path.id * 0.008}
            initial={{ pathLength: 0.3, opacity: 0.4 }}
            animate={{
              pathLength: [0.3, 1, 0.3],
              opacity: [0.2, 0.5, 0.2],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 15 + Math.random() * 12,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export default function FloatingPaths({ className = "" }: { className?: string }) {
  return (
    <div
      className={`absolute pointer-events-none overflow-hidden ${className}`}
      style={{
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100vw',
        height: '100%',
        top: 0,
      }}
    >
      <PathLayer position={1} offset={0} />
      <PathLayer position={-1} offset={3} />
    </div>
  );
}
