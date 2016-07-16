import Ember from 'ember';

const { Service } = Ember;
const { RSVP: { resolve } } = Ember;

export default Service.extend({
  isPlaceholder: true,

  animate() {
    return resolve();
  }
});
