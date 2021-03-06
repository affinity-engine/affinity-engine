import Ember from 'ember';

const {
  Service,
  computed,
  get,
  set
} = Ember;

export default Service.extend({
  fixtureMap: computed(() => Ember.Object.create()),

  add(type, fixtures) {
    const collection = this.findAll(type) || this.instantiateCollection(type);

    fixtures.forEach((fixture) => set(fixture, '_type', type));

    return collection.pushObjects(fixtures);
  },

  instantiateCollection(type) {
    return set(this, `fixtureMap.${type}`, Ember.A());
  },

  find(type, id) {
    return this.findAll(type).findBy('id', id);
  },

  findAll(type) {
    return get(this, `fixtureMap.${type}`);
  }
});
