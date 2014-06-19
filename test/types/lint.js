var fs     = require('fs');
var util   = require('util');
var assert = require('assert');
var chalk  = require('chalk');
var _      = require('lodash');

var RECESS = require('../../lib');
var noop = function () {};

// LOGGING
!function () {
  var log = console.log;
  var loggedStr;
  var withOutCompile;
  var withCompile;
  console.log = function (string) {
    loggedStr = string;
  };
  withOutCompile = new RECESS.Constructor(null, {
    cli: true
  });
  withOutCompile.log('first');
  assert.equal(loggedStr, 'first', 'console.log was not called when compile was true');
  withCompile = new RECESS.Constructor(false, {
    compile: true,
    cli: true
  });
  withCompile.log('second');
  assert.equal(loggedStr, 'first', 'console.log was not called when compile was true');
  withCompile.log('third', true);
  assert.equal(loggedStr, 'third', 'console.log was called when force was was true');

  // revert
  console.log = log;
}();

// --stripColor
!function () {
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
  assert.equal(loggedStr, chalk.red('hello'), 'console.log was called with colored string');
  cliInstance = new RECESS.Constructor(null, {
    cli: true,
    stripColors: true
  });
  cliInstance.log(chalk.red('hello'));
  assert.equal(loggedStr, 'hello', 'console.log was called with color stripped string');
  console.log = log;
}();


/**
 * VALIDATIONS.strictPropertyOrder
 */

!function () {
  var path = 'test/fixtures/property-order.css';
  var Recess = new RECESS.Constructor();
  var validate = RECESS.Constructor.prototype.validate;

  RECESS.Constructor.prototype.validate = noop;

  Recess.data = fs.readFileSync(path, 'utf8');
  Recess.parse();

  RECESS.Constructor.RULES.strictPropertyOrder(Recess.definitions[0], Recess.data);
  assert.ok(Recess.definitions[0].errors);
  assert.equal(Recess.definitions[0].errors.length, 1, 'one error found');
  assert.equal(Recess.definitions[0].errors[0].type, 'strictPropertyOrder', 'strictPropertyOrder exception raised');
  assert.equal(Recess.definitions[0].errors[0].line, 5, 'Correct line number reported');
  assert.equal(Recess.definitions[0].errors[0].sortedRules.length, Recess.definitions[0].rules.length, 'same rule length in property');
  assert.equal(Recess.definitions[0].errors[0].sortedRules[0].name, 'position', 'Correctly ordered');
  assert.equal(Recess.definitions[0].errors[0].sortedRules[1].name, 'display', 'Correctly ordered');
  assert.equal(Recess.definitions[0].errors[0].sortedRules[2].name, 'font', 'Correctly ordered');
  assert.equal(Recess.definitions[0].errors[0].sortedRules[3].name, 'font-size', 'Correctly ordered');
  assert.equal(Recess.definitions[0].errors[0].sortedRules[4].name, 'color', 'Correctly ordered');
  assert.equal(Recess.definitions[0].errors[0].sortedRules[5].name, 'background', 'Correctly ordered');

  RECESS.Constructor.prototype.validate = validate;
}();


/**
 * VALIDATIONS.strictPropertyOrder
 */

 // VALIDATIONS.noJSPrefix
!function () {
  var path = 'test/fixtures/no-JS.css';
  var Recess = new RECESS.Constructor();
  var validate = RECESS.Constructor.prototype.validate;
  var lines = [7, 8, 16, 16, 21, 21];

  RECESS.Constructor.prototype.validate = noop;

  Recess.data = fs.readFileSync(path, 'utf8');
  Recess.parse();

  Recess.definitions.forEach(function (def) {
    RECESS.Constructor.RULES.noJSPrefix(def, Recess.data);
    assert.ok(def.errors);
    assert.equal(def.errors.length, 2, 'one error found');
    assert.equal(def.errors[0].type, 'noJSPrefix');
    assert.equal(def.errors[0].line, lines.shift(), 'Correct line number reported');
    assert.equal(def.errors[1].type, 'noJSPrefix');
    assert.equal(def.errors[1].line, lines.shift(), 'Correct line number reported');
  });

  RECESS.Constructor.prototype.validate = validate;
}();


/**
 * VALIDATIONS.strictPropertyOrder
 */

!function () {
  var path = 'test/fixtures/no-IDs.css';
  var Recess = new RECESS.Constructor();
  var validate = RECESS.Constructor.prototype.validate;
  var lines = [1, 7, 13];

  RECESS.Constructor.prototype.validate = noop;

  Recess.data = fs.readFileSync(path, 'utf8');
  Recess.parse();

  Recess.definitions.forEach(function (def) {
    RECESS.Constructor.RULES.noIDs(def, Recess.data);
    assert.ok(def.errors);
    assert.equal(def.errors.length, 1, 'one error found');
    assert.equal(def.errors[0].type, 'noIDs');
    assert.equal(def.errors[0].line, lines.shift(), 'Correct line number reported');
  });

  RECESS.Constructor.prototype.validate = validate;
}();


