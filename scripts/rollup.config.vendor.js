// for development mode
// build vendors: @angular/*
import commonConfig from './rollup.config.common';

const config = Object.assign({}, commonConfig, {
  entry: 'src/vendor.ts',
  dest: 'www/assets/scripts/vendor.js',
  moduleName: 'vendor',
  format: 'iife',
  context: 'this'
});

export default config;
