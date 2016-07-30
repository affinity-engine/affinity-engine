import Ember from 'ember';
import { BusPublisherMixin, BusSubscriberMixin } from 'ember-message-bus';
import { deepMerge, gatherTypes, registrant } from 'affinity-engine';

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

export default Service.extend(BusPublisherMixin, BusSubscriberMixin, {
  attrs: computed(() => Ember.Object.create()),

  saveStateManager: registrant('affinity-engine/save-state-manager'),

  init() {
    const engineId = get(this, 'engineId');

    this.on(`ae:${engineId}:shouldResetEngine`, this, this.resetConfig);

    this._super();
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

    const saveStateManager = get(this, 'saveStateManager');
    const savedConfig = saveStateManager.getStateValue('_config') || {};
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
    const engineId = get(this, 'engineId');

    set(_config, key, value);

    this.publish(`ae:${engineId}:shouldSetStateValue`, '_config', _config);

    return set(this, key, value);
  },

  _getSavedConfig(key) {
    const saveStateManager = get(this, 'saveStateManager');
    const _config = get(saveStateManager, '_config') || {};

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
