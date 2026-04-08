"use client";

import React from "react";
import styles from "./XSocialContact.module.css";

export interface SocialItem {
  id: string;
  href: string;
  label: string;
  icon: React.ReactNode;
  text?: string;
  iconColor?: string;
  iconHoverColor?: string;
}

export interface XSocialContactProps {
  items: SocialItem[];
  columns?: number;
  rows?: number;
  size?: "small" | "medium" | "large";
  alignment?: "left" | "center" | "right";
  gap?: string;
  backgroundColor?: string;
  iconDefaultColor?: string;
  iconDefaultHoverColor?: string;
  borderColor?: string;
  borderWidth?: string;
  borderStyle?: "solid" | "dashed" | "dotted";
  borderRadius?: "rounded" | "square";
  padding?: string;
  textAlign?: "left" | "center" | "right";
  textColor?: string;
  textSize?: string;
}

export default function XSocialContact({
  items,
  columns = 3,
  rows,
  size = "medium",
  alignment = "center",
  gap,
  backgroundColor,
  iconDefaultColor,
  iconDefaultHoverColor,
  borderColor,
  borderWidth,
  borderStyle = "solid",
  borderRadius = "rounded",
  padding,
  textAlign = "center",
  textColor,
  textSize,
}: XSocialContactProps) {
  const sizeMap = {
    small: "1rem",
    medium: "1.5rem",
    large: "2rem",
  } as const;

  const alignmentMap = {
    left: "flex-start",
    center: "center",
    right: "flex-end",
  } as const;

  const textAlignMap = {
    left: "left",
    center: "center",
    right: "right",
  } as const;

  const radiusMap = {
    rounded: "0.5rem",
    square: "0",
  } as const;

  const defaultGap = gap || (size === "small" ? "1rem" : size === "medium" ? "1.5rem" : "2rem");
  const defaultPadding =
    padding || (size === "small" ? "1rem" : size === "medium" ? "1.5rem" : "2rem");
  const defaultTextSize = textSize || (size === "small" ? "0.875rem" : size === "medium" ? "1rem" : "1.125rem");

  const customStyles = {
    "--columns": columns.toString(),
    "--gap": defaultGap,
    "--padding": defaultPadding,
    "--text-size": defaultTextSize,
    "--alignment": alignmentMap[alignment],
    "--text-align": textAlignMap[textAlign],
    "--icon-gap": sizeMap[size],
    "--border-radius": radiusMap[borderRadius],
    ...(backgroundColor && { "--bg-color": backgroundColor }),
    ...(iconDefaultColor && { "--icon-color": iconDefaultColor }),
    ...(iconDefaultHoverColor && { "--icon-hover-color": iconDefaultHoverColor }),
    ...(borderColor && { "--border-color": borderColor }),
    ...(borderWidth && { "--border-width": borderWidth }),
    ...(textColor && { "--text-color": textColor }),
    "--border-style": borderStyle,
  } as React.CSSProperties;

  let containerClass = styles.container;
  if (rows) {
    containerClass += ` ${styles[`rows${rows}`]}`;
  }

  return (
    <div
      className={`${containerClass} ${styles[size]}`}
      style={customStyles}
    >
      {items.map((item) => (
        <a
          key={item.id}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.item}
          title={item.label}
          style={{
            ...(item.iconColor && { "--item-icon-color": item.iconColor }),
            ...(item.iconHoverColor && { "--item-icon-hover-color": item.iconHoverColor }),
          } as React.CSSProperties}
        >
          <div className={styles.iconWrapper}>{item.icon}</div>
          {item.text && <span className={styles.text}>{item.text}</span>}
        </a>
      ))}
    </div>
  );
}
