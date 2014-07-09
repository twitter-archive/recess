var expect = require('chai').expect;
var RECESS = require('../');


var fs     = require('fs');
var util   = require('util');
var assert = require('assert');
var chalk  = require('chalk');
var _      = require('lodash');

var noop = function () {};

xdescribe('VALIDATIONS.dataUri:', function () {
  it('image should be embedded', function () {
    var path = 'test/fixtures/data-uri.less';
    var Recess = new RECESS.Constructor();
    var validate = RECESS.Constructor.prototype.validate;

    RECESS.Constructor.prototype.validate = noop;

    Recess.data = fs.readFileSync(path, 'utf8');
    Recess.parse();

    Recess.definitions.forEach(function (def) {
      RECESS.Constructor.RULES.dataUri(def, Recess.data);
      expect(def.errors).to.be.ok;
      expect(typeof def.errors).to.be.an('undefined');
      expect(def.errors.length).to.equal(1);
      expect(def.errors[0].type).to.equal('dataUri');
      expect(def.errors[0].line).to.equal(lines.shift());
    });
  });
});

