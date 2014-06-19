var assert = require('assert');
var chalk  = require('chalk');

var RECESS = require('../../lib');

// error
!function () {

  RECESS('./foo.less', function (err, instance) {
    assert.ok(err.length == 1);
    assert.ok(/Error:/.test(err[0].toString()));
    assert.ok(!!instance);
    console.log(chalk.green("✓ erroring correctly."));
  });
}();
