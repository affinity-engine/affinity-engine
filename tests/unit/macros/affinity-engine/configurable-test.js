import Ember from 'ember';
import { configurable, classNamesConfigurable } from 'affinity-engine';
import { module, test } from 'qunit';

module('Unit | Macro | affinity-engine configurable');

const ConfigurableObject = Ember.Object.extend({
  config: {
    attrs: {
      foo: {
        nested: {
          attrs: {
            string: 'nested value'
          }
        }
      },
      bar: {
        attrs: {
          string: 'flat value'
        }
      },
      baz: {
        attrs: {}
      }
    }
  }
});

test('`configurable` returns the value for the first non-empty key', function(assert) {
  assert.expect(1);

  const configurableObject = ConfigurableObject.extend({
    stringValue: configurable(['foo', 'bar', 'baz'], 'string')
  }).create();

  assert.equal(configurableObject.get('stringValue'), 'flat value', 'string is correct');
});

test('`configurable` handles nested values', function(assert) {
  assert.expect(1);

  const configurableObject = ConfigurableObject.extend({
    stringValue: configurable(['foo.nested', 'bar', 'baz'], 'string')
  }).create();

  assert.equal(configurableObject.get('stringValue'), 'nested value', 'string is correct');
});

const ConfigurableClassNamesObject = Ember.Object.extend({
  config: {
    attrs: {
      none: {
        attrs: {}
      },
      string: {
        attrs: {
          classNames: 'string1'
        }
      },
      array: {
        attrs: {
          classNames: ['array1', 'array2']
        }
      },
      objectA: {
        attrs: {
          classNames: {
            1: ['objectA1'],
            2: ['objectA2', 'objectA3']
          }
        }
      },
      objectB: {
        attrs: {
          classNames: Ember.Object.create({
            1: 'objectB1',
            4: 'objectB4',
            5: undefined
          })
        }
      }
    }
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
