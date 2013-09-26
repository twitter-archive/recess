'use strict'

function TextFormatter(log) {
  this.logger = log;
  this.log = function(string) { log.log(string); }
}

TextFormatter.prototype = {
  summary: function(path, fails) {
    // log file overview
    this.log('FILE: ' + path.cyan)

    if (fails) {
      this.log('STATUS: ' + 'Busted'.magenta)
      this.log('FAILURES: ' + (fails + ' failure' + (fails > 1 ? 's' : '')).magenta + '\n')
    } else {
      this.log('STATUS: ' + 'Perfect!\n'.yellow)
    };
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
    this.log(err.message)
    err.extract && this.log(err.extract + '\n')
  },

  complete: function() {
  }
}

module.exports = TextFormatter;

/*
 * Local Variables:
 * js-indent-level: 2
 * End:
 */
