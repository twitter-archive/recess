var fs     = require('fs');
var path   = require('path');
var assert = require('assert');
var util   = require('util');
var chalk  = require('chalk');

var RECESS = require('../../lib');

// Ignore anything not a less/css file.
var isValidExtension = function(filepath) {
  var ext = path.extname(filepath);
  return (ext === '.less') || (ext === '.css');
};

var expected = function(filename) {
  return fs.readFileSync('test/expected/' + filename, 'utf8');
};


fs.readdirSync('test/fixtures').forEach(function (filepath, index) {
  if (!isValidExtension(filepath)) {return;}

  var options = {compile: true, inlineImages: true };

  RECESS('test/fixtures/' + filepath, options, function (err, json) {
    console.log(filepath);
    if (/preboot/.test(filepath)) {
      console.log(util.inspect(json, null, 10));
    }
    var filename = filepath.replace(/less$/, 'css');
    var str = json[0].output[0];

    assert.ok(err === null);
    assert.ok(str === expected(filename), filename + ' should be compiled from:', filepath);
  });
});

console.log(chalk.green('✓ compiling'));