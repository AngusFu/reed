// development mode
import commonConfig from './rollup.config.common';

const config = Object.assign({}, commonConfig, {
  entry: 'src/main.ts',
  dest: 'www/assets/scripts/bundle.js',
  format: 'iife',
  context: 'this',
  external: [
    '@angular/core',
    '@angular/common',
    '@angular/platform-browser-dynamic',
    '@angular/platform-browser',
    '@angular/forms',
    '@angular/http',
    '@angular/router'
  ],
  globals: {
    '@angular/core': 'vendor.core',
    '@angular/common': 'vendor.common',
    '@angular/platform-browser': 'vendor.platformBrowser',
    '@angular/platform-browser-dynamic': 'vendor.platformBrowserDynamic',
    '@angular/router': 'vendor.router',
    '@angular/http': 'vendor.http',
    '@angular/forms': 'vendor.forms'
  }
});

export default config;
