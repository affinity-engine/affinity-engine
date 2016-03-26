import Ember from 'ember';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';
import BusSubscriberMixin from 'ember-theater/mixins/ember-theater/bus-subscriber';
import TheaterIdMixin from 'ember-theater/mixins/ember-theater/theater-id';

const {
  get,
  isBlank,
  isPresent,
  on,
  set
} = Ember;

const { computed: { alias } } = Ember;

export default Ember.Object.extend(BusSubscriberMixin, TheaterIdMixin, {
  saveStateManager: multitonService('ember-theater/save-state-manager', 'theaterId'),

  sceneRecord: alias('saveStateManager.activeState._sceneRecord'),

  resetRecord() {
    return set(this, 'sceneRecord', {});
  },

  completeDirection: on('bus:resolveDirection', function(index, value) {
    this._update(index, value);
  }),

  _update(key, value) {
    set(this, `sceneRecord.${key}`, isPresent(value) && !value._isDirection ? value : '_RESOLVED');
  }
});
