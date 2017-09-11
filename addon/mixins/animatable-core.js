import Ember from 'ember';

const {
  Mixin,
  computed,
  get,
  getProperties,
  isPresent,
  observer,
  run,
  set
} = Ember;

const { RSVP: { Promise } } = Ember;

export default Mixin.create({
  transitions: computed(() => Ember.A()),

  init(...args) {
    this._super(...args);

    const transitionIn = get(this, 'transitionIn');

    if (isPresent(transitionIn)) {
      get(this, 'transitions').unshiftObject(transitionIn);
    }
  },

  _initiateTransitionOut: observer('willTransitionOut', function() {
    const {
      willTransitionOut,
      hasInitiatedTransitionOut
    } = getProperties(this, 'willTransitionOut', 'hasInitiatedTransitionOut');

    if (willTransitionOut && !hasInitiatedTransitionOut) {
      this._queueTransitionOut();
    }
  }),

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
          if (isPresent(this.attrs.didTransitionOut)) {
            this.attrs.didTransitionOut();
          } else if (isPresent(this.didTransitionOut)) {
            this.didTransitionOut();
          }
        });
      });
    }
  },

  _didCompleteQueue(...args) {
    const _resolveTransitionOut = get(this, '_resolveTransitionOut');

    if (isPresent(_resolveTransitionOut)) {
      _resolveTransitionOut(...args);
    } else if (isPresent(this.attrs.didCompleteQueue)) {
      this.attrs.didCompleteQueue(...args);
    }
  },

  actions: {
    didCompleteQueue(...args) {
      this._didCompleteQueue(...args);
    }
  }
});
