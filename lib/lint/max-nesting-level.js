'use strict'

var util = require('../util')
  , _ = require('underscore')

// find how deep a selector
function nestingLevel(selector) {
  var elements = selector.elements
    , level = elements.length

    // combinators that do not nest
    , combiners = ['', '~', '+']

  elements.forEach(function (elem) {
    if (_.contains(combiners, elem.combinator.value)) level -= 1
  });

  return level
}

// validation method
module.exports = function (def, data, max) {
  // default validation to true
  var isValid = true

  // return if no selector to validate
  if (!def.selectors) return isValid

  // loop over selectors
  def.selectors.forEach(function (selector) {

    // evaluate selector to string and trim whitespace
    var selectorString = selector.toCSS().trim()
      , level = nestingLevel(selector)
      , line
      , extract

    // if selector isn't overqualified continue
    if (level <= max) return

    // calculate line number for the extract
    line = util.getLine(selector.elements[0].index - selector.elements[0].value.length, data)
    extract = util.padLine(line)

    // highlight selector overqualification
    extract += selectorString.replace(selectorString, function ($1) { return $1.magenta })

    // set invalid flag to false
    isValid = false

    // set error object on defintion token
    util.throwError(def, {
      type: "max nesting level"
    , message: "Selector should not be nested more than " + max + " levels deep."
    , extract: extract
    , line: line
    })

  })

  // return validation state
  return isValid
}