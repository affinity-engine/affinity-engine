import Ember from 'ember';
import layout from '../templates/components/affinity-engine-animation-box-wrapper';

const {
  Component,
  K,
  computed,
  get,
  getProperties,
  isPresent,
  run,
  set
} = Ember;

const { RSVP: { Promise } } = Ember;

export default Component.extend({
  layout,
  tagName: '',

  classNames: '',
  externalAction: K,
  transitions: computed(() => Ember.A()),

  init(...args) {
    this._super(...args);

    const transitionIn = get(this, 'transitionIn');

    if (isPresent(transitionIn)) {
      get(this, 'transitions').unshiftObject(transitionIn);
    }
  },

  didReceiveAttrs(...args) {
    this._super(...args);

    const {
      willTransitionOut,
      hasInitiatedTransitionOut
    } = getProperties(this, 'willTransitionOut', 'hasInitiatedTransitionOut');

    if (willTransitionOut && !hasInitiatedTransitionOut) {
      this._queueTransitionOut();
    }
  },

  _queueTransitionOut() {
    const transitionOut = get(this, 'transitionOut');

    if (isPresent(transitionOut)) {
      set(this, 'hasInitiatedTransitionOut', true);

      new Promise((resolve) => {
        run(() => {
          set(this, '_resolveTransitionOut', resolve);
          get(this, 'transitions').pushObject(transitionOut);
        });
      }).then(() => {
        run(() => {
          const didTransitionOut = this.attrs.didTransitionOut;

          if (isPresent(didTransitionOut)) {
            didTransitionOut();
          }
        });
      });
    }
  },

  actions: {
    didCompleteQueue(...args) {
      const _resolveTransitionOut = get(this, '_resolveTransitionOut');
      const didCompleteQueue = this.attrs.didCompleteQueue;

      if (isPresent(_resolveTransitionOut)) {
        _resolveTransitionOut(...args);
      } else if (isPresent(didCompleteQueue)) {
        didCompleteQueue(...args);
      }
    }
  }
});
