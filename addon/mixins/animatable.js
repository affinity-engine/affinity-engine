import Ember from 'ember';
import AnimatableCore from './animatable-core';
import { AnimatableMixin } from 'ember-animation-box';

export default Ember.Mixin.create(AnimatableMixin, AnimatableCore, {
  didCompleteQueue(...args) {
    this._didCompleteQueue(...args);
  }
});
