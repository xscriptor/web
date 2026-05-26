# Changelog

## [0.1.5] — 2026-05-26

### Added

- **XNavbar**: new i18n-ready props — `navLabel`, `menuLabel`, `linkLabelPrefix`, `themeToggleAriaLabel`, `themeToggleTitle`. All previously hardcoded aria-labels and title attributes are now configurable while keeping Spanish defaults.

- **XContactForm**: new i18n-ready props — `nameLabel`, `emailLabel`, `phoneLabel`, `subjectLabel`, `messageLabel`, `honeypotLabel`, `honeypotName`, `submitText`, `defaultSubject`, `bodyNamePrefix`, `bodyEmailPrefix`, `bodyPhonePrefix`. Field labels, button text, mail body prefixes, and honeypot strings are now configurable while keeping Spanish defaults.

- **XNewsletter**: new `loadingText` prop (default `"Enviando..."`) to allow customising the button text while the request is in-flight.

### Changed

- Version bumped to `0.2.0` (minor release — backwards-compatible additions).
