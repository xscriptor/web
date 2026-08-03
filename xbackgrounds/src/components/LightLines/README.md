# LightLines

Animated background of thin, diagonal light lines that draw themselves horizontally across the viewport in a repeating cycle, with a color gradient from magenta to cyan.

## Import

```tsx
import { LightLines } from "@xscriptor/xbackgrounds/LightLines";
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | `""` | Extra classes for the container div |
| `lineCount` | `number` | `12` | Number of lines to render |
| `color` | `string` | `undefined` | Custom stroke color (defaults to theme gradient) |

## Basic usage

```tsx
<LightLines lineCount={16} />
```

## Behavior

- Renders `lineCount` diagonal SVG lines inside an absolutely positioned, centered container.
- Each line animates `pathLength` (draw → full → erase) and `opacity` on an infinite loop with staggered delays (`6-18s` durations).
- Stroke color is a horizontal linear gradient (`#fc618d → #fce566 → #948ae3 → #5ad4e6`) with per-stop opacity.
- Dark and light mode use two gradient variants (`lightGradDark` / `lightGradLight`) selected automatically via `class="dark"` on `<html>`, observed with a `MutationObserver`.
- `pointer-events-none`, scales to fill via `viewBox="0 0 1000 400"` with `xMidYMid slice`.

## Notes

- Requires `framer-motion` (`motion.line`).
- This is a `"use client"` component.
- The `color` prop is currently declared but not applied; the gradient palette is defined in the SVG defs. Edit the source to customize.
