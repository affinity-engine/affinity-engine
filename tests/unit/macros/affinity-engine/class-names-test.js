import Ember from 'ember';
import { classNames } from 'affinity-engine';
import { module, test } from 'qunit';

module('Unit | Macro | affinity-engine classNames');

const ConfigurableClassNamesObject = Ember.Object.extend({
  none: {
  },
  string: {
    classNames: 'string1'
  },
  array: {
    classNames: ['array1', 'array2']
  },
  object: {
    classNames: {
      1: ['objectA1'],
      2: ['objectA2', 'objectA3']
    }
  }
});

test('classNames returns a string when provided a string', function(assert) {
  assert.expect(1);

  const configurableObject = ConfigurableClassNamesObject.extend({
    classNames: classNames('string')
  }).create();

  assert.equal(configurableObject.get('classNames'), 'string1', 'string is correct');
});

test('classNames returns a string when provided an array', function(assert) {
  assert.expect(1);

  const configurableObject = ConfigurableClassNamesObject.extend({
    classNames: classNames('array')
  }).create();

  assert.equal(configurableObject.get('classNames'), 'array1 array2', 'string is correct');
});

test('classNames returns a string when provided an object', function(assert) {
  assert.expect(1);

  const configurableObject = ConfigurableClassNamesObject.extend({
    classNames: classNames('object')
  }).create();

  assert.equal(configurableObject.get('classNames'), 'objectA1 objectA2 objectA3', 'string is correct');
});

test('classNames returns a string when provided undefined', function(assert) {
  assert.expect(1);

  const configurableObject = ConfigurableClassNamesObject.extend({
    classNames: classNames('none')
  }).create();

  assert.equal(configurableObject.get('classNames'), '', 'string is correct');
});
