// development mode only
// just bundle polyfills and @angular/*
// in seperate for performance concern
// this can make rollup response to changes
// faster ever
// import './polyfills.ts';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/';

platformBrowserDynamic().bootstrapModule(AppModule);
