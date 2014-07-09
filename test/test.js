var expect = require('chai').expect;
var RECESS = require('../');


var fs     = require('fs');
var util   = require('util');
var assert = require('assert');
var chalk  = require('chalk');
var _      = require('lodash');

var noop = function () {};



// Keep order of input paths
describe('VALIDATIONS.noUniversalSelectors:', function () {
  it('should validate noUniversalSelectors', function () {

    RECESS([
      'test/fixtures/blog.css',
      'test/fixtures/inline-images.css'
    ], function (err, instance) {
      expect(instance[0].path).to.equal('test/fixtures/blog.css');
    });

  });
});