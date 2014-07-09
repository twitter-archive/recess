var expect = require('chai').expect;
var RECESS = require('../');


var fs     = require('fs');
var util   = require('util');
var assert = require('assert');
var chalk  = require('chalk');
var _      = require('lodash');

var noop = function () {};

describe('logging:', function () {
  var log = console.log;
  var loggedStr;
  var withOutCompile;
  var withCompile;

  beforeEach(function(){
    console.log = function (string) {
      loggedStr = string;
    };
    withOutCompile = new RECESS.Constructor(null, {
      cli: true
    });
    withOutCompile.log('first');
  });

  afterEach(function(){
    // revert
    console.log = log;
  });

  it('console.log was not called when compile was true', function (done) {
    expect(loggedStr).to.equal('first');
    done();
  });

  it('console.log was not called when compile was true', function (done) {
    withCompile = new RECESS.Constructor(false, {
      compile: true,
      cli: true
    });
    withCompile.log('second');
    expect(loggedStr).to.equal('first');
    done();
  });

  it('console.log was called when force was was true', function (done) {
    withCompile.log('third', true);
    expect(loggedStr).to.equal('third');
    done();
  });
});

describe('--stripColor: false (default)', function () {
  it('console.log was called with colored string', function (done) {
    var log = console.log;
    var loggedStr;
    var cliInstance;
    console.log = function (string) {
      loggedStr = string;
    };
    cliInstance = new RECESS.Constructor(null, {
      cli: true
    });
    cliInstance.log(chalk.red('hello'));

    // 'console.log was called with colored string'
    expect(loggedStr).to.equal(chalk.red('hello'));

    // revert
    console.log = log;
    done();
  });
});

describe('--stripColor: true', function () {
  it('console.log was called with color stripped string', function (done) {
    var log = console.log;
    var loggedStr;
    var cliInstance;
    console.log = function (string) {
      loggedStr = string;
    };

    cliInstance = new RECESS.Constructor(null, {
      cli: true,
      stripColors: true
    });
    cliInstance.log(chalk.red('hello'));

    expect(loggedStr).to.equal('hello');

    // revert
    console.log = log;
    done();
  });
});