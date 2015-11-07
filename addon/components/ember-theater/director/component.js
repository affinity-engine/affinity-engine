import Ember from 'ember';
import { Layer } from 'ember-theater';
import layout from './template';
import animate from 'ember-theater/utils/animate';

const {
  Component,
  computed,
  inject,
  isBlank,
  isPresent,
  observer,
  on
} = Ember;

const { alias } = computed;

export default Component.extend({
  classNames: ['et-director'],
  layout: layout,
  emberTheaterLayerManager: inject.service(),
  emberTheaterSceneManager: inject.service(),
  emberTheaterStageManager: inject.service(),
  directions: alias('emberTheaterStageManager.directions'),

  _sceneChanged: observer('emberTheaterSceneManager.scene', function() {
    const scene = this.get('emberTheaterSceneManager.scene');

    if (isPresent(scene)) {
      animate(this.element, { opacity: 0 }, { duration: 1000 }).then(()=> {
        this.get('emberTheaterStageManager').clearDirections();
        this.get('emberTheaterLayerManager').clearFilters();
        animate(this.element, { opacity: 1 }, { duration: 0 });
        scene.script();
      });
    }
  }),

  _liftCurtains: on('didInsertElement', function() {
    this.get('emberTheaterSceneManager').liftCurtains();
  })
});
