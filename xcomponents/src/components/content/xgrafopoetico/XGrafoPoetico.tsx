"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./XGrafoPoetico.module.css";

export interface PoemData {
  id: string;
  title: string;
  content: string;
  book: string;
  bookIndex: number;
}

function useDetectTheme(): "dark" | "light" {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  useEffect(() => {
    const check = () => {
      setTheme(
        document.documentElement.getAttribute("data-theme") === "dark"
          ? "dark"
          : "light"
      );
    };
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);
  return theme;
}

interface Node {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  poem: PoemData;
  color: string;
}

interface Edge {
  source: string;
  target: string;
}

export interface XGrafoPoeticoProps {
  poems: PoemData[];
  locale?: string;
  color1?: string;
  color2?: string;
  color3?: string;
  color4?: string;
  color5?: string;
  color6?: string;
  color7?: string;
  color8?: string;
}

const COLORS_DEFAULT = [
  "#ff6b6b",
  "#ffd93d",
  "#6bcb77",
  "#4d96ff",
  "#ff6bff",
  "#ff9f43",
  "#22d3ee",
  "#54a0ff",
];

const BOOK_LABELS: Record<string, Record<string, string>> = {
  es: {
    boulevard: "Boulevard",
    asintota: "Asíntota",
    "primavera-en-el-desierto": "Primavera en el desierto",
    "la-danza-de-las-amapolas": "La danza de las amapolas",
    colaterales: "Colaterales",
    "cielos-de-alquitran": "Cielos de alquitrán",
    blog: "Blog",
  },
  en: {
    boulevard: "Boulevard",
    asintota: "Asymptote",
    "primavera-en-el-desierto": "Spring in the Desert",
    "la-danza-de-las-amapolas": "The Dance of the Poppies",
    colaterales: "Collaterals",
    "cielos-de-alquitran": "Skies of Tar",
    blog: "Blog",
  },
  de: {
    boulevard: "Boulevard",
    asintota: "Asymptote",
    "primavera-en-el-desierto": "Frühling in der Wüste",
    "la-danza-de-las-amapolas": "Der Tanz der Mohnblumen",
    colaterales: "Kollateralen",
    "cielos-de-alquitran": "Teerhimmel",
    blog: "Blog",
  },
  it: {
    boulevard: "Boulevard",
    asintota: "Asintoto",
    "primavera-en-el-desierto": "Primavera nel deserto",
    "la-danza-de-las-amapolas": "La danza dei papaveri",
    colaterales: "Collaterali",
    "cielos-de-alquitran": "Cieli di catrame",
    blog: "Blog",
  },
  fr: {
    boulevard: "Boulevard",
    asintota: "Asymptote",
    "primavera-en-el-desierto": "Printemps dans le désert",
    "la-danza-de-las-amapolas": "La danse des coquelicots",
    colaterales: "Collatéraux",
    "cielos-de-alquitran": "Ciels de goudron",
    blog: "Blog",
  },
};

function formatLine(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/__(.+?)__/g, "<strong>$1</strong>")
    .replace(/_(.+?)_/g, "<em>$1</em>");
}

const UI_TEXT: Record<string, { search: string; hint: string; result: (n: number) => string }> = {
  es: { search: "Buscar…", hint: "Rueda para zoom · Arrastra fondo para mover · Click en nodo para leer", result: (n) => `${n} resultado${n !== 1 ? "s" : ""}` },
  en: { search: "Search…", hint: "Scroll to zoom · Drag background to move · Click node to read", result: (n) => `${n} result${n !== 1 ? "s" : ""}` },
  de: { search: "Suchen…", hint: "Scrollen zum Zoomen · Hintergrund ziehen zum Bewegen · Klick auf Knoten zum Lesen", result: (n) => `${n} Ergebnis${n !== 1 ? "se" : ""}` },
  it: { search: "Cerca…", hint: "Rotella per zoom · Trascina sfondo per muovere · Clicca nodo per leggere", result: (n) => `${n} risultato${n !== 1 ? "i" : ""}` },
  fr: { search: "Chercher…", hint: "Molette pour zoomer · Glisser fond pour bouger · Cliquer nœud pour lire", result: (n) => `${n} résultat${n !== 1 ? "s" : ""}` },
};

