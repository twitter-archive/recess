// ==========================================
// RECESS
// RULE: Must use correct property ordering
// ==========================================
// Copyright 2012 Twitter, Inc
// Licensed under the Apache License v2.0
// http://www.apache.org/licenses/LICENSE-2.0
// ==========================================

'use strict';

var _ = require('lodash');

var chalk = require('chalk');
var utils = require('../utils');


var RULE = {
  type: 'strictPropertyOrder',
  message: 'Incorrect property order for rule'
};


// Defaults
var vendorPrefixes = require('../defaults/vendor');
var hackPrefixes = require('../defaults/hacks');
var order = require('../defaults/order');


function makeRegex(defaults) {
  var re = /[-[\]{}()*+?.,\\^$#\s]/g;
  var arr = defaults.join('|').replace(re, "\\$&");
  return new RegExp('^(' + arr + ')');
}

// regex tests
var HACK_PREFIX = makeRegex(hackPrefixes);
var VENDOR_PREFIX = makeRegex(vendorPrefixes);


// validation method
module.exports = function strictPropertyOrder(def, data) {

  // default validation to `true`
  var isValid = true;
  var index = 0;
  var cleanRules;
  var sortedRules;
  var firstLine;
  var extract;
  var selector;

  // return if no rules to validate
  if (!def.rules) {
    return isValid;
  }

  // recurse over nested rulesets
  def.rules.forEach(function (rule) {
    if (rule.selectors) {
      module.exports(rule, data);
    }
  });

  cleanRules = def.rules.map(function (rule) {
    return rule.name && rule;
  }).filter(function (item) {
    return item;
  });

  // sort rules
  sortedRules = _.sortBy(cleanRules, function (rule) {

    // pad value of each rule position to account for vendor prefixes
    var padding = (vendorPrefixes.length + 1) * 10;
    var root;
    var val;

    rule.name = _.map(rule.name, function (name) {
      return name.value;
    })[0];

    // strip vendor prefix and hack prefix from rule name to find root
    root = rule.name.replace(VENDOR_PREFIX, '').replace(HACK_PREFIX, '');

    // find value of order of the root css property
    val = order.indexOf(root);

    // if property is not found, exit with property not found error
    if (!~val) {
      return utils.throwError(def, {
        type: 'propertyNotFound',
        message: 'Unknown property name: "' + rule.name + '"'
      });
    }

    // pad value
    val = val * padding + 10;

    // adjust value based on prefix
    val += VENDOR_PREFIX.exec(rule.name) ? vendorPrefixes.indexOf(RegExp.$1) : vendorPrefixes.length + 1;

    // adjust value based on css hack
    val += HACK_PREFIX.exec(rule.name) ? hackPrefixes.indexOf(RegExp.$1) : 0;

    // return sort value
    return val;
  });

  // check to see if sortedRules has same order as provided rules
  isValid = _.isEqual(sortedRules, cleanRules);

  // return if sort is correct
  if (isValid) {
    return isValid;
  }

  // get the line number of the first rule
  firstLine = utils.getLine(def.rules[0].index, data);

  // generate a extract what the correct sorted rules would look like
  extract = sortedRules.map(function (rule) {
    if (!rule.name) {
      return;
    }

    var value = rule.value;
    if (typeof rule.value !== 'string') {
      value = rule.value.toCSS({});
    }

    return utils.padLine(firstLine + (index += 1)) + ' ' + rule.name + ': ' + value + ';';

  }).filter(function (item) {
    return item;
  }).join('\n');


  // extract selector for error message
  selector = (' "' + def.selectors.map(function (selector) {
    return selector.toCSS && selector.toCSS({}).replace(/^\s/, '');
  }).join(', ') + '"').magenta;


  // set error object on defintion token
  utils.throwError(def, {
    type: RULE.type,
    message: RULE.message + selector + chalk.gray('\n\n  Correct order below:\n'),
    extract: extract,
    sortedRules: sortedRules,
    line: firstLine
  });

  // return valid state
  return isValid;
};