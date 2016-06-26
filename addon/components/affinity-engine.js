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

  hook: 'ember_theater',

  'aria-live': 'polite',
  ariaRole: 'region',
  attributeBindings: ['aria-live', 'tabIndex'],
  classNames: ['affinity-engine'],
  tabIndex: 0,

  multitonManager: service('multiton-service-manager'),
  configService: multiton('affinity-engine/config', 'theaterId'),
  producer: multiton('affinity-engine/producer', 'theaterId'),
  fixtureStore: multiton('affinity-engine/fixture-store', 'theaterId'),

  isFocused: alias('producer.isFocused'),

  init() {
    this._ensureTheaterId();
    get(this, 'configService').initializeConfig(get(this, 'config'));
    this._loadfixtures();

    this._super();
  },

  _ensureTheaterId() {
    if (isNone(get(this, 'theaterId'))) {
      set(this, 'theaterId', 'affinity-engine-default');
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
    const theaterId = get(this, 'theaterId');

    get(this, 'multitonManager').removeServices(theaterId);
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
