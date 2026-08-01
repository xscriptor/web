"use client";

import { useEffect, useRef } from "react";

export type ColorRainProps = {
  colors?: string[];
  speed?: number;
  direction?: "down" | "up" | "both";
  opacity?: number;
  fontSize?: number;
  className?: string;
  lightBg?: string;
  darkBg?: string;
};

const DEFAULT_COLORS = ["#fbbf24", "#fc618d", "#7bd88f", "#fce566", "#fd9353", "#948ae3", "#5ad4e6"];

export default function ColorRain({
  colors = DEFAULT_COLORS,
  speed = 40,
  direction = "down",
  opacity = 0.75,
  fontSize = 18,
  className = "",
  lightBg = "230,230,230",
  darkBg = "10,10,10",
}: ColorRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = canvas.width;
    let H = canvas.height;

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };
    resize();
    window.addEventListener("resize", resize);

    const chars = "XSCRIPTORDEVX▣◈◇◎●◉✦✧⬡▥▣△▽▲▼◆○◌◍◐◑◒◓✓✕✖◆◇○◎▶▷▸▹►▻▼▽▾▿◀◁◂◃◄◅";
    const columns = Math.floor(W / fontSize);
    const drops: number[] = Array(columns).fill(1).map(() => Math.random() * H);
    const colorIdx: number[] = Array(columns).fill(0).map(() => Math.floor(Math.random() * colors.length));
    const dirs: number[] = Array(columns).fill(0).map(() =>
      direction === "both" ? (Math.random() > 0.5 ? 1 : -1) : direction === "up" ? -1 : 1
    );

    let isDark = document.documentElement.classList.contains("dark");
    const getBg = () => isDark ? darkBg : lightBg;

    const interval = setInterval(() => {
      ctx.fillStyle = `rgba(${getBg()},0.06)`;
      ctx.fillRect(0, 0, W, H);

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = colors[colorIdx[i] % colors.length];
        ctx.font = `${fontSize}px monospace`;
        const alpha = Math.abs(drops[i]) / 30;
        ctx.globalAlpha = Math.min(Math.max(alpha, 0.05), 0.8);
        ctx.fillText(char, i * fontSize, drops[i]);
        ctx.globalAlpha = 1;

        drops[i] += dirs[i] * 0.8;

        if (drops[i] > H + 20 || drops[i] < -20) {
          drops[i] = dirs[i] > 0 ? -10 : H + 10;
          colorIdx[i] = Math.floor(Math.random() * colors.length);
        }
      }
    }, speed);

    const themeObserver = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains("dark");
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
      themeObserver.disconnect();
    };
  }, [colors, speed, direction, opacity, fontSize, lightBg, darkBg]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ opacity }}
    />
  );
}
