# Tonalize

A fast, fully client-side color palette generator. Generates a 5-role palette (primary,
secondary, accent, text, muted text), nudges it toward WCAG-readable contrast, and lets
you lock, fine-tune, save, and export it — all in the browser, with **no server, no
database, and no API routes**. Built to deploy as a static export to GitHub Pages.

## Features

- **Harmony-aware generation** — auto, complementary, analogous, triadic, monochromatic
- **Per-role locking** — lock any color so randomize leaves it alone
- **Undo / redo** history (and `Ctrl/Cmd+Z` / `Ctrl/Cmd+Shift+Z`)
- **Fine-tune any color** — hex input + H/S/L sliders, live WCAG contrast badge
- **Shade ramps** — 50–950 tint/shade scale per role, click any chip to copy its hex
- **Accessibility panel** — contrast ratio + AA/AAA rating for every background × text pair
- **Save palettes** to a local library (persisted in `localStorage`)
- **Shareable links** — palette state is encoded directly in the URL, no backend needed
- **Export**: PNG, SVG, CSS variables, SCSS variables, Tailwind v3 config, Tailwind v4
  `@theme`, JSON tokens, and quick hex/labeled copy-to-clipboard
- **App theme**: light / dark / system, persisted, no flash-of-wrong-theme on load
- **Keyboard shortcuts**: `Space` to randomize

Everything above — including the PNG export — runs with `<canvas>`/SVG and the
Clipboard API in the browser. Nothing requires a server at runtime.

## Local development

```bash
npm install
npm run dev
```

## Building the static export

```bash
npm run build
```

This produces a fully static site in `./out` — open `out/index.html` directly, or serve
the folder with any static file server. There is no `next start` step needed for
production; static hosting is enough.

## Deploying to GitHub Pages

A workflow is already set up at `.github/workflows/deploy.yml`. To use it:

1. Push this repo to GitHub.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. If your repo is *not* named `Tonalize`, update the `NEXT_PUBLIC_BASE_PATH` value in
   `.github/workflows/deploy.yml` to match your repo name (e.g. `/my-repo`). If you're
   deploying to a custom domain or a `USER.github.io` *user* site, delete that env line
   entirely — those are served from the root and don't need a base path.
4. Push to `main`. The workflow builds and publishes `./out` automatically.

### Deploying manually (no Actions)

```bash
NEXT_PUBLIC_BASE_PATH=/your-repo-name npm run build
# commit/push the contents of ./out to a `gh-pages` branch, or upload it
# anywhere that serves static files.
```

## Project structure

```
src/
  app/                 # routes: / (generator), /about, not-found
  components/          # UI: SwatchBand, ControlsPanel, ExportPanel, ColorEditModal, ...
  context/             # PaletteContext (state), ThemeContext (UI theme),
                        # ToastContext (notifications), PanelContext (overlay UI state)
  lib/
    color.ts            # HSL/RGB/hex conversions, contrast math, shade ramps — dependency-free
    palette.ts           # harmony-aware palette generation
    storage.ts            # localStorage read/write helpers
    urlShare.ts            # encode/decode palette into a URL param
    exportPalette.ts        # CSS/SCSS/Tailwind/JSON/PNG/SVG export
```