/**
 * VALIDATIONS.strictPropertyOrder
 */

!function () {
  var path = 'test/fixtures/no-underscores.css';
  var Recess = new RECESS.Constructor();
  var validate = RECESS.Constructor.prototype.validate;
  var lines = [1, 6, 6];

  RECESS.Constructor.prototype.validate = noop;

  Recess.data = fs.readFileSync(path, 'utf8');
  Recess.parse();

  Recess.definitions.forEach(function (def) {
    RECESS.Constructor.RULES.noUnderscores(def, Recess.data);
    assert.ok(def.errors);
    assert.equal(def.errors.length, 1, 'one error found');
    assert.equal(def.errors[0].type, 'noUnderscores');
    assert.equal(def.errors[0].line, lines.shift(), 'Correct line number reported');
  });

  RECESS.Constructor.prototype.validate = validate;
}();


/**
 * VALIDATIONS.strictPropertyOrder
 */

!function () {
  var path = 'test/fixtures/universal-selectors.css';
  var Recess = new RECESS.Constructor();
  var validate = RECESS.Constructor.prototype.validate;
  var counts = [1, 3, 1 ];
  var lines = [1, 5, 6, 7, 11];

  RECESS.Constructor.prototype.validate = noop;

  Recess.data = fs.readFileSync(path, 'utf8');
  Recess.parse();

  Recess.definitions.forEach(function (def) {
    RECESS.Constructor.RULES.noUniversalSelectors(def, Recess.data);
    assert.ok(def.errors);
    assert.equal(def.errors.length, counts.shift(), 'Correct error count found');
    def.errors.forEach(function (error) {
      assert.equal(error.type, 'noUniversalSelectors');
      assert.equal(error.line, lines.shift(), 'Correct line number reported');
    });
  });

  RECESS.Constructor.prototype.validate = validate;
}();


/**
 * VALIDATIONS.strictPropertyOrder
 */

!function () {
  var path = 'test/fixtures/no-overqualifying.css';
  var Recess = new RECESS.Constructor();
  var validate = RECESS.Constructor.prototype.validate;
  var counts = [1, 2];
  var lines = [1, 7, 8];

  RECESS.Constructor.prototype.validate = noop;

  Recess.data = fs.readFileSync(path, 'utf8');
  Recess.parse();

  Recess.definitions.forEach(function (def) {
    RECESS.Constructor.RULES.noOverqualifying(def, Recess.data);
    assert.ok(def.errors);
    assert.equal(def.errors.length, counts.shift(), 'Correct error count found');
    def.errors.forEach(function (error) {
      assert.equal(error.type, 'noOverqualifying');
      assert.equal(error.line, lines.shift(), 'Correct line number reported');
    });
  });

  RECESS.Constructor.prototype.validate = validate;
}();


// Cannot read property 'red' of undefined
!function () {
  var Recess = new RECESS.Constructor();
  var validate = RECESS.Constructor.prototype.validate;

  RECESS.Constructor.prototype.validate = noop;

  Recess.data = '.foo { background:green;; }';
  Recess.parse();

  assert.notEqual(Recess.output[0], '\x1b[31mParse error\x1b[39m: Cannot read property \'red\' of undefined on line 1');

  RECESS.Constructor.prototype.validate = validate;
}();


/**
 * VALIDATIONS.strictPropertyOrder
 */

!function () {
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
      assert.ok(def.errors);
      assert.equal(def.errors.length, counts.shift(), 'Correct error count found');
      def.errors.forEach(function (error) {
        assert.equal(def.errors[0].type, 'inlineImages');
        assert.equal(error.line, lines.shift(), 'Correct line number reported');
      });
    } else {
      assert.ok(!def.errors);
    }
  });

  RECESS.Constructor.prototype.validate = validate;
}();


/**
 * VALIDATIONS.strictPropertyOrder
 */

!function () {
  var path = 'test/fixtures/data-uri.less';
  var Recess = new RECESS.Constructor();
  var validate = RECESS.Constructor.prototype.validate;
  var def;

  RECESS.Constructor.prototype.validate = noop;

  Recess.data = fs.readFileSync(path, 'utf8');
  Recess.parse();
  def = Recess.definitions[0];

  RECESS.Constructor.RULES.dataUri(def, Recess.data);
  assert.equal(typeof def.errors, 'undefined');

  RECESS.Constructor.prototype.validate = validate;
}();

// Keep order of input paths
!function () {
  RECESS([
    'test/fixtures/blog.css',
    'test/fixtures/inline-images.css'
  ], function (err, instance) {
    assert(instance[0].path === 'test/fixtures/blog.css');
  });
}();
console.log('\u2713 linting'.green);