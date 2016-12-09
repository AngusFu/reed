'use strict';
require('shelljs/global');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const print  = console.error.bind(console);
const readlineSync = require('readline-sync');

let start = +new Date();
echo('');
print(chalk.yellow('Start AOT processing...'));

/************************************************************
                     preprocessing
************************************************************/
print(chalk.yellow('  Start preprocessing works...'));

rm('-rf', './aot');
rm('-rf', './temp');
cp('-R', './src/', './temp');
cd('./temp');

// compile scss files
ls('app/**/*.scss').forEach(function(file) {
  let dir = path.dirname(file);
  exec(`"../node_modules/.bin/node-sass" ${file} -o ${dir} --output-style compressed`, { silent: true });
});

// replace suffix `.component.scss` to `.component.css`
ls('app/**/*.component.ts').forEach(function(file) {
  let dir = path.dirname(file);
  sed('-i', /\.component\.scss/, '.component.css', file);
});

print(chalk.green('    Preprocessing DONE...'));

/************************************************************
                     ngc compiling
************************************************************/
let ngc_start = +new Date();
print(chalk.yellow('  Start ngc compiling...'));
cd('..');
exec('"./node_modules/.bin/ngc" -p ./tsconfig.aot.json');
print('    '
  + chalk.green('Ngc compiling done in ')
  + chalk.red((+new Date() - ngc_start) + 'ms. ')
);

/************************************************************
                     aot bundling
************************************************************/
let aot_start = +new Date();
print(chalk.yellow('  Start rollup bundling...'));
exec('"./node_modules/.bin/rollup" -c ./scripts/rollup.config.aot.js');

print('    '
  + chalk.green('Rollup bundling done in ')
  + chalk.red((+new Date() - aot_start) + 'ms. ')
);

// clean temps
rm('-rf', './aot');
rm('-rf', './temp');
print(''
  + chalk.green('AOT bundling done in ')
  + chalk.red((+new Date() - start) + 'ms. ')
);

echo('');

let preview = readlineSync.keyInYN('Do you want to check in browser?');
if (!preview) {
  print(chalk.green('DONE!'));
  process.exit(0);
}

/************************************************************
                     browser-sync
************************************************************/
print(chalk.green('Launching server, please check the result....'));

const bs = require('browser-sync').create();
bs.watch('www/**/*').on('change', bs.reload);

bs.init({
  open: 'external',
  logPrefix: 'BS Log',
  server: {
    baseDir: './www',
    middleware: function (req, res, next) {
      let url = req.url;
      if (/^\/assets\//.test(url)) {
        next();
      } else {
        res.writeHead(200, {
          'Content-Type': 'text/html'
        });
        fs.createReadStream('./www/index.aot.html').pipe(res);
      }
    }
  }
});
