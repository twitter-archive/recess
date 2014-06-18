// ==========================================
// RECESS
// COMPILE: replaces data-uri with base64 file data with fallback to url
// ==========================================
// Copyright 2012 Twitter, Inc
// Licensed under the Apache License v2.0
// http://www.apache.org/licenses/LICENSE-2.0
// ==========================================

'use strict'

var less = require('less')
    , fs = require('fs')
    , path = require('path')
    , mime = require('mime')
    , toCSS
    , filePath
    , forIE

function compile(context, env) {
    // strip units from 0 values
    var props = toCSS.apply(this, arguments)

    // do we have a url here?
    if (/data-uri\(/.test(props)) {
        var fileName = props.match(/data-uri\((['"]?([^'"]*)[^)]+)\)/)[2].match(/([^?#]*)/)[1];
        var fullPath = path.resolve(path.dirname(filePath), fileName);
        var mimetype = mime.lookup(fullPath);
        var dataBuffer = new Buffer(fs.readFileSync(fullPath));
        var urlData = '';
        if (forIE && dataBuffer.length>32*1024) {
               //Don't embed. leave url
             return props.replace(/data-uri/, 'url');
        }
        urlData = 'url(data:' + mimetype + ';base64,' + dataBuffer.toString('base64') + ')';
        return props.replace(/data-uri\([^\)]*\)/, urlData);
    }
    return props
}

module.exports.on = function () {
    filePath = this.path;
    forIE = this.options.dataUri === 'ie';
    toCSS = less.tree.Value.prototype.toCSS;
    less.tree.Value.prototype.toCSS = compile;
}

module.exports.off = function () {
    less.tree.Value.prototype.toCSS = toCSS
}
