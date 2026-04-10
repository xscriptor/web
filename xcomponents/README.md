<h1 align="center">@xscriptor/xcomponents</h1>

<div align="center">

Reusable React/Next.js component package by Xscriptor.

![npm](https://xscriptor.github.io/badges/tools/npm.svg)
![license](https://xscriptor.github.io/badges/terminal/LICENSE.svg)
![MIT](https://xscriptor.github.io/badges/licenses/mit.svg)
![typescript](https://xscriptor.github.io/badges/languages/typescript.svg)
![CSS](https://xscriptor.github.io/badges/languages/css.svg)

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