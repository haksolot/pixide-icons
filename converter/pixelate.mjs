/**
 * pixelate.mjs
 *
 * Convert a Lucide SVG into a 24×24 binary pixel grid.
 *
 * Pipeline:
 *   1. Render SVG at 2× resolution (48×48) via @resvg/resvg-js
 *   2. Read pixel alpha channel via pngjs
 *   3. Downsample 48×48 → 24×24 with OR threshold (any lit sub-pixel → on)
 *   4. Bitpack the 24×24 grid (576 bits → 72 bytes → base64, 96 chars)
 *
 * The 2× render preserves thin 1px strokes that would vanish at native 24×24.
 */

import { Resvg } from '@resvg/resvg-js';
import { PNG } from 'pngjs';

// ─── Config ────────────────────────────────────────────────────────────────

export const GRID_SIZE = 24;          // output grid dimension
const RENDER_SCALE = 2;              // render at 2× for better thin-stroke fidelity
const RENDER_SIZE = GRID_SIZE * RENDER_SCALE; // 48

// Alpha threshold: a sub-pixel must be at least this opaque to count as "filled"
const ALPHA_THRESHOLD = 30;

// ─── Core ──────────────────────────────────────────────────────────────────

/**
 * Render SVG to raw RGBA pixel buffer at RENDER_SIZE×RENDER_SIZE.
 * @param {string} svgString
 * @returns {Promise<Buffer>} raw RGBA buffer (RENDER_SIZE × RENDER_SIZE × 4 bytes)
 */
async function renderSvgToRgba(svgString) {
  const resvg = new Resvg(svgString, {
    fitTo: { mode: 'width', value: RENDER_SIZE },
    font: { loadSystemFonts: false },
  });

  const rendered = resvg.render();
  const pngBuffer = rendered.asPng();

  return new Promise((resolve, reject) => {
    const png = new PNG();
    png.parse(pngBuffer, (err, data) => {
      if (err) return reject(err);
      resolve(data.data); // raw RGBA Buffer
    });
  });
}

/**
 * Downsample a RENDER_SIZE×RENDER_SIZE RGBA buffer to a GRID_SIZE×GRID_SIZE
 * boolean grid using OR logic: any lit sub-pixel in a RENDER_SCALE×RENDER_SCALE
 * block marks the output pixel as filled.
 *
 * @param {Buffer} rgba
 * @returns {boolean[]} flat array [row*GRID_SIZE + col], length = GRID_SIZE²
 */
function downsampleToGrid(rgba) {
  const grid = new Array(GRID_SIZE * GRID_SIZE).fill(false);

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      let lit = false;

      // Sample all RENDER_SCALE×RENDER_SCALE sub-pixels
      for (let dy = 0; dy < RENDER_SCALE && !lit; dy++) {
        for (let dx = 0; dx < RENDER_SCALE && !lit; dx++) {
          const px = col * RENDER_SCALE + dx;
          const py = row * RENDER_SCALE + dy;
          const idx = (py * RENDER_SIZE + px) * 4;
          const alpha = rgba[idx + 3];
          if (alpha >= ALPHA_THRESHOLD) lit = true;
        }
      }

      grid[row * GRID_SIZE + col] = lit;
    }
  }

  return grid;
}

/**
 * Bitpack a boolean[] (576 values) into a Uint8Array of 72 bytes,
 * then encode as base64 (96 chars).
 *
 * Bit order: MSB first within each byte.
 *
 * @param {boolean[]} grid
 * @returns {string} base64 string
 */
export function packGrid(grid) {
  const byteCount = Math.ceil(grid.length / 8);
  const bytes = new Uint8Array(byteCount);

  for (let i = 0; i < grid.length; i++) {
    if (grid[i]) {
      bytes[Math.floor(i / 8)] |= (1 << (7 - (i % 8)));
    }
  }

  return Buffer.from(bytes).toString('base64');
}

/**
 * Unpack a base64-encoded bitpacked grid back to a boolean[].
 * (Used in tests / preview; not shipped in the React bundle.)
 *
 * @param {string} b64
 * @returns {boolean[]}
 */
export function unpackGrid(b64) {
  const bytes = Buffer.from(b64, 'base64');
  const bits = [];
  for (const byte of bytes) {
    for (let bit = 7; bit >= 0; bit--) {
      bits.push((byte >> bit & 1) === 1);
    }
  }
  // Trim to GRID_SIZE² in case of padding
  return bits.slice(0, GRID_SIZE * GRID_SIZE);
}

/**
 * Convert a Lucide SVG string to a base64-encoded 24×24 pixel grid.
 *
 * @param {string} svgString
 * @returns {Promise<{ grid: boolean[], packed: string }>}
 */
export async function pixelateSvg(svgString) {
  const rgba = await renderSvgToRgba(svgString);
  const grid = downsampleToGrid(rgba);
  const packed = packGrid(grid);
  return { grid, packed };
}
