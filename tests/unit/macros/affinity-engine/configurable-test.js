import Ember from 'ember';
import { classNamesConfigurable } from 'affinity-engine';
import { module, test } from 'qunit';

module('Unit | Macro | affinity-engine configurable');

const ConfigurableClassNamesObject = Ember.Object.extend({
  none: {
  },
  string: {
    classNames: 'string1'
  },
  array: {
    classNames: ['array1', 'array2']
  },
  objectA: {
    classNames: {
      1: ['objectA1'],
      2: ['objectA2', 'objectA3']
    }
  },
  objectB: {
    classNames: Ember.Object.create({
      1: 'objectB1',
      4: 'objectB4',
      5: undefined
    })
  }
});

test('classNamesConfigurable returns a string when provided a string', function(assert) {
  assert.expect(1);

  const configurableObject = ConfigurableClassNamesObject.extend({
    classNames: classNamesConfigurable(['string', 'array', 'objectA', 'objectB', 'none'], 'classNames')
  }).create();

  assert.equal(configurableObject.get('classNames'), 'string1', 'string is correct');
});

test('classNamesConfigurable returns a string when provided an array', function(assert) {
  assert.expect(1);

  const configurableObject = ConfigurableClassNamesObject.extend({
    classNames: classNamesConfigurable(['array', 'string', 'objectA', 'objectB', 'none'], 'classNames')
  }).create();

  assert.equal(configurableObject.get('classNames'), 'array1 array2', 'string is correct');
});

test('classNamesConfigurable returns a string when provided multiple objects', function(assert) {
  assert.expect(1);

  const configurableObject = ConfigurableClassNamesObject.extend({
    classNames: classNamesConfigurable(['objectA', 'objectB', 'none'], 'classNames')
  }).create();

  assert.equal(configurableObject.get('classNames'), 'objectA1 objectA2 objectA3 objectB4', 'string is correct');
});

test('classNamesConfigurable returns a string when provided undefined', function(assert) {
  assert.expect(1);

  const configurableObject = ConfigurableClassNamesObject.extend({
    classNames: classNamesConfigurable(['none'], 'classNames')
  }).create();

  assert.equal(configurableObject.get('classNames'), '', 'string is correct');
});
