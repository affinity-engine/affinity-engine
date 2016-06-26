import { MultitonService } from 'ember-multiton-service';
import { MultitonIdsMixin } from 'affinity-engine';

export default MultitonService.extend(MultitonIdsMixin, {
  isFocused: null
});
