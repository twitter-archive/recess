// ==========================================
// RECESS
// UTILS: basic utility methods
// ==========================================
// Copyright 2012 Twitter, Inc
// Licensed under the Apache License v2.0
// http://www.apache.org/licenses/LICENSE-2.0
// ==========================================

'use strict';

var path = require('path');
var chalk = require('chalk');
var _ = require('lodash');


// Camelcase a string
exports.camelize = function (name) {
  return name.replace(/(\-[a-z])/gi, function ($1) {
    return $1.toUpperCase().replace('-', '');
  }).replace(/\.js$/, '');
};

// Return the camelcased basename froma a filepath
exports.name = function (filepath) {
  var basename = path.basename(filepath, path.extname(filepath));
  return exports.camelize(basename);
};

// Set fail output object
exports.throwError = function (def, err) {
  def.errors = def.errors || [];
  err.message = chalk.cyan(err.message);
  def.errors.push(err);
};

// Set line padding
exports.padLine = function (line) {
  var num = line + '. ';
  var space = '';
  _.times(10 - num.length, function () {
    space += ' ';
  });
  return chalk.gray(space + num);
};

// Get line number from data
exports.getLine = function (index, data) {
  return (data.slice(0, index).match(/\n/g) || '').length + 1;
};

// Error counter
exports.countErrors = function (definitions) {
  var fails = 0;
  definitions.forEach(function (def) {
    if (def.errors && def.errors.length) {
      def.errors.forEach(function () {
        fails++;
      });
    }
  });
  return fails;
};