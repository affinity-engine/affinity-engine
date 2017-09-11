import Ember from 'ember';
import layout from '../templates/components/affinity-engine-animation-box-wrapper';
import AnimatableCore from '../mixins/animatable-core';

const {
  Component
} = Ember;

export default Component.extend(AnimatableCore, {
  layout,
  tagName: '',

  classNames: '',
  externalAction() {}
});
