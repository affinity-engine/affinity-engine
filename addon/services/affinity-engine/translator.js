import Ember from 'ember';

const {
  Service,
  K
} = Ember;

export default Service.extend({
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
