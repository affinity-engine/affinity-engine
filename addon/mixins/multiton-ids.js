import Ember from 'ember';

const {
  Mixin,
  computed,
  get,
  isPresent
} = Ember;

export default Mixin.create({
  engineId: computed('_multitonServiceKeys.[]', {
    get() {
      const keys = get(this, '_multitonServiceKeys');

      return isPresent(keys) ? keys[0] : undefined;
    }
  }),

  windowId: computed('_multitonServiceKeys.[]', {
    get() {
      const keys = get(this, '_multitonServiceKeys');

      return isPresent(keys) ? keys[1] : undefined;
    }
  })
});
