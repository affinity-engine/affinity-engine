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

  config: multiton('affinity-engine/config', 'theaterId'),

  maxAutosaves: configurable(configurationTiers, 'maxAutosaves'),

  setupEvents: on('init', function() {
    const theaterId = get(this, 'theaterId');

    this.on(`et:${theaterId}:writingAutosave`, this, this.writeAutosave);
  }),

  autosaves: computed({
    get() {
      const theaterId = get(this, 'theaterId');

      return get(this, 'store').query('affinity-engine/local-save', {
        theaterId,
        isAutosave: true
      });
    }
  }).readOnly().volatile(),

  writeAutosave() {
    get(this, 'autosaves').then((autosaves) => {
      run(() => {
        const theaterId = get(this, 'theaterId');

        if (get(this, 'maxAutosaves') > get(autosaves, 'length')) {
          this.publish(`et:${theaterId}:saveIsCreating`, '', { isAutosave: true });
        } else {
          const autosave = autosaves.sortBy('updated').get('firstObject');

          this.publish(`et:${theaterId}:saveIsUpdating`, autosave);
        }
      });
    });
  }
});
