import Ember from 'ember';
import multiton from 'ember-multiton-service';

const {
  Mixin,
  computed,
  get,
  guidFor,
  isNone,
  set
} = Ember;

const {
  and
} = computed;

const { run: { next } } = Ember;

export default Mixin.create({
  focusManager: multiton('affinity-engine/focus-manager', 'engineId'),

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

  engineIsFocused: computed('focusManager.isFocused', {
    get() {
      if (isNone(get(this, 'engineId'))) { return false; }

      return get(this, 'focusManager.isFocused')
    }
  }),

  isTopOfStack: computed({
    get() {
      return get(this, 'focusManager.stack.firstObject') === get(this, 'guid');
    }
  })
});
