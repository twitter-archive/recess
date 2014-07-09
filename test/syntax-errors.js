var expect = require('chai').expect;
var RECESS = require('../');


var fs     = require('fs');
var util   = require('util');
var assert = require('assert');
var chalk  = require('chalk');
var _      = require('lodash');

var noop = function () {};

// Cannot read property 'red' of undefined
describe('syntax-errors:', function () {
  it('should report syntax errors', function () {
    var Recess = new RECESS.Constructor();
    var validate = RECESS.Constructor.prototype.validate;

    RECESS.Constructor.prototype.validate = noop;

    Recess.data = '.foo { background:green;; }';
    Recess.parse();

    expect(Recess.output[0]).to.not.equal('\x1b[31mParse error\x1b[39m: Cannot read property \'red\' of undefined on line 1');
    RECESS.Constructor.prototype.validate = validate;
  });
});
