import Ember from 'ember';
import multiton from 'ember-multiton-service';

const {
  Mixin,
  get,
  guidFor
} = Ember;

const {
  computed: {
    and,
    equal,
    reads
  }
} = Ember;

export default Mixin.create({
  focusManager: multiton('affinity-engine/focus-manager', 'engineId'),

  engineIsFocused: reads('focusManager.isFocused'),
  isTopOfStack: equal('focusManager.focusStack.lastObject._guid', '_guid'),
  isFocused: and('engineIsFocused', 'isTopOfStack'),

  init(...args) {
    this._super(...args);

    guidFor(this);

    get(this, 'focusManager.stack').pushObject(this);
  },

  willDestroyElement(...args) {
    this._super(...args);

    get(this, 'focusManager.stack').removeObject(this);
  }
});
