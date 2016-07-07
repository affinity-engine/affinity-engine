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

export default Mixin.create({
  focusManager: multiton('affinity-engine/focus-manager', 'engineId'),

  engineIsFocused: reads('focusManager.isFocused'),
  isFocused: and('engineIsFocused', 'isTopOfStack'),

  isTopOfStack: computed('focusManager.stack.lastObject', 'guid', {
    get() {
      return get(this, 'focusManager.stack.lastObject') === get(this, 'guid');
    }
  }),

  init(...args) {
    this._super(...args);

    get(this, 'focusManager.stack').pushObject(set(this, 'guid', guidFor(this)));
  },

  willDestroyElement(...args) {
    this._super(...args);

    get(this, 'focusManager.stack').removeObject(get(this, 'guid'));
  }
});
