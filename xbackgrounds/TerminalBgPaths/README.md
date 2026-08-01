# TerminalBgPaths

Animated full-viewport background of layered, waving bezier path lines in a magenta-to-cyan gradient, designed for terminal-themed pages.

## Import

```tsx
import { TerminalBgPaths } from "@xscriptor/xbackgrounds/TerminalBgPaths";
```

## Props

None.

## Basic usage

```tsx
<TerminalBgPaths />
```

## Behavior

- Renders a `fixed inset-0 z-0 pointer-events-none` full-viewport layer.
- Three groups of paths (primary ×12, secondary ×15, accent ×10) are generated procedurally with a cubic bezier wave function (`generateAestheticPath`), differentiated by amplitude, opacity, width and animation duration.
- Each path animates a vertical bob (`y: [0, -N, 0]`, infinite, reverse) for a soft "breathing" motion.
- All strokes share the `TerminalBgGradient` linear gradient (`#fc618d → #948ae3 → #5ad4e6`).
- Uses `viewBox="-2400 -800 4800 1600"` with `xMidYMid slice` to cover any viewport size.
- Paths are memoized with `memo` + `useMemo`, so geometry is computed once per mount.

## Notes

- Requires `framer-motion` (`motion.path`).
- This is a `"use client"` component.
- Intended to be placed as a fixed background layer with content above it (`relative z-10`).
