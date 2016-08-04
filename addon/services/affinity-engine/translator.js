import Ember from 'ember';

const {
  Service,
  K
} = Ember;

export default Service.extend({
  locales: [],
  setLocale: K,

  translate(string) {
    return string;
  }
});
