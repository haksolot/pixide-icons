/**
 * extract.mjs
 *
 * Copies all SVG source icons from the Lucide icons/ directory
 * into icons/original/ for processing.
 *
 * Usage: node extract.mjs [--limit N]
 */

import { readdir, copyFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parseArgs } from 'util';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SRC = join(ROOT, 'icons');
const DEST = join(ROOT, 'icons', 'original');

const { values } = parseArgs({
  options: { limit: { type: 'string', short: 'l' } },
  strict: false,
});

const limit = values.limit ? parseInt(values.limit, 10) : Infinity;

await mkdir(DEST, { recursive: true });

const files = (await readdir(SRC)).filter((f) => f.endsWith('.svg'));
const toProcess = files.slice(0, limit);

let count = 0;
for (const file of toProcess) {
  await copyFile(join(SRC, file), join(DEST, file));
  count++;
}

console.log(`Extracted ${count} SVG icons to icons/original/`);
