"use client";

import React, { useState } from "react";

export interface XSocialIconProps extends Omit<React.SVGProps<SVGSVGElement>, "color" | "children"> {
  size?: number | string;
  color?: string;
  hoverColor?: string;
  fillColor?: string;
  hoverFillColor?: string;
  backgroundColor?: string;
  badgeColor?: string;
  badgeBackgroundColor?: string;
  strokeWidth?: number;
  showBadge?: boolean;
  title?: string;
}

type IconPalette = {
  stroke: string;
  fill: string;
  badgeStroke: string;
  badgeFill: string;
};

type SocialIconContentProps = {
  palette: IconPalette;
};

type SocialIconRenderer = (props: SocialIconContentProps) => React.ReactNode;

function XSocialIconShell({
  size = 24,
  color = "currentColor",
  hoverColor,
  fillColor,
  hoverFillColor,
  backgroundColor,
  badgeColor,
  badgeBackgroundColor,
  strokeWidth = 1.8,
  showBadge = true,
  title,
  style,
  children,
  ...rest
}: XSocialIconProps & { children: SocialIconRenderer }) {
  const [isHovered, setIsHovered] = useState(false);

  const stroke = isHovered && hoverColor ? hoverColor : color;
  const fill = isHovered && hoverFillColor ? hoverFillColor : fillColor || stroke;
  const badgeStroke = badgeColor || stroke;
  const badgeFill = badgeBackgroundColor || "transparent";

  const palette = {
    stroke,
    fill,
    badgeStroke,
    badgeFill,
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      style={{ color: stroke, ...(style ?? {}) }}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      <circle
        cx="12"
        cy="12"
        r="10.5"
        fill={backgroundColor || "none"}
        stroke={backgroundColor ? "none" : stroke}
        strokeOpacity={backgroundColor ? undefined : 0.14}
        strokeWidth={backgroundColor ? undefined : strokeWidth}
      />
      {children({ palette })}
      {showBadge && (
        <g>
          <circle cx="18" cy="18" r="2.6" fill={badgeFill} stroke={badgeStroke} strokeWidth="1" />
          <path d="M17.05 17.05L18.95 18.95M18.95 17.05L17.05 18.95" stroke={badgeStroke} strokeWidth="1.15" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}

export function XTelegramIcon(props: XSocialIconProps) {
  return (
    <XSocialIconShell {...props} strokeWidth={props.strokeWidth ?? 1.8}>
      {({ palette }) => (
        <>
          <path
            d="M9.2 12.4l2.15 2.15 5.1-5.1M20.6 4.2L4 12l6.45 1.8 1.8 6.45 2.55-4.2 4.2 2.55 1.6-14.4z"
            stroke={palette.stroke}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <circle cx="12" cy="12" r="9.75" fill="none" stroke={palette.stroke} strokeOpacity="0.18" strokeWidth="1" />
        </>
      )}
    </XSocialIconShell>
  );
}

export function XInstagramIcon(props: XSocialIconProps) {
  return (
    <XSocialIconShell {...props} strokeWidth={props.strokeWidth ?? 1.6}>
      {({ palette }) => (
        <>
          <rect x="6.2" y="6.2" width="11.6" height="11.6" rx="3.2" ry="3.2" stroke={palette.stroke} strokeWidth="1.6" fill="none" />
          <circle cx="12" cy="12" r="3.15" stroke={palette.stroke} strokeWidth="1.6" fill="none" />
          <circle cx="16.3" cy="7.7" r="0.7" fill={palette.fill} />
        </>
      )}
    </XSocialIconShell>
  );
}

export function XWhatsappIcon(props: XSocialIconProps) {
  return (
    <XSocialIconShell {...props} strokeWidth={props.strokeWidth ?? 1.5}>
      {({ palette }) => (
        <>
          <path
            d="M16.72 13.06c-.29-.15-1.71-.84-1.98-.94-.26-.1-.45-.15-.64.14-.19.29-.74.94-.9 1.13-.16.19-.33.22-.62.08-.29-.15-1.23-.45-2.35-1.45-.87-.77-1.45-1.72-1.62-2.01-.16-.29-.02-.45.12-.59.13-.13.29-.33.43-.49.14-.16.18-.28.27-.47.09-.19.04-.36-.02-.51-.07-.15-.64-1.54-.88-2.1-.23-.55-.47-.48-.64-.49-.16-.01-.36-.01-.55-.01-.19 0-.5.07-.76.36-.26.29-1 1.01-1 2.47 0 1.45 1.04 2.85 1.19 3.05.15.19 2.05 3.12 5.2 4.38.73.31 1.3.49 1.74.63.73.23 1.4.2 1.92.12.59-.09 1.71-.7 1.95-1.37.24-.67.24-1.25.17-1.37-.07-.11-.26-.18-.55-.32z"
            fill={palette.fill}
          />
          <path
            d="M12 3.2C7.13 3.2 3.2 7.13 3.2 12c0 1.56.41 3.02 1.13 4.29L3.2 20.8l4.59-1.09A8.77 8.77 0 0 0 12 20.8c4.87 0 8.8-3.93 8.8-8.8s-3.93-8.8-8.8-8.8z"
            stroke={palette.stroke}
            strokeWidth="1.2"
            fill="none"
            opacity="0.18"
          />
        </>
      )}
    </XSocialIconShell>
  );
}

export function XEmailIcon(props: XSocialIconProps) {
  return (
    <XSocialIconShell {...props} strokeWidth={props.strokeWidth ?? 1.6}>
      {({ palette }) => (
        <>
          <rect x="4.5" y="7" width="15" height="10" rx="1.4" stroke={palette.stroke} strokeWidth="1.6" fill="none" />
          <path d="M4.6 7.1l7.4 5.5 7.4-5.5" stroke={palette.stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </>
      )}
    </XSocialIconShell>
  );
}

export function XLinkedInIcon(props: XSocialIconProps) {
  return (
    <XSocialIconShell {...props} strokeWidth={props.strokeWidth ?? 1.6}>
      {({ palette }) => (
        <>
          <path d="M8.1 9.1l2.6 2.6 4.1-4.1" stroke={palette.stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M6.8 10.2c1.6-1.6 4.3-1.6 5.9 0" stroke={palette.stroke} strokeWidth="1.6" strokeLinecap="round" fill="none" />
          <rect x="5" y="5" width="14" height="14" rx="3" ry="3" stroke={palette.stroke} strokeWidth="1.4" fill="none" opacity="0.12" />
        </>
      )}
    </XSocialIconShell>
  );
}

export function XTwitterIcon(props: XSocialIconProps) {
  return (
    <XSocialIconShell {...props} strokeWidth={props.strokeWidth ?? 1.6}>
      {({ palette }) => (
        <>
          <path d="M7 4l7 8.7L7 21h2.2l7-8.7L21 4h-2.2l-7 8.7L7 4z" fill={palette.fill} />
          <path d="M8 4h2.2l6.2 7.7" stroke={palette.stroke} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.2" />
        </>
      )}
    </XSocialIconShell>
  );
}

export function XGitHubIcon(props: XSocialIconProps) {
  return (
    <XSocialIconShell {...props} strokeWidth={props.strokeWidth ?? 1.35}>
      {({ palette }) => (
        <>
          <path
            d="M12 2c5.52 0 10 4.48 10 10 0 4.42-2.87 8.17-6.84 9.49.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7 2.78.6 3.37-1.34 3.37-1.34.45-1.16 1.11-1.46 1.11-1.46.91-.62-.07-.61-.07-.61-1 .07-1.53 1.03-1.53 1.03-.89 1.53-2.34 1.54-2.91 1.19-.09-.92-.35-1.54-.63-1.9 2.22-.25 4.55-1.11 4.55-4.94 0-1.09-.39-1.98-1.03-2.68.1-.25.45-1.27-.1-2.65 0 0-.84-.27-2.75 1.03A9.58 9.58 0 0 0 12 6.84c-.85 0-1.7.12-2.51.34-1.91-1.3-2.75-1.03-2.75-1.03-.54 1.38-.2 2.4-.1 2.65-.63.7-1.03 1.59-1.03 2.68 0 3.84 2.33 4.69 4.54 4.94-.29.36-.55.97-.64 1.9-.57.35-2.02.34-2.91-1.19 0 0-.52-.96-1.53-1.03 0 0-.98-.01-.07.61 0 0 .66.3 1.11 1.46 0 0 .59 1.94 3.37 1.34 0 .83-.01 1.46-.01 1.7 0 .26.18.57.68.48C5.87 20.17 3 16.42 3 12 3 6.48 7.48 2 12 2z"
            fill={palette.fill}
          />
        </>
      )}
    </XSocialIconShell>
  );
}
