'use strict'

function CompactFormatter(log) {
  this.logger = log;
  this.log = function(string) { log.log(string); }
}

CompactFormatter.prototype = {
  summary: function(path, fails) {
    // No summary output in compact mode
  },

  startFile: function(path) {
  },

  parserError: function(err) {
    if (err.type == 'Parse') {
      // parse error
      this.log("Parser error".red + (err.filename ? ' in ' + err.filename : '') + '\n')
    } else {
      // other exception
      this.log(String(err.name).red + ": " + err.message + ' of ' + String(err.filename).yellow + '\n')
    }

    // if extract - then log it
    err.extract && err.extract.forEach(function (line, index) {
      this.log(util.padLine(err.line + index) + line)
    })

    // add extra line for readability after error log
    this.log(" ")
  },

  parseError: function(err, line) {
    // log a message trying to explain why
    this.log(
      "Parse error".red
        + ": "
        + err.message
        + " on line "
        + line
    );
  },

  validationError: function(err, path) {
    this.log(path + ':' + err.line + ':' + err.message)
  },

  complete: function() {
  }
}

module.exports = CompactFormatter;

/*
 * Local Variables:
 * js-indent-level: 2
 * End:
 */
