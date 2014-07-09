var expect = require('chai').expect;
var RECESS = require('../');


var fs     = require('fs');
var util   = require('util');
var assert = require('assert');
var chalk  = require('chalk');
var _      = require('lodash');

var noop = function () {};


describe('VALIDATION.noUnderscores:', function () {
  it('should validate noUnderscores', function () {
    var path = 'test/fixtures/no-underscores.css';
    var Recess = new RECESS.Constructor();
    var validate = RECESS.Constructor.prototype.validate;
    var lines = [8, 5, 6];

    RECESS.Constructor.prototype.validate = noop;

    Recess.data = fs.readFileSync(path, 'utf8');
    Recess.parse();

    Recess.definitions.forEach(function (def) {
      RECESS.Constructor.RULES.noUnderscores(def, Recess.data);
      expect(def.errors).to.be.ok;

      expect(def.errors.length).to.equal(1);
      expect(def.errors[0].type).to.equal('noUnderscores');
      expect(def.errors[0].line).to.equal(lines.shift());
    });

    RECESS.Constructor.prototype.validate = validate;
  });
});
