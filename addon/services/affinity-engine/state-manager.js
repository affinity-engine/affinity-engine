import Ember from 'ember';
import { MultitonIdsMixin } from 'affinity-engine';

const { Service } = Ember;

export default Service.extend(MultitonIdsMixin, {
  isFocused: null
});
