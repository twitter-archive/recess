var fs = require('fs');
var assert = require('assert');
var chalk = require('chalk');
var RECESS = require('../../lib');


// Ignore anything not a less/css file.
var isValidExtension = function(str) {
  return /\.less$|\.css$/.test(str);
};


fs.readdirSync('test/fixtures').forEach(function (filepath, index) {
  if (!isValidExtension(filepath)) {return;}

  RECESS('test/fixtures/' + filepath, {
    compile: true,
    inlineImages: true
  }, function (err, fat) {
    var file2 = filepath.replace(/less$/, 'css');

    // assert.ok(err === null);
    assert.ok(fat[0].output[0] === fs.readFileSync('test/expected/' + file2, 'utf8'), file2 + ' should be compiled from ' + filepath);
  });
});

console.log(chalk.green('\u2713 compiling'));