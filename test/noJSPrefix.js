var expect = require('chai').expect;
var RECESS = require('../');


var fs     = require('fs');
var util   = require('util');
var assert = require('assert');
var chalk  = require('chalk');
var _      = require('lodash');

var noop = function () {};


describe('VALIDATIONS.noJSPrefix:', function () {
  it('should validate noJSPrefix', function () {
    var path = 'test/fixtures/no-JS.css';
    var Recess = new RECESS.Constructor();
    var validate = RECESS.Constructor.prototype.validate;
    var lines = [4, 7, 14, 16, 17, 21];

    RECESS.Constructor.prototype.validate = noop;
    Recess.data = fs.readFileSync(path, 'utf8');
    Recess.parse();

    Recess.definitions.forEach(function (def) {
      RECESS.Constructor.RULES.noJSPrefix(def, Recess.data);
      expect(def.errors).to.be.ok;

      // 'one error found'
      expect(def.errors.length).to.equal(2);
      expect(def.errors[0].type).to.equal('noJSPrefix');

      // 'Correct line number reported'
      expect(def.errors[0].line).to.equal(lines.shift());
      expect(def.errors[1].type).to.equal('noJSPrefix');

      // 'Correct line number reported'
      expect(def.errors[1].line).to.equal(lines.shift());
    });
    RECESS.Constructor.prototype.validate = validate;
  });
});