export function XGrafoPoetico({
  poems,
  locale: localeProp,
  color1,
  color2,
  color3,
  color4,
  color5,
  color6,
  color7,
  color8,
}: XGrafoPoeticoProps) {
  const locale = localeProp || "es";
  const labels = BOOK_LABELS[locale] || BOOK_LABELS.es;
  const uiText = UI_TEXT[locale] || UI_TEXT.es;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const nodesRef = useRef<Node[]>([]);
  const edgesRef = useRef<Edge[]>([]);
  const rafRef = useRef<number>(0);
  const simRef = useRef({ alpha: 1, time: 0 });
  const mouseRef = useRef({ x: -999, y: -999 });
  const hoveredRef = useRef<string | null>(null);
  const connectedRef = useRef<Set<string>>(new Set());
  const draggedNodeRef = useRef<Node | null>(null);
  const dragActiveRef = useRef(false);
  const dragMovedRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const panningRef = useRef(false);
  const panStartRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const transformRef = useRef({ x: 0, y: 0, scale: 1 });
  const sizeRef = useRef({ w: 800, h: 600 });

  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef("");
  const matchingIdsRef = useRef<Set<string>>(new Set());

  const theme = useDetectTheme();
  const themeRef = useRef<"dark" | "light">("light");
  themeRef.current = theme;

  const matchingIds = useMemo(() => {
    if (!searchQuery.trim()) return new Set<string>();
    const q = searchQuery.toLowerCase();
    const ids = new Set<string>();
    for (const poem of poems) {
      if (
        poem.title.toLowerCase().includes(q) ||
        poem.content.toLowerCase().includes(q)
      ) {
        ids.add(poem.id);
      }
    }
    return ids;
  }, [searchQuery, poems]);

  matchingIdsRef.current = matchingIds;
  searchRef.current = searchQuery;

  const [tooltipNode, setTooltipNode] = useState<Node | null>(null);
  const [selectedPoem, setSelectedPoem] = useState<PoemData | null>(null);

  const touchRef = useRef({ startX: 0, startY: 0, startTime: 0, moved: false, lastDist: 0 });

  const colors = useMemo(
    () => [color1, color2, color3, color4, color5, color6, color7, color8].map(
      (c, i) => c || COLORS_DEFAULT[i]
    ),
    [color1, color2, color3, color4, color5, color6, color7, color8]
  );

  function initSimulation(w: number, h: number) {
    const nodes: Node[] = poems.map((poem) => ({
      id: poem.id,
      x: (Math.random() - 0.5) * Math.max(w, h) * 1.2,
      y: (Math.random() - 0.5) * Math.max(w, h) * 1.2,
      vx: 0,
      vy: 0,
      radius: 2 + (poem.content.length % 4),
      poem,
      color: colors[poem.bookIndex % colors.length],
    }));

    const edges: Edge[] = [];
    const byBook = new Map<string, Node[]>();
    for (const n of nodes) {
      const list = byBook.get(n.poem.book);
      if (list) list.push(n);
      else byBook.set(n.poem.book, [n]);
    }
    for (const group of byBook.values()) {
      for (let i = 0; i < group.length; i++) {
        const a = group[i];
        edges.push({ source: a.id, target: group[(i + 1) % group.length].id });
        edges.push({ source: a.id, target: group[(i + 2) % group.length].id });
      }
    }

    nodesRef.current = nodes;
    edgesRef.current = edges;
    simRef.current = { alpha: 1, time: 0 };
    transformRef.current = { x: w / 2, y: h / 2, scale: 1 };
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    ctxRef.current = canvas.getContext("2d");

    const rect = container.getBoundingClientRect();
    const w = Math.round(rect.width);
    const h = Math.round(rect.height);
    canvas.width = w;
    canvas.height = h;
    sizeRef.current = { w, h };
    initSimulation(w, h);

    const ro = new ResizeObserver(([entry]) => {
      const cw = Math.round(entry.contentRect.width);
      const ch = Math.round(entry.contentRect.height);
      if (cw !== sizeRef.current.w || ch !== sizeRef.current.h) {
        sizeRef.current = { w: cw, h: ch };
        canvas.width = cw;
        canvas.height = ch;
      }
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, [poems, colors]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    let running = true;

    const tick = () => {
      if (!running) return;

      const nodes = nodesRef.current;
      const edges = edgesRef.current;
      const sim = simRef.current;
      const size = sizeRef.current;
      const drag = draggedNodeRef.current;
      const dragActive = dragActiveRef.current;

      sim.alpha = Math.max(0.001, sim.alpha * 0.992);
      sim.time++;

      const alpha = sim.alpha;
      const repulsionK = 1200 * alpha;
      const centeringK = 0.002 * alpha;
      const edgeK = 0.003 * alpha;

      for (const n of nodes) {
        if (drag && drag.id === n.id) continue;

        let fx = 0;
        let fy = 0;

        fx += -n.x * centeringK;
        fy += -n.y * centeringK;

        for (const other of nodes) {
          if (other.id === n.id) continue;
          if (drag && drag.id === other.id) continue;
          const dx = n.x - other.x;
          const dy = n.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 0.1) continue;
          const force = (repulsionK * n.radius * other.radius) / (dist * dist + 1);
          fx += (dx / dist) * force;
          fy += (dy / dist) * force;
        }
      }

      for (const edge of edges) {
        const source = nodes.find((n) => n.id === edge.source);
        const target = nodes.find((n) => n.id === edge.target);
        if (!source || !target) continue;
        if (drag && (drag.id === source.id || drag.id === target.id)) continue;
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 0.1) continue;
        const force = dist * edgeK;
        source.vx += (dx / dist) * force;
        source.vy += (dy / dist) * force;
        target.vx -= (dx / dist) * force;
        target.vy -= (dy / dist) * force;
      }

      const damping = 0.3 + 0.3 * (1 - alpha);
      for (const n of nodes) {
        if (drag && drag.id === n.id) continue;
        n.vx *= 1 - damping;
        n.vy *= 1 - damping;
        n.x += n.vx;
        n.y += n.vy;
      }

      const t = transformRef.current;
      const hoveredId = hoveredRef.current;
      const connected = connectedRef.current;
      const matchingIds = matchingIdsRef.current;
      const hasSearch = searchRef.current.trim().length > 0;
      const isDark = themeRef.current === "dark";
      const edgeRGB = isDark ? "255,255,255" : "0,0,0";
      const glowAlpha = isDark ? "40" : "15";

      ctx.clearRect(0, 0, size.w, size.h);
      ctx.save();
      ctx.translate(t.x, t.y);
      ctx.scale(t.scale, t.scale);

      for (const edge of edges) {
        const source = nodes.find((n) => n.id === edge.source);
        const target = nodes.find((n) => n.id === edge.target);
        if (!source || !target) continue;

        let eAlpha = 0.04;
        let eWidth = 0.4;

        if (hoveredId) {
          if (edge.source === hoveredId || edge.target === hoveredId) {
            eAlpha = 0.25;
            eWidth = 1.0;
          } else if (connected.has(edge.source) && connected.has(edge.target)) {
            eAlpha = 0.08;
          } else if (hasSearch && (!matchingIds.has(edge.source) || !matchingIds.has(edge.target))) {
            eAlpha = 0.008;
          }
        } else if (hasSearch) {
          if (matchingIds.has(edge.source) && matchingIds.has(edge.target)) {
            eAlpha = 0.2;
          } else {
            eAlpha = 0.008;
          }
        }

        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.strokeStyle = `rgba(${edgeRGB},${eAlpha})`;
        ctx.lineWidth = eWidth / t.scale;
        ctx.stroke();
      }

      for (const n of nodes) {
        const isHovered = hoveredId === n.id;
        const isConnected = connected.has(n.id);
        const r = n.radius;

        let nodeAlpha = hoveredId ? 0.15 : 0.5;
        let nodeR = r;

        if (hasSearch && matchingIds.has(n.id)) {
          nodeAlpha = hoveredId ? 1 : 0.9;
          nodeR = r * 1.3;
        }

        if (isHovered) {
          nodeAlpha = 1;
          nodeR = r * 1.6;
          const gradient = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 6);
          gradient.addColorStop(0, n.color + glowAlpha);
          gradient.addColorStop(1, n.color + "00");
          ctx.beginPath();
          ctx.arc(n.x, n.y, r * 6, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        } else if (isConnected) {
          nodeAlpha = 0.8;
          nodeR = r * 1.2;
        } else if (hasSearch && !matchingIds.has(n.id)) {
          nodeAlpha = hoveredId ? 0.02 : 0.04;
          nodeR = r;
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, nodeR, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.globalAlpha = nodeAlpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      ctx.restore();
      rafRef.current = requestAnimationFrame(tick);
    };

    tick();
    return () => { running = false; cancelAnimationFrame(rafRef.current); };
  }, []);

  function screenToWorld(sx: number, sy: number) {
    const t = transformRef.current;
    return { x: (sx - t.x) / t.scale, y: (sy - t.y) / t.scale };
  }

  function getNodeAt(sx: number, sy: number): Node | null {
    const world = screenToWorld(sx, sy);
    const t = transformRef.current;
    const nodes = nodesRef.current;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      const dx = world.x - n.x;
      const dy = world.y - n.y;
      const hitR = (n.radius + 4) / t.scale;
      if (dx * dx + dy * dy < hitR * hitR) return n;
    }
    return null;
  }

  function getConnected(nodeId: string): Set<string> {
    const s = new Set<string>();
    for (const edge of edgesRef.current) {
      if (edge.source === nodeId) s.add(edge.target);
      if (edge.target === nodeId) s.add(edge.source);
    }
    return s;
  }

  const onMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    const node = getNodeAt(sx, sy);
    if (node) {
      draggedNodeRef.current = node;
      dragActiveRef.current = true;
      dragMovedRef.current = false;
      const w = screenToWorld(sx, sy);
      dragOffsetRef.current = { x: node.x - w.x, y: node.y - w.y };
    } else {
      panningRef.current = true;
      panStartRef.current = { x: sx, y: sy, tx: transformRef.current.x, ty: transformRef.current.y };
      dragMovedRef.current = false;
    }
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    mouseRef.current = { x: e.clientX, y: e.clientY };

    if (dragActiveRef.current && draggedNodeRef.current) {
      dragMovedRef.current = true;
      const w = screenToWorld(sx, sy);
      draggedNodeRef.current.x = w.x + dragOffsetRef.current.x;
      draggedNodeRef.current.y = w.y + dragOffsetRef.current.y;
      draggedNodeRef.current.vx = 0;
      draggedNodeRef.current.vy = 0;
      return;
    }

    if (panningRef.current) {
      dragMovedRef.current = true;
      transformRef.current.x = panStartRef.current.tx + (sx - panStartRef.current.x);
      transformRef.current.y = panStartRef.current.ty + (sy - panStartRef.current.y);
      return;
    }

    const node = getNodeAt(sx, sy);
    canvas.style.cursor = node ? "pointer" : "grab";
    const nextId = node?.id ?? null;
    if (nextId !== hoveredRef.current) {
      hoveredRef.current = nextId;
      connectedRef.current = node ? getConnected(node.id) : new Set();
      setTooltipNode(node);
    }
  }, []);

  const onMouseUp = useCallback(() => {
    dragActiveRef.current = false;
    draggedNodeRef.current = null;
    panningRef.current = false;
  }, []);

  const onMouseLeave = useCallback(() => {
    dragActiveRef.current = false;
    draggedNodeRef.current = null;
    panningRef.current = false;
    hoveredRef.current = null;
    connectedRef.current = new Set();
    setTooltipNode(null);
  }, []);

  const onWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const t = transformRef.current;
    const delta = -e.deltaY * 0.001;
    const newScale = Math.min(4, Math.max(0.12, t.scale * (1 + delta)));
    transformRef.current = {
      scale: newScale,
      x: mx - (newScale / t.scale) * (mx - t.x),
      y: my - (newScale / t.scale) * (my - t.y),
    };
  }, []);

  const onClick = useCallback(() => {
    if (!dragMovedRef.current) {
      const id = hoveredRef.current;
      if (id) {
        const node = nodesRef.current.find((n) => n.id === id);
        if (node) setSelectedPoem(node.poem);
      }
    }
  }, []);

  const onTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const touch = touchRef.current;

    touch.moved = false;
    touch.startTime = Date.now();

    if (e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dx = t1.clientX - t2.clientX;
      const dy = t1.clientY - t2.clientY;
      touch.lastDist = Math.sqrt(dx * dx + dy * dy);
      dragActiveRef.current = false;
      draggedNodeRef.current = null;
      panningRef.current = false;
      return;
    }

    const t = e.touches[0];
    const sx = t.clientX - rect.left;
    const sy = t.clientY - rect.top;
    touch.startX = sx;
    touch.startY = sy;
    mouseRef.current = { x: t.clientX, y: t.clientY };

    const node = getNodeAt(sx, sy);
    if (node) {
      draggedNodeRef.current = node;
      dragActiveRef.current = true;
      dragMovedRef.current = false;
      const w = screenToWorld(sx, sy);
      dragOffsetRef.current = { x: node.x - w.x, y: node.y - w.y };
      hoveredRef.current = node.id;
      connectedRef.current = getConnected(node.id);
      setTooltipNode(node);
    } else {
      panningRef.current = true;
      panStartRef.current = { x: sx, y: sy, tx: transformRef.current.x, ty: transformRef.current.y };
      dragMovedRef.current = false;
      hoveredRef.current = null;
      connectedRef.current = new Set();
      setTooltipNode(null);
    }
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const touch = touchRef.current;

    touch.moved = true;

    if (e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dx = t1.clientX - t2.clientX;
      const dy = t1.clientY - t2.clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (touch.lastDist > 0) {
        const scale = dist / touch.lastDist;
        const mx = (t1.clientX + t2.clientX) / 2 - rect.left;
        const my = (t1.clientY + t2.clientY) / 2 - rect.top;
        const tr = transformRef.current;
        const newScale = Math.min(4, Math.max(0.12, tr.scale * scale));
        transformRef.current = {
          scale: newScale,
          x: mx - (newScale / tr.scale) * (mx - tr.x),
          y: my - (newScale / tr.scale) * (my - tr.y),
        };
      }
      touch.lastDist = dist;
      return;
    }

    const t = e.touches[0];
    const sx = t.clientX - rect.left;
    const sy = t.clientY - rect.top;
    mouseRef.current = { x: t.clientX, y: t.clientY };

    if (dragActiveRef.current && draggedNodeRef.current) {
      dragMovedRef.current = true;
      const w = screenToWorld(sx, sy);
      draggedNodeRef.current.x = w.x + dragOffsetRef.current.x;
      draggedNodeRef.current.y = w.y + dragOffsetRef.current.y;
      draggedNodeRef.current.vx = 0;
      draggedNodeRef.current.vy = 0;
      return;
    }

    if (panningRef.current) {
      dragMovedRef.current = true;
      transformRef.current.x = panStartRef.current.tx + (sx - panStartRef.current.x);
      transformRef.current.y = panStartRef.current.ty + (sy - panStartRef.current.y);
      return;
    }

    const node = getNodeAt(sx, sy);
    const nextId = node?.id ?? null;
    if (nextId !== hoveredRef.current) {
      hoveredRef.current = nextId;
      connectedRef.current = node ? getConnected(node.id) : new Set();
      setTooltipNode(node);
    }
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    const touch = touchRef.current;

    if (e.touches.length < 2) {
      touch.lastDist = 0;
    }

    if (e.changedTouches.length > 0 && !touch.moved) {
      const id = hoveredRef.current;
      if (id) {
        const node = nodesRef.current.find((n) => n.id === id);
        if (node) setSelectedPoem(node.poem);
      }
    }

    if (e.touches.length === 0) {
      dragActiveRef.current = false;
      draggedNodeRef.current = null;
      panningRef.current = false;
    }
  }, []);

  const bookKeys = [...new Set(poems.map((p) => p.book))];

  return (
    <div ref={containerRef} className={styles.container}>
      <div className={styles.searchContainer}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder={uiText.search}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery.trim() && (
          <span className={styles.searchCount}>
            {uiText.result(matchingIds.size)}
          </span>
        )}
      </div>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onWheel={onWheel}
        onClick={onClick}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      />

      {tooltipNode && (
        <div
          className={styles.tooltip}
          style={{
            left: mouseRef.current.x + 14,
            top: mouseRef.current.y - 8,
          }}
        >
          <span className={styles.tooltipTitle}>{tooltipNode.poem.title}</span>
          <span className={styles.tooltipBook}>
            {labels[tooltipNode.poem.book] || tooltipNode.poem.book}
          </span>
        </div>
      )}

      <div className={styles.legend}>
        {bookKeys.map((book, i) => (
          <div key={book} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: colors[i % colors.length] }} />
            <span className={styles.legendLabel}>{labels[book] || book}</span>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedPoem && (
          <motion.div
            className={styles.overlay}
            onClick={() => setSelectedPoem(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              className={styles.modal}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <button className={styles.modalClose} onClick={() => setSelectedPoem(null)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
              <p className={styles.modalBook}>
                {labels[selectedPoem.book] || selectedPoem.book}
              </p>
              <p className={styles.modalTitle}>{selectedPoem.title}</p>
              <div className={styles.modalContent}>
                {(() => {
                  const lines = selectedPoem.content.split("\n");
                  return lines.map((line, i) => (
                    <span key={i} dangerouslySetInnerHTML={{ __html: formatLine(line) + (i < lines.length - 1 ? "<br>" : "") }} />
                  ));
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
