import Ember from 'ember';
import { MultitonService } from 'ember-multiton-service';
import { MultitonIdsMixin, configurable } from 'affinity-engine';
import { BusPublisherMixin, BusSubscriberMixin } from 'ember-message-bus';
import multiton from 'ember-multiton-service';

const {
  computed,
  get,
  on,
  run
} = Ember;

const { inject: { service } } = Ember;

const configurationTiers = [
  'config.attrs.autosaveManager',
  'config.attrs.saveStateManager',
  'config.attrs.globals'
];

export default MultitonService.extend(BusPublisherMixin, BusSubscriberMixin, MultitonIdsMixin, {
  store: service(),

  config: multiton('affinity-engine/config', 'engineId'),

  maxAutosaves: configurable(configurationTiers, 'maxAutosaves'),

  setupEvents: on('init', function() {
    const engineId = get(this, 'engineId');

    this.on(`et:${engineId}:writingAutosave`, this, this.writeAutosave);
  }),

  autosaves: computed({
    get() {
      const engineId = get(this, 'engineId');

      return get(this, 'store').query('affinity-engine/local-save', {
        engineId,
        isAutosave: true
      });
    }
  }).readOnly().volatile(),

  writeAutosave() {
    get(this, 'autosaves').then((autosaves) => {
      run(() => {
        const engineId = get(this, 'engineId');

        if (get(this, 'maxAutosaves') > get(autosaves, 'length')) {
          this.publish(`et:${engineId}:saveIsCreating`, '', { isAutosave: true });
        } else {
          const autosave = autosaves.sortBy('updated').get('firstObject');

          this.publish(`et:${engineId}:saveIsUpdating`, autosave);
        }
      });
    });
  }
});
