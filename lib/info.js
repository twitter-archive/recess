// ==========================================
// RECESS
// DOCS: Command line output
// ==========================================
// Copyright 2012 Twitter, Inc
// Licensed under the Apache License v2.0
// http://www.apache.org/licenses/LICENSE-2.0
// ==========================================

'use strict';

var chalk = require('chalk');

// require core
var RECESS = require('./core');


// expose docs
exports.docs = function () {
  console.log(' ');
  console.log(chalk.gray('GENERAL USE: ' + '$') + chalk.cyan(' recess') + chalk.yellow(' [path] ') + chalk.gray('[options]'));
  console.log(' ');
  console.log('OPTIONS (with defaults):');

  for (var option in RECESS.DEFAULTS) {
    if (RECESS.DEFAULTS.hasOwnProperty(option)) {
      console.log('  --' + option + ' ' + RECESS.DEFAULTS[option]);
    }
  }

  console.log(' ');
  console.log('EXAMPLE:');
  console.log(' ');
  console.log(' ');
  console.log(chalk.gray('  $') + chalk.cyan(' recess') + chalk.yellow(' ./bootstrap.css ') + chalk.gray('--noIDs false'));
  console.log(' ');
  console.log(chalk.yellow('GENERAL HELP: ' + 'http://git.io/recess'));
  console.log(' ');
};