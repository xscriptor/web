"use client";

import { useEffect, useState, ReactNode, CSSProperties } from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./XNavbar.module.css";

// ─────────────────────────────────────────────────────────────────────────────
// Tipos públicos — exportados para que el consumidor pueda tipear sus datos
// ─────────────────────────────────────────────────────────────────────────────

export type NavLinkItem = {
  /** Ruta destino */
  url: string;
  /** Texto visible */
  title: string;
  /** Si es true abre en pestaña nueva y muestra el indicador ↗ */
  external?: boolean;
};

/**
 * ReactNode estático O función de render (size, color?) => ReactNode.
 * La función recibe el tamaño y el color vigente para que el ícono
 * pueda adaptarse dinámicamente a los props del navbar.
 */
export type IconRenderer = ReactNode | ((size: number, color?: string) => ReactNode);

export type ThemeToggleIcons = {
  /** Ícono/renderer hacia tema oscuro (ReactNode o función) */
  toDark: IconRenderer;
  /** Ícono/renderer hacia tema claro (ReactNode o función) */
  toLight: IconRenderer;
};

export type XNavbarProps = {
  // ── Navegación ──────────────────────────────────────────────────────────
  /** Links que aparecen a la izquierda del logo en desktop */
  linksLeft?: NavLinkItem[];
  /** Links que aparecen a la derecha del logo en desktop */
  linksRight?: NavLinkItem[];

  // ── Logo central ────────────────────────────────────────────────────────
  /** Contenido del botón central (texto o JSX). Por defecto: "X" */
  logo?: ReactNode;
  /** Si true el logo actúa como toggle de tema (comportamiento original). Default: true */
  logoAsThemeToggle?: boolean;
  /** Callback custom si logoAsThemeToggle es false */
  onLogoClick?: () => void;

  // ── Toggle de tema ──────────────────────────────────────────────────────
  /** Íconos para el toggle de tema. Si no se pasa, no se mostrará hint de ícono */
  themeIcons?: ThemeToggleIcons;
  /** Tema inicial. Default: "light" */
  defaultTheme?: "light" | "dark";
  /** Key de localStorage para persistencia del tema. Default: "theme" */
  storageKey?: string;

  // ── Color de los enlaces de navegación ──────────────────────────────────────
  /** Color base de los enlaces (Inicio, Contacto, etc.). Default: var(--text) */
  linkColor?: string;
  /** Color al hacer hover sobre los enlaces. Default: opacidad reducida del linkColor */
  linkHoverColor?: string;
  /** Color del borde inferior del enlace activo. Default: linkColor */
  linkActiveColor?: string;

  // ── Color y tamaño de íconos theme-toggle ────────────────────────────────
  /** Color base de los íconos. Acepta cualquier valor CSS: hex, hsl, "var(--accent)", etc.
   *  Si no se pasa, los íconos heredan el color del texto (currentColor). */
  iconColor?: string;
  /** Color que toman los íconos al hacer hover sobre el logo. Default: iconColor */
  iconHoverColor?: string;
  /** Tamaño en px que se pasa a IconRenderer cuando es función. Default: 22 */
  iconSize?: number;

  // ── Hamburguesa ──────────────────────────────────────────────────────────
  /** Color de las 3 barras (y la X de cierre móvil). Acepta cualquier valor CSS. Default: var(--text) */
  hamburgerColor?: string;
  /** Ancho de las barras. Cualquier unidad CSS. Default: "2rem" */
  hamburgerBarWidth?: string;
  /** Grosor (altura) de las barras. Cualquier unidad CSS. Default: "3px" */
  hamburgerBarThickness?: string;

  // ── Variables CSS personalizadas ─────────────────────────────────────────
  /** Inyecta variables CSS extra directamente en el style del <header>.
   *  Útil para pasar tokens del tema: { '--xnav-icon-color': 'var(--accent)' } */
  cssVars?: Record<string, string>;

  // ── Labels de accesibilidad ─────────────────────────────────────────────
  /** aria-label del botón hamburguesa cuando está cerrado. Default: "Abrir menú" */
  labelOpen?: string;
  /** aria-label del botón hamburguesa cuando está abierto. Default: "Cerrar menú" */
  labelClose?: string;
  /** Texto del botón de tema oscuro en menú móvil. Default: "Oscuro" */
  labelDark?: string;
  /** Texto del botón de tema claro en menú móvil. Default: "Claro" */
  labelLight?: string;

  // ── Estilos adicionales ─────────────────────────────────────────────────
  /** className extra que se añade al <header> */
  className?: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Variantes de animación (idénticas al navbar original)
// ─────────────────────────────────────────────────────────────────────────────

const iconTrayRightVariants: Variants = {
  hidden: { opacity: 0, x: -6, pointerEvents: "none" },
  visible: { opacity: 1, x: 0, pointerEvents: "none", transition: { duration: 0.18 } },
};
const iconTrayLeftVariants: Variants = {
  hidden: { opacity: 0, x: 6, pointerEvents: "none" },
  visible: { opacity: 1, x: 0, pointerEvents: "none", transition: { duration: 0.18 } },
};

const topVariants: Variants    = { closed: { rotate: 0 }, opened: { rotate: 45 } };
const centerVariants: Variants = { closed: { opacity: 1 }, opened: { opacity: 0 } };
const bottomVariants: Variants = { closed: { rotate: 0 }, opened: { rotate: -45 } };

const listVariants: Variants = {
  closed: { x: "100vw" },
  opened: { x: 0, transition: { when: "beforeChildren", staggerChildren: 0.02 } },
};
const itemVariants: Variants = {
  closed: { x: -10, opacity: 0 },
  opened: { x: 0, opacity: 1 },
};

/** Renderiza un IconRenderer: si es función la llama con (size, color?), si es ReactNode lo devuelve tal cual. */
function renderIcon(
  icon: IconRenderer,
  size: number,
  color?: string
): ReactNode {
  if (typeof icon === "function") return icon(size, color);
  return icon;
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-componente NavLink (interno)
// ─────────────────────────────────────────────────────────────────────────────

type NavLinkProps = {
  link: NavLinkItem;
  onClick?: () => void;
  mobile?: boolean;
};

function XNavLink({ link, onClick, mobile }: NavLinkProps) {
  const pathname = usePathname();
  const isActive =
    link.url === "/" ? pathname === "/" : pathname?.startsWith(link.url);

  const baseClass = mobile ? styles.mobileNavLink : styles.navLink;
  const activeClass = mobile ? styles.mobileNavLinkActive : styles.navLinkActive;
  const externalClass = link.external ? styles.navLinkExternal : "";

  return (
    <Link
      href={link.url}
      onClick={onClick}
      target={link.external ? "_blank" : undefined}
      rel={link.external ? "noopener noreferrer" : undefined}
      aria-label={`Ir a ${link.title}`}
      aria-current={isActive ? "page" : undefined}
      className={[baseClass, isActive ? activeClass : "", externalClass]
        .filter(Boolean)
        .join(" ")}
    >
      {link.title}
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Componente principal XNavbar
// ─────────────────────────────────────────────────────────────────────────────

export default function XNavbar({
  linksLeft = [],
  linksRight = [],
  logo = "X",
  logoAsThemeToggle = true,
  onLogoClick,
  themeIcons,
  defaultTheme = "light",
  storageKey = "theme",
  linkColor,
  linkHoverColor,
  linkActiveColor,
  iconColor,
  iconHoverColor,
  iconSize = 22,
  hamburgerColor,
  hamburgerBarWidth,
  hamburgerBarThickness,
  cssVars,
  labelOpen = "Abrir menú",
  labelClose = "Cerrar menú",
  labelDark = "Oscuro",
  labelLight = "Claro",
  className,
}: XNavbarProps) {
  const [open, setOpen] = useState(false);
  const [hoverX, setHoverX] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(defaultTheme);

  // Persistir tema
  useEffect(() => {
    const saved = (typeof window !== "undefined" &&
      localStorage.getItem(storageKey)) as "light" | "dark" | null;
    applyTheme(saved ?? defaultTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applyTheme(t: "light" | "dark") {
    setTheme(t);
    const root = document.documentElement;
    if (t === "dark") root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");
    localStorage.setItem(storageKey, t);
  }

  function toggleTheme() {
    applyTheme(theme === "dark" ? "light" : "dark");
  }

  // Bloquear scroll — usamos documentElement para no tocar document.body
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => { document.documentElement.style.overflow = ""; };
  }, [open]);

  // Cerrar con ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const allLinks = [...linksLeft, ...linksRight];

  // ── CSS vars inyectadas en el <header> via inline style ─────────────────
  // Usando "--xnav-*" como namespace para no colisionar con vars globales.
  const headerStyle = {
    ...(linkColor         && { "--xnav-link-color"  : linkColor }),
    ...(linkHoverColor    && { "--xnav-link-hover"  : linkHoverColor }),
    ...(linkActiveColor   && { "--xnav-link-active" : linkActiveColor }),
    ...(iconColor         && { "--xnav-icon-color"  : iconColor }),
    ...(iconHoverColor    && { "--xnav-icon-hover"  : iconHoverColor }),
    ...(hamburgerColor    && { "--xnav-bar-color"   : hamburgerColor }),
    ...(hamburgerBarWidth   && { "--xnav-bar-w"     : hamburgerBarWidth }),
    ...(hamburgerBarThickness && { "--xnav-bar-h"   : hamburgerBarThickness }),
    ...cssVars,
  } as CSSProperties;

  // Acción del logo central
  const handleLogoClick = () => {
    if (logoAsThemeToggle) {
      toggleTheme();
    } else {
      onLogoClick?.();
    }
  };

  const logoAriaLabel = logoAsThemeToggle
    ? `Cambiar a tema ${theme === "dark" ? "claro" : "oscuro"}`
    : undefined;

  const logoTitle = logoAsThemeToggle
    ? theme === "dark"
      ? "Cambiar a tema claro"
      : "Cambiar a tema oscuro"
    : undefined;

  return (
    <header
      className={[styles.header, className].filter(Boolean).join(" ")}
      style={headerStyle}
      role="banner"
    >
      {/* ── Desktop ── */}
      <nav className={styles.desktopNav} aria-label="Navegación principal">
        <div className={styles.desktopLinksLeft}>
          {linksLeft.map((link) => (
            <XNavLink key={link.url + link.title} link={link} />
          ))}
        </div>

        {/* Botón logo central */}
        <div className={styles.logoSlot}>
          <div
            className={styles.logoWrapper}
            onMouseEnter={() => setHoverX(true)}
            onMouseLeave={() => setHoverX(false)}
          >
            <button
              type="button"
              onClick={handleLogoClick}
              aria-label={logoAriaLabel}
              title={logoTitle}
              className={styles.logoBtn}
            >
              {logo}
            </button>

            {/* Ícono hint al hover (solo si se pasan themeIcons y el logo es toggle de tema) */}
            {logoAsThemeToggle && themeIcons && (
              <>
                {theme === "light" ? (
                  <motion.div
                    initial={false}
                    animate={hoverX ? "visible" : "hidden"}
                    variants={iconTrayRightVariants}
                    className={`${styles.iconTray} ${styles.iconTrayRight}`}
                    style={{
                      color:
                        (hoverX ? iconHoverColor ?? iconColor : iconColor) ||
                        undefined,
                    }}
                    aria-hidden
                  >
                    {renderIcon(themeIcons.toDark, iconSize, iconColor)}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={false}
                    animate={hoverX ? "visible" : "hidden"}
                    variants={iconTrayLeftVariants}
                    className={`${styles.iconTray} ${styles.iconTrayLeft}`}
                    style={{
                      color:
                        (hoverX ? iconHoverColor ?? iconColor : iconColor) ||
                        undefined,
                    }}
                    aria-hidden
                  >
                    {renderIcon(themeIcons.toLight, iconSize, iconColor)}
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>

        <div className={styles.desktopLinksRight}>
          {linksRight.map((link) => (
            <XNavLink key={link.url + link.title} link={link} />
          ))}
        </div>
      </nav>

      {/* ── Mobile: botón hamburguesa ── */}
      <div className={styles.mobileToggle}>
        <button
          aria-label={open ? labelClose : labelOpen}
          aria-expanded={open}
          aria-controls="xnavbar-mobile-menu"
          onClick={() => setOpen((p) => !p)}
          className={styles.hamburgerBtn}
          title={open ? labelClose : labelOpen}
        >
          <motion.div
            variants={topVariants}
            initial="closed"
            animate={open ? "opened" : "closed"}
            className={styles.bar}
            style={{ originX: "left" }}
            aria-hidden
          />
          <motion.div
            variants={centerVariants}
            initial="closed"
            animate={open ? "opened" : "closed"}
            className={styles.bar}
            aria-hidden
          />
          <motion.div
            variants={bottomVariants}
            initial="closed"
            animate={open ? "opened" : "closed"}
            className={styles.bar}
            style={{ originX: "left" }}
            aria-hidden
          />
        </button>
      </div>

      {/* ── Mobile overlay — position:fixed, sin portal, sin document.body ── */}
      {open && (
        <motion.div
          id="xnavbar-mobile-menu"
          variants={listVariants}
          initial="closed"
          animate="opened"
          className={styles.mobileOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
        >
          {/* Botón cerrar */}
          <button
            aria-label={labelClose}
            onClick={() => setOpen(false)}
            className={styles.mobileCloseBtn}
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            <span
              aria-hidden
              className={styles.closeBar}
              style={{ transform: "rotate(45deg)" }}
            />
            <span
              aria-hidden
              className={styles.closeBar}
              style={{ transform: "rotate(-45deg)" }}
            />
            <span className="sr-only">{labelClose}</span>
          </button>

          {/* Logo decorativo */}
          <motion.div variants={itemVariants} className={styles.mobileLogo}>
            {logo}
          </motion.div>

          {/* Links */}
          {allLinks.map((link) => (
            <motion.div key={link.url + link.title} variants={itemVariants}>
              <XNavLink
                link={link}
                onClick={() => setOpen(false)}
                mobile
              />
            </motion.div>
          ))}

          {/* Toggle de tema */}
          <motion.button
            variants={itemVariants}
            onClick={toggleTheme}
            className={styles.themeToggleMobile}
          >
            {themeIcons ? (
              theme === "light" ? (
                <>
                  {renderIcon(themeIcons.toDark, iconSize, iconColor)}
                  {labelDark}
                </>
              ) : (
                <>
                  {renderIcon(themeIcons.toLight, iconSize, iconColor)}
                  {labelLight}
                </>
              )
            ) : theme === "light" ? (
              labelDark
            ) : (
              labelLight
            )}
          </motion.button>
        </motion.div>
      )}
    </header>
  );
}
