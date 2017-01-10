import Ember from 'ember';
import { deepMerge, gatherTypes, registrant } from 'affinity-engine';
import multiton from 'ember-multiton-service';

const {
  Service,
  computed,
  get,
  getOwner,
  isEmpty,
  isPresent,
  set,
  setProperties,
  typeOf
} = Ember;

export default Service.extend({
  attrs: computed(() => Ember.Object.create()),

  eBus: multiton('message-bus', 'engineId'),
  dataManager: registrant('affinity-engine/data-manager'),

  init(...args) {
    this._super(...args);

    get(this, 'eBus').subscribe('refreshingFromState', this, this.resetConfig);
  },

  initializeConfig(engineConfig = {}) {
    set(this, 'engineConfig', engineConfig);

    return this.resetConfig();
  },

  resetConfig() {
    const attrs = get(this, 'attrs');
    const engineConfig = get(this, 'engineConfig');
    const configs = get(this, '_configs').sort((a, b) => get(a, 'priority') - get(b, 'priority'));
    const mergedConfig = deepMerge({}, ...configs, engineConfig);

    setProperties(attrs, mergedConfig);

    const dataManager = get(this, 'dataManager');
    const savedConfig = dataManager.get('data._config') || {};
    const savedMergedConfig = deepMerge({}, mergedConfig, savedConfig);

    return setProperties(attrs, savedMergedConfig);
  },

  _configs: computed({
    get() {
      const appInstance = getOwner(this);
      const configNames = gatherTypes(appInstance, 'affinity-engine/config');

      return configNames.map((configName) => {
        return appInstance.lookup(`affinity-engine/config:${configName}`);
      }).filter((config) => isPresent(config) && typeOf(config) === 'object');
    }
  }),

  getProperty(section, key) {
    return get(this, `${section}.${key}`) || get(this, `globals.${key}`);
  },

  setProperty(key, value) {
    const _config = this._getSavedConfig(key);

    set(_config, key, value);
    get(this, 'eBus').publish('shouldSetStateValue', '_config', _config);

    return set(this, key, value);
  },

  _getSavedConfig(key) {
    const dataManager = get(this, 'dataManager');
    const _config = get(dataManager, '_config') || {};

    const segments = key.split('.');

    // ensure full path to the config exists
    segments.forEach((segment, index) => {
      const path = segments.slice(0, index + 1).join('.');

      if (isEmpty(get(_config, path))) {
        set(_config, path, {});
      }
    });

    return _config;
  }
});
