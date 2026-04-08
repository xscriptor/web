import React from 'react';
import styles from './XSeparator.module.css';

export interface XSeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed' | 'dotted';
  isFaded?: boolean;
  hasX?: boolean;
  xColor?: string; // Nuevo: Color de la X
  xBg?: string;    // Nuevo: Fondo detrás de la X (para el recorte)
  thickness?: string;
  color?: string;
  gap?: string;
  className?: string;
}

export default function XSeparator({
  orientation = 'horizontal',
  variant = 'solid',
  isFaded = false,
  hasX = false,
  xColor, 
  xBg = 'white',
  thickness = '1px',
  color = '#e2e8f0',
  gap = '1rem',
  className = ''
}: XSeparatorProps) {
  
  const dynamicStyles = {
    '--separator-color': color,
    '--separator-thickness': thickness,
    '--separator-margin': gap,
    '--x-color': xColor || color, // Si no se define xColor, usa el color de la línea
    '--x-bg': xBg,
  } as React.CSSProperties;

  const classes = [
    styles.separator,
    orientation === 'vertical' ? styles.vertical : styles.horizontal,
    variant !== 'solid' && styles[variant],
    isFaded && styles.faded,
  ].filter(Boolean).join(' ');

  const line = <hr className={classes} style={dynamicStyles} />;

  if (!hasX) return line;

  return (
    <div className={`${styles.separatorContainer} ${className}`} style={dynamicStyles}>
      {line}
      <div className={styles.iconWrapper}>
        ✕
      </div>
    </div>
  );
}