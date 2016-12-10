'use strict';
require('shelljs/global');
const fs = require('fs');
const rollup = require('rollup');
const chalk = require('chalk');
const readlineSync = require('readline-sync');
const print = console.error.bind(console);

/************************************************************
                build vendor & polyfills
************************************************************/
const unexists = (name) => !test('-f', `www/assets/scripts/${name}.js`);
const bundle   = (name) => {
  print(chalk.yellow(`building ${name}.js...`));
  exec(`rollup -c ./scripts/rollup.config.${name}.js`);
  print(chalk.green(`building ${name}.js DONE.`));
};
const build = (name) => {
  if (
    unexists(name)
      || readlineSync.keyInYN(chalk.blue(`${name} exists, do you want to rebuild?`))
  ) {
    bundle(name);
  }
};

build('polyfills');
build('vendor');

// check if watch if needed
if (!readlineSync.keyInYN(chalk.blue(`Watching mode?[y/n]`))) {
  print(chalk.yellow(`Start bundling...`));
  exec(`rollup -c ./scripts/rollup.config.development.js`);
  print(chalk.green(`Bundling DONE.`));
  return;
}

/************************************************************
                     Watching
************************************************************/
require('babel-register');
print(chalk.green('Start bundling...\n'));

// @see https://github.com/rollup/rollup/blob/master/bin/src/runRollup.js#L156
var options = require('./rollup.config.development.js')['default'];

// @see https://github.com/AngusFu/rollup-watch-angular
var watch = require('rollup-watch-angular');
var watcher = watch(rollup, options);

// browser-sync
var bs = require('browser-sync').create();
bs.watch('www/**/*').on('change', bs.reload);
addWatcherEvent(bs);

/**
 * addWatcherEvent
 */
function addWatcherEvent(bs) {
  var LOG_PREFIX = chalk.yellow('[Bundle]') + ' ';
  var log = function (str) {
    print(LOG_PREFIX + str);
  };

  try {
    watcher.on('event', function (event) {
      switch (event.code) {
        case 'STARTING':
          log(chalk.green('Checking rollup-watch...'));
          break;

        case 'BUILD_START':
          log(chalk.green('bundling...'));
          bs.__initialised && bs.notify('Bundling, please wait...', 4000);
          break;

        case 'BUILD_END':
          log(''
            + chalk.green('Bundled in ')
            + chalk.red(event.duration + 'ms. ')
            + chalk.green('Watching for changes...')
          );

          if (!bs.__initialised) {
            log(chalk.green('Launching browser-sync...'));
            bsInit(bs);
          }
          break;

        case 'ERROR':
          throw event.error;

        default:
          log('unknown event', event);
      }
    });
  } catch (err) {
    console.log(err);
    bs.exit();
  }
};

/**
 * init browser-sync server
 */
function bsInit(server) {
  if (server.__initialised) return;

  server.init({
    open: 'external',
    logPrefix: 'BS Log',
    injectChanges: false,
    reloadDelay: 1000,
    reloadDebounce: 2000,
    server: {
      baseDir: './www',
      middleware: function (req, res, next) {
        var url = req.url;
        if (/^\/(assets|dist)\//.test(url)) {
          next();
        } else {
          res.writeHead(200, {
            'Content-Type': 'text/html'
          });
          fs.createReadStream('./www/index.html').pipe(res);
        }
      }
    }
  });

  server.__initialised = true;
};
