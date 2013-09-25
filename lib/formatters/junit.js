'use strict'

var libxml = require("libxmljs");

function JUnitFormatter(log) {
  this.log = function(string) { log.log(string); }
  this.errors = {};
  this.currentFile = null;
}

JUnitFormatter.prototype = {
  summary: function(path, fails) {
    // No summary output in compact mode
  },

  startFile: function(path) {
    this.currentFile = path;
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

  validationError: function(err, path, line) {
    this.errors[this.currentFile] = this.errors[this.currentFile] || [];
    this.errors[this.currentFile].push({ err: err, path: path, line: line})
  },

  complete: function() {
    var doc = new libxml.Document();
    var suiteNode = doc
      .node("testsuite")
      .attr("name", "RECESS")
      .attr("tests", this.errors.length)
      .attr("errors", this.errors.length)
      .attr("timestamp", new Date().toISOString());

    for (var file in this.errors) {
      var errors = this.errors[file];
      var caseNode = suiteNode.node("testcase")
	.attr("name", file);

      errors.forEach(function(errorData) {
	caseNode
	  .node("error")
	  .attr("type", errorData.err.type.stripColors)
	  .attr("message", errorData.err.message.stripColors + " at line " + errorData.line)
      });
    };

    this.log(doc.toString());
  }
}

module.exports = JUnitFormatter;

/*
 * Local Variables:
 * js-indent-level: 2
 * End:
 */
