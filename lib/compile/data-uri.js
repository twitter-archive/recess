// ==========================================
// RECESS
// COMPILE: replaces data-uri with base64 file data with fallback to url
// ==========================================
// Copyright 2012 Twitter, Inc
// Licensed under the Apache License v2.0
// http://www.apache.org/licenses/LICENSE-2.0
// ==========================================

'use strict';

var fs = require('fs');
var path = require('path');
var mime = require('mime');
var less = require('less');

var toCSS;
var filepath;
var forIE;

function compile(context, env) {

  // strip units from 0 values
  var props = toCSS.apply(this, arguments);

  // // do we have a url here?
  // if (/url\(/.test(props)) {
  //   var filename = props.match(/url\((['"]?)(.*)\1\)/)[2];
  //   var ext = filename.match(/[^.]*$/)[0];
  //   var mimetype = 'image/' + ext.replace(/jpg/, 'jpeg');

  //   var segments = path.split(path.indexOf('\\') >= 0 ? '\\' : '/');
  //   var filepath = segments.slice(0, segments.length - 1).join(path.sep);

  //   var fullpath = (filepath ? filepath : '.') + path.sep + filenme;
  //   var content = fs.readFileSync(fullpath);
  //   var imgBuffer = new Buffer(content).toString('base64');


  //   var urlData = 'url(data:' + mimetype + ';base64,' + imgBuffer + ')';
  //   return props.replace(/url\([^\)]*\)/, urlData);
  // }


  var re = /url\(['"]?(.+)['"]?\)/;

  function replaceStr(str, mimetype) {
    // data:[<mime type>][;charset=<charset>][;base64],<encoded data>
    return 'url("data:' + mimetype + ';base64,' + str.toString('base64'); + '")';
  }

  function filename(str, dirname) {
    var match = str.match(re);
    if (match) {
      return dirname + '/' + match[1];
    }
    return null;
  }


  // If we find a data-uri, continue
  if (/data-uri\(/.test(props)) {
    var filename = props.match(/data-uri\((['"]?([^'"]*)[^)]+)\)/)[2].match(/([^?#]*)/)[1];
    var fullpath = path.join(path.dirname(filepath), filename);

    var mimetype = mime.lookup(fullpath);
    var content = fs.readFileSync(fullpath);
    var dataBuffer = new Buffer(content);

    // If it exceeds IE limitations, don't embed and leave as a url.
    if (forIE && dataBuffer.length > 32 * 1024) {
      return props.replace(/data-uri/, 'url');
    }

    return props.replace(/data-uri\([^\)]*\)/, replaceStr(mimetype, dataBuffer));
  }
  return props;
}

module.exports.on = function () {
  filepath = this.path;
  forIE = this.options.dataUri === 'ie';
  toCSS = less.tree.Value.prototype.toCSS;
  less.tree.Value.prototype.toCSS = compile;
};

module.exports.off = function () {
  less.tree.Value.prototype.toCSS = toCSS;
};