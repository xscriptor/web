"use client";

import { memo, useRef, useState, useEffect } from "react";

type XBlogDecryptProps = {
  contentHtml: string;
  title?: string;
  image?: string;
  author?: string;
  date?: string;
  isoDate?: string;
  categories?: string[];
  keywords?: string[];
  readingTime?: string;
  speed?: number;
  revealColor?: string;
  scrambleColor?: string;
  startDelay?: number;
};

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const scrambleTail = (text: string, revealed: number) => {
  let out = "";
  for (let i = revealed; i < text.length; i++) {
    out += text[i] === " " ? " " : CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return out;
};

const inViewport = (el: Element) => {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  return rect.bottom > 0 && rect.top < vh && (rect.width > 0 || rect.height > 0);
};

type BodyProps = {
  contentHtml: string;
  speed: number;
  revealColor: string;
  scrambleColor: string;
  startDelay: number;
};

const XBlogBody = memo(function XBlogBody({ contentHtml, speed, revealColor, scrambleColor, startDelay }: BodyProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    type Wrap = { el: HTMLElement; text: string; vis: HTMLElement };
    const wraps: Wrap[] = [];

    const existing = root.querySelectorAll<HTMLElement>(".xblog-text");
    if (existing.length > 0) {
      existing.forEach((el) => {
        const sr = el.querySelector<HTMLElement>(".sr-only");
        const vis = el.querySelector<HTMLElement>('[aria-hidden="true"]');
        if (sr && vis) wraps.push({ el, text: sr.textContent || "", vis });
      });
    } else {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => {
          if (!node.textContent?.trim()) return NodeFilter.FILTER_REJECT;
          let el: HTMLElement | null = node.parentElement;
          while (el && el !== root) {
            if (el.classList?.contains("katex") || el.classList?.contains("katex-display") || el.classList?.contains("xblog-text")) {
              return NodeFilter.FILTER_REJECT;
            }
            el = el.parentElement;
          }
          return NodeFilter.FILTER_ACCEPT;
        },
      });

      const nodes: Text[] = [];
      while (walker.nextNode()) nodes.push(walker.currentNode as Text);

      for (const node of nodes) {
        const text = node.textContent || "";

        const wrapper = document.createElement("span");
        wrapper.className = "xblog-text";
        wrapper.style.display = "inline";

        const sr = document.createElement("span");
        sr.className = "sr-only";
        sr.textContent = text;

        const vis = document.createElement("span");
        vis.setAttribute("aria-hidden", "true");

        wrapper.appendChild(sr);
        wrapper.appendChild(vis);
        node.parentNode?.replaceChild(wrapper, node);

        wraps.push({ el: wrapper, text, vis });
      }
    }

    if (wraps.length === 0) return;

    const intervals = new Set<ReturnType<typeof setInterval>>();
    const starters = new Map<Element, () => void>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          starters.get(entry.target)?.();
        }
      },
      { threshold: 0.1 },
    );

    for (const { el, text, vis } of wraps) {
      vis.innerHTML = `<span style="color:${scrambleColor}">${esc(scrambleTail(text, 0))}</span>`;

      let started = false;
      const start = () => {
        if (started) return;
        started = true;
        let revealed = 0;
        const interval = setInterval(() => {
          revealed++;
          const r = text.slice(0, revealed);
          const u = scrambleTail(text, revealed);
          const revealedHtml = `<span style="color:${revealColor}">${esc(r)}</span>`;
          const scrambledHtml = `<span style="color:${scrambleColor}">${esc(u)}</span>`;
          vis.innerHTML = revealed > 0 ? revealedHtml + scrambledHtml : scrambledHtml;
          if (revealed >= text.length) {
            clearInterval(interval);
            intervals.delete(interval);
            vis.textContent = text;
          }
        }, speed);
        intervals.add(interval);
      };

      starters.set(el, start);
    }

    const armTimer = setTimeout(() => {
      starters.forEach((start, el) => {
        if (inViewport(el)) start();
        else observer.observe(el);
      });
    }, startDelay);

    return () => {
      clearTimeout(armTimer);
      observer.disconnect();
      intervals.forEach(clearInterval);
    };
  }, [contentHtml, speed, revealColor, scrambleColor, startDelay]);

  return <div ref={containerRef} className="article-content" dangerouslySetInnerHTML={{ __html: contentHtml }} />;
});

export default function XBlogDecrypt({ contentHtml, title, image, author, date, isoDate, categories, keywords, readingTime, speed = 50, revealColor = "var(--accent, #e3342f)", scrambleColor = "#b8a8ff", startDelay = 450 }: XBlogDecryptProps) {
  const [titleText, setTitleText] = useState(title || "");
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = titleRef.current;
    if (!title || !el) return;

    setTitleText(`<span style="color:${scrambleColor}">${esc(scrambleTail(title, 0))}</span>`);

    let interval: ReturnType<typeof setInterval> | null = null;
    let started = false;

    const reveal = () => {
      if (started) return;
      started = true;
      let revealed = 0;
      interval = setInterval(() => {
        revealed++;
        const r = title.slice(0, revealed);
        const u = scrambleTail(title, revealed);
        const revealedHtml = `<span style="color:${revealColor}">${esc(r)}</span>`;
        const scrambledHtml = `<span style="color:${scrambleColor}">${esc(u)}</span>`;
        setTitleText(revealed > 0 ? revealedHtml + scrambledHtml : scrambledHtml);
        if (revealed >= title.length) {
          if (interval) clearInterval(interval);
          interval = null;
          setTitleText(esc(title));
        }
      }, speed);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            reveal();
          }
        }
      },
      { threshold: 0.1 },
    );

    const armTimer = setTimeout(() => {
      if (inViewport(el)) reveal();
      else observer.observe(el);
    }, startDelay);

    return () => {
      clearTimeout(armTimer);
      observer.disconnect();
      if (interval) clearInterval(interval);
    };
  }, [title, speed, revealColor, scrambleColor, startDelay]);

  return (
    <div>
      {title && (
        <h1 ref={titleRef} className="mb-2">
          <span className="sr-only">{title}</span>
          <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: titleText }} />
        </h1>
      )}

      {(author || date || readingTime) && (
        <div className="flex flex-wrap items-center gap-4 text-sm opacity-70 mb-4">
          {author && <span>{author}</span>}
          {date && <time dateTime={isoDate || ""}>{date}</time>}
          {readingTime && <span>{readingTime}</span>}
        </div>
      )}

      {((categories && categories.length > 0) || (keywords && keywords.length > 0)) && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {categories?.map((c, i) => (
            <span key={`c-${c}-${i}`} className="text-xs px-3 py-1 rounded-full bg-[var(--accent)] text-[var(--accent-text)] font-medium">
              {c}
            </span>
          ))}
          {categories && categories.length > 0 && keywords && keywords.length > 0 && (
            <span className="flex-1" />
          )}
          {keywords?.map((k, i) => (
            <span key={`k-${k}-${i}`} className="text-xs px-3 py-1 rounded-full border border-[var(--accent)] text-[var(--accent)] font-medium">
              {k}
            </span>
          ))}
        </div>
      )}

      {image && (
        <div className="relative aspect-video rounded-lg overflow-hidden mb-8">
          <img src={image} alt={title || ""} className="object-cover w-full h-full" />
        </div>
      )}

      <XBlogBody
        contentHtml={contentHtml}
        speed={speed}
        revealColor={revealColor}
        scrambleColor={scrambleColor}
        startDelay={startDelay}
      />
    </div>
  );
}
