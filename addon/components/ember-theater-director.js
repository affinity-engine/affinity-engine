import Ember from 'ember';
import layout from '../templates/components/ember-theater-director';

const { Component, $, inject, observer } = Ember;

export default Component.extend({
  store: inject.service('store'),
  layout: layout,
  classNames: ['ember-theater__director'],
  backdrops: Ember.A([]),

  _loadScene: observer('scene.script', function() {
    const scene = this.get('scene');
    scene.set('director', this);
    scene.send('next');
  }),

  actions: {
    backdrop(line, resolve) {
      if (!line.sync) { resolve(); }
      const backdrop = this.get('store').peekRecord('ember-theater-backdrop', line.id);
      const backdrops = this.get('backdrops');
      if (line.destroy) { return backdrops.removeObject(backdrop); }
      const backdropIsPresent = backdrops.some((b) => {
        return b.id === backdrop.id;
      });

      if (!backdropIsPresent) {
        backdrops.pushObject(backdrop);
      }

      Ember.run.later(() => {
        const element = backdrop.get('component.element');
        const effect = line.effect ? line.effect : 'transition.fadeIn';
        $.Velocity.animate(element, effect, line.options).then(() => {
          if (line.sync) { resolve(); }
        });
      });
    }
  }
});
