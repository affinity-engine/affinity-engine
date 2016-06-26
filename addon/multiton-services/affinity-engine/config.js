import Ember from 'ember';
import { MultitonService } from 'ember-multiton-service';
import multiton from 'ember-multiton-service';
import { BusSubscriberMixin } from 'ember-message-bus';
import { MultitonIdsMixin, deepMerge, gatherTypes } from 'affinity-engine';

const {
  computed,
  get,
  getOwner,
  isEmpty,
  isPresent,
  set,
  setProperties
} = Ember;

export default MultitonService.extend(BusSubscriberMixin, MultitonIdsMixin, {
  attrs: computed(() => Ember.Object.create()),

  saveStateManager: multiton('affinity-engine/save-state-manager', 'theaterId'),

  init() {
    const theaterId = get(this, 'theaterId');

    this.on(`et:${theaterId}:reseting`, this, this.resetConfig);

    this._super();
  },

  initializeConfig(theaterConfig = {}) {
    set(this, 'theaterConfig', theaterConfig);

    return this.resetConfig();
  },

  resetConfig() {
    const theaterConfig = get(this, 'theaterConfig');
    const configs = get(this, '_configs').sort((a, b) => get(a, 'priority') - get(b, 'priority'));
    const saveStateManager = get(this, 'saveStateManager');
    const savedConfig = saveStateManager.getStateValue('_config') || {};
    const mergedConfig = deepMerge({}, ...configs, theaterConfig, savedConfig);
    const attrs = get(this, 'attrs');

    return setProperties(attrs, mergedConfig);
  },

  _configs: computed({
    get() {
      const appInstance = getOwner(this);
      const configNames = gatherTypes(appInstance, 'affinity-engine/config');

      return configNames.map((configName) => {
        return appInstance.lookup(`affinity-engine/config:${configName}`);
      }).filter((config) => isPresent(config));
    }
  }),

  getProperty(section, key) {
    return get(this, `${section}.${key}`) || get(this, `globals.${key}`);
  },

  setProperty(key, value) {
    const saveStateManager = get(this, 'saveStateManager');
    const _config = this._getSavedConfig(key);

    set(_config, key, value);
    saveStateManager.setStateValue('_config', _config);

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
