'use client';

import { GRID_SIZE } from './defaultAttributes';

/**
 * Decode a base64-encoded bitpacked pixel grid into a flat boolean array.
 * Length = GRID_SIZE × GRID_SIZE (576).
 */
export function unpackGrid(b64: string): boolean[] {
  const binary = atob(b64);
  const bits: boolean[] = [];
  for (let i = 0; i < binary.length; i++) {
    const byte = binary.charCodeAt(i);
    for (let bit = 7; bit >= 0; bit--) {
      bits.push(((byte >> bit) & 1) === 1);
    }
  }
  return bits.slice(0, GRID_SIZE * GRID_SIZE);
}

/**
 * Convert a flat boolean grid to an array of { x, y } pixel positions.
 */
export function gridToRects(grid: boolean[]): { x: number; y: number }[] {
  const rects: { x: number; y: number }[] = [];
  for (let i = 0; i < grid.length; i++) {
    if (grid[i]) {
      rects.push({ x: i % GRID_SIZE, y: Math.floor(i / GRID_SIZE) });
    }
  }
  return rects;
}
