import Link from "next/link";
import { CSSProperties } from "react";
import styles from "./XFooter.module.css";

export type XFooterLink = {
  label: string;
  href: string;
};

export type CopyrightConfig = {
  text?: string;
  showYear?: boolean;
  customYear?: number | string;
  yearFirst?: boolean;
};

export type XFooterProps = {
  links: XFooterLink[];
  copyright?: CopyrightConfig; 
  layout?: "horizontal" | "vertical";
  columns?: 1 | 2 | 3 | 4;
  colors?: {
    bg?: string;
    text?: string;
    accent?: string;
    border?: string;
  };
  className?: string;
};
export default function XFooter({
  links,
  copyright,
  layout = "horizontal",
  columns = 1,
  colors,
  className = "",
}: XFooterProps) {
  
  const customStyles = {
    "--xf-bg": colors?.bg,
    "--xf-text": colors?.text,
    "--xf-accent": colors?.accent,
    "--xf-border": colors?.border,
    "--xf-cols": layout === "horizontal" ? columns : 1,
  } as CSSProperties;

  const currentYear = copyright?.customYear || new Date().getFullYear();
  const copyLabel = copyright?.text || "Xscriptor";

  return (
    <footer className={`${styles.XFooter} ${className}`} style={customStyles}>
      <div className={styles.container}>
        {/* Los links se organizan en el grid definido por --xf-cols */}
        <nav className={layout === "vertical" ? styles.navVertical : styles.nav}>
          {links.map((link, idx) => (
            <Link key={idx} href={link.href} className={styles.link}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* El copyright queda fuera del nav, por lo que hereda el centrado del container */}
        <div className={styles.copyright}>
          © {copyright?.yearFirst 
              ? `${currentYear} ${copyLabel}` 
              : `${copyLabel} ${currentYear}`}
        </div>
      </div>
    </footer>
  );
}