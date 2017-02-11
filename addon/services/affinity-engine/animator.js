import Ember from 'ember';

const { Service } = Ember;
const { RSVP: { resolve } } = Ember;

export default Service.extend({
  isPlaceholder: true,

  animate(element, effect = {}) {
    Ember.$(element).css(effect);

    return resolve();
  }
});
