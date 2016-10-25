import Ember from 'ember';
import ResizeAware from 'ember-resize/mixins/resize-aware';

const { Mixin } = Ember;
const { inject: { service } } = Ember;

export default Mixin.create(ResizeAware, {
  resizeService: service('resize')
});
