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
  format: 'iife',
  sourceMap: true,
  plugins: [
    progress({ clearLine: true }),
    sourcemaps(),
    // see https://github.com/ReactiveX/rxjs/issues/1954
    // also see https://github.com/ReactiveX/rxjs/pull/2019
    // {
    //   resolveId: id => {
    //     if (id.startsWith('rxjs/') || id.startsWith('rxjs\\')) {
    //       let result = `${__dirname}/node_modules/rxjs-es/${id.replace('rxjs/', '')}.js`;
    //       return result.replace(/\/\\/g, sep);
    //     }
    //   }
    // },
    nodeResolve({
      jsnext: true,
      main: true,
      extensions: [ '.ts', '.js', '.json' ]
    }),
    angular({
      preprocessors: {
        template: template => minifyHtml(template, htmlminOpts),
        style: (text, path) => {
          const css = sass.renderSync({ file: path }).css.toString('utf-8');
          return cssmin.minify(css).styles;
        },
      }
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
