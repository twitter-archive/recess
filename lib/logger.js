'use strict'

function Logger(options) {
  this.options = options;
  this.output = [];
}

Logger.prototype = {
  log: function (str) {
    if (!this.options.compile) {
      this.logForce(str);
    }
  },

  logForce: function(str) {
    if (this.options.stripColors) str = str.stripColors

    this.options.cli ? console.log(str) : this.output.push(str)
  }
};

module.exports = Logger;
/*
 * Local Variables:
 * js-indent-level: 2
 * End:
 */
