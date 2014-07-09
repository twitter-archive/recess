// ===================================================
// RECESS
// RULE: Linked images should be embeded.
// ===================================================
// Copyright 2012 Twitter, Inc
// Licensed under the Apache License v2.0
// http://www.apache.org/licenses/LICENSE-2.0
// ===================================================

'use strict';

var utils = require('../utils');

var RULE = {
  type: 'inlineImages',
  exp: /^url\((?!data:)/,
  message: 'Linked images should be embeded.'
};

// validation method
module.exports = function inlineImages(def, data) {

  // default validation to true
  var isValid = true;

  // return if no selector to validate
  if (!def.rules) {
    return isValid;
  }

  // loop over selectors
  def.rules.forEach(function (rule) {
    var extract;
    var line;

    // continue to next rule if no url is present
    if (!(rule.value && rule.value.is === 'value' && RULE.exp.test(rule.value.toCSS({})))) {
      return;
    }

    // calculate line number for the extract
    line = utils.getLine(rule.index, data);
    extract = utils.padLine(line);

    // highlight invalid 0 units
    extract += rule.toCSS({}).replace(RULE.exp, function ($1) {
      return chalk.magenta($1);
    });

    // set invalid flag to false
    isValid = false;

    // set error object on defintion token
    utils.throwError(def, {
      type: RULE.type,
      message: RULE.message,
      extract: extract,
      line: line
    });

  });

  // return validation state
  return isValid;
};