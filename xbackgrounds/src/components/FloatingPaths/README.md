# FloatingPaths

Animated background of two mirrored layers of glowing SVG bezier paths that continuously draw and fade, creating a subtle "floating paths" light motif.

## Import

```tsx
import { FloatingPaths } from "@xscriptor/xbackgrounds/FloatingPaths";
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | `""` | Extra classes for the container div |

## Basic usage

```tsx
<FloatingPaths />
```

## Behavior

- Two `PathLayer` groups (one mirrored horizontally) render 36 SVG paths each.
- Each path animates its `pathLength` and `opacity` in a loop (`15-27s`, linear, infinite), giving a continuous drawing/fading effect.
- Colors cycle through a fixed 7-color palette, with per-path stroke width and opacity ramps.
- Container is absolutely positioned, centered horizontally (`100vw` wide), `pointer-events-none`.
- Renders inside an `<svg viewBox="0 0 696 316">` with `xMidYMid slice`, so it scales to fill any aspect ratio.

## Notes

- Requires `framer-motion` (`motion.path`).
- This is a `"use client"` component.
- Palette is fixed in the `PALETTE` array; edit the source to change colors.
