import Ember from 'ember';
import layout from '../templates/components/ember-theater-stage-actor';
import TheaterStage from './ember-theater-stage';
import WindowResizeMixin from '../mixins/window-resize';

const { Component, observer, on, run } = Ember;

export default Component.extend(WindowResizeMixin, {
  layout: layout,
  classNames: ['ember-theater-stage__character'],
  portraits: Ember.A([]),

  associateCharacterWithComponent: on('init', function() {
    this.set('character.component', this);
  }),

  handleWindowResize: on('windowResize', function() {
    this.adjustStageSize();
    this.adjustImageSizes();
  }),

  adjustStageSize: on('didInsertElement', function() {
    const stage = this.nearestOfType(TheaterStage).$();
    this.set('stageWidth', stage.width());
    this.set('stageHeight', stage.height());
  }),

  adjustImageSizes() {
    const height = this.get('character.height');
    const stageHeight = this.get('stageHeight');
    const largestWidth = this.determineWidth(height * stageHeight / 100);
    this.$().width(largestWidth).css('left', largestWidth - (largestWidth * 1.5));
  },

  // Uses JQuery `each`, which changes `this` to the current element. Therefore, no fat arrow.
  determineWidth(height) {
    let largestWidth = 0;
    this.$('.ember-theater-stage__portrait').each(function() {
      const $img = Ember.$(this);
      const ratio = height / $img.prop('naturalHeight');
      const width = $img.prop('naturalWidth') * ratio;
      if (width > largestWidth) { largestWidth = width; }
      $img.width(width);
    });
    return largestWidth;
  },

  addInitialPortrait: on('didInsertElement', function() {
    const src = this.get('character.defaultPortrait.src');
    const height = this.get('character.height');
    this.$().height(`${height}vh`);
    this.get('portraits').pushObject(src);
    run.later(() => {
      this.adjustImageSizes();
    });
  }),

  activateImage() {
    return Ember.$.Velocity.animate(this.$('.ember-theater-stage__portrait').first(), {
      opacity: 100
    }, 0);
  },

  actions: {

    changePortrait(imagePath, options) {
      const portraits = this.get('portraits');
      this.$('.ember-theater-stage__portrait').each(function() {
        Ember.$.Velocity.animate(Ember.$(this), { opacity: 0 }, options).then(() => {
          portraits.shiftObject();
        });
      });

      portraits.addObject(imagePath);
      Ember.run.later(this, function() {
        this.$('.ember-theater-stage__portrait').last().velocity('fadeIn', options);
      });
    }

  }
});
