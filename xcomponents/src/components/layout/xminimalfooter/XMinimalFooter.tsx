import type { CSSProperties } from "react";

export type XMinimalFooterProps = {
  copyright: string;
  links?: { label: string; href: string }[];
  className?: string;
  style?: CSSProperties;
};

export default function XMinimalFooter({
  copyright,
  links = [],
  className = "",
  style,
}: XMinimalFooterProps) {
  return (
    <footer
      className={className}
      style={{
        width: "100%",
        textAlign: "center",
        padding: "1rem 1rem",
        color: "var(--text)",
        ...style,
      }}
    >
      <span style={{ fontSize: "0.875rem", opacity: 0.6 }}>
        {copyright}
        {links.length > 0 && (
          <span>
            {" — "}
            {links.map((link, i) => (
              <span key={link.href}>
                {i > 0 && <span> · </span>}
                <a
                  href={link.href}
                  style={{
                    color: "var(--accent)",
                    textDecoration: "none",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  {link.label}
                </a>
              </span>
            ))}
          </span>
        )}
      </span>
    </footer>
  );
}
