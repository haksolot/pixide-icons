<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./docs/images/pixide-logo-dark.svg">
    <img src="./docs/images/pixide-logo.svg" alt="Pixide Icons" width="96" height="96">
  </picture>
</p>

<h1 align="center">Pixide Icons</h1>

<p align="center">
  Pixel-style icon library — a fork of <a href="https://lucide.dev">Lucide</a> with a pixel-art conversion pipeline.
</p>

<p align="center">
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-ISC-blue" alt="License"></a>
  <img src="https://img.shields.io/badge/icons-1694-brightgreen" alt="Icon count">
  <img src="https://img.shields.io/badge/grid-24×24-orange" alt="Grid">
</p>

---

## What is Pixide?

Pixide converts every [Lucide](https://lucide.dev) icon into a clean **24×24 pixel grid** via a rasterization pipeline. The result is a crisp, retro icon library that stays API-compatible with Lucide.

Each icon is:
- Stored as a **bitpacked 24×24 binary grid** — 96 chars per icon
- Rendered as **SVG `<rect>` elements** — no paths, no strokes, no blur
- **Tree-shakeable** — only imported icons land in your bundle

---

## Quick Start

```bash
npm install pixide-react
```

```tsx
import { Camera, Activity, Box } from 'pixide-react';

export default function App() {
  return (
    <div>
      <Camera />
      <Activity size={32} />
      <Box color="#6366f1" />
    </div>
  );
}
```

---

## API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `number \| string` | `24` | Width and height in px |
| `color` | `string` | `currentColor` | Fill color |
| `className` | `string` | `''` | CSS class on the `<svg>` |

> Pixide uses `fill` instead of `stroke` — there is no `strokeWidth` prop.

### Global defaults with `PixideProvider`

```tsx
import { PixideProvider } from 'pixide-react';

function App() {
  return (
    <PixideProvider size={20} color="black">
      {/* all icons inside inherit these defaults */}
    </PixideProvider>
  );
}
```

---

## Packages

| Package | Status | Description |
|---------|--------|-------------|
| `pixide-react` | ✅ Ready | React component library |
| `pixide-vue` | 🚧 Planned | Vue 3 component library |
| `pixide-svelte` | 🚧 Planned | Svelte component library |
| `pixide-static` | 🚧 Planned | Raw pixel SVG files |

---

## How it works

```
Lucide SVG  (stroke-based vector)
      │
      │  @resvg/resvg-js
      ▼
  Render at 48×48 px
      │
      │  Downsample with OR threshold
      ▼
  24×24 binary pixel grid
      │
      │  Bitpack → base64
      ▼
  96-char string per icon
      │
      │  generate-ts.mjs
      ▼
  TypeScript file  →  React component  →  <rect> elements
```

### Run the pipeline locally

```bash
cd converter

# 1. Copy SVG sources from icons/ → icons/original/
node extract.mjs

# 2. Rasterize & convert → icons/pixel/*.json + *.svg
node convert.mjs

# 3. Generate TypeScript files → packages/pixide-react/src/icons/
node generate-ts.mjs

# 4. Open side-by-side preview in your browser
node preview.mjs
```

Or run everything at once:

```bash
npm run pipeline
```

---

## Differences from Lucide

| | Lucide | Pixide |
|---|---|---|
| Rendering | SVG paths + stroke | SVG `<rect>` fill only |
| `strokeWidth` prop | ✅ | ❌ |
| Visual style | Smooth, vector | Pixel-art, crisp |
| Icon data | Path node arrays | Base64 pixel grid |
| Grid | 24×24 viewBox | 24×24 binary pixels |

---

## Syncing with upstream Lucide

Pixide is a Git fork of Lucide. The upstream remote is tracked so new icons can be pulled in:

```bash
git remote add upstream https://github.com/lucide-icons/lucide.git
git fetch upstream
git merge upstream/main

# Then re-run the pipeline to convert new icons
cd converter && npm run pipeline
```

---

## License

ISC — same as Lucide. See [LICENSE](./LICENSE).
