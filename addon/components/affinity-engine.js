import Ember from 'ember';
import layout from '../templates/components/affinity-engine';
import { task, timeout } from 'ember-concurrency';
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
  tabIndex: 0,

  multitonManager: service('multiton-service-manager'),
  configService: multiton('affinity-engine/config', 'engineId'),
  fixtureStore: multiton('affinity-engine/fixture-store', 'engineId'),
  focusManager: multiton('affinity-engine/focus-manager', 'engineId'),

  isFocused: alias('focusManager.isFocused'),

  init(...args) {
    this._super(...args);

    this._ensureEngineId();
    get(this, 'configService').initializeConfig(get(this, 'config'));
    this._loadfixtures();
  },

  willDestroyElement(...args) {
    this._super(...args);

    const engineId = get(this, 'engineId');

    get(this, 'multitonManager').removeServices([{ engineId }]);
  },

  focusIn(...args) {
    this._super(...args);

    get(this, '_debouncingFocusTask').perform(true);
  },

  focusOut(...args) {
    this._super(...args);

    get(this, '_debouncingFocusTask').perform(false);
  },

  _debouncingFocusTask: task(function * (value) {
    yield timeout(100);

    set(this, 'isFocused', value);
  }).restartable(),

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

  actions: {
    completePreload() {
      set(this, 'isLoaded', true);
    }
  }
});
