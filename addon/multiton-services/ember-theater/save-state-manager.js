import Ember from 'ember';
import { MultitonService } from 'ember-multiton-service';
import { MultitonIdsMixin, configurable, nativeCopy } from 'ember-theater';
import { BusSubscriberMixin } from 'ember-message-bus';
import multiton from 'ember-multiton-service';

const {
  computed,
  get,
  getProperties,
  merge,
  on,
  run,
  set,
  setProperties
} = Ember;

const { RSVP: { Promise } } = Ember;
const { inject: { service } } = Ember;

const configurationTiers = [
  'config.attrs.saveStateManager',
  'config.attrs.globals'
];

export default MultitonService.extend(BusSubscriberMixin, MultitonIdsMixin, {
  version: '1.1.0',

  store: service(),

  config: multiton('ember-theater/config', 'theaterId'),

  maxStatePoints: configurable(configurationTiers, 'maxStatePoints'),

  activeState: computed(() => Ember.Object.create()),
  statePoints: computed(() => Ember.A()),

  setupEventListenerss: on('init', function() {
    const theaterId = get(this, 'theaterId');

    this.on(`et:${theaterId}:saveIsCreating`, this, this.createRecord);
    this.on(`et:${theaterId}:saveIsUpdating`, this, this.updateRecord);
    this.on(`et:${theaterId}:saveIsDestroying`, this, this.deleteRecord);
    this.on(`et:${theaterId}:appendingActiveState`, this, this.appendActiveState);
    this.on(`et:${theaterId}:gameIsRewinding`, this, this.loadStatePoint);
    this.on(`et:${theaterId}:gameIsResetting`, this, this.resetActiveState);
    this.on(`et:${theaterId}:settingStateValue`, this, this.setStateValue);
    this.on(`et:${theaterId}:decrementingStateValue`, this, this.decrementStateValue);
    this.on(`et:${theaterId}:incrementingStateValue`, this, this.incrementStateValue);
    this.on(`et:${theaterId}:togglingStateValue`, this, this.toggleStateValue);
    this.on(`et:${theaterId}:deletingStateValue`, this, this.deleteStateValue);
  }),

  mostRecentSave: computed({
    get() {
      return new Promise((resolve) => {
        get(this, 'saves').then((saves) => {
          run(() => {
            resolve(saves.sortBy('updated').reverseObjects().get('firstObject'));
          });
        });
      });
    }
  }).volatile(),

  saves: computed({
    get() {
      const theaterId = get(this, 'theaterId');

      return get(this, 'store').query('ember-theater/local-save', {
        theaterId
      });
    }
  }).readOnly().volatile(),

  // RECORD MANAGEMENT //
  createRecord(name, options) {
    const theaterId = get(this, 'theaterId');
    const version = get(this, 'version');
    const statePoints = this._getCurrentStatePoints();

    const record = get(this, 'store').createRecord('ember-theater/local-save', {
      name,
      statePoints,
      theaterId,
      version,
      ...options
    });

    return new Promise((resolve) => {
      record.save().then((save) => {
        run(() => {
          resolve(save);
        });
      });
    });
  },

  updateRecord(record, options) {
    const theaterId = get(this, 'theaterId');
    const version = get(this, 'version');
    const statePoints = this._getCurrentStatePoints();

    setProperties(record, {
      statePoints,
      theaterId,
      version,
      ...options
    });

    return new Promise((resolve) => {
      record.save().then((save) => {
        run(() => {
          resolve(save);
        });
      });
    });
  },

  _getCurrentStatePoints() {
    const statePoints = nativeCopy(get(this, 'statePoints'));
    const activeState = nativeCopy(get(this, 'activeState'));

    merge(statePoints[statePoints.length - 1], activeState);

    return statePoints;
  },

  deleteRecord(record) {
    return new Promise((resolve) => {
      record.destroyRecord().then((save) => {
        run(() => {
          resolve(save);
        });
      });
    });
  },

  loadRecord(record) {
    record.reload();

    const {
      activeState,
      statePoints
    } = getProperties(record, 'activeState', 'statePoints');

    setProperties(this, {
      activeState: nativeCopy(activeState),
      statePoints: Ember.A(nativeCopy(statePoints))
    });
  },

  // STATE MANAGEMENT //
  resetActiveState() {
    setProperties(this, {
      activeState: {},
      statePoints: Ember.A()
    });
  },

  appendActiveState(optionalValues) {
    const maxStatePoints = get(this, 'maxStatePoints');
    const statePoints = get(this, 'statePoints');
    const activeState = nativeCopy(get(this, 'activeState'));
    const mergedState = merge(activeState, optionalValues);

    statePoints.pushObject(mergedState);
    set(this, 'activeState', activeState);

    while (statePoints.length > maxStatePoints) {
      statePoints.shiftObject();
    }
  },

  loadStatePoint(statePoints) {
    const activeState = get(statePoints, 'lastObject');

    setProperties(this, { activeState, statePoints });
  },

  getStateValue(key) {
    return get(this, `activeState.${key}`);
  },

  setStateValue(key, value) {
    return set(this, `activeState.${key}`, value);
  },

  decrementStateValue(key, amount) {
    return this.decrementProperty(`activeState.${key}`, amount);
  },

  incrementStateValue(key, amount) {
    return this.incrementProperty(`activeState.${key}`, amount);
  },

  toggleStateValue(key) {
    return this.toggleProperty(`activeState.${key}`);
  },

  deleteStateValue(key) {
    return this.setStateValue(key, undefined);
  }
});
