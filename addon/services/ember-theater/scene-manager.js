import Ember from 'ember';

const {
  get,
  isEmpty,
  isPresent,
  Service,
  set
} = Ember;

const { inject: { service } } = Ember;

export default Service.extend({
  config: service('ember-theater/config'),
  saveStateManager: service('ember-theater/save-state-manager'),
  sceneRecorder: service('ember-theater/scene-recorder'),

  resetScene() {
    const id = get(this, 'config.initial.sceneId');

    this.toScene(id);
  },

  liftCurtains: async function() {
    if (isEmpty(this.get('scene'))) {
      const options = { autosave: false };
      const autosave = await this.get('saveStateManager.autosave');
      let sceneId = autosave.get('activeState.sceneId');

      if (isEmpty(sceneId)) {
        sceneId = get(this, 'config.initial.sceneId');
        options.autosave = true;
      }

      this.toScene(sceneId, options);
    }
  },

  toScene: async function(sceneId, options = {}) {
    const oldScene = this.get('scene');

    if (isPresent(oldScene)) { oldScene.abort(); }

    const saveStateManager = this.get('saveStateManager');

    const sceneFactory = this.get('container').lookupFactory(`scene:${sceneId}`);
    const scene = sceneFactory.create({
      id: sceneId,
      options
    });

    const isLoading = get(options, 'loading');

    set(this, 'isLoading', isLoading);
    get(this, 'sceneRecorder').resetIndex();

    if (!isLoading) {
      saveStateManager.clearSceneRecord();
    }

    if (get(options, 'autosave') !== false) {
      const autosave = await saveStateManager.get('autosave');

      saveStateManager.appendActiveState({
        sceneId,
        sceneName: get(scene, 'name') || sceneId
      });
      saveStateManager.updateRecord(autosave);
    }

    this.set('scene', scene);
  }
});
