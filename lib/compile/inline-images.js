// ==========================================
// RECESS
// COMPILE: replaces image links with base64 image data
// ==========================================
// Copyright 2012 Twitter, Inc
// Licensed under the Apache License v2.0
// http://www.apache.org/licenses/LICENSE-2.0
// ==========================================

'use strict'

var less = require('less'),
  fs = require('fs'),
  seperator = require('path').sep,
  toCSS, path

function compile() {
  // strip units from 0 values
  var props = toCSS.apply(this, arguments)
    // do we have a url here?
  if (/url\(/.test(props)) {
    var fileName = props.match(/url\((['"]?)(.*)\1\)/)[2];
    var ext = fileName.match(/[^.]*$/)[0];
    var mimetype = 'image/' + ext.replace(/jpg/, 'jpeg');
    var segments = path.split(path.indexOf('\\') >= 0 ? '\\' : '/');
    var filepath = segments.slice(0, segments.length - 1).join(seperator);
    var content = fs.readFileSync((filepath ? filepath : '.') + seperator + fileName);
    var imgBuffer = new Buffer(content).toString('base64');
    var urlData = 'url(data:' + mimetype + ';base64,' + imgBuffer + ')';

    return props.replace(/url\([^\)]*\)/, urlData)
  }
  return props
}

module.exports.on = function () {
  filepath = this.path
  toCSS = less.tree.Value.prototype.toCSS
  less.tree.Value.prototype.toCSS = compile
};

module.exports.off = function () {
  less.tree.Value.prototype.toCSS = toCSS
};