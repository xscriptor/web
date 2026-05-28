# Changelog

## [0.1.8] — 2026-05-27

### Fixed

- **XNavbar**: mobile overlay now renders via a React Portal to `document.body` instead of inline in the component tree. This prevents `position: fixed` from breaking when any ancestor applies `transform`, `will-change`, or `filter` (framer-motion page transitions, CSS animations, etc.). The overlay always covers the viewport correctly regardless of parent stacking contexts.

- **XSkillNetwork**: new component in `@xscriptor/xcomponents/content` — an interactive constellation/graph view for displaying skills or tagged nodes. Nodes are draggable, connected by SVG lines with hover highlighting, and show a compact tooltip on hover. Falls back to a grid layout on mobile (< 1024px). Accepts `skills: XSkillNode[]` and `constellationLabel?: string`.

## [0.1.7] — 2026-05-27

### Added

- **XBookReaderIllus**: new component in `@xscriptor/xcomponents/content` — same paginated poetry reader as `XBookReader`, but supports inline images using Markdown syntax `![alt](src)` within `rawText`. Images render at the same size/styling as the cover image (`max-width: 300px`, centered, border-radius, shadow).

### Changed

- **docs/USAGE.md**: comprehensive usage documentation created for all 19 components with full prop tables and examples.

## [0.1.5] — 2026-05-26

### Added

- **XNavbar**: new i18n-ready props — `navLabel`, `menuLabel`, `linkLabelPrefix`, `themeToggleAriaLabel`, `themeToggleTitle`. All previously hardcoded aria-labels and title attributes are now configurable while keeping Spanish defaults.

- **XContactForm**: new i18n-ready props — `nameLabel`, `emailLabel`, `phoneLabel`, `subjectLabel`, `messageLabel`, `honeypotLabel`, `honeypotName`, `submitText`, `defaultSubject`, `bodyNamePrefix`, `bodyEmailPrefix`, `bodyPhonePrefix`. Field labels, button text, mail body prefixes, and honeypot strings are now configurable while keeping Spanish defaults.

- **XNewsletter**: new `loadingText` prop (default `"Enviando..."`) to allow customising the button text while the request is in-flight.

### Changed

- Version bumped to `0.2.0` (minor release — backwards-compatible additions).
