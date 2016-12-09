// for development mode
// build polyfills
import commonConfig from './rollup.config.common';

const config = Object.assign({}, commonConfig, {
  entry: 'src/polyfills.ts',
  dest: 'www/assets/scripts/polyfills.js',
  format: 'iife',
  context: 'this'
});

export default config;
