// ==========================================
// RECESS
// INDEX: The root api definition
// ==========================================
// Copyright 2012 Twitter, Inc
// Licensed under the Apache License v2.0
// http://www.apache.org/licenses/LICENSE-2.0
// ==========================================

'use strict';

var chalk = require('chalk');
var RECESS = require('./core');
var info = require('./info');


module.exports = function(paths, options, callback) {
  var message;
  var instances = [];

  // if no options default to empty object
  options = options || {};

  // if options is a function, set to callback and set options to {}
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  // if single path, convert to array
  if (typeof paths === 'string') {
    paths = [paths];
  }

  // there were no paths, show the info
  if (!paths || !paths.length) {
    return info();
  }

  // if a compress flag is present, we automatically make compile flag true
  if (options.compress) {
    options.compile = true;
  }

  // if format is set to compact, automatically set noSummary
  if (options.format && options.format === 'compact') {
    options.noSummary = true;
  }

  // if not compiling, let user know which files will be linted
  if (!options.compile && options.cli && !options.noSummary) {
    message = '\nAnalyzing the following files: ' + ((paths + '').replace(/,/g, ', ') + '\n');

    if (chalk.supportsColor && !options.stripColors) {
      message = chalk.gray(message);
    }
    console.log(message);
  }

  // for each path, create a new RECESS instance
  function recess(init, path, err) {
    if (path = paths.shift()) {
      return instances.push(new RECESS(path, options, recess));
    }

    // map/filter for errors
    err = instances
      .map(function (i) {
        return i.errors.length && i.errors;
      })
      .filter(function (i) {
        return i;
      });

    // if no error, set explicitly to null
    err = err.length ? err[0] : null;

    // callback
    if (callback) {
      callback(err, instances);
    }
  }

  // start processing paths
  recess(true);
};

// default options
module.exports.DEFAULTS = RECESS.DEFAULTS = {
  compile: false,
  compress: false,
  config: false,
  format: 'text',
  includePath: [],
  noIDs: true,
  noJSPrefix: true,
  noOverqualifying: true,
  noSummary: false,
  noUnderscores: true,
  noUniversalSelectors: true,
  prefixWhitespace: true,
  strictPropertyOrder: true,
  stripColors: false,
  watch: false,
  zeroUnits: true,
  inlineImages: false,
  dataUri: true
};

// expose RECESS
module.exports.Constructor = RECESS;