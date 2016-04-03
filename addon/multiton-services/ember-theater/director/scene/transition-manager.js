import Ember from 'ember';
import animate from 'ember-theater/utils/ember-theater/animate';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';
import BusPublisherMixin from 'ember-theater/mixins/ember-theater/bus-publisher';
import MultitonIdsMixin from 'ember-theater/mixins/ember-theater/multiton-ids';

const {
  get,
  getOwner,
  getProperties,
  isPresent,
  typeOf
} = Ember;

const { run: { later } } = Ember;

export default Ember.Object.extend(BusPublisherMixin, MultitonIdsMixin, {
  config: multitonService('ember-theater/config', 'theaterId'),
  autosaveManager: multitonService('ember-theater/autosave-manager', 'theaterId'),
  saveStateManager: multitonService('ember-theater/save-state-manager', 'theaterId'),
  sceneManager: multitonService('ember-theater/director/scene-manager', 'theaterId', 'windowId'),

  toScene(scene, options) {
    const windowId = get(this, 'windowId');
    const query = windowId === 'main' ? '.et-director' : `[data-scene-window-id="${windowId}"] .et-director`;
    const $director = Ember.$(query);
    const duration = get(options, 'transitionOut.duration') || get(this, 'config.attrs.director.scene.transitionOut.duration');
    const effect = get(options, 'transitionOut.effect') || get(this, 'config.attrs.director.scene.transitionOut.effect');

    this.publish(`et:${windowId}:scriptsMustAbort`);

    animate($director, effect, { duration }).then(() => {
      this._transitionScene(scene, options);

      later(() => $director.removeAttr('style'));
    });
  },

  _transitionScene(scene, options) {
    this._clearStage();
    this._setSceneManager(script, options);

    const data = get(this, 'saveStateManager.activeState');
    const script = this._buildScript();
    const { start, sceneId, sceneName } = typeOf(scene) === 'function' ?
      { start: scene } :
      this._buildScene(scene);

    this._updateAutosave(sceneId, sceneName, options);

    start(script, data, get(options, 'window'));
  },

  _buildScene(id) {
    const factory = getOwner(this).lookup(`scene:${id}`);
    const { theaterId, windowId } = getProperties(this, 'theaterId', 'windowId');
    const instance = factory.create({ theaterId, windowId });

    return {
      start: instance.start,
      sceneId: id,
      sceneName: get(instance, 'name')
    }
  },

  _buildScript(options) {
    const sceneManager = get(this, 'sceneManager');
    const factory = getOwner(this).lookup('script:main');
    const { theaterId, windowId } = getProperties(this, 'theaterId', 'windowId');
    const sceneRecord = get(sceneManager, 'sceneRecord');

    return factory.create({ sceneRecord, theaterId, windowId });
  },

  _clearStage() {
    const windowId = get(this, 'windowId');

    this.publish(`et:${windowId}:stageIsClearing`);
  },

  _setSceneManager(script, options) {
    const sceneManager = get(this, 'sceneManager');
    const sceneRecord = get(options, 'sceneRecord');

    sceneManager.setScript(script);
    sceneManager.setSceneRecord(sceneRecord);
  },

  _updateAutosave: async function(sceneId, sceneName, options) {
    if (get(options, 'autosave') === false || get(this, 'config.attrs.director.scene.autosave') === false) { return; }

    this.publish('et:main:recordingSaveData', '_sceneRecord', undefined);

    this.publish('et:main:appendingActiveState', {
      sceneId,
      sceneName
    });

    get(this, 'autosaveManager'); // initialize the autosave-manager

    this.publish('et:main:writeAutosave');
  }
});
