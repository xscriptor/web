# Contributing

Thanks for your interest in improving @xscriptor/xcomponents.

## Scope

This package contains reusable React/Next.js UI components.
Contributions should keep public APIs stable and types well documented.

## Development setup

1. Install dependencies:

```bash
npm install
```

2. Build the package:

```bash
npm run prepare:build
```

3. Validate the package content:

```bash
npm pack --dry-run
```

## Contribution workflow

1. Create a feature branch from `dev`.
2. Keep changes focused and small.
3. Add or update examples when behavior changes.
4. Ensure build passes before opening a PR.
5. Open a pull request with:
   - clear summary
   - screenshots or usage snippet for UI changes
   - migration note if API changed

## Coding guidelines

- Use TypeScript and exported prop types.
- Keep component names with `X` prefix.
- Prefer category barrels for exports.
- Avoid breaking changes unless explicitly discussed.

## Commit style

Use concise, imperative commit messages, for example:

- `feat(social): add XLinkedInIcon hover fill support`
- `fix(layout): correct zigzag spacing on mobile`
- `docs(readme): update publish steps`

## Reporting issues

Please include:

- expected behavior
- current behavior
- reproduction steps
- package version
- React/Next.js versions
