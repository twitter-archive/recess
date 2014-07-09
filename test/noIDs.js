var expect = require('chai').expect;
var RECESS = require('../');


var fs     = require('fs');
var util   = require('util');
var assert = require('assert');
var chalk  = require('chalk');
var _      = require('lodash');

var noop = function () {};


describe('VALIDATIONS.no-IDs:', function () {
  it('should validate no-IDs', function () {
    var path = 'test/fixtures/no-IDs.css';
    var Recess = new RECESS.Constructor();
    var validate = RECESS.Constructor.prototype.validate;
    var lines = [1, 6, 13];

    RECESS.Constructor.prototype.validate = noop;

    Recess.data = fs.readFileSync(path, 'utf8');
    Recess.parse();

    Recess.definitions.forEach(function (def) {
      RECESS.Constructor.RULES.noIDs(def, Recess.data);
      expect(def.errors).to.be.ok;

      // 'one error found'
      expect(def.errors.length).to.equal(1);
      expect(def.errors[0].type).to.equal('noIDs');

      // 'Correct line number reported'
      expect(def.errors[0].line).to.equal(lines.shift());
    });
    RECESS.Constructor.prototype.validate = validate;
  });
});
