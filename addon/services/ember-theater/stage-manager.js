import Ember from 'ember';

const {
  Service,
  computed,
  get,
  isBlank,
  merge,
  setProperties
} = Ember;

export default Service.extend({
  directables: computed(() => Ember.A()),

  clearDirectables() {
    get(this, 'directables').clear();
  },

  removeDirectable(directable) {
    get(this, 'directables').removeObject(directable);
    directable.destroy();
  },

  findDirectableWithId(id, type, instanceId) {
    return get(this, 'directables').find((directable) => {
      return get(directable, 'id') === id &&
        get(directable, 'type') === type &&
        get(directable, 'instanceId') === instanceId;
    });
  },

  handleDirectable(id, type, properties, resolve) {
    const instanceId = get(properties, 'options.instance') || 0;
    const directable = this.findDirectableWithId(id, type, instanceId);

    if (isBlank(directable)) {
      this._addNewDirectable(merge(properties, { id, type, resolve, instanceId }));
    } else {
      this._updateDirectable(directable, properties, resolve);
    }
  },

  _addNewDirectable(properties) {
    const Directable = this.container.lookup('directable:main');
    const directable = Directable.create(properties);

    get(this, 'directables').pushObject(directable);
  },

  _updateDirectable(directable, properties, resolve) {
    setProperties(directable, merge(properties, { resolve }));
  }
});
