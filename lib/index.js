// ==========================================
// RECESS
// INDEX: The root api definition
// ==========================================
// Copyright 2012 Twitter, Inc
// Licensed under the Apache License v2.0
// http://www.apache.org/licenses/LICENSE-2.0
// ==========================================

'use strict'

// require core
var RECESS = require('./core')
  , colors = require('colors')
  , FormatterJUnit = require('./formatters/junit')
  , FormatterText = require('./formatters/text')
  , FormatterCompact = require('./formatters/compact')
  , Logger = require('./logger')

// define main export
module.exports = function (paths, options, callback) {

  var option, message, i, instances = []

  // if no options default to empty object
  options = options || {}

  // if options is a function, set to callback and set options to {}
  if (typeof options == 'function') (callback = options) && (options = {})

  // if single path, convert to array
  if (typeof paths == 'string') paths = [paths]

  // there were no paths, show the docs
  if (!paths || !paths.length) return module.exports.docs()

  // if a compress flag is present, we automatically make compile flag true
  options.compress && (options.compile = true)

  // if format is set to compact, automatically set noSummary
  options.format && (options.format == 'compact') && (options.noSummary = true)

  // if not compiling, let user know which files will be linted
  if (!options.compile && options.cli && !options.noSummary && options.format != 'junit') {
    message = "\nAnalyzing the following files: " + ((paths + '').replace(/,/g, ', ') + '\n').grey
    options.stripColors && (message = message.stripColors)
    console.log(message)
  }

  // Logger
  var log = new Logger(options);

  // Create an instance of the output formatter selected by the user
  var formatter;
  switch (options.format) {
  case 'compact':
    formatter = new FormatterCompact(log);
    break;
  case 'junit':
    formatter = new FormatterJUnit(log);
    break;
  case 'text':
  default:
    formatter = new FormatterText(log);
    break;
  }

  // for each path, create a new RECESS instance
  function recess(init, path, err) {
    if (path = paths.shift()) {
      log.output = [];
      formatter.startFile(path);
      return instances.push(new RECESS(path, options, log, formatter, recess))
    }

    // map/filter for errors
    err = instances
      .map(function (i) {
        return i.errors.length && i.errors
      })
      .filter(function (i) {
        return i
      })

    // if no error, set explicitly to null
    err = err.length ? err[0] : null

    //callback
    callback && callback(err, instances)

    formatter.complete();
  }

  // start processing paths
  recess(true)
}

// default options
module.exports.DEFAULTS = RECESS.DEFAULTS = {
  compile: false
, compress: false
, config: false
, format: 'text'
, includePath: []
, noIDs: true
, noJSPrefix: true
, noOverqualifying: true
, noSummary: false
, noUnderscores: true
, noUniversalSelectors: true
, prefixWhitespace: true
, strictPropertyOrder: true
, stripColors: false
, watch: false
, zeroUnits: true
, inlineImages: false
}


// expose RAW RECESS class
module.exports.Constructor = RECESS

// expose docs
module.exports.docs = function () {
  console.log("\nGENERAL USE: " + "$".grey + " recess".cyan + " [path] ".yellow + "[options]\n".grey)
  console.log("OPTIONS:")
  for (var option in RECESS.DEFAULTS) console.log('  --' + option)
  console.log("\nEXAMPLE:\n\n" + "  $".grey + " recess".cyan + " ./bootstrap.css ".yellow + "--noIDs false\n".grey)
  console.log('GENERAL HELP: ' + 'http://git.io/recess\n'.yellow)
}

/*
 * Local Variables:
 * js-indent-level: 2
 * End:
 */
