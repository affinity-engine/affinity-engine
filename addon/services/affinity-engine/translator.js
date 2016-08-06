import Ember from 'ember';

const {
  Service,
  K
} = Ember;

export default Service.extend({
  isPlaceholder: true,

  locales: [],

  exists() { return false; },
  setLocale: K,

  formatDate(date) {
    return date;
  },

  formatNumber(number) {
    return number;
  },

  translate(string) {
    return string;
  }
});
