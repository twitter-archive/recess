// ==========================================
// RECESS
// RULE: Must use correct property ordering
// ==========================================
// Copyright 2012 Twitter, Inc
// Licensed under the Apache License v2.0
// http://www.apache.org/licenses/LICENSE-2.0
// ==========================================

'use strict'

var _ = require('underscore')
  , util = require('../util')
  , RULE = {
      type: 'strictPropertyOrder'
    , message: 'Incorrect property order for rule'
    }

  // vendor prefix order
  , vendorPrefixes = [
      '-webkit-'
    , '-khtml-'
    , '-epub-'
    , '-moz-'
    , '-ms-'
    , '-o-'
    ]

  // hack prefix order
  , hackPrefixes = [
      '_' // ie7
    , '*' // ie6
    ]

  // css property order
  , order = [
      'align-content'
    , 'align-items'
    , 'alignment-baseline'
    , 'align-self'
    , 'animation'
    , 'animation-delay'
    , 'animation-direction'
    , 'animation-duration'
    , 'animation-fill-mode'
    , 'animation-iteration-count'
    , 'animation-name'
    , 'animation-play-state'
    , 'animation-timing-function'
    , 'appearance'
    , 'backface-visibility'
    , 'background'
    , 'background-attachment'
    , 'background-clip'
    , 'background-color'
    , 'background-composite'
    , 'background-image'
    , 'background-inline-policy'
    , 'background-origin'
    , 'background-position'
    , 'background-repeat'
    , 'background-size'
    , 'baseline-shift'
    , 'binding'
    , 'border'
    , 'border-bottom'
    , 'border-bottom-color'
    , 'border-bottom-colors'
    , 'border-bottom-left-radius'
    , 'border-bottom-right-radius'
    , 'border-bottom-style'
    , 'border-bottom-width'
    , 'border-collapse'
    , 'border-color'
    , 'border-fit'
    , 'border-horizontal-spacing'
    , 'border-image'
    , 'border-image-outset'
    , 'border-image-repeat'
    , 'border-image-slice'
    , 'border-image-source'
    , 'border-image-width'
    , 'border-left'
    , 'border-left-color'
    , 'border-left-colors'
    , 'border-left-style'
    , 'border-left-width'
    , 'border-radius'
    , 'border-radius-bottomleft'
    , 'border-radius-bottomright'
    , 'border-radius-topleft'
    , 'border-radius-topright'
    , 'border-right'
    , 'border-right-color'
    , 'border-right-colors'
    , 'border-right-style'
    , 'border-right-width'
    , 'border-spacing'
    , 'border-style'
    , 'border-top'
    , 'border-top-color'
    , 'border-top-colors'
    , 'border-top-left-radius'
    , 'border-top-right-radius'
    , 'border-top-style'
    , 'border-top-width'
    , 'border-vertical-spacing'
    , 'border-width'
    , 'bottom'
    , 'box-align'
    , 'box-decoration-break'
    , 'box-direction'
    , 'box-flex'
    , 'box-flex-group'
    , 'box-lines'
    , 'box-ordinal-group'
    , 'box-orient'
    , 'box-pack'
    , 'box-reflect'
    , 'box-shadow'
    , 'box-sizing'
    , 'caption-side'
    , 'clear'
    , 'clip'
    , 'clip-path'
    , 'clip-rule'
    , 'color'
    , 'color-correction'
    , 'color-interpolation'
    , 'color-interpolation-filters'
    , 'color-rendering'
    , 'column-axis'
    , 'column-break-after'
    , 'column-break-before'
    , 'column-break-inside'
    , 'column-count'
    , 'column-gap'
    , 'column-rule-color'
    , 'column-rule-style'
    , 'column-rule-width'
    , 'column-span'
    , 'column-width'
    , 'content'
    , 'counter-increment'
    , 'counter-reset'
    , 'cursor'
    , 'direction'
    , 'display'
    , 'dominant-baseline'
    , 'empty-cells'
    , 'fill'
    , 'fill-opacity'
    , 'fill-rule'
    , 'filter'
    , 'flex'
    , 'flex-direction'
    , 'flex-flow'
    , 'flex-wrap'
    , 'float'
    , 'float-edge'
    , 'flood-color'
    , 'flood-opacity'
    , 'flow-from'
    , 'flow-into'
    , 'font'
    , 'font-family'
    , 'font-feature-settings'
    , 'font-kerning'
    , 'font-language-override'
    , 'font-size'
    , 'font-size-adjust'
    , 'font-smoothing'
    , 'font-stretch'
    , 'font-style'
    , 'font-variant'
    , 'font-variant-ligatures'
    , 'font-weight'
    , 'force-broken-image-icon'
    , 'glyph-orientation-horizontal'
    , 'glyph-orientation-vertical'
    , 'grid-column'
    , 'grid-columns'
    , 'grid-row'
    , 'grid-rows'
    , 'height'
    , 'highlight'
    , 'hyphenate-character'
    , 'hyphenate-limit-after'
    , 'hyphenate-limit-before'
    , 'hyphenate-limit-lines'
    , 'hyphens'
    , 'image-region'
    , 'image-rendering'
    , 'ime-mode'
    , 'interpolation-mode'
    , 'justify-content'
    , 'kerning'
    , 'left'
    , 'letter-spacing'
    , 'lighting-color'
    , 'line-align'
    , 'line-box-contain'
    , 'line-break'
    , 'line-clamp'
    , 'line-grid'
    , 'line-height'
    , 'line-snap'
    , 'list-style'
    , 'list-style-image'
    , 'list-style-position'
    , 'list-style-type'
    , 'locale'
    , 'margin'
    , 'margin-after-collapse'
    , 'margin-before-collapse'
    , 'margin-bottom'
    , 'margin-bottom-collapse'
    , 'margin-collapse'
    , 'margin-left'
    , 'margin-left-collapse'
    , 'margin-right'
    , 'margin-right-collapse'
    , 'margin-top'
    , 'margin-top-collapse'
    , 'marker-end'
    , 'marker-mid'
    , 'marker-offset'
    , 'marker-start'
    , 'marks'
    , 'marquee-direction'
    , 'marquee-increment'
    , 'marquee-repetition'
    , 'marquee-style'
    , 'mask'
    , 'mask-attachment'
    , 'mask-box-image'
    , 'mask-box-image-outset'
    , 'mask-box-image-repeat'
    , 'mask-box-image-slice'
    , 'mask-box-image-source'
    , 'mask-box-image-width'
    , 'mask-clip'
    , 'mask-composite'
    , 'mask-image'
    , 'mask-origin'
    , 'mask-position'
    , 'mask-repeat'
    , 'mask-size'
    , 'max-height'
    , 'max-width'
    , 'min-height'
    , 'min-width'
    , 'nbsp-mode'
    , 'opacity'
    , 'order'
    , 'orient'
    , 'orphans'
    , 'outline'
    , 'outline-color'
    , 'outline-offset'
    , 'outline-radius-bottomleft'
    , 'outline-radius-bottomright'
    , 'outline-radius-topleft'
    , 'outline-radius-topright'
    , 'outline-style'
    , 'outline-width'
    , 'overflow'
    , 'overflow-x'
    , 'overflow-y'
    , 'padding'
    , 'padding-bottom'
    , 'padding-left'
    , 'padding-right'
    , 'padding-top'
    , 'page'
    , 'page-break-after'
    , 'page-break-before'
    , 'page-break-inside'
    , 'perspective'
    , 'perspective-origin'
    , 'pointer-events'
    , 'position'
    , 'print-color-adjust'
    , 'quotes'
    , 'region-break-after'
    , 'region-break-before'
    , 'region-break-inside'
    , 'region-overflow'
    , 'resize'
    , 'right'
    , 'rtl-ordering'
    , 'set-link-source'
    , 'shape-inside'
    , 'shape-outside'
    , 'shape-rendering'
    , 'size'
    , 'speak'
    , 'src'
    , 'stack-sizing'
    , 'stop-color'
    , 'stop-opacity'
    , 'stroke'
    , 'stroke-dasharray'
    , 'stroke-dashoffset'
    , 'stroke-linecap'
    , 'stroke-linejoin'
    , 'stroke-miterlimit'
    , 'stroke-opacity'
    , 'stroke-width'
    , 'svg-shadow'
    , 'table-layout'
    , 'tab-size'
    , 'tap-highlight-color'
    , 'text-align'
    , 'text-align-last'
    , 'text-anchor'
    , 'text-blink'
    , 'text-combine'
    , 'text-decoration'
    , 'text-decoration-color'
    , 'text-decoration-line'
    , 'text-decorations-in-effect'
    , 'text-decoration-style'
    , 'text-emphasis-color'
    , 'text-emphasis-position'
    , 'text-emphasis-style'
    , 'text-fill-color'
    , 'text-indent'
    , 'text-orientation'
    , 'text-overflow'
    , 'text-rendering'
    , 'text-security'
    , 'text-shadow'
    , 'text-size-adjust'
    , 'text-stroke-color'
    , 'text-stroke-width'
    , 'text-transform'
    , 'top'
    , 'transform'
    , 'transform-origin'
    , 'transform-style'
    , 'transition'
    , 'transition-delay'
    , 'transition-duration'
    , 'transition-property'
    , 'transition-timing-function'
    , 'unicode-bidi'
    , 'user-drag'
    , 'user-focus'
    , 'user-input'
    , 'user-modify'
    , 'user-select'
    , 'vector-effect'
    , 'vertical-align'
    , 'visibility'
    , 'white-space'
    , 'widows'
    , 'width'
    , 'window-shadow'
    , 'word-break'
    , 'word-spacing'
    , 'word-wrap'
    , 'wrap-flow'
    , 'wrap-margin'
    , 'wrap-padding'
    , 'wrap-through'
    , 'writing-mode'
    , 'z-index'
    , 'zoom'
    ]

  // regex tests
  , HACK_PREFIX = new RegExp('^(' + hackPrefixes.join('|').replace(/[-[\]{}()*+?.,\\^$#\s]/g, "\\$&") + ')')
  , VENDOR_PREFIX = new RegExp('^(' + vendorPrefixes.join('|').replace(/[-[\]{}()*+?.,\\^$#\s]/g, "\\$&") + ')')


// validation method
module.exports = function (def, data) {

  // // default validation to true
  var isValid = true
    , dict = {}
    , index = 0
    , cleanRules
    , sortedRules
    , firstLine
    , extract
    , selector

  // return if no rules to validate
  if (!def.rules) return isValid

  // recurse over nested rulesets
  def.rules.forEach(function (rule) {
    if (rule.selectors) module.exports(rule, data)
  })

  cleanRules = def.rules.map(function (rule) {
    return rule.name && rule
  }).filter(function (item) { return item })

  // sort rules
  sortedRules = _.sortBy(cleanRules, function (rule) {

    // pad value of each rule position to account for vendor prefixes
    var padding = (vendorPrefixes.length + 1) * 10
      , root
      , val

    // strip vendor prefix and hack prefix from rule name to find root
    root = rule.name
      .replace(VENDOR_PREFIX, '')
      .replace(HACK_PREFIX, '')

    // find value of order of the root css property
    val = order.indexOf(root)

    // if property is not found, exit with property not found error
    if (!~val) {
      return util.throwError(def, {
        type: 'propertyNotFound'
      , message: 'Unknown property name: "' + rule.name + '"'
      })
    }

    // pad value
    val  = (val * padding) + 10

    // adjust value based on prefix
    val += VENDOR_PREFIX.exec(rule.name) ? vendorPrefixes.indexOf(RegExp.$1) : (vendorPrefixes.length + 1)

    // adjust value based on css hack
    val += HACK_PREFIX.exec(rule.name) ? (hackPrefixes.indexOf(RegExp.$1)) : 0

    // return sort value
    return val
  })

  // check to see if sortedRules has same order as provided rules
  isValid = _.isEqual(sortedRules, cleanRules)

  // return if sort is correct
  if (isValid) return isValid

  // get the line number of the first rule
  firstLine = util.getLine(def.rules[0].index, data)

  // generate a extract what the correct sorted rules would look like
  extract = sortedRules.map(function (rule) {
    if (!rule.name) return
    return util.padLine(firstLine + index++)
      + ' ' + rule.name + ': '
      + (typeof rule.value == 'string' ? rule.value : rule.value.toCSS({}))
      + ';'
  }).filter(function (item) { return item }).join('\n')

  // extract selector for error message
  selector = (' "' + def.selectors.map(function (selector) {
    return selector.toCSS && selector.toCSS({}).replace(/^\s/, '')
  }).join(', ') + '"').magenta

  // set error object on defintion token
  util.throwError(def, {
    type: RULE.type
  , message: RULE.message + selector + '\n\n  Correct order below:\n'.grey
  , extract: extract
  , sortedRules: sortedRules
  })

  // return valid state
  return isValid
}
