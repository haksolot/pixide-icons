/**
 * convert.mjs
 *
 * Batch conversion: icons/original/*.svg → icons/pixel/*.json + *.svg preview
 *
 * Each icon produces:
 *   icons/pixel/<name>.json   { name, packed, grid[] } — source of truth
 *   icons/pixel/<name>.svg    debug preview (rect-based SVG)
 *
 * Usage:
 *   node convert.mjs               # convert all icons in icons/original/
 *   node convert.mjs --limit 20    # first 20 only
 *   node convert.mjs --icon camera # single icon
 */

import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { join, basename, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parseArgs } from 'util';
import { pixelateSvg, GRID_SIZE } from './pixelate.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const INPUT = join(ROOT, 'icons', 'original');
const OUTPUT = join(ROOT, 'icons', 'pixel');

const { values } = parseArgs({
  options: {
    limit: { type: 'string', short: 'l' },
    icon: { type: 'string' },
  },
  strict: false,
});

await mkdir(OUTPUT, { recursive: true });

// ─── File list ─────────────────────────────────────────────────────────────

let files;
if (values.icon) {
  const name = values.icon.endsWith('.svg') ? values.icon : `${values.icon}.svg`;
  files = [name];
} else {
  const all = await readdir(INPUT);
  files = all.filter((f) => f.endsWith('.svg'));
  if (values.limit) files = files.slice(0, parseInt(values.limit, 10));
}

// ─── Conversion ─────────────────────────────────────────────────────────────

/**
 * Render a grid as a debug SVG (each pixel = 1×1 rect).
 */
function gridToSvg(grid) {
  const rects = [];
  for (let i = 0; i < grid.length; i++) {
    if (grid[i]) {
      const col = i % GRID_SIZE;
      const row = Math.floor(i / GRID_SIZE);
      rects.push(`<rect x="${col}" y="${row}" width="1" height="1"/>`);
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${GRID_SIZE}" height="${GRID_SIZE}" viewBox="0 0 ${GRID_SIZE} ${GRID_SIZE}" fill="currentColor">\n${rects.join('\n')}\n</svg>`;
}

let ok = 0;
let errors = 0;
const total = files.length;
const startTime = Date.now();

for (let i = 0; i < files.length; i++) {
  const file = files[i];
  const name = basename(file, '.svg');
  const inputPath = join(INPUT, file);

  try {
    const svgSource = await readFile(inputPath, 'utf8');
    const { grid, packed } = await pixelateSvg(svgSource);

    const filledCount = grid.filter(Boolean).length;

    // JSON — source of truth for build step
    const jsonPath = join(OUTPUT, `${name}.json`);
    await writeFile(jsonPath, JSON.stringify({ name, packed, size: GRID_SIZE }, null, 2), 'utf8');

    // SVG — debug preview
    const svgPath = join(OUTPUT, `${name}.svg`);
    await writeFile(svgPath, gridToSvg(grid), 'utf8');

    ok++;
    const pct = Math.round(((i + 1) / total) * 100);
    process.stdout.write(`\r[${pct}%] ${ok}/${total} ✓ ${name} (${filledCount}px)`);
  } catch (err) {
    errors++;
    process.stderr.write(`\n✗ ${name}: ${err.message}\n`);
  }
}

const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
console.log(`\n\nDone: ${ok} converted, ${errors} errors — ${elapsed}s`);
