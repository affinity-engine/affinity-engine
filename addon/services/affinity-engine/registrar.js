import Ember from 'ember';
import { MultitonIdsMixin } from 'affinity-engine';
import multiton from 'ember-multiton-service';

const {
  Service,
  computed,
  get,
  getOwner,
  getProperties,
  set
} = Ember;

export default Service.extend(MultitonIdsMixin, {
  config: multiton('affinity-engine/config', 'engineId'),

  registrantMap: computed(() => Ember.Object.create()),

  register(name) {
    const { engineId, registrantMap } = getProperties(this, 'engineId', 'registrantMap');
    const path = get(this, `config.attrs.${name}.path`);
    const container = getOwner(this);
    const instance = container._lookupFactory(path).create({ engineId });

    return set(registrantMap, name, instance);
  },

  lookup(name) {
    return get(this, `registrantMap.${name}`);
  }
});
