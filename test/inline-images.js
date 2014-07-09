var expect = require('chai').expect;
var RECESS = require('../');


var fs     = require('fs');
var util   = require('util');
var assert = require('assert');
var chalk  = require('chalk');
var _      = require('lodash');

var noop = function () {};


xdescribe('inlineImages:', function () {
  it('should inline images', function () {
    var path = 'test/fixtures/inline-images.css';
    var Recess = new RECESS.Constructor();
    var validate = RECESS.Constructor.prototype.validate;
    var counts = [1, 1, 1, 0];
    var lines = [2, 5, 8];

    RECESS.Constructor.prototype.validate = noop;

    Recess.data = fs.readFileSync(path, 'utf8');
    Recess.parse();

    Recess.definitions.forEach(function (def) {
      RECESS.Constructor.RULES.inlineImages(def, Recess.data);
      if (counts[0]) {
        expect(def.errors).to.be.ok;

        // 'Correct error count found'
        expect(def.errors.length).to.equal(counts.shift());
        def.errors.forEach(function (error) {
          expect(def.errors[0].type).to.equal('inlineImages');

          // 'Correct line number reported'
          expect(error.line).to.equal(lines.shift());
        });
      } else {
        expect(!def.errors).to.be.ok;
      }
    });

    RECESS.Constructor.prototype.validate = validate;
  });
});
