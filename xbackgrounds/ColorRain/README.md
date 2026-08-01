# ColorRain

Canvas-based digital rain background: columns of colored glyphs fall from the top of the screen (Matrix-style), with configurable direction, speed, opacity and palette.

## Import

```tsx
import { ColorRain } from "@xscriptor/xbackgrounds/ColorRain";
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `colors` | `string[]` | 7-hue palette | Hex colors cycled per column |
| `speed` | `number` | `40` | Interval in ms between frames (lower = faster) |
| `direction` | `"down" \| "up" \| "both"` | `"down"` | Rain fall direction |
| `opacity` | `number` | `0.75` | Canvas element opacity (0-1) |
| `fontSize` | `number` | `18` | Glyph size in px |
| `className` | `string` | `""` | Extra classes for the canvas |
| `lightBg` | `string` | `"230,230,230"` | Background RGB for the trail in light mode |
| `darkBg` | `string` | `"10,10,10"` | Background RGB for the trail in dark mode |

## Basic usage

```tsx
<ColorRain />
```

Custom params:

```tsx
<ColorRain
  direction="both"
  speed={30}
  opacity={0.6}
  fontSize={22}
  colors={["#0f0", "#0a0", "#ff0"]}
/>
```

## Behavior

- Full-viewport canvas, `pointer-events-none`, absolutely positioned (`inset-0 w-full h-full`).
- Renders `Math.floor(W / fontSize)` columns of glyphs drawn from a fixed character set (letters + geometric symbols).
- Each column has its own color (from `colors`) and falls at 0.8px/frame; trail effect via translucent background fill (`rgba(bg, 0.06)`).
- Direction: `"down"`, `"up"`, or `"both"` (random per column).
- Auto-detects light/dark mode via `class="dark"` on `<html>`, observed with a `MutationObserver`.
- Handles window resize automatically.

## Notes

- This is a `"use client"` component.
- The background canvas does not include a solid page background; pair it with a `position: fixed; inset: 0` container with `var(--background)` as done in the resources page.
