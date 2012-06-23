// ==========================================
// RECESS
// COMPILE: replaces image links with base64 image data
// ==========================================
// Copyright 2012 Twitter, Inc
// Licensed under the Apache License v2.0
// http://www.apache.org/licenses/LICENSE-2.0
// ==========================================

'use strict'

var less = require('less')
  , fs = require('fs')
  , seperator = (process.platform == 'win32') ? '\\' : '/'
  , toCSS
  , path

function compile () {
  // strip units from 0 values
  var props = toCSS.apply(this, arguments)

  // do we have a url here?
  if (/url\(([a-zA-Z\"\'.]+)\)/.test(props)) {
    var fileName = props.replace(/url\((\"|\'|)/, '').replace(/(\"|\'|)\)/, '')
      , chunks = fileName.split('.')
      , ext = chunks[chunks.length - 1]
      , mimetype = 'image/' + ext.replace(/jpg/, 'jpeg')
      , pathParts = path.split('/')
      , filePath = pathParts.slice(0, pathParts.length - 1).join(seperator)

    return props.replace(/url\(([a-zA-Z\"\'.]+)\)/, 'url(data:' + mimetype + ';base64,' + new Buffer(fs.readFileSync(filePath+seperator+fileName)).toString('base64') + ')')
  }

  return props
}

module.exports.on = function () {
  path = this.path
  toCSS = less.tree.Value.prototype.toCSS
  less.tree.Value.prototype.toCSS = compile
}

module.exports.off = function () {
  less.tree.Value.prototype.toCSS = toCSS
}