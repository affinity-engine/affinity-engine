import Ember from 'ember';

const {
  Service,
  computed,
  get,
  inject,
  isBlank,
  merge,
  set
} = Ember;

const { RSVP: { Promise } } = Ember;

export default Service.extend({
  sceneRecorder: inject.service('ember-theater/scene-recorder'),

  directables: computed(() => Ember.A()),

  clearDirectables() {
    get(this, 'directables').clear();
  },

  removeDirectable(directable) {
    get(this, 'directables').removeObject(directable);
    directable.destroy();
  },

  findDirectableWithId(id, type) {
    return get(this, 'directables').find((directable) => {
      return get(directable, 'id') === id && get(directable, 'type') === type;
    });
  },

  handleDirection(factory, type, args) {
    const promise = this._handleDirection(factory, type, ...args);

    return this._handlePromiseResolution(promise);
  },

  _handleDirection(factory, type, ...args) {
    const direction = this._instantiateFactory(factory, { type });

    return new Promise((resolve) => {
      direction.perform(resolve, ...args);
    });
  },

  handleDirectable(factory, type, args) {
    const promise = this._handleDirectable(factory, type, args);

    return this._handlePromiseResolution(promise);
  },

  _handleDirectable(factory, type, args) {
    const id = args[0];
    const directable = this.findDirectableWithId(id, type);

    return new Promise((resolve) => {
      if (isBlank(directable)) {
        this._addNewDirectable(factory, type, args, resolve);
      } else {
        this._updateDirectable(directable, args, resolve);
      }
    });
  },

  _addNewDirectable(factory, type, args, resolve) {
    const directable = this._instantiateFactory(factory, { resolve, type });

    directable.parseArgs(...args);
    get(this, 'directables').pushObject(directable);
  },

  _updateDirectable(directable, args, resolve) {
    // typically, `advanceSceneRecord` is called in `_instantiateFactory`, but since the directable
    // is already instantiated, we call it manually here.
    get(this, 'sceneRecorder').advance();

    set(directable, 'resolve', resolve);
    directable.parseArgs(...args);
  },

  _instantiateFactory(factory, additionalProperties = {}) {
    const properties = get(this, 'sceneRecorder').advance();

    merge(properties, additionalProperties);

    return factory.create(properties);
  },

  _handlePromiseResolution(promise) {
    get(this, 'sceneRecorder').recordEvent(promise);

    return promise;
  }
});
