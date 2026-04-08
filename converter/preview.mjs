/**
 * preview.mjs
 *
 * Generates a static HTML file comparing original Lucide SVGs vs
 * the Pixide pixel-grid output — with live gridSize switching.
 *
 * Usage: node preview.mjs [--output preview.html] [--limit N]
 */

import { readdir, readFile, writeFile } from 'fs/promises';
import { join, basename, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parseArgs } from 'util';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const ORIGINAL = join(ROOT, 'icons', 'original');
const PIXEL_DIR = join(ROOT, 'icons', 'pixel');

const { values } = parseArgs({
  options: {
    output: { type: 'string', short: 'o', default: 'preview.html' },
    limit: { type: 'string', short: 'l' },
  },
  strict: false,
});

const limit = values.limit ? parseInt(values.limit) : Infinity;

const jsonFiles = (await readdir(PIXEL_DIR))
  .filter((f) => f.endsWith('.json'))
  .slice(0, limit);

const icons = await Promise.all(
  jsonFiles.map(async (file) => {
    const name = basename(file, '.json');
    const [originalSvg, { packed }] = await Promise.all([
      readFile(join(ORIGINAL, `${name}.svg`), 'utf8').catch(() => '<svg/>'),
      readFile(join(PIXEL_DIR, file), 'utf8').then(JSON.parse),
    ]);
    return { name, originalSvg, packed };
  }),
);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Pixide — Preview</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, sans-serif;
      background: #0f0f0f;
      color: #fff;
      padding: 24px;
    }
    header {
      display: flex;
      align-items: center;
      gap: 24px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }
    h1 { font-size: 20px; }
    .subtitle { color: #666; font-size: 13px; }

    .controls {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-left: auto;
    }
    .controls label { font-size: 13px; color: #aaa; }
    .controls input[type=range] { width: 120px; accent-color: #4ade80; }
    #gridSizeLabel {
      font-size: 13px;
      color: #4ade80;
      font-family: monospace;
      min-width: 70px;
    }

    .filter-input {
      padding: 6px 12px;
      background: #1a1a1a;
      border: 1px solid #333;
      border-radius: 6px;
      color: #fff;
      font-size: 13px;
      width: 200px;
    }
    .filter-input:focus { outline: none; border-color: #4ade80; }

    .col-headers {
      display: grid;
      grid-template-columns: 160px 1fr 1fr;
      padding: 6px 12px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #555;
      border-bottom: 1px solid #1e1e1e;
      margin-bottom: 4px;
    }

    #icon-list { display: flex; flex-direction: column; gap: 2px; }

    .icon-row {
      display: grid;
      grid-template-columns: 160px 1fr 1fr;
      align-items: center;
      padding: 6px 12px;
      border-radius: 6px;
    }
    .icon-row:hover { background: #181818; }
    .icon-row.hidden { display: none; }

    .label {
      font-size: 11px;
      color: #666;
      font-family: monospace;
    }

    .icon-cell {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    /* Sizes shown: 16, 24, 32 */
    .icon-cell canvas, .icon-cell svg {
      image-rendering: pixelated;
      display: block;
    }
    .original-wrap svg { width: 24px; height: 24px; color: #fff; }

    .pixel-wrap canvas {
      border-radius: 2px;
    }

    .sz { opacity: 0.6; font-size: 10px; color: #555; }
  </style>
</head>
<body>
  <header>
    <div>
      <h1>Pixide Preview</h1>
      <p class="subtitle">${icons.length} icons &mdash; Lucide original (white) vs Pixide pixel grid</p>
    </div>
    <div class="controls">
      <input class="filter-input" type="text" placeholder="Search icons…" id="searchInput" />
      <label for="gridSizeRange">gridSize</label>
      <input type="range" id="gridSizeRange" min="1" max="4" value="1" step="1" />
      <span id="gridSizeLabel">1 (24×24)</span>
    </div>
  </header>

  <div class="col-headers">
    <span>Icon</span>
    <span>Original (Lucide)</span>
    <span>Pixide pixel grid</span>
  </div>

  <div id="icon-list">
    ${icons.map(({ name, originalSvg, packed }) => `
    <div class="icon-row" data-name="${name}">
      <div class="label">${name}</div>
      <div class="icon-cell original-wrap">${originalSvg}</div>
      <div class="icon-cell pixel-wrap">
        <canvas class="pixel-canvas" width="24" height="24" style="width:24px;height:24px" data-packed="${packed}"></canvas>
        <canvas class="pixel-canvas" width="24" height="24" style="width:48px;height:48px" data-packed="${packed}"></canvas>
        <canvas class="pixel-canvas" width="24" height="24" style="width:96px;height:96px" data-packed="${packed}"></canvas>
      </div>
    </div>`).join('')}
  </div>

  <script>
    const GRID = 24;

    function unpackGrid(b64) {
      const binary = atob(b64);
      const bits = [];
      for (let i = 0; i < binary.length; i++) {
        const byte = binary.charCodeAt(i);
        for (let bit = 7; bit >= 0; bit--) bits.push((byte >> bit & 1) === 1);
      }
      return bits.slice(0, GRID * GRID);
    }

    function downsample(grid, blockSize) {
      if (blockSize <= 1) return grid;
      const out = [];
      const outSize = Math.ceil(GRID / blockSize);
      for (let row = 0; row < outSize; row++) {
        for (let col = 0; col < outSize; col++) {
          let lit = false;
          for (let dy = 0; dy < blockSize && !lit; dy++) {
            for (let dx = 0; dx < blockSize && !lit; dx++) {
              const sr = row * blockSize + dy;
              const sc = col * blockSize + dx;
              if (sr < GRID && sc < GRID) lit = grid[sr * GRID + sc];
            }
          }
          out.push(lit);
        }
      }
      return out;
    }

    function renderToCanvas(canvas, packed, blockSize) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, GRID, GRID);
      const grid = unpackGrid(packed);
      const downsampled = downsample(grid, blockSize);
      const outSize = Math.ceil(GRID / blockSize);
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < downsampled.length; i++) {
        if (downsampled[i]) {
          const col = i % outSize;
          const row = Math.floor(i / outSize);
          ctx.fillRect(col * blockSize, row * blockSize, blockSize, blockSize);
        }
      }
    }

    const allCanvases = document.querySelectorAll('.pixel-canvas');
    let currentGridSize = 1;

    function renderAll(gridSize) {
      currentGridSize = gridSize;
      const outSize = Math.ceil(GRID / gridSize);
      document.getElementById('gridSizeLabel').textContent =
        \`\${gridSize} (\${outSize}×\${outSize})\`;

      allCanvases.forEach(canvas => {
        renderToCanvas(canvas, canvas.dataset.packed, gridSize);
      });
    }

    // Initial render
    renderAll(1);

    document.getElementById('gridSizeRange').addEventListener('input', (e) => {
      renderAll(parseInt(e.target.value));
    });

    // Search
    document.getElementById('searchInput').addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      document.querySelectorAll('.icon-row').forEach(row => {
        row.classList.toggle('hidden', !row.dataset.name.includes(query));
      });
    });
  </script>
</body>
</html>`;

const outputPath = join(__dirname, values.output ?? 'preview.html');
await writeFile(outputPath, html, 'utf8');
console.log(`Preview written to ${outputPath} (${icons.length} icons)`);
