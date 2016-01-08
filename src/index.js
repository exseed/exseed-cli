#! /usr/bin/env node

// ====================
// Packages and modules
// ====================

// native packages
import path from 'path';
import fs from 'fs';

// vendor packages
import program from 'commander';
import gulp from 'gulp';

// local modules
import pkg from '../package.json';

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

// to customize command name in help information
// ref: https://github.com/tj/commander.js/issues/466
process.argv[1] = 'sd';
program.parse(process.argv);

if (!program.args.length) {
  program.help();
}