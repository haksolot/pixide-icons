import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import preserveDirectives from 'rollup-plugin-preserve-directives';
import dts from 'rollup-plugin-dts';

const input = 'src/pixide-react.ts';
const external = ['react', 'react/jsx-runtime'];

const typescriptPlugin = () =>
  typescript({
    tsconfig: './tsconfig.json',
    declaration: false,
    declarationMap: false,
  });

export default [
  // ESM — tree-shakeable, preserve modules
  {
    input,
    external,
    plugins: [
      resolve(),
      typescriptPlugin(),
      preserveDirectives({
        include: ['src/pixide-react.ts', 'src/context.ts', 'src/Icon.ts'],
        suppressPreserveModulesWarning: true,
      }),
    ],
    output: {
      dir: 'dist/esm',
      format: 'esm',
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
  },

  // CJS — single file
  {
    input,
    external,
    plugins: [resolve(), typescriptPlugin()],
    output: {
      file: 'dist/cjs/pixide-react.js',
      format: 'cjs',
      sourcemap: true,
    },
  },

  // Type declarations
  {
    input,
    plugins: [dts()],
    output: {
      file: 'dist/pixide-react.d.ts',
      format: 'es',
    },
  },
];
