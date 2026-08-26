<h1 align="center">@xscriptor/xbackgrounds</h1>

<div align="center">

Animated background components for React and Next.js by Xscriptor.

![npm](https://img.shields.io/npm/v/@xscriptor/xbackgrounds?style=flat-square&label=npm&color=ab865d)
![license](https://img.shields.io/badge/license-MIT?style=flat-square&color=ab865d)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)

</div>

<br>
<hr>

<details open>
   <summary><h2>Table of Contents</h2></summary>
   <ul>
      <li><a href="#overview">Overview</a></li>
      <li><a href="#installation">Installation</a></li>
      <li><a href="#usage">Usage</a></li>
      <li><a href="#exports">Exports</a></li>
      <li><a href="#project-structure">Project Structure</a></li>
      <li><a href="#scripts">Scripts</a></li>
      <li><a href="#packaging-and-publish">Packaging and Publish</a></li>
      <li><a href="#related-documents">Related Documents</a></li>
   </ul>
</details>

<hr>

<h2 id="overview">Overview</h2>

<p>
@xscriptor/xbackgrounds provides animated full-viewport backgrounds built on Canvas and SVG,
designed as drop-in ambient layers for landing pages, hero sections and portfolio screens.
</p>

<h2 id="installation">Installation</h2>

```bash
npm install @xscriptor/xbackgrounds
```

<h2 id="usage">Usage</h2>

```tsx
import { XParticles, FlowFieldBg, ColorRain } from "@xscriptor/xbackgrounds";
// or per-component:
import { FloatingPaths } from "@xscriptor/xbackgrounds/FloatingPaths";
```

```tsx
export default function Home() {
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <XParticles />
      <main style={{ position: "relative", zIndex: 1 }}>...</main>
    </div>
  );
}
```

<h3><code>"use client"</code> requirement</h3>

<p>All components in this package use React hooks (<code>useState</code>, <code>useEffect</code>, etc.). When consumed from a <strong>Next.js App Router Server Component</strong>, the bundled dist (<code>chunk-*.mjs</code>) does <strong>not</strong> preserve the <code>"use client"</code> directive.</p>

<p><strong>Solutions</strong> (pick one):</p>

<ol>
   <li><strong>Create a <code>"use client"</code> barrel file</strong> in your project:</li>
</ol>

<pre lang="tsx"><code>// src/app/components/xbackgrounds/index.ts
"use client";
export { XParticles, FlowFieldBg, ColorRain } from "@xscriptor/xbackgrounds";</code></pre>

<ol start="2">
   <li><strong>Use the component only inside <code>"use client"</code> pages or components</strong> — this works without a barrel.</li>
</ol>

<h2 id="exports">Exports</h2>

<ul>
   <li><code>@xscriptor/xbackgrounds</code> (root exports)</li>
   <li><code>@xscriptor/xbackgrounds/xparticles</code></li>
   <li><code>@xscriptor/xbackgrounds/FlowFieldBg</code></li>
   <li><code>@xscriptor/xbackgrounds/FloatingPaths</code></li>
   <li><code>@xscriptor/xbackgrounds/LightLines</code></li>
   <li><code>@xscriptor/xbackgrounds/TerminalBgPaths</code></li>
   <li><code>@xscriptor/xbackgrounds/ColorRain</code></li>
</ul>

<h2 id="project-structure">Project Structure</h2>

<ul>
   <li><code>src/components/xparticles</code> — XParticles (home)</li>
   <li><code>src/components/FlowFieldBg</code></li>
   <li><code>src/components/FloatingPaths</code></li>
   <li><code>src/components/LightLines</code></li>
   <li><code>src/components/TerminalBgPaths</code></li>
   <li><code>src/components/ColorRain</code></li>
</ul>

<h2 id="scripts">Scripts</h2>

```bash
npm run build
npm run clean
npm run prepare:build
```

<h2 id="packaging-and-publish">Packaging and Publish</h2>

1. Authenticate with npm:

```bash
npm login
npm whoami
```

2. Build and validate package content:

```bash
npm run prepare:build
npm pack --dry-run
```

3. Bump version:

```bash
npm version patch
```

4. Publish package:

```bash
npm publish
```

<h2 id="related-documents">Related Documents</h2>

<ul>
   <li><a href="./CONTRIBUTING.md">Contributing Guide</a></li>
   <li><a href="./CODE_OF_CONDUCT.md">Code of Conduct</a></li>
   <li><a href="./SECURITY.md">Security Policy</a></li>
   <li><a href="./LICENSE">License (MIT)</a></li>
</ul>

<div align="center">
<h2>X</h2>

<a href="https://xscriptor.io">XWeb</a> | <a href="https://github.com/xscriptor-web">Profile</a>
</div>
