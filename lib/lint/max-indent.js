'use strict'

var util = require('../util')

// validation method
module.exports = function (def, data) {
  // default validation to true
  var isValid = true
    , max = 3

  // return if no selector to validate
  if (!def.selectors) return isValid

  // loop over selectors
  def.selectors.forEach(function (selector) {

    // evaluate selector to string and trim whitespace
    var selectorString = selector.toCSS().trim()
      , selectorCount = selectorString.split(' ')
      , line
      , extract

    // if selector isn't overqualified continue
    if (selectorCount < 3) return

    // calculate line number for the extract
    line = util.getLine(selector.elements[0].index - selector.elements[0].value.length, data)
    extract = util.padLine(line)

    // highlight selector overqualification
    extract += selectorString.replace(selectorString, function ($1) { return $1.magenta })

    // set invalid flag to false
    isValid = false

    // set error object on defintion token
    util.throwError(def, {
      type: "max indent"
    , message: "selector should not be nested more than " + max + " levels deep."
    , extract: extract
    , line: line
    })

  })

  // return validation state
  return isValid
}