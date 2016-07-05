import Ember from 'ember';
import { getMultiton } from 'ember-multiton-service';

const {
  computed,
  get,
  getOwner
} = Ember;

export default function registrant(name) {
  return computed({
    get() {
      const owner = getOwner(this);
      const engineId = get(this, 'engineId');
      const registrar = getMultiton(owner, 'affinity-engine/registrar', [engineId]);

      return registrar.lookup(name) || registrar.register(name);
    }
  });
}
