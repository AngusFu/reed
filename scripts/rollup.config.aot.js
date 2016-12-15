// for AOT Prod mode
import { sep } from 'path';

import angular from 'rollup-plugin-angular';
import typescript from 'rollup-plugin-typescript';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import buble from 'rollup-plugin-buble';
import progress from 'rollup-plugin-progress';

import sourcemaps from 'rollup-plugin-sourcemaps';
import uglify from 'rollup-plugin-uglify';
import { minify } from 'uglify-js';

// import sass from 'dart-sass';
import sass from 'node-sass';

import CleanCSS from 'clean-css';
import { minify as minifyHtml } from 'html-minifier';

const cssmin = new CleanCSS();
const htmlminOpts = {
  caseSensitive: true,
  collapseWhitespace: true,
  removeComments: true,
};

const config =  {
  entry: 'temp/main.aot.ts',
  format: 'iife',
  dest: 'www/assets/scripts/bundle.aot.js',
  sourceMap: true,
  plugins: [
    progress({ clearLine: true }),
    sourcemaps(),
    nodeResolve({
      jsnext: true,
      main: true,
      extensions: [ '.ts', '.js', '.json' ]
    }),
    typescript({
      typescript: require('typescript')
    }),
    commonjs(),
    json(),
    buble(),
    uglify({}, minify)
  ],
  context: 'window'
};

export default config;
