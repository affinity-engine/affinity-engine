import Ember from 'ember';
import multiton from 'ember-multiton-service';

const {
  Mixin,
  computed,
  get,
  guidFor,
  set
} = Ember;

const {
  and,
  equal,
  reads
} = computed;

const { run: { next } } = Ember;

export default Mixin.create({
  focusManager: multiton('affinity-engine/focus-manager', 'engineId'),

  engineIsFocused: reads('focusManager.isFocused'),
  isFocused: and('engineIsFocused', 'isTopOfStack'),
  isTopOfStack: equal('focusManager.stack.firstObject', 'guid'),

  init(...args) {
    this._super(...args);

    const stack = get(this, 'focusManager.stack');

    next(() => stack.unshiftObject(set(this, 'guid', guidFor(this))));
  },

  willDestroyElement(...args) {
    this._super(...args);

    const stack = get(this, 'focusManager.stack');

    next(() => stack.removeObject(get(this, 'guid')));
  }
});
