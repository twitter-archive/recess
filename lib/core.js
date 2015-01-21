// ==========================================
// RECESS
// CORE: The core class definition
// ==========================================
// Copyright 2012 Twitter, Inc
// Licensed under the Apache License v2.0
// http://www.apache.org/licenses/LICENSE-2.0
// ==========================================

'use strict';

var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var resolve = require('resolve-dep');
var less = require('less');
var _ = require('lodash');

var minify = require('./min');
var utils = require('./utils');


/**
 * Core class defintion
 *
 * @param  {String}   `filepath`
 * @param  {Object}   `options`
 * @param  {Function} `callback`
 * @return {String}
 * @api public
 */

var RECESS = module.exports = function RECESS(filepath, options, callback) {
  this.path = filepath;
  this.output = [];
  this.errors = [];
  this.options = _.extend({}, RECESS.DEFAULTS, options);
  if (filepath) {
    this.read();
  }
  this.callback = callback;
};


/**
 * Instance methods
 */

RECESS.prototype.constructor = RECESS;

RECESS.prototype.log = function (str, force) {
  if (this.options.stripColors || !chalk.supportsColor) {
    str = chalk.stripColor(str);
  }

  // if compiling only, write with --force flag
  if (!this.options.compile || force) {
    if (this.options.cli === true) {
      console.log(str);
    } else {
      this.output.push(str);
    }
  }
};


RECESS.prototype.read = function () {
  var self = this;

  // try to read data from path
  fs.readFile(this.path, 'utf8', function (err, data) {

    //  if err, exit with could not read message
    if (err) {
      self.errors.push(err);
      self.log(chalk.red('Error reading file: ') + chalk.gray(String(self.path)) + '\n', true);
      return self.callback && self.callback();
    }

    // set instance data
    self.data = data;

    // parse data
    self.parse();
  });
};


RECESS.prototype.parse = function () {
  var self = this;
  var options = {
    paths: [path.dirname(this.path)].concat(this.options.includePath),
    optimization: 0,
    filename: this.path && this.path.replace(/.*(?=\/)\//, '')
  };

  // try to parse with less parser
  try {

    // instantiate new parser with options
    new less.Parser(options).parse(this.data, function (err, tree) {

      if (err) {

        // push to errors array
        self.errors.push(err);

        if (err.type === 'Parse') {

          // parse error
          self.log(chalk.red('Parser error') + (err.filename ? ' in ' + chalk.yellow(err.filename) : ''));
          self.log(' ');
        } else {

          // other exception
          self.log(chalk.red(err.name) + ': ' + err.message + (err.filename ? ' of ' + chalk.yellow(err.filename) : ''));
          self.log(' ');
        }

        // if extract - then log it
        if (err.extract) {
          err.extract.forEach(function (line, index) {
            self.log(utils.padLine(err.line + index) + line);
          });
        }

        // add extra line for readability after error log
        self.log(' ');

        // exit with callback if present
        return self.callback && self.callback();
      }

      // test to see if file has a less extension
      if (/less$/.test(self.path) && !self.parsed) {

        // if it's a LESS file, we flatten it
        self.data = tree.toCSS({});

        // set parse to true so as to not infinitely reparse less files
        self.parsed = true;

        // reparse less file
        return self.parse();
      }

      // set definitions to parse tree
      self.definitions = tree.rules;

      // validation defintions
      if (self.options.compile) {
        self.compile();
      } else {
        self.validate();
      }
    });
  } catch (err) {

    /**
     * ERRORED
     * If we're here, less exploded trying to parse the file (╯°□°）╯︵ ┻━┻
     */

    // push to errors array
    self.errors.push(err);

    // log a message trying to explain why
    self.log(chalk.red('Parse error') + ': ' + err.message + ' on line ' + utils.getLine(err.index, this.data));

    // exit with callback if present
    if (this.callback) {
      this.callback();
    }
  }
};


RECESS.prototype.compile = function () {
  var self = this;
  var css;

  // activate all relevant compilers
  Object.keys(this.options).forEach(function (key) {
    if (self.options[key] && RECESS.COMPILERS[key]) {
      RECESS.COMPILERS[key].on.call(self);
    }
  });

  // iterate over defintions and compress them (join with new lines)
  css = this.definitions.map(function (def) {
    return def.toCSS([[]], {
      data: self.data,
      compress: self.options.compress
    });
  }).join(this.options.compress ? '' : '\n');

  // minify with cssmin
  if (self.options.compress) {
    css = minify.compressor.cssmin(css);
  }

  // deactivate all relevant compilers
  Object.keys(this.options).reverse().forEach(function (key) {
    if (self.options[key] && RECESS.COMPILERS[key]) {
      RECESS.COMPILERS[key].off();
    }
  });

  // cleanup trailing newlines
  css = css.replace(/[\n\s\r]*$/, '');

  // output css
  this.log(css, true);

  // callback and exit
  if (this.callback) {
    this.callback();
  }
};


RECESS.prototype.validate = function () {
  var failed;
  var key;

  // iterate over instance options
  for (key in this.options) {

    // if option has a validation, then we test it
    if (this.options.hasOwnProperty(key)) {
      if (this.options[key] && RECESS.RULES[key] && !this.test(RECESS.RULES[key])) {
        failed = true;
      }
    }
  }

  // exit with failed flag to validateStatus
  this.validateStatus(failed);
};


RECESS.prototype.test = function (validation) {
  var l = this.definitions.length;
  var i = 0;
  var isValid = true;
  var def;

  // test each definition against a given validation
  for (; i < l; i += 1) {
    def = this.definitions[i];
    if (!validation(def, this.data)) {
      isValid = false;
    }
  }

  // return valid state
  return isValid;
};


RECESS.prototype.validateStatus = function (failed) {
  var self = this;
  var fails;

  if (failed) {

    // count errors
    this.fails = fails = utils.countErrors(this.definitions);

    // log file overview
    this.log('FILE: ' + chalk.cyan(this.path));
    this.log('STATUS: ' + chalk.magenta('Busted'));
    this.log('FAILURES: ' + (fails + ' failure' + chalk.magenta(fails > 1 ? 's' : '')));
    this.log();

    // iterate through each definition
    this.definitions.forEach(function (def) {

      // if there's an error, log the error and optional err.extract
      if (def.errors && def.errors.length) {
        def.errors.forEach(function (err) {
          self.log(err.message);
          if (err.extract) {
            self.log(err.extract + '\n');
          }
        });
      }
    });

  } else {
    // it was a success - let the user know!
    this.log(chalk.cyan('FILE: ' + this.path));
    this.log(chalk.yellow('STATUS: ' + 'Perfect!'));
    this.log();
  }

  // callback and exit
  if (this.callback) {
    this.callback();
  }
};


// import validation rules
RECESS.RULES = {};

resolve('lib/lint/*.js').forEach(function(filepath) {
  RECESS.RULES[utils.name(filepath)] = require(filepath);
});


// import compilers
RECESS.COMPILERS = {};

resolve('lib/compile/*.js').forEach(function(filepath) {
  RECESS.COMPILERS[utils.name(filepath)] = require(filepath);
});
