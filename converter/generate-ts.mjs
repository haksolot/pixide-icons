/**
 * generate-ts.mjs
 *
 * Generates TypeScript icon files for packages/pixide-react/src/icons/
 * from the pixel grid JSON files in icons/pixel/.
 *
 * Each icon gets:
 *   src/icons/<name>.ts        — individual icon component
 *
 * Also generates:
 *   src/icons/index.ts         — barrel export of all icons
 *
 * Usage:
 *   node generate-ts.mjs
 *   node generate-ts.mjs --limit 20   # dev: generate subset only
 */

import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { join, basename, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parseArgs } from 'util';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PIXEL_DIR = join(ROOT, 'icons', 'pixel');
const OUT_DIR = join(ROOT, 'packages', 'pixide-react', 'src', 'icons');

const { values } = parseArgs({
  options: { limit: { type: 'string', short: 'l' } },
  strict: false,
});

// ─── Helpers ───────────────────────────────────────────────────────────────

/** kebab-case → PascalCase */
function toPascalCase(str) {
  return str
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
}

// ─── Main ──────────────────────────────────────────────────────────────────

await mkdir(OUT_DIR, { recursive: true });

const jsonFiles = (await readdir(PIXEL_DIR))
  .filter((f) => f.endsWith('.json'))
  .sort();

const toProcess = values.limit ? jsonFiles.slice(0, parseInt(values.limit, 10)) : jsonFiles;

const exports = [];
let ok = 0;

for (const file of toProcess) {
  const iconName = basename(file, '.json');
  const componentName = toPascalCase(iconName);
  const { packed } = JSON.parse(await readFile(join(PIXEL_DIR, file), 'utf8'));

  const ts = `import createPixideIcon from '../createLucideIcon';

/**
 * @component @name ${componentName}
 * @description Pixide SVG icon component — pixel-style version of the Lucide icon.
 *
 * @param {Object} props - PixideProps: size, color, gridSize, className
 * @returns {JSX.Element} JSX Element
 */
const ${componentName} = createPixideIcon('${iconName}', '${packed}');

export { ${componentName} };
export default ${componentName};
`;

  await writeFile(join(OUT_DIR, `${iconName}.ts`), ts, 'utf8');
  exports.push({ componentName, iconName });
  ok++;

  if (ok % 100 === 0) process.stdout.write(`  ${ok}/${toProcess.length} icons generated...\n`);
}

// ─── Barrel index ──────────────────────────────────────────────────────────

const indexTs = exports
  .map(({ componentName, iconName }) => `export { ${componentName} } from './${iconName}';`)
  .join('\n') + '\n';

await writeFile(join(OUT_DIR, 'index.ts'), indexTs, 'utf8');

console.log(`\nGenerated ${ok} icon files + index.ts in packages/pixide-react/src/icons/`);
