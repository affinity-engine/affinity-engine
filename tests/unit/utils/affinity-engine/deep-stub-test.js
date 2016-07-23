import { deepStub } from 'affinity-engine';
import { module, test } from 'qunit';

module('Unit | Utility | affinity engine/deep stub');

test('it returns an object with the provided path terminated the provided object', function(assert) {
  assert.expect(1);

  const object = { key: 'value' };
  const result = deepStub('foo.bar.baz', object);

  assert.deepEqual(result, {
    foo: {
      bar: {
        baz: object
      }
    }
  }, 'stub is correct');
});
