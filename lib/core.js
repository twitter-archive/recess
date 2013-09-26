// ==========================================
// RECESS
// CORE: The core class definition
// ==========================================
// Copyright 2012 Twitter, Inc
// Licensed under the Apache License v2.0
// http://www.apache.org/licenses/LICENSE-2.0
// ==========================================

'use strict'

var _ = require('underscore')
  , colors = require('colors')
  , less = require('less')
  , util = require('./util')
  , path = require('path')
  , fs = require('fs')
  , formatterFactory = require('./formatters/factory')

// core class defintion
function RECESS(path, options, callback, formatter) {
  if (!formatter) {
    formatter = formatterFactory(options || {});
  };
  var log = formatter.logger;

  this.path = path

  this.log = function(string, force) { force ? log.logForce(string) : log.log(string); }
  this.logForce = function(string) { log.logForce(string); }
  this.output = log.output

  this.formatter = formatter

  this.errors = []
  this.options = _.extend({}, RECESS.DEFAULTS, options)
  path && this.read()
  this.callback = callback
}

// instance methods
RECESS.prototype = {

  constructor: RECESS

, read: function () {
    var that = this

    // try to read data from path
    fs.readFile(this.path, 'utf8', function (err, data) {

      //  if err, exit with could not read message
      if (err) {
        that.errors.push(err)
        that.logForce('Error reading file: '.red + String(that.path).grey + '\n')
        return that.callback && that.callback()
      }

      // set instance data
      that.data = data

      // parse data
      that.parse()

    })
  }

, parse: function () {
    var that = this
      , options = {
          paths: [path.dirname(this.path)].concat(this.options.includePath)
        , optimization: 0
        , filename: this.path && this.path.replace(/.*(?=\/)\//, '')
        }

    // try to parse with less parser
    try {

      // instantiate new parser with options
      new less.Parser(options)

        // parse data into tree
        .parse(this.data, function (err, tree) {

          if (err) {
            // push to errors array
            that.errors.push(err)

            that.formatter.parserError(err)

            // exit with callback if present
            return that.callback && that.callback()
          }

          // test to see if file has a less extension
          if (/less$/.test(that.path) && !that.parsed) {

            // if it's a LESS file, we flatten it
            that.data = tree.toCSS({})

            // set parse to true so as to not infinitely reparse less files
            that.parsed = true

            // reparse less file
            return that.parse()
          }

          // set definitions to parse tree
          that.definitions = tree.rules

          // validation defintions
          that.options.compile ? that.compile() : that.validate()
        })

    } catch (err) {
      // less exploded trying to parse the file (╯°□°）╯︵ ┻━┻
      // push to errors array
      that.errors.push(err)

      that.formatter.parseError(err, util.getLine(err.index, this.data))

      // exit with callback if present
      this.callback && this.callback()
    }
  }

, compile: function () {
    var that = this
      , key
      , css

    // activate all relevant compilers
    Object.keys(this.options).forEach(function (key) {
      that.options[key]
        && RECESS.COMPILERS[key]
        && RECESS.COMPILERS[key].on.call(that)
    })

    // iterate over defintions and compress them (join with new lines)
    css = this.definitions.map(function (def) {
      return def.toCSS([[]], { data: that.data, compress: that.options.compress })
    }).join(this.options.compress ? '' : '\n')

    // minify with cssmin
    if (that.options.compress) css = require('./min').compressor.cssmin(css)

    // deactivate all relevant compilers
    Object.keys(this.options).reverse().forEach(function (key) {
      that.options[key]
        && RECESS.COMPILERS[key]
        && RECESS.COMPILERS[key].off()
    })

    // cleanup trailing newlines
    css = css.replace(/[\n\s\r]*$/, '')

    // output css
    this.logForce(css)

    // callback and exit
    this.callback && this.callback()
  }

, validate: function () {
    var failed
      , key

    // iterate over instance options
    for (key in this.options) {

      // if option has a validation, then we test it
      this.options[key]
        && RECESS.RULES[key]
        && !this.test(RECESS.RULES[key])
        && (failed = true)

    }

    // exit with failed flag to validateStatus
    this.validateStatus(failed)
  }

, test: function (validation) {
    var l = this.definitions.length
      , i = 0
      , isValid = true
      , rule
      , def
      , j
      , k

    // test each definition against a given validation
    for (; i < l; i++) {
      def = this.definitions[i]
      if (!validation(def, this.data)) isValid = false
    }

    // return valid state
    return isValid
  }

, validateStatus: function (failed) {
    var that = this
      , fails
      , formatter

    if (failed) {

      // count errors
      fails = util.countErrors(this.definitions)

      if (!this.options.noSummary) {
        this.formatter.summary(this.path, fails);
      }

      // iterate through each definition
      this.definitions.forEach(function (def) {
        // if there's an error, log the error and optional err.extract
        def.errors
          && def.errors.length
          && def.errors.forEach(function(e) {
            that.formatter.validationError(
              e,
              that.path,
              e.line
            );
          })
      })

    } else {
      // it was a success - let the user know!
      this.formatter.summary(this.path, 0);
    }

    // callback and exit
    this.callback && this.callback()
  }

}

// import validation rules
RECESS.RULES = {}

fs.readdirSync(path.join(__dirname, 'lint')).forEach(function (name) {
  var camelName = name
    .replace(/(\-[a-z])/gi, function ($1) { return $1.toUpperCase().replace('-', '') })
    .replace(/\.js$/, '')
  RECESS.RULES[camelName] = require(path.join(__dirname, 'lint', name))
})

// import compilers
RECESS.COMPILERS = {}

fs.readdirSync(path.join(__dirname, 'compile')).forEach(function (name) {
  var camelName = name
    .replace(/(\-[a-z])/gi, function ($1) { return $1.toUpperCase().replace('-', '') })
    .replace(/\.js$/, '')
  RECESS.COMPILERS[camelName] = require(path.join(__dirname, 'compile', name))
})

// export class
module.exports = RECESS

/*
 * Local Variables:
 * js-indent-level: 2
 * End:
 */
