"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { AnchorHTMLAttributes, CSSProperties, ReactNode } from "react";

import styles from "./XRepoCard.module.css";

export type XRepoCardColors = {
  background?: string;
  border?: string;
  hoverBorder?: string;
  foreground?: string;
  primary?: string;
  muted?: string;
  overlayBackground?: string;
  gradientEnd?: string;
  shadow?: string;
};

export type XRepoCardProps = {
  title: string;
  description: string;
  href: string;
  icon?: ReactNode;
  size?: "sm" | "md" | "lg";
  align?: "left" | "center";
  colors?: XRepoCardColors;
  animationDelay?: number;
  openInNewTab?: boolean;
  external?: boolean;
  target?: AnchorHTMLAttributes<HTMLAnchorElement>["target"];
  rel?: string;
  minHeight?: CSSProperties["minHeight"];
  borderRadius?: CSSProperties["borderRadius"];
  ariaLabel?: string;
  className?: string;
  cardClassName?: string;
  contentClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  overlayClassName?: string;
  iconClassName?: string;
  style?: CSSProperties;
};

type RepoCardStyle = CSSProperties & Record<`--${string}`, string | undefined>;

const SIZE_CLASS_MAP = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
} as const;

const ALIGN_CLASS_MAP = {
  left: styles.alignLeft,
  center: styles.alignCenter,
} as const;

function cn(...values: Array<string | undefined | false | null>) {
  return values.filter(Boolean).join(" ");
}

function normalizeLength(value: CSSProperties["minHeight"] | CSSProperties["borderRadius"]) {
  if (typeof value === "number") {
    return `${value}px`;
  }
  return value;
}

function isExternalHref(href: string) {
  return /^(https?:\/\/|mailto:|tel:)/.test(href);
}

export default function XRepoCard({
  title,
  description,
  href,
  icon,
  size = "md",
  align = "center",
  colors,
  animationDelay = 0,
  openInNewTab,
  external,
  target,
  rel,
  minHeight,
  borderRadius,
  ariaLabel,
  className,
  cardClassName,
  contentClassName,
  titleClassName,
  descriptionClassName,
  overlayClassName,
  iconClassName,
  style,
}: XRepoCardProps) {
  const useExternalLink = external ?? isExternalHref(href);
  const linkTarget = target ?? (openInNewTab ?? useExternalLink ? "_blank" : undefined);
  const linkRel = rel ?? (linkTarget === "_blank" ? "noopener noreferrer" : undefined);

  const cssVars: RepoCardStyle = {
    ...style,
    "--repo-card-background": colors?.background,
    "--repo-card-border": colors?.border,
    "--repo-card-hover-border": colors?.hoverBorder,
    "--repo-card-foreground": colors?.foreground,
    "--repo-card-primary": colors?.primary,
    "--repo-card-muted": colors?.muted,
    "--repo-card-overlay": colors?.overlayBackground,
    "--repo-card-gradient-end": colors?.gradientEnd,
    "--repo-card-shadow": colors?.shadow,
    "--repo-card-height": normalizeLength(minHeight),
    "--repo-card-radius": normalizeLength(borderRadius),
  };

  const card = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: animationDelay }}
      className={cn(
        styles.card,
        SIZE_CLASS_MAP[size],
        ALIGN_CLASS_MAP[align],
        cardClassName,
      )}
      style={cssVars}
    >
      <div className={styles.gradient} />

      <div className={cn(styles.content, contentClassName)}>
        <h2 className={cn(styles.title, titleClassName)}>{title}</h2>
      </div>

      <div className={cn(styles.overlay, overlayClassName)}>
        <p className={cn(styles.description, descriptionClassName)}>{description}</p>
      </div>

      {icon ? <div className={cn(styles.icon, iconClassName)}>{icon}</div> : null}
    </motion.div>
  );

  if (useExternalLink) {
    return (
      <a
        href={href}
        target={linkTarget}
        rel={linkRel}
        aria-label={ariaLabel ?? title}
        className={cn(styles.link, className)}
      >
        {card}
      </a>
    );
  }

  return (
    <Link
      href={href}
      target={linkTarget}
      rel={linkRel}
      aria-label={ariaLabel ?? title}
      className={cn(styles.link, className)}
    >
      {card}
    </Link>
  );
}
