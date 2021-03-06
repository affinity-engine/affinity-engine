import Ember from 'ember';
import multiton from 'ember-multiton-service';

const {
  Service,
  computed,
  get,
  getOwner,
  getProperties,
  set
} = Ember;

export default Service.extend({
  config: multiton('affinity-engine/config', 'engineId'),

  registrantMap: computed(() => Ember.Object.create()),

  register(name) {
    const path = get(this, `config.attrs.registrant.${name.replace('/', '.')}.path`) || `service:${name}`;

    const { engineId, registrantMap } = getProperties(this, 'engineId', 'registrantMap');
    const container = getOwner(this);
    const instance = container.factoryFor(path).create({ engineId });

    return set(registrantMap, name, instance);
  },

  lookup(name) {
    return get(this, `registrantMap.${name}`);
  }
});
