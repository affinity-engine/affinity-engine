import Ember from 'ember';

const {
  Service,
  computed
} = Ember;

export default Service.extend({
  isFocused: false,
  stack: computed(() => Ember.A())
});
