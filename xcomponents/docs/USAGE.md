# Usage Guide — @xscriptor/xcomponents

> Full documentation for all components.

---

## Index

- [Usage Guide — @xscriptor/xcomponents](#usage-guide--xscriptorxcomponents)
  - [Index](#index)
  - [Installation \& Imports](#installation--imports)
  - [Content](#content)
    - [XInteractivePhrase](#xinteractivephrase)
    - [XBookReader](#xbookreader)
    - [XBookReaderIllus](#xbookreaderillus)
    - [XSkillNetwork](#xskillnetwork)
    - [XDecryptedText](#xdecryptedtext)
    - [XRepoCard](#xrepocard)
    - [XBookReaderPoems](#xbookreaderpoems)
    - [XAsintotaReader](#xasintotareader)
    - [XCompleteBook](#xcompletebook)
  - [Forms](#forms)
    - [XContactForm](#xcontactform)
    - [XNewsletter](#xnewsletter)
  - [Gallery](#gallery)
    - [XMicroGalleryText](#xmicrogallerytext)
    - [XStaticGallery](#xstaticgallery)
  - [Layout](#layout)
    - [XFooter](#xfooter)
    - [XSeparator](#xseparator)
    - [XZigZagLayout](#xzigzaglayout)
    - [XZigZagLayoutVideo](#xzigzaglayoutvideo)
    - [XMinimalFooter](#xminimalfooter)
  - [Navigation](#navigation)
    - [XNavbar](#xnavbar)
    - [XGlassNavbar](#xglassnavbar)
  - [Social](#social)
    - [XSocialContact](#xsocialcontact)
    - [Social Icons](#social-icons)

---

## Installation & Imports

```bash
npm install @xscriptor/xcomponents
```

Import global styles once in your app layout:

```tsx
import "@xscriptor/xcomponents/styles.css";
```

Each category is importable from its own sub-path:

```tsx
import { XNavbar, XSeparator } from "@xscriptor/xcomponents";
import { XContactForm } from "@xscriptor/xcomponents/forms";
import { XBookReader } from "@xscriptor/xcomponents/content";
import { XStaticGallery } from "@xscriptor/xcomponents/gallery";
import { XFooter } from "@xscriptor/xcomponents/layout";
import { XSocialContact, XTelegramIcon } from "@xscriptor/xcomponents/social";
```

---

## Content

### XInteractivePhrase

Renders an interactive phrase where each word chunk has configurable interaction types.

```tsx
import { XInteractivePhrase } from "@xscriptor/xcomponents/content";
import type { WordConfig } from "@xscriptor/xcomponents/content";
```

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `words` | `WordConfig[]` | required | Array of word configurations |
| `as` | `"h1" \| "h2" \| "h3" \| "h4" \| "h5" \| "h6" \| "p" \| "span"` | `"p"` | Semantic HTML tag |
| `className` | `string` | `""` | Extra CSS class |

**WordConfig:**

| Prop | Type | Description |
|---|---|---|
| `text` | `string` | The word text to display |
| `type` | `"normal" \| "underline" \| "button" \| "blur1" \| "blur2"` | Interaction behavior |
| `breakAfter?` | `boolean` | Line break after this word |
| `italic?` | `boolean` | Wrap with `<em>` |
| `bold?` | `boolean` | Wrap with `<strong>` |

**Example:**

```tsx
const words: WordConfig[] = [
  { text: "Hola", type: "normal" },
  { text: "mundo", type: "underline", bold: true, breakAfter: true },
  { text: "interactivo", type: "button", italic: true },
];

<XInteractivePhrase words={words} as="h2" />
```

---

### XBookReader

Pagination-based poetry/poem reader with cover image support.

```tsx
import { XBookReader } from "@xscriptor/xcomponents/content";
```

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `rawText` | `string` | required | Raw text separated by 3+ newlines to delimit poems |
| `coverImage?` | `string` | — | URL for the cover image (shown on page 0) |

**Example:**

```tsx
<XBookReader
  coverImage="/images/portada.jpg"
  rawText={`\
Primer poema
verso uno
verso dos

Segundo poema
verso uno

Tercer poema
verso uno
verso dos
verso tres`}
/>
```

Poems are auto-paginated (4 then 5 per page), parsed into `WordConfig[]` chunks, and rendered inside `XInteractivePhrase` within `XZigZagLayout`.

---

### XBookReaderIllus

Same as `XBookReader` but supports inline images using Markdown image syntax within `rawText`.

```tsx
import { XBookReaderIllus } from "@xscriptor/xcomponents/content";
```

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `rawText` | `string` | required | Text + `![alt](src)` image blocks, separated by 3+ newlines |
| `coverImage?` | `string` | — | URL for the cover image (shown on page 0) |

**Example:**

```tsx
<XBookReaderIllus
  coverImage="/images/portada.jpg"
  rawText={`\
Primer poema
verso uno
verso dos

![Paisaje hermoso](/images/landscape.jpg)

Segundo poema
verso uno
verso dos

![Retrato](/images/portrait.jpg)

Tercer poema
verso final`}
/>
```

Rules for images:
- Place `![alt text](image-url)` as its own block separated by **3+ newlines** from surrounding text
- Images render at the same size/style as coverImage: `max-width: 300px`, centered, with border-radius and shadow
- Images count as pagination items (same 4/5 alternation as poems)

---

### XSkillNetwork

Interactive constellation/graph view for displaying skills or tagged nodes. Nodes are draggable, connected by SVG lines with hover highlighting, and show a compact tooltip on hover. Falls back to a grid layout on mobile (< 1024px).

```tsx
import { XSkillNetwork } from "@xscriptor/xcomponents/content";
import type { XSkillNetworkProps, XSkillNode } from "@xscriptor/xcomponents/content";
```

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `skills` | `XSkillNode[]` | required | Array of nodes to display in the graph |
| `constellationLabel` | `string` | `"constellation_view"` | Small footer label at bottom-left |

**XSkillNode:**

| Prop | Type | Description |
|---|---|---|
| `name` | `string` | Node display name |
| `x` | `number` | Horizontal position as percentage (0-100) |
| `y` | `number` | Vertical position as percentage (0-100) |
| `description` | `string` | Tooltip description shown on hover |
| `connections` | `number[]` | Array of node indices this node connects to |
| `category` | `"frontend" \| "backend" \| "tool" \| "core"` | Determines node color (blue, green, amber, purple) |

**Example:**

```tsx
const skills: XSkillNode[] = [
  {
    name: "TypeScript",
    x: 50, y: 45,
    description: "JavaScript with syntax for types",
    connections: [1, 2, 3],
    category: "core",
  },
  {
    name: "React",
    x: 60, y: 25,
    description: "Library for web and native user interfaces",
    connections: [0, 3],
    category: "frontend",
  },
  {
    name: "Node.js",
    x: 55, y: 60,
    description: "JavaScript runtime built on Chrome's V8",
    connections: [0, 3],
    category: "backend",
  },
  {
    name: "X",
    x: 50, y: 50,
    description: "Development ecosystem",
    connections: [0, 1, 2],
    category: "core",
  },
];

<XSkillNetwork
  skills={skills}
  constellationLabel="my-constellation"
/>
```

The component expects CSS custom properties `--background`, `--border`, `--primary`, `--text-muted`, and `--foreground` to be defined on a parent element for correct theming.

---

### XDecryptedText

Text scrambling animation on hover or in-view. Reveals characters sequentially or simultaneously.

```tsx
import { XDecryptedText } from "@xscriptor/xcomponents/content";
import type { XDecryptedTextProps } from "@xscriptor/xcomponents/content";
```

**Props (extends `HTMLMotionProps<'span'>`):**

| Prop | Type | Default | Description |
|---|---|---|---|
| `text` | `string` | required | Text to scramble |
| `speed` | `number` | `50` | Interval in ms per iteration |
| `maxIterations` | `number` | `10` | Max shuffle iterations per char |
| `sequential` | `boolean` | `false` | Reveal one char at a time |
| `revealDirection` | `"start" \| "end" \| "center"` | `"start"` | Reveal order |
| `useOriginalCharsOnly` | `boolean` | `false` | Only shuffle original chars |
| `characters` | `string` | alphanumeric + symbols | Scramble pool |
| `className` | `string` | `""` | Revealed char class |
| `encryptedClassName` | `string` | `""` | Scrambled char class |
| `parentClassName` | `string` | `""` | Wrapper class |
| `animateOn` | `"view" \| "hover"` | `"hover"` | Trigger |

**Example:**

```tsx
<XDecryptedText
  text="Mensaje secreto"
  sequential
  revealDirection="center"
  animateOn="view"
  speed={30}
/>
```

---

### XRepoCard

Animated card with title, hover overlay description, and optional icon.

```tsx
import { XRepoCard } from "@xscriptor/xcomponents/content";
import type { XRepoCardProps, XRepoCardColors } from "@xscriptor/xcomponents/content";
```

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | required | Card title |
| `description` | `string` | required | Description shown on hover |
| `href` | `string` | required | Link URL |
| `icon` | `ReactNode` | — | Optional icon (top-right) |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Card size |
| `align` | `"left" \| "center"` | `"center"` | Content alignment |
| `colors` | `XRepoCardColors` | — | Color overrides |
| `animationDelay` | `number` | `0` | framer-motion delay (s) |
| `openInNewTab` | `boolean` | — | Force new tab |
| `external` | `boolean` | auto | Treat as external link |
| `minHeight` | `CSSProperties["minHeight"]` | `"12rem"` | Min height |
| `borderRadius` | `CSSProperties["borderRadius"]` | `"1rem"` | Border radius |

**XRepoCardColors:**

| Prop | Type | Default |
|---|---|---|
| `background` | `string` | `var(--card-bg)` |
| `border` | `string` | `var(--border)` |
| `hoverBorder` | `string` | `var(--primary)` |
| `foreground` | `string` | `var(--foreground)` |
| `primary` | `string` | `var(--primary)` |
| `muted` | `string` | `var(--text-muted)` |
| `overlayBackground` | `string` | `color-mix(in srgb, var(--background) 95%, transparent)` |
| `gradientEnd` | `string` | `color-mix(in srgb, var(--background) 50%, transparent)` |
| `shadow` | `string` | `var(--card-shadow)` |

**Example:**

```tsx
<XRepoCard
  title="xcomponents"
  description="Reusable React/Next.js UI components"
  href="https://github.com/xscriptor/xcomponents"
  icon={<svg>...</svg>}
  size="lg"
  animationDelay={0.2}
/>
```

---

### XBookReaderPoems

Advanced poetry reader with section index, poem reordering, and multi-locale support. Parses raw text with section titles (TACTO, TRANSFUSIONES, etc.) and renders poems in a zigzag layout.

```tsx
import { XBookReaderPoems } from "@xscriptor/xcomponents/content";
import type { XBookReaderPoemsProps } from "@xscriptor/xcomponents/content";
```

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `rawText` | `string` | required | Raw text with poems and index |
| `coverImage` | `string` | — | Cover image URL |
| `locale` | `string` | `"es"` | Locale for built-in labels |
| `labels` | `Partial<Labels>` | — | Override labels |
| `messages` | `Record<string, Partial<Labels>>` | — | Full translations by locale |
| `indexHeaders` | `Record<string, string>` | — | Index header text by locale |
| `sectionNames` | `Record<string, string[]>` | — | Section names by locale |

**Labels:**

| Key | Default (es) | Description |
|---|---|---|
| `prev` | `"Anterior"` | Previous button |
| `next` | `"Siguiente"` | Next button |
| `pageOf` | `"Página {current} de {total}"` | Page indicator template |
| `index` | `"Índice"` | Index page title |
| `coverAlt` | `"Portada"` | Cover image alt text |

**Example:**

```tsx
<XBookReaderPoems
  rawText={rawBookContent}
  coverImage="/images/portada.jpg"
  locale="es"
/>
```

Built-in locales: `es`, `en`, `de`. Add more via `messages`:

```tsx
<XBookReaderPoems
  locale="fr"
  messages={{
    fr: {
      prev: "Précédent",
      next: "Suivant",
      pageOf: "Page {current} sur {total}",
      index: "Table des matières",
      coverAlt: "Couverture",
    }
  }}
/>
```

---

### XAsintotaReader

Simplified poetry reader for sections (CURVA, PLANO CARTESIANO, RECTA) with image captions and index.

```tsx
import { XAsintotaReader } from "@xscriptor/xcomponents/content";
import type { XAsintotaReaderProps } from "@xscriptor/xcomponents/content";
```

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `rawText` | `string` | required | Raw text with poems and index |
| `coverImage` | `string` | — | Cover image URL |
| `locale` | `string` | `"es"` | Locale for built-in labels |
| `labels` | `Partial<Labels>` | — | Override labels |
| `messages` | `Record<string, Partial<Labels>>` | — | Full translations by locale |
| `indexHeaders` | `Record<string, string>` | — | Index header text by locale |
| `sectionNames` | `Record<string, string[]>` | — | Section names by locale |

**Example:**

```tsx
<XAsintotaReader
  rawText={rawBookContent}
  coverImage="/images/asintota.jpg"
  locale="es"
/>
```

---

### XCompleteBook

Full-featured poetry reader with full-bleed background video/image, section titles, index page, and multi-locale support.

```tsx
import { XCompleteBook } from "@xscriptor/xcomponents/content";
import type { XCompleteBookProps } from "@xscriptor/xcomponents/content";
```

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `rawText` | `string` | required | Raw text with poems |
| `coverImage` | `string` | — | Cover image URL |
| `backgroundImage` | `string` | — | Full-bleed background image |
| `backgroundVideo` | `string` | — | Full-bleed background video |
| `locale` | `string` | `"es"` | Locale for built-in labels |
| `overlayColor` | `string` | `"rgba(0,0,0,0.45)"` | Overlay over background |
| `labels` | `Partial<Labels>` | — | Override labels |
| `messages` | `Record<string, Partial<Labels>>` | — | Full translations by locale |
| `indexHeaders` | `Record<string, string>` | — | Index header text by locale |
| `sectionNames` | `Record<string, string[]>` | — | Section names by locale |
| `onPageChange` | `(page: number) => void` | — | Page change callback |

**Labels:**

| Key | Default (es) | Description |
|---|---|---|
| `prev` | `"Anterior"` | Previous button |
| `next` | `"Siguiente"` | Next button |
| `pageOf` | `"Página {current} de {total}"` | Page indicator template |
| `index` | `"Índice"` | Index page title |

**Example:**

```tsx
<XCompleteBook
  rawText={rawBookContent}
  coverImage="/images/portada.jpg"
  backgroundVideo="/videos/book-bg.mp4"
  locale="es"
  onPageChange={(page) => console.log("Page:", page)}
/>
```

---

## Forms

### XContactForm

Configurable contact form that opens the user's email client via `mailto:`.

```tsx
import { XContactForm } from "@xscriptor/xcomponents/forms";
import type { XContactFormProps } from "@xscriptor/xcomponents/forms";
```

**Props (all optional unless noted):**

| Prop | Type | Default | Description |
|---|---|---|---|
| `showName` | `boolean` | `true` | Show name field |
| `showEmail` | `boolean` | `true` | Show email field |
| `showPhone` | `boolean` | `true` | Show phone field |
| `showSubject` | `boolean` | `true` | Show subject field |
| `showMessage` | `boolean` | `true` | Show message textarea |
| `namePlaceholder` | `string` | `"Tu nombre"` | Placeholder text |
| `emailPlaceholder` | `string` | `"tucorreo@ejemplo.com"` | Placeholder text |
| `phonePlaceholder` | `string` | `"+34 600 000 000"` | Placeholder text |
| `subjectPlaceholder` | `string` | `"Tema del mensaje"` | Placeholder text |
| `messagePlaceholder` | `string` | `"Cuéntame qué necesitas…"` | Placeholder text |
| `nameLabel` | `string` | `"Nombre"` | Label text |
| `emailLabel` | `string` | `"Email"` | Label text |
| `phoneLabel` | `string` | `"Teléfono"` | Label text |
| `subjectLabel` | `string` | `"Asunto"` | Label text |
| `messageLabel` | `string` | `"Mensaje"` | Label text |
| `submitText` | `string` | `"Enviar"` | Button text |
| `defaultSubject` | `string` | `"Contacto desde web"` | Subject when field hidden |
| `bodyNamePrefix` | `string` | `"Nombre: "` | Prefix in email body |
| `bodyEmailPrefix` | `string` | `"Email: "` | Prefix in email body |
| `bodyPhonePrefix` | `string` | `"Teléfono: "` | Prefix in email body |
| `honeypotLabel` | `string` | `"Tu web"` | Honeypot label |
| `honeypotName` | `string` | `"website"` | Honeypot input name |
| `requiredFieldsMessage` | `string` | `"Rellena los campos obligatorios."` | Validation message |
| `honeypotMessage` | `string` | `"Gracias."` | Anti-spam trigger message |
| `submitSuccessMessage` | `string` | `"Abriendo tu aplicación de correo…"` | Success message |
| `labelColor` | `string` | — | CSS color for labels |
| `wrapperBackgroundColor` | `string` | — | Wrapper background |
| `wrapperBorderColor` | `string` | — | Wrapper border color |
| `wrapperBorderWidth` | `string` | — | Wrapper border width |
| `wrapperBorderRadius` | `"rounded" \| "square"` | `"rounded"` | Wrapper radius |
| `wrapperBorderStyle` | `"solid" \| "dashed" \| "dotted"` | `"solid"` | Wrapper border style |
| `fieldBorderColor` | `string` | — | Input border color |
| `fieldBorderWidth` | `string` | — | Input border width |
| `fieldBorderRadius` | `"rounded" \| "square"` | `"rounded"` | Input radius |
| `fieldBorderStyle` | `"solid" \| "dashed" \| "dotted"` | `"solid"` | Input border style |
| `buttonColor` | `string` | — | Button bg color |
| `buttonTextColor` | `string` | — | Button text color |
| `buttonBorderColor` | `string` | — | Button border color |
| `buttonBorderWidth` | `string` | — | Button border width |
| `buttonBorderRadius` | `"rounded" \| "square"` | `"rounded"` | Button radius |
| `buttonBorderStyle` | `"solid" \| "dashed" \| "dotted"` | `"solid"` | Button border style |
| `buttonHoverColor` | `string` | — | Button hover bg |
| `buttonHoverTextColor` | `string` | — | Button hover text |
| `buttonHoverBorderColor` | `string` | — | Button hover border |
| `buttonAlignment` | `"left" \| "right"` | `"left"` | Button alignment |
| `statusSuccessColor` | `string` | — | Success text color |
| `statusErrorColor` | `string` | — | Error text color |
| `decorativeX` | `boolean` | `false` | Show decorative X |
| `decorativeXColor` | `string` | `"currentColor"` | X color |
| `size` | `"small" \| "medium" \| "large"` | `"medium"` | Size variant |
| `layout` | `"vertical" \| "grid"` | `"grid"` | Layout mode |

**Example:**

```tsx
<XContactForm
  showPhone={false}
  buttonColor="#ab865d"
  buttonHoverColor="#c9a87c"
  decorativeX
  size="large"
/>
```

---

### XNewsletter

Newsletter subscription form with async API submission.

```tsx
import { XNewsletter } from "@xscriptor/xcomponents/forms";
import type { XNewsletterProps } from "@xscriptor/xcomponents/forms";
```

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `apiRoute` | `string` | **required** | API endpoint for subscription |
| `title` | `string` | `"Recibe poesía y reflexiones"` | Title text |
| `placeholder` | `string` | `"tu@email.com"` | Input placeholder |
| `buttonText` | `string` | `"Suscribirse"` | Button text |
| `loadingText` | `string` | `"Enviando..."` | Loading state text |
| `termsText` | `string` | `"Acepto"` | Checkbox label |
| `termsLinkText` | `string` | `"términos"` | Clickable terms text |
| `termsLink` | `string` | `"/terminos-y-condiciones"` | Terms URL |
| `successMessage` | `string` | `"¡Bienvenido(a)!"` | Success message |
| `errorMessage` | `string` | `"Algo salió mal..."` | Error message |
| `termsErrorMessage` | `string` | `"Debes aceptar los términos..."` | Terms validation message |
| `method` | `"POST" \| "GET" \| "PUT"` | `"POST"` | HTTP method |
| `payloadType` | `"formData" \| "json"` | `"formData"` | Payload format |
| `layout` | `"horizontal" \| "vertical"` | `"horizontal"` | Layout direction |
| `accentColor` | `string` | `"var(--accent)"` | Accent CSS color |
| `textColor` | `string` | `"var(--text)"` | Text CSS color |
| `borderColor` | `string` | `"var(--border)"` | Border CSS color |
| `buttonTextColor` | `string` | `"var(--accent-text)"` | Button text color |
| `containerClassName` | `string` | `"w-full max-w-4xl mx-auto px-4 py-6"` | Extra CSS classes |

**Example:**

```tsx
<XNewsletter
  apiRoute="/api/subscribe"
  layout="vertical"
  accentColor="#ab865d"
/>
```

---

## Gallery

### XMicroGalleryText

Micro-gallery showing 3 images alongside text with auto-shuffle.

```tsx
import { XMicroGalleryText } from "@xscriptor/xcomponents/gallery";
import type { XMicroGalleryTextProps, XMicroGalleryImage } from "@xscriptor/xcomponents/gallery";
```

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `images` | `XMicroGalleryImage[]` | required | Array of images (3 displayed at a time) |
| `text` | `React.ReactNode` | required | Content shown alongside images |
| `textPosition` | `"left" \| "right"` | `"left"` | Which side the text appears |
| `textAlign` | `"left" \| "right" \| "center"` | `"left"` | Text alignment within its container |
| `autoShuffle` | `boolean` | `false` | Automatically rotate images |
| `shuffleInterval` | `number` | `5000` | Rotation interval in ms |

**XMicroGalleryImage:**

| Prop | Type | Description |
|---|---|---|
| `src` | `string` | Image URL |
| `alt` | `string` | Alt text |

**Example:**

```tsx
<XMicroGalleryText
  images={[
    { src: "/img1.jpg", alt: "Descripción 1" },
    { src: "/img2.jpg", alt: "Descripción 2" },
    { src: "/img3.jpg", alt: "Descripción 3" },
    { src: "/img4.jpg", alt: "Descripción 4" },
  ]}
  text="<p>Texto acompañante</p>"
  textPosition="right"
  autoShuffle
  shuffleInterval={4000}
/>
```

---

### XStaticGallery

Masonry-style static image gallery with configurable columns.

```tsx
import { XStaticGallery } from "@xscriptor/xcomponents/gallery";
import type { XStaticGalleryProps, XStaticGalleryImage } from "@xscriptor/xcomponents/gallery";
```

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `images` | `XStaticGalleryImage[]` | required | Array of images |
| `columns` | `1 \| 2 \| 3 \| 4 \| 5` | `4` | Grid columns |
| `title` | `string` | — | Optional gallery title |

**XStaticGalleryImage:**

| Prop | Type | Description |
|---|---|---|
| `src` | `string` | Image URL |
| `alt` | `string` | Alt text |

**Example:**

```tsx
<XStaticGallery
  images={[
    { src: "/photo1.jpg", alt: "Photo 1" },
    { src: "/photo2.jpg", alt: "Photo 2" },
    { src: "/photo3.jpg", alt: "Photo 3" },
  ]}
  columns={3}
  title="My Gallery"
/>
```

---

## Layout

### XFooter

Footer component with navigation links and copyright.

```tsx
import { XFooter } from "@xscriptor/xcomponents/layout";
import type { XFooterProps, XFooterLink, CopyrightConfig } from "@xscriptor/xcomponents/layout";
```

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `links` | `XFooterLink[]` | required | Navigation links |
| `copyright` | `CopyrightConfig` | — | Copyright configuration |
| `layout` | `"horizontal" \| "vertical"` | `"horizontal"` | Link layout direction |
| `columns` | `1 \| 2 \| 3 \| 4` | `1` | Grid columns (horizontal only) |
| `colors` | `{ bg?, text?, accent?, border? }` | — | Color overrides |
| `className` | `string` | — | Extra CSS class |

**XFooterLink:**

| Prop | Type | Description |
|---|---|---|
| `label` | `string` | Display text |
| `href` | `string` | Link URL |

**CopyrightConfig:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `text?` | `string` | `"Xscriptor"` | Copyright holder |
| `showYear?` | `boolean` | — | Show current year |
| `customYear?` | `number \| string` | — | Custom year |
| `yearFirst?` | `boolean` | `false` | Year before text |

**Example:**

```tsx
<XFooter
  links={[
    { label: "Inicio", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "Contacto", href: "/contacto" },
  ]}
  copyright={{ text: "Xscriptor", showYear: true }}
  layout="horizontal"
  columns={3}
/>
```

---

### XSeparator

Versatile divider line with multiple styles.

```tsx
import { XSeparator } from "@xscriptor/xcomponents/layout";
import type { XSeparatorProps } from "@xscriptor/xcomponents/layout";
```

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Line direction |
| `variant` | `"solid" \| "dashed" \| "dotted"` | `"solid"` | Line style |
| `isFaded` | `boolean` | `false` | Fade edges |
| `hasX` | `boolean` | `false` | Decorative X in center |
| `xColor` | `string` | — | X color (defaults to `color`) |
| `xBg` | `string` | `"white"` | Background behind X |
| `thickness` | `string` | `"1px"` | Line thickness |
| `color` | `string` | `"#e2e8f0"` | Line color |
| `gap` | `string` | `"1rem"` | Margin above/below |
| `className` | `string` | `""` | Extra CSS class |

**Example:**

```tsx
<XSeparator variant="dashed" isFaded gap="2rem" />

<XSeparator hasX xColor="#ab865d" thickness="2px" color="#ab865d" gap="3rem" />

<XSeparator orientation="vertical" thickness="2px" color="var(--accent)" />
```

---

### XZigZagLayout

Layout that alternates children between left and right sides in a zigzag pattern, with an optional SVG connecting line that draws on scroll.

```tsx
import { XZigZagLayout } from "@xscriptor/xcomponents/layout";
import type { XZigZagLayoutProps } from "@xscriptor/xcomponents/layout";
```

**Props (extends `HTMLAttributes<HTMLDivElement>`):**

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `React.ReactNode` | required | Items to zigzag |
| `startSide` | `"left" \| "right"` | `"left"` | First item side |
| `gap` | `number \| string` | — | Space between items (px or CSS) |
| `offset` | `number \| string` | — | Horizontal offset per item |
| `textAlign` | `"inherit" \| "side" \| "left" \| "right"` | `"inherit"` | Text alignment (`"side"` aligns away from center line) |
| `showLine` | `boolean` | `false` | Draw SVG connecting line |
| `lineColor` | `string` | `"#cccccc"` | Line color |
| `lineThickness` | `number \| string` | `2` | Line thickness |

**Example:**

```tsx
<XZigZagLayout
  startSide="left"
  gap={6}
  offset="clamp(1rem, 4vw, 4rem)"
  textAlign="side"
  showLine
  lineColor="var(--accent)"
  lineThickness={0.2}
>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</XZigZagLayout>
```

---

### XZigZagLayoutVideo

Extends `XZigZagLayout` with a full-bleed video or image background and staggered item reveal on scroll.

```tsx
import { XZigZagLayoutVideo } from "@xscriptor/xcomponents/layout";
import type { XZigZagLayoutVideoProps } from "@xscriptor/xcomponents/layout";
```

**Props (extends `HTMLAttributes<HTMLDivElement>`):**

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `React.ReactNode` | required | Items to zigzag |
| `startSide` | `"left" \| "right"` | `"left"` | First item side |
| `gap` | `number \| string` | — | Space between items |
| `offset` | `number \| string` | — | Horizontal offset per item |
| `textAlign` | `"inherit" \| "side" \| "left" \| "right"` | `"inherit"` | Text alignment |
| `showLine` | `boolean` | `false` | Draw SVG connecting line |
| `lineColor` | `string` | `"#cccccc"` | Line color |
| `lineThickness` | `number \| string` | `2` | Line thickness |
| `videoSrc` | `string` | — | Background video URL |
| `imageSrc` | `string` | — | Background image URL |
| `overlayColor` | `string` | — | Overlay CSS color over media |

**Example:**

```tsx
<XZigZagLayoutVideo
  videoSrc="/videos/background.mp4"
  overlayColor="rgba(0, 0, 0, 0.45)"
  startSide="left"
  showLine
  lineColor="var(--accent)"
>
  <div>Contenido sobre el video</div>
  <div>Más contenido</div>
</XZigZagLayoutVideo>
```

---

### XMinimalFooter

Minimal inline footer with copyright and optional links.

```tsx
import { XMinimalFooter } from "@xscriptor/xcomponents/layout";
import type { XMinimalFooterProps } from "@xscriptor/xcomponents/layout";
```

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `copyright` | `string` | required | Copyright text |
| `links` | `{ label: string; href: string }[]` | `[]` | Optional links |
| `className` | `string` | `""` | Extra CSS class |
| `style` | `CSSProperties` | — | Inline styles |

**Example:**

```tsx
<XMinimalFooter
  copyright="© 2025 Xscriptor"
  links={[
    { label: "GitHub", href: "https://github.com/xscriptor" },
    { label: "Twitter", href: "https://twitter.com/xscriptor" },
  ]}
/>
```

---

## Navigation

### XNavbar

Responsive navigation bar with theme toggle, mobile menu, and accessibility.

```tsx
import { XNavbar } from "@xscriptor/xcomponents/navigation";
import type { XNavbarProps, NavLinkItem, ThemeToggleIcons, IconRenderer } from "@xscriptor/xcomponents/navigation";
```

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `linksLeft` | `NavLinkItem[]` | `[]` | Links left of logo (desktop) |
| `linksRight` | `NavLinkItem[]` | `[]` | Links right of logo (desktop) |
| `logo` | `React.ReactNode` | `"X"` | Central logo content |
| `logoAsThemeToggle` | `boolean` | `true` | Logo toggles theme |
| `onLogoClick` | `() => void` | — | Custom click handler |
| `themeIcons` | `ThemeToggleIcons` | — | Icons for light/dark |
| `defaultTheme` | `"light" \| "dark"` | `"light"` | Initial theme |
| `storageKey` | `string` | `"theme"` | localStorage key |
| `linkColor` | `string` | — | Link text color |
| `linkHoverColor` | `string` | — | Link hover color |
| `linkActiveColor` | `string` | — | Active link underline color |
| `iconColor` | `string` | — | Theme icon color |
| `iconHoverColor` | `string` | — | Theme icon hover color |
| `iconSize` | `number` | `22` | Icon size in px |
| `hamburgerColor` | `string` | — | Hamburger bars color |
| `hamburgerBarWidth` | `string` | — | Hamburger bar width |
| `hamburgerBarThickness` | `string` | — | Hamburger bar thickness |
| `cssVars` | `Record<string, string>` | — | Extra CSS variables |
| `labelOpen` | `string` | `"Abrir menú"` | aria-label (closed) |
| `labelClose` | `string` | `"Cerrar menú"` | aria-label (open) |
| `labelDark` | `string` | `"Oscuro"` | Dark mode label |
| `labelLight` | `string` | `"Claro"` | Light mode label |
| `navLabel` | `string` | `"Navegación principal"` | Desktop nav aria-label |
| `menuLabel` | `string` | `"Menú de navegación"` | Mobile overlay aria-label |
| `linkLabelPrefix` | `string` | `"Ir a "` | Link aria-label prefix |
| `themeToggleAriaLabel` | `(theme) => string` | built-in | Logo aria-label fn |
| `themeToggleTitle` | `(theme) => string` | built-in | Logo title fn |
| `className` | `string` | — | Extra class |

**NavLinkItem:**

| Prop | Type | Description |
|---|---|---|
| `url` | `string` | Route URL |
| `title` | `string` | Visible text |
| `external?` | `boolean` | Opens in new tab |

**ThemeToggleIcons:**

| Prop | Type | Description |
|---|---|---|
| `toDark` | `IconRenderer` | Icon shown when switching to dark (ReactNode or `(size, color?) => ReactNode`) |
| `toLight` | `IconRenderer` | Icon shown when switching to light |

**Example:**

```tsx
<XNavbar
  linksLeft={[
    { url: "/", title: "Inicio" },
    { url: "/blog", title: "Blog" },
  ]}
  linksRight={[
    { url: "/contacto", title: "Contacto" },
    { url: "https://github.com/xscriptor", title: "GitHub", external: true },
  ]}
  logo="X"
  themeIcons={{
    toDark: (size) => <svg width={size} height={size}>...</svg>,
    toLight: (size) => <svg width={size} height={size}>...</svg>,
  }}
  linkColor="var(--text)"
  linkActiveColor="var(--accent)"
/>
```

---

### XGlassNavbar

Glassmorphism floating navbar with theme toggle and mobile overlay.

```tsx
import { XGlassNavbar } from "@xscriptor/xcomponents/navigation";
import type { XGlassNavbarProps, NavLinkItem, ThemeToggleIcons, IconRenderer } from "@xscriptor/xcomponents/navigation";
```

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `linksLeft` | `NavLinkItem[]` | `[]` | Links left of logo (desktop) |
| `linksRight` | `NavLinkItem[]` | `[]` | Links right of logo (desktop) |
| `logo` | `ReactNode` | `"X"` | Central logo content |
| `logoAsThemeToggle` | `boolean` | `true` | Logo toggles theme |
| `onLogoClick` | `() => void` | — | Custom click handler |
| `themeIcons` | `ThemeToggleIcons` | — | Icons for light/dark |
| `defaultTheme` | `"light" \| "dark"` | `"light"` | Initial theme |
| `storageKey` | `string` | `"theme"` | localStorage key |
| `linkColor` | `string` | `"var(--text)"` | Link text color |
| `linkHoverColor` | `string` | — | Link hover color |
| `linkActiveColor` | `string` | `"var(--accent)"` | Active link color |
| `iconColor` | `string` | — | Theme icon color |
| `iconHoverColor` | `string` | — | Theme icon hover color |
| `iconSize` | `number` | `22` | Icon size in px |
| `hamburgerColor` | `string` | — | Hamburger bars color |
| `hamburgerBarWidth` | `string` | `"1.25rem"` | Hamburger bar width |
| `hamburgerBarThickness` | `string` | `"2px"` | Hamburger bar thickness |
| `cssVars` | `Record<string, string>` | — | Extra CSS variables |
| `labelOpen` | `string` | `"Abrir menú"` | aria-label (closed) |
| `labelClose` | `string` | `"Cerrar menú"` | aria-label (open) |
| `labelDark` | `string` | `"Oscuro"` | Dark mode label |
| `labelLight` | `string` | `"Claro"` | Light mode label |
| `navLabel` | `string` | `"Navegación principal"` | Desktop nav aria-label |
| `menuLabel` | `string` | `"Menú de navegación"` | Mobile overlay aria-label |
| `linkLabelPrefix` | `string` | `"Ir a "` | Link aria-label prefix |
| `themeToggleAriaLabel` | `(theme) => string` | built-in | Logo aria-label fn |
| `themeToggleTitle` | `(theme) => string` | built-in | Logo title fn |
| `className` | `string` | `""` | Extra class |

**NavLinkItem** (same as XNavbar):

| Prop | Type | Description |
|---|---|---|
| `url` | `string` | Route URL |
| `title` | `string` | Visible text |
| `external?` | `boolean` | Opens in new tab |
| `showExternalIcon?` | `boolean` | Show `↗` indicator |

**Example:**

```tsx
<XGlassNavbar
  linksLeft={[
    { url: "/", title: "Inicio" },
    { url: "/blog", title: "Blog" },
  ]}
  linksRight={[
    { url: "/contacto", title: "Contacto" },
    { url: "https://github.com/xscriptor", title: "GitHub", external: true },
  ]}
  logo="X"
  themeIcons={{
    toDark: (size) => <MoonIcon size={size} />,
    toLight: (size) => <SunIcon size={size} />,
  }}
/>
```

---

## Social

### XSocialContact

Grid of social media contact links.

```tsx
import { XSocialContact } from "@xscriptor/xcomponents/social";
import type { XSocialContactProps, SocialItem } from "@xscriptor/xcomponents/social";
```

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `SocialItem[]` | required | Social media items |
| `columns` | `number` | `3` | Grid columns |
| `rows` | `number` | — | Grid rows (limits items shown) |
| `size` | `"small" \| "medium" \| "large"` | `"medium"` | Size variant |
| `alignment` | `"left" \| "center" \| "right"` | `"center"` | Grid alignment |
| `gap` | `string` | auto | Gap between items |
| `backgroundColor` | `string` | — | Container background |
| `iconDefaultColor` | `string` | — | Default icon color |
| `iconDefaultHoverColor` | `string` | — | Default icon hover color |
| `borderColor` | `string` | — | Item border color |
| `borderWidth` | `string` | — | Item border width |
| `borderStyle` | `"solid" \| "dashed" \| "dotted"` | `"solid"` | Item border style |
| `borderRadius` | `"rounded" \| "square"` | `"rounded"` | Item border radius |
| `padding` | `string` | auto | Item padding |
| `textAlign` | `"left" \| "center" \| "right"` | `"center"` | Text alignment within items |
| `textColor` | `string` | — | Item text color |
| `textSize` | `string` | auto | Item text font size |

**SocialItem:**

| Prop | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier |
| `href` | `string` | Profile or contact URL |
| `label` | `string` | Link label / tooltip |
| `icon` | `React.ReactNode` | Icon component |
| `text?` | `string` | Optional display text |
| `iconColor?` | `string` | Per-item icon color override |
| `iconHoverColor?` | `string` | Per-item icon hover color override |

**Example:**

```tsx
<XSocialContact
  items={[
    {
      id: "telegram",
      href: "https://t.me/xscriptor",
      label: "Telegram",
      icon: <XTelegramIcon size="32" />,
      text: "Telegram",
    },
    {
      id: "email",
      href: "mailto:x@xscriptor.com",
      label: "Email",
      icon: <XEmailIcon size="32" />,
      text: "Email",
    },
  ]}
  columns={2}
  size="medium"
  alignment="center"
  iconDefaultColor="var(--accent)"
/>
```

---

### Social Icons

Seven SVG social media icon components. Each accepts the same props.

```tsx
import {
  XTelegramIcon,
  XInstagramIcon,
  XWhatsappIcon,
  XEmailIcon,
  XLinkedInIcon,
  XTwitterIcon,
  XGitHubIcon,
} from "@xscriptor/xcomponents/social";
```

**Props (`XSocialIconProps`, extends `SVGProps<SVGSVGElement>`):**

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `number \| string` | `24` | Icon dimensions (px) |
| `color` | `string` | `"currentColor"` | Stroke color |
| `hoverColor` | `string` | — | Hover stroke color |
| `fillColor` | `string` | — | Fill color |
| `hoverFillColor` | `string` | — | Hover fill color |
| `backgroundColor` | `string` | — | Circle background fill |
| `badgeColor` | `string` | — | Badge + stroke color |
| `badgeBackgroundColor` | `string` | — | Badge circle fill |
| `strokeWidth` | `number` | varies (1.35–1.8) | Icon stroke width |
| `showBadge` | `boolean` | `true` | Show corner badge |
| `title` | `string` | — | Accessible title (sets `role="img"`) |

**Example:**

```tsx
<XTelegramIcon size={32} color="#ab865d" hoverColor="#c9a87c" showBadge />

<XGitHubIcon size={48} color="currentColor" fillColor="currentColor" showBadge={false} title="GitHub" />
```
