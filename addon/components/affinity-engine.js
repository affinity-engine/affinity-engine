import Ember from 'ember';
import layout from '../templates/components/affinity-engine';
import multiton from 'ember-multiton-service';

const {
  Component,
  get,
  isNone,
  isPresent,
  on,
  set
} = Ember;

const { computed: { alias } } = Ember;
const { inject: { service } } = Ember;
const { run: { debounce } } = Ember;

const focusDebounceDuration = 100;

export default Component.extend({
  layout,

  hook: 'affinity_engine',

  'aria-live': 'polite',
  ariaRole: 'region',
  attributeBindings: ['aria-live', 'tabIndex'],
  classNames: ['affinity-engine'],
  tabIndex: 0,

  multitonManager: service('multiton-service-manager'),
  configService: multiton('affinity-engine/config', 'engineId'),
  producer: multiton('affinity-engine/producer', 'engineId'),
  fixtureStore: multiton('affinity-engine/fixture-store', 'engineId'),

  isFocused: alias('producer.isFocused'),

  init() {
    this._ensureEngineId();
    get(this, 'configService').initializeConfig(get(this, 'config'));
    this._loadfixtures();

    this._super();
  },

  _ensureEngineId() {
    if (isNone(get(this, 'engineId'))) {
      set(this, 'engineId', 'affinity-engine-default');
    }
  },

  _loadfixtures() {
    const fixtureStore = get(this, 'fixtureStore');
    const fixtureMap = get(this, 'fixtures');

    if (isPresent(fixtureMap)) {
      const fixtureKeys = Object.keys(fixtureMap);

      fixtureKeys.forEach((key) => {
        fixtureStore.add(key, fixtureMap[key]);
      });
    }
  },

  destroyMultitons: on('willDestroyElement', function() {
    const engineId = get(this, 'engineId');

    get(this, 'multitonManager').removeServices(engineId);
  }),

  claimFocus: on('focusIn', function() {
    debounce(this, () => set(this, 'isFocused', true), focusDebounceDuration);
  }),

  relinquishFocus: on('focusOut', function() {
    debounce(this, () => set(this, 'isFocused', false), focusDebounceDuration);
  }),

  actions: {
    completePreload() {
      set(this, 'isLoaded', true);
    }
  }
});
