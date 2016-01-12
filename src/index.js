#! /usr/bin/env node

// ====================
// Packages and modules
// ====================

// native packages
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';

// vendor packages
import program from 'commander';
import gulp from 'gulp';
import gutil from 'gulp-util';

// local modules
import pkg from '../package.json';
import { formatOptions, readFormatOptions } from './utils/';
import { registerTasks } from './tasks/';

// ======================
// Definition of commands
// ======================

// specify cli version number
program
  .version(pkg.version);

// specify command `initialize`
program
  .command('hello')
  .description('show hello message')
  .action(() => {
    console.log('hello, this is a hello message from exseed command line tool');
  });

// specify command `build`
program
  .command('build')
  .alias('b')
  .description('build source files')
  .option(
    '-e, --env <env>',
    'build environment (development|test|production)',
    'development')
  .option(
    '-w, --watch',
    'monitor `source` files changing, for react components, use livereload')
  .option(
    '-s, --source <source>',
    'source code directory',
    './src')
  .option(
    '-t, --target <target>',
    'build target directory',
    './build')
  .action((options) => {
    const opts = formatOptions(options);
    registerTasks(opts);
    // run gulp tasks
    gulp.start('clean', 'output:options', 'build', 'webpack', 'copy', 'watch');
  });

// specify command `initialize`
program
  .command('init')
  .description('initialize installed apps, required to run `build` first')
  .option(
    '-a, --app [name]',
    'initialize specified app')
  .action((options) => {
    readFormatOptions((err, opts) => {
      if (err) {
        return gutil.log('Please build project before init');
      }
      const entryPath = path.join(opts.dir.target, 'server.js');
      const child = exec(`node ${entryPath}`, {
        env: {
          EXSEED_OPTIONS: JSON.stringify({
            init: true,
            name: options.app,
          }),
        },
      });
      child.stdout.on('data', (data) => {
        gutil.log(data);
      });
      child.stderr.on('data', (data) => {
        gutil.log(data);
      });
    });
  });

// to customize command name in help information
// ref: https://github.com/tj/commander.js/issues/466
process.argv[1] = 'sd';
program.parse(process.argv);

if (!program.args.length) {
  program.help();
}