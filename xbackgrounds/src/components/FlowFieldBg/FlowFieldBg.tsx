"use client";

import { useEffect, useRef } from "react";

const COLORS = ["#fbbf24", "#fc618d", "#7bd88f", "#fce566", "#fd9353", "#948ae3", "#5ad4e6"];

interface FlowFieldBgProps {
  className?: string;
  trailOpacity?: number;
  particleCount?: number;
  speed?: number;
  lightBg?: string;
  darkBg?: string;
}

export default function FlowFieldBg({
  className = "",
  trailOpacity = 0.07,
  particleCount = 2500,
  speed = 0.8,
  lightBg = "255,255,255",
  darkBg = "0,0,0",
}: FlowFieldBgProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const cv = canvas;
    const ct = container;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const c = ctx;
    let width = ct.clientWidth;
    let height = ct.clientHeight;
    let mouse = { x: -9999, y: -9999 };
    let animationId: number;
    let particles: Particle[] = [];
    let isDark = document.documentElement.classList.contains("dark");

    const getBg = () => (isDark ? darkBg : lightBg);

    function edgePos(): { x: number; y: number } {
      const edge = Math.floor(Math.random() * 4);
      switch (edge) {
        case 0: return { x: Math.random() * width, y: 0 };
        case 1: return { x: width, y: Math.random() * height };
        case 2: return { x: Math.random() * width, y: height };
        default: return { x: 0, y: Math.random() * height };
      }
    }

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      age: number;
      life: number;
      color: string;

      constructor() {
        const p = edgePos();
        this.x = p.x;
        this.y = p.y;
        this.vx = 0;
        this.vy = 0;
        this.age = 0;
        this.life = 200 + Math.random() * 300;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      }

      update() {
        const angle =
          (Math.cos(this.x * 0.004 + this.y * 0.002) +
            Math.sin(this.y * 0.004 - this.x * 0.001)) *
          Math.PI;
        this.vx += Math.cos(angle) * 0.08 * speed;
        this.vy += Math.sin(angle) * 0.08 * speed;

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const d = Math.sqrt(dx * dx + dy * dy);

        if (d < 10000) {
          const f = 24 / (d + 10);
          this.vx += (dx / d) * f;
          this.vy += (dy / d) * f;
        }

        if (d < 15) {
          this.reset();
          return;
        }

        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.96;
        this.vy *= 0.96;
        this.age++;

        if (this.age > this.life) {
          this.reset();
          return;
        }

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      reset() {
        const p = edgePos();
        this.x = p.x;
        this.y = p.y;
        this.vx = 0;
        this.vy = 0;
        this.age = 0;
        this.life = 200 + Math.random() * 300;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.globalAlpha =
          (1 - Math.abs(this.age / this.life - 0.5) * 2) *
          (isDark ? 0.6 : 0.5);
        ctx.fillRect(this.x, this.y, 1.5, 1.5);
        ctx.globalAlpha = 1;
      }
    }

    function init() {
      const dpr = window.devicePixelRatio || 1;
      cv.width = width * dpr;
      cv.height = height * dpr;
      c.scale(dpr, dpr);
      cv.style.width = `${width}px`;
      cv.style.height = `${height}px`;
      particles = Array.from({ length: particleCount }, () => new Particle());
    }

    function animate() {
      isDark = document.documentElement.classList.contains("dark");
      c.fillStyle = `rgba(${getBg()},${trailOpacity})`;
      c.fillRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw(c);
      });
      animationId = requestAnimationFrame(animate);
    }

    function resize() {
      width = ct.clientWidth;
      height = ct.clientHeight;
      init();
    }

    function onMove(e: MouseEvent) {
      const r = ct.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    }

    function onLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    init();
    animate();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    const themeObserver = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains("dark");
      c.fillStyle = `rgba(${getBg()},1)`;
      c.fillRect(0, 0, width, height);
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      themeObserver.disconnect();
    };
  }, [trailOpacity, particleCount, speed, lightBg, darkBg]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
