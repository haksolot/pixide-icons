# pixide-react

Pixel-style icon library for React — 1694 icons, fill-based, tree-shakeable.

[![npm](https://img.shields.io/npm/v/pixide-react?color=blue)](https://www.npmjs.com/package/pixide-react)
![NPM Downloads](https://img.shields.io/npm/dw/pixide-react)
[![GitHub](https://img.shields.io/github/license/haksolot/pixide-icons)](https://github.com/haksolot/pixide-icons/blob/main/LICENSE)

A fork of [Lucide](https://lucide.dev) with every icon converted to a crisp **24×24 pixel grid**. Rendered as SVG `<rect>` elements — no paths, no strokes, no blur.

## Installation

```sh
npm install pixide-react
```

```sh
pnpm add pixide-react
```

```sh
yarn add pixide-react
```

## Usage

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

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `number \| string` | `24` | Width and height in px |
| `color` | `string` | `currentColor` | Fill color |
| `className` | `string` | `''` | CSS class on the `<svg>` |

> Pixide uses `fill` instead of `stroke` — there is no `strokeWidth` prop.

## Global defaults

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

## License

ISC — same as Lucide. See [LICENSE](https://github.com/haksolot/pixide-icons/blob/main/LICENSE).
