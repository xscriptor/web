<h1 align="center">@xscriptor/xcomponents</h1>

<div align="center">

Reusable React/Next.js component package by Xscriptor.

![npm](https://img.shields.io/npm/v/@xscriptor/xcomponents?style=flat-square&label=npm&color=ab865d)
![license](https://img.shields.io/badge/license-MIT?style=flat-square&color=ab865d)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=nextdotjs&logoColor=white)

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
@xscriptor/xcomponents provides reusable UI building blocks for React and Next.js projects,
organized by category and exported with TypeScript declarations.
</p>

<h2 id="installation">Installation</h2>

```bash
npm install @xscriptor/xcomponents
```

<h2 id="usage">Usage</h2>

```tsx
import "@xscriptor/xcomponents/styles.css";
import { XNavbar, XSeparator } from "@xscriptor/xcomponents";
import { XContactForm } from "@xscriptor/xcomponents/forms";
import { XSocialContact, XInstagramIcon } from "@xscriptor/xcomponents/social";
```

<blockquote>
See <a href="./docs/USAGE.md"><code>docs/USAGE.md</code></a> for complete component API reference, all props, and runnable examples.
</blockquote>

<h3><code>"use client"</code> requirement</h3>

<p>Components in this package use React hooks (<code>useState</code>, <code>useEffect</code>, etc.). When consumed from a <strong>Next.js App Router Server Component</strong>, the bundled dist (<code>chunk-*.mjs</code>) does <strong>not</strong> preserve the <code>"use client"</code> directive.</p>

<p>If you import a component directly in a Server Component, you'll get <code>TypeError: useState is not a function</code>.</p>

<p><strong>Solutions</strong> (pick one):</p>

<ol>
   <li>
      <p><strong>Create a <code>"use client"</code> barrel file</strong> in your project that re-exports the components you need:</p>
      <pre lang="tsx"><code>// src/app/components/xcomponents/index.ts
"use client";
export { XNavbar, XFooter, XSeparator, XZigZagLayout } from "@xscriptor/xcomponents";
export { XBookReader, XBookReaderIllus, XInteractivePhrase } from "@xscriptor/xcomponents";
export { XContactForm, XNewsletter, XSocialContact } from "@xscriptor/xcomponents";</code></pre>
      <p>Then import from your barrel instead of the npm direct path:</p>
      <pre lang="tsx"><code>import { XBookReader } from "@/app/components/xcomponents";   // ok
// instead of
import { XBookReader } from "@xscriptor/xcomponents";         // worng breaks in Server Components</code></pre>
   </li>
   <li><strong>Use the component only inside <code>"use client"</code> pages or components</strong> — this works without a barrel.</li>
</ol>

<h2 id="exports">Exports</h2>

<ul>
   <li><code>@xscriptor/xcomponents</code> (root exports)</li>
   <li><code>@xscriptor/xcomponents/forms</code></li>
   <li><code>@xscriptor/xcomponents/navigation</code></li>
   <li><code>@xscriptor/xcomponents/layout</code></li>
   <li><code>@xscriptor/xcomponents/content</code></li>
   <li><code>@xscriptor/xcomponents/gallery</code></li>
   <li><code>@xscriptor/xcomponents/social</code></li>
</ul>

<h2 id="project-structure">Project Structure</h2>

<ul>
   <li><code>src/components/forms</code></li>
   <li><code>src/components/navigation</code></li>
   <li><code>src/components/layout</code></li>
   <li><code>src/components/content</code></li>
   <li><code>src/components/gallery</code></li>
   <li><code>src/components/social</code></li>
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

<a href="https://dev.xscriptor.com">XWeb</a> | <a href="https://github.com/xscriptor">Profile</a>
</div>