import Ember from 'ember';
import TheaterIdMixin from 'ember-theater/mixins/ember-theater/theater-id';

const {
  get,
  on,
  set
} = Ember;

export default Ember.Object.extend(TheaterIdMixin, {
  initializeQueue: on('init', function() {
    const queue = new createjs.LoadQueue(true);

    queue.installPlugin(createjs.Sound);
    set(this, 'queue', queue);
  }),

  idFor(fixture, attribute) {
    return `${fixture._type}:${fixture.id}:${attribute}`;
  },

  getElement(id) {
    return get(this, 'queue').getResult(id);
  },

  loadFile(file) {
    get(this, 'queue').loadFile(file);
  },

  onComplete(callback) {
    get(this, 'queue').on('complete', callback);
  },

  onFileLoad(callback) {
    get(this, 'queue').on('fileload', callback);
  },

  onProgress(callback) {
    get(this, 'queue').on('progress', callback);
  }
});
