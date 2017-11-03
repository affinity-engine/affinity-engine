import Ember from 'ember';
import layout from '../templates/components/affinity-engine';
import multiton from 'ember-multiton-service';

const {
  Component,
  get,
  isNone,
  isPresent,
  set
} = Ember;

const { computed: { alias } } = Ember;
const { inject: { service } } = Ember;

export default Component.extend({
  layout,

  hook: 'affinity_engine',

  'aria-live': 'polite',
  ariaRole: 'region',
  attributeBindings: ['aria-live', 'tabIndex'],
  classNames: ['affinity-engine'],
  classNameBindings: ['isFocused'],
  tabIndex: 0,

  multitonManager: service('multiton-service-manager'),
  configService: multiton('affinity-engine/config', 'engineId'),
  eBus: multiton('message-bus', 'engineId'),
  fixtureStore: multiton('affinity-engine/fixture-store', 'engineId'),
  focusManager: multiton('affinity-engine/focus-manager', 'engineId'),

  isFocused: alias('focusManager.isFocused'),

  init(...args) {
    this._super(...args);

    this._ensureEngineId();
    get(this, 'configService').initializeConfig(get(this, 'config'));
    get(this, 'eBus').subscribe('readyToRunGame', this, this._readyToRunGame);
    this._loadfixtures();
  },

  willDestroyElement(...args) {
    this._super(...args);

    const engineId = get(this, 'engineId');

    get(this, 'eBus').publish('engineWillBeDestroyed');
    get(this, 'multitonManager').removeServices([{ engineId }]);
  },

  focusIn(...args) {
    this._super(...args);

    set(this, 'isFocused', true);
  },

  focusOut(...args) {
    this._super(...args);

    set(this, 'isFocused', false);
  },

  _ensureEngineId() {
    if (isNone(get(this, 'engineId'))) {
      set(this, 'engineId', 'affinity-engine-default');
    }
  },

  _readyToRunGame() {
    set(this, 'isLoaded', true);
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
  }
});
