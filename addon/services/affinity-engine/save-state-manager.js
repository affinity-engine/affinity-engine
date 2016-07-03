import Ember from 'ember';

const {
  K,
  Service
} = Ember;

export default Service.extend({
  isPlaceholder: true,

  getStateValue() {
    return {};
  },

  setStateValue: K,
});
