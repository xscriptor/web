# XParticles

Canvas-based particle background component. Particles spawn at viewport edges, drift through an organic Perlin-like flow field, and are attracted toward the mouse pointer. They die when close to the cursor (< 15px) and respawn at a random edge.

## Location

```
src/app/components/xcomponents/xbackgrounds/xparticles/xparticles.tsx
```

Barrel: `src/app/components/xcomponents/xbackgrounds/index.ts` re-exports `XParticles`.

## Import

```tsx
import { XParticles } from "../components/xcomponents/xbackgrounds";
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | `""` | Extra classes for the container div |
| `trailOpacity` | `number` | `0.07` | Trail fade opacity (0-1) |
| `particleCount` | `number` | `2500` | Number of simultaneous particles |
| `speed` | `number` | `0.8` | Flow field speed multiplier |
| `lightBg` | `string` | `"255,255,255"` | Background RGB for trail in light mode |
| `darkBg` | `string` | `"0,0,0"` | Background RGB for trail in dark mode |

## Basic usage

```tsx
<XParticles />
```

Custom params:

```tsx
<XParticles
  particleCount={1200}
  trailOpacity={0.04}
  speed={1.2}
/>
```

## Behavior

- Fixed full-viewport canvas, `pointer-events-none`.
- Particles spawn at viewport edges and move via a cos/sin flow field.
- Mouse attraction: `f = 24 / (d + 10)`.
- Particles die at distance < 15px from the cursor and respawn at a random edge.
- Auto-detects light/dark mode via `class="dark"` on `<html>`.
- Handles window resize automatically.

## Notes

- This is a `"use client"` component. It cannot be imported directly from a Server Component without a `"use client"` barrel.
- Particle colors are fixed in the `COLORS` array (7 pastel/vibrant hues). Edit the source to change them.
