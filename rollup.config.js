import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import resolve from 'rollup-plugin-node-resolve';
import rimraf from 'rimraf';
import babel from 'rollup-plugin-babel';
import progress from 'rollup-plugin-progress';

rimraf.sync('./sw.js');
const extensions = ['.js', '.jsx', '.ts', '.tsx'];
export default {
  input: './sw.ts',
  output: {
    file: 'sw.js',
    format: 'esm'
  },
  plugins: [
    progress(),
    resolve({ extensions }),
    typescript(),
    babel({
      extensions,
      runtimeHelpers: true,
      include: ['src/**/*'],
      exclude: ['node_modules/**']
    }),
    terser({
      output: {
        comments: () => false
      }
    })
  ]
};
