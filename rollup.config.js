import nodeResolve from 'rollup-plugin-node-resolve';
import commonJs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import { eslint } from 'rollup-plugin-eslint';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import stylelint from 'rollup-plugin-stylelint';

const IS_PROD = process.env.BUILD === 'production';

const configOptions = [
  {
    input: 'src/script.ts',
    output: [{
      file: 'dist/script.js',
      format: 'iife',
      name: 'MySelect',
    }],
    plugins: [
      eslint({
        fix: true,
      }),
      typescript(),
      nodeResolve(),
      commonJs(),
      IS_PROD && terser({
        output: {
          comments: false,
        },
      }),
      stylelint({}),
      postcss({
        extract: 'style.css',
        modules: false,
        use: ['sass'],
        plugins: [
          autoprefixer(),
        ],
        minimize: IS_PROD,
      }),
    ],
  },
];

export default configOptions;
