'use strict'

var FormatterText = require('./text')
  , FormatterCompact = require('./compact')
  , FormatterJUnit = require('./junit')
  , Logger = require('../logger')

function formatterFactory(options) {
  var log = new Logger(options);
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
  };

  return formatter;
}

module.exports = formatterFactory;

/*
 * Local Variables:
 * js-indent-level: 2
 * End:
 */
