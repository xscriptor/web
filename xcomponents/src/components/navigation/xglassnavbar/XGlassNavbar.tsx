"use client";

import {
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import styles from "./XGlassNavbar.module.css";

export type NavLinkItem = {
  url: string;
  title: string;
  external?: boolean;
  showExternalIcon?: boolean;
};

export type IconRenderer =
  | ReactNode
  | ((size: number, color?: string) => ReactNode);

export type ThemeToggleIcons = {
  toDark: IconRenderer;
  toLight: IconRenderer;
};

export type XGlassNavbarProps = {
  linksLeft?: NavLinkItem[];
  linksRight?: NavLinkItem[];
  logo?: ReactNode;
  logoAsThemeToggle?: boolean;
  onLogoClick?: () => void;
  themeIcons?: ThemeToggleIcons;
  defaultTheme?: "light" | "dark";
  storageKey?: string;
  linkColor?: string;
  linkHoverColor?: string;
  linkActiveColor?: string;
  iconColor?: string;
  iconHoverColor?: string;
  iconSize?: number;
  hamburgerColor?: string;
  hamburgerBarWidth?: string;
  hamburgerBarThickness?: string;
  cssVars?: Record<string, string>;
  labelOpen?: string;
  labelClose?: string;
  labelDark?: string;
  labelLight?: string;
  navLabel?: string;
  menuLabel?: string;
  linkLabelPrefix?: string;
  themeToggleAriaLabel?: (theme: "light" | "dark") => string;
  themeToggleTitle?: (theme: "light" | "dark") => string;
  className?: string;
};

function renderIconElement(
  icon: IconRenderer | undefined,
  size: number,
  color?: string,
): ReactNode {
  if (icon === undefined) return null;
  if (typeof icon === "function") {
    return icon(size, color);
  }
  return icon;
}

export default function XGlassNavbar({
  linksLeft = [],
  linksRight = [],
  logo = "X",
  logoAsThemeToggle = true,
  onLogoClick,
  themeIcons,
  defaultTheme = "light",
  storageKey = "theme",
  linkColor = "var(--text)",
  linkHoverColor,
  linkActiveColor = "var(--accent)",
  iconColor,
  iconHoverColor,
  iconSize = 22,
  hamburgerColor,
  hamburgerBarWidth = "1.25rem",
  hamburgerBarThickness = "2px",
  cssVars,
  labelOpen = "Abrir menú",
  labelClose = "Cerrar menú",
  labelDark = "Oscuro",
  labelLight = "Claro",
  navLabel = "Navegación principal",
  menuLabel = "Menú de navegación",
  linkLabelPrefix = "Ir a ",
  themeToggleAriaLabel,
  themeToggleTitle,
  className = "",
}: XGlassNavbarProps) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<"light" | "dark">(defaultTheme);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored === "light" || stored === "dark") {
        setTheme(stored);
      }
    } catch {
    }
  }, [storageKey]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
    try {
      localStorage.setItem(storageKey, theme);
    } catch {
    }
  }, [theme, storageKey]);

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [menuOpen]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const handleLogoClick = useCallback(() => {
    if (logoAsThemeToggle) {
      toggleTheme();
    }
    onLogoClick?.();
  }, [logoAsThemeToggle, onLogoClick, toggleTheme]);

  const isActive = useCallback(
    (url: string): boolean => {
      if (!pathname) return false;
      const normalizedUrl = url.replace(/\/$/, "");
      const normalizedPath = pathname.replace(/\/$/, "");
      if (normalizedPath === normalizedUrl) return true;
      if (normalizedUrl === "") return false;
      return normalizedPath.startsWith(normalizedUrl);
    },
    [pathname],
  );

  const renderLink = (item: NavLinkItem, mobile = false) => {
    const active = isActive(item.url);
    const classList = mobile
      ? `${styles.mobileLink} ${active ? styles.mobileLinkActive : ""}`
      : `${styles.link} ${active ? styles.linkActive : ""}`;

    return (
      <a
        key={item.url + item.title}
        href={item.url}
        className={classList}
        target={item.external ? "_blank" : undefined}
        rel={item.external ? "noopener noreferrer" : undefined}
        aria-label={
          item.external
            ? `${linkLabelPrefix}${item.title} (${item.url})`
            : `${linkLabelPrefix}${item.title}`
        }
        onClick={() => {
          if (mobile) setMenuOpen(false);
        }}
        style={{ color: active ? linkActiveColor : linkColor }}
      >
        {item.title}
        {item.external && (item.showExternalIcon !== false) && (
          <span className={styles.externalIcon} aria-hidden="true">
            ↗
          </span>
        )}
      </a>
    );
  };

  const currentThemeIcon =
    theme === "light"
      ? themeIcons?.toDark
      : themeIcons?.toLight;

  const navStyle: Record<string, string> = {
    ...(cssVars ?? {}),
  };
  if (hamburgerColor) {
    navStyle["--hamburger-color"] = hamburgerColor;
  }
  if (hamburgerBarWidth) {
    navStyle["--hamburger-width"] = hamburgerBarWidth;
  }
  if (hamburgerBarThickness) {
    navStyle["--hamburger-thickness"] = hamburgerBarThickness;
  }

  return (
    <>
      <div className={styles.outer}>
        <header
          className={`${styles.nav} ${className}`}
          style={Object.keys(navStyle).length > 0 ? navStyle : undefined}
        >
          <div className={styles.sectionLeft} role="list">
            {linksLeft.map((item) => renderLink(item, false))}
          </div>

          <button
            type="button"
            className={styles.logoBtn}
            onClick={handleLogoClick}
            aria-label={
              themeToggleAriaLabel
                ? themeToggleAriaLabel(theme)
                : `${theme === "light" ? labelDark : labelLight}`
            }
            title={
              themeToggleTitle
                ? themeToggleTitle(theme)
                : `${theme === "light" ? labelDark : labelLight}`
            }
          >
            <span className={styles.logoIconLeft}>
              {renderIconElement(themeIcons?.toLight, iconSize, iconColor)}
            </span>
            {logo}
            <span className={styles.logoIconRight}>
              {renderIconElement(themeIcons?.toDark, iconSize, iconColor)}
            </span>
          </button>

          <div className={styles.sectionRight} role="list">
            {linksRight.map((item) => renderLink(item, false))}
          </div>
        </header>
      </div>

      <button
        type="button"
        className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ""}`}
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label={menuOpen ? labelClose : labelOpen}
        aria-expanded={menuOpen}
        aria-controls="xglassnav-mobile-menu"
      >
        <span className={styles.hamburgerInner}>
          <span className={styles.hamburgerBar} />
          <span className={styles.hamburgerBar} />
          <span className={styles.hamburgerBar} />
        </span>
      </button>

      <nav
        id="xglassnav-mobile-menu"
        aria-label={menuLabel}
        className={`${styles.overlay} ${menuOpen ? styles.overlayOpen : ""}`}
        role="navigation"
      >
        {[...linksLeft, ...linksRight].map((item) => renderLink(item, true))}

        {themeIcons && (
          <div className={styles.mobileTheme}>
            <button
              type="button"
              className={styles.mobileThemeBtn}
              onClick={toggleTheme}
              aria-label={
                themeToggleAriaLabel
                  ? themeToggleAriaLabel(theme)
                  : `${theme === "light" ? labelDark : labelLight}`
              }
            >
              {renderIconElement(
                theme === "light"
                  ? themeIcons.toDark
                  : themeIcons.toLight,
                iconSize - 4,
                iconColor,
              )}
              <span>{theme === "light" ? labelDark : labelLight}</span>
            </button>
          </div>
        )}
      </nav>
    </>
  );
}
