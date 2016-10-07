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
  reads
} = computed;

const { run: { next } } = Ember;

export default Mixin.create({
  focusManager: multiton('affinity-engine/focus-manager', 'engineId'),

  engineIsFocused: reads('focusManager.isFocused'),
  isFocused: and('engineIsFocused', 'isTopOfStack'),

  init(...args) {
    this._super(...args);

    const stack = get(this, 'focusManager.stack');

    next(() => stack.unshiftObject(set(this, 'guid', guidFor(this))));
  },

  willDestroyElement(...args) {
    this._super(...args);

    const stack = get(this, 'focusManager.stack');

    next(() => stack.removeObject(get(this, 'guid')));
  },

  isTopOfStack: computed({
    get() {
      return get(this, 'focusManager.stack.firstObject') === get(this, 'guid');
    }
  })
});
