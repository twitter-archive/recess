var expect = require('chai').expect;
var RECESS = require('../');


var fs     = require('fs');
var util   = require('util');
var assert = require('assert');
var chalk  = require('chalk');
var _      = require('lodash');

var noop = function () {};


describe('VALIDATIONS.strictPropertyOrder:', function () {
  var path = 'test/fixtures/property-order.css';
  var Recess = new RECESS.Constructor();
  var validate = RECESS.Constructor.prototype.validate;

  // Setup
  beforeEach(function(){
    RECESS.Constructor.prototype.validate = noop;
    Recess.data = fs.readFileSync(path, 'utf8');
    Recess.parse();
    RECESS.Constructor.RULES.strictPropertyOrder(Recess.definitions[0], Recess.data);
  });

  // Tear down
  afterEach(function(){
    RECESS.Constructor.prototype.validate = validate;
  });

  describe('when exceptions are raised for strictPropertyOrder:', function () {
    it('should retport them', function () {
      expect(Recess.definitions[0].errors).to.be.ok;
      expect(Recess.definitions[0].errors.length).to.equal(1);
    });
    it('strictPropertyOrder exception raised', function () {
      expect(Recess.definitions[0].errors[0].type).to.equal('strictPropertyOrder');
    });
  });

  describe('line numbers:', function () {
    it('should be reported', function () {
      expect(Recess.definitions[0].errors[0].line).to.equal(5);
    });
  });

  describe('properties:', function () {
    it('same rule length in property', function () {
      expect(Recess.definitions[0].errors[0].sortedRules.length).to.equal(Recess.definitions[0].rules.length);
    });
    it('`position` should be correctly ordered', function () {
      expect(Recess.definitions[0].errors[0].sortedRules[0].name).to.equal('position');
    });
    it('`display` should be correctly ordered', function () {
      expect(Recess.definitions[0].errors[0].sortedRules[1].name).to.equal('display');
    });
    it('`font` should be correctly ordered', function () {
      expect(Recess.definitions[0].errors[0].sortedRules[2].name).to.equal('font');
    });
    it('`font` should be correctly ordered', function () {
      expect(Recess.definitions[0].errors[0].sortedRules[3].name).to.equal('font-size');
    });
    it('`color` should be correctly ordered', function () {
      expect(Recess.definitions[0].errors[0].sortedRules[4].name).to.equal('color');
    });
    it('`background` should be correctly ordered', function () {
      expect(Recess.definitions[0].errors[0].sortedRules[5].name).to.equal('background');
    });
  });
});
