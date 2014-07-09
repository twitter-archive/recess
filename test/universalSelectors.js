var expect = require('chai').expect;
var RECESS = require('../');


var fs     = require('fs');
var util   = require('util');
var assert = require('assert');
var chalk  = require('chalk');
var _      = require('lodash');

var noop = function () {};

describe('VALIDATIONS.noUniversalSelectors:', function () {
  it('should validate noUniversalSelectors', function () {
    var path = 'test/fixtures/universal-selectors.css';
    var Recess = new RECESS.Constructor();
    var validate = RECESS.Constructor.prototype.validate;
    var counts = [1, 3, 1 ];
    var lines = [13, 5, 6, 7, 11];

    RECESS.Constructor.prototype.validate = noop;

    Recess.data = fs.readFileSync(path, 'utf8');
    Recess.parse();

    Recess.definitions.forEach(function (def) {
      RECESS.Constructor.RULES.noUniversalSelectors(def, Recess.data);
      expect(def.errors).to.be.ok;
      expect(def.errors.length).to.equal(counts.shift()); // 'Correct error count found');
      def.errors.forEach(function (error) {
        expect(error.type).to.equal('noUniversalSelectors');
        expect(error.line).to.equal(lines.shift()); // 'Correct line number reported');
      });
    });

    RECESS.Constructor.prototype.validate = validate;
  });
});

