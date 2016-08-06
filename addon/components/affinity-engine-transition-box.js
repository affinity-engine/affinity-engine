import Ember from 'ember';
import layout from '../templates/components/affinity-engine-transition-box';
import { registrant } from 'affinity-engine';
import { task, timeout } from 'ember-concurrency';

const {
  Component,
  K,
  get,
  getProperties,
  isNone,
  isPresent
} = Ember;

const { RSVP: { resolve } } = Ember;

export default Component.extend({
  layout,
  hook: 'affinity_engine_transition_box',

  resolve: K,
  transitions: [],

  animator: registrant('affinity-engine/animator'),

  _transitionQueue: [],

  didReceiveAttrs(...args) {
    this._super(...args);
    this._queueTransitions();

    get(this, '_mainQueueTask').perform();
  },

  _queueTransitions() {
    const queue = get(this, '_transitionQueue');

    get(this, 'transitions').forEach((transition) => queue.push(transition));

    Reflect.deleteProperty(this, 'transitions');
  },

  _mainQueueTask: task(function * () {
    yield get(this, '_queueTask').perform('main', get(this, '_transitionQueue'));

    get(this, 'resolve')();
  }).keepLatest(),

  _queueTask: task(function * (queueName, queue) {
    while (queue.length > 0) {
      yield this._executeNextTransition(queueName, queue);
    }
  }),

  _executeNextTransition(parentQueueName, queue) {
    const queueName = get(queue[0], 'queue');

    if (queueName === parentQueueName || isNone(queueName)) {
      return this._transitionSwitch(queue.shift());
    } else {
      this._startParallelQueue(queueName, queue);

      return resolve();
    }
  },

  _startParallelQueue(queueName, queue) {
    const exitTransition = queue.find((transition) => get(transition, 'queue') !== queueName);
    const queueLength = isPresent(exitTransition) ? queue.indexOf(exitTransition) : queue.length;

    get(this, '_queueTask').perform(queueName, queue.splice(0, queueLength));
  },

  _transitionSwitch(transition) {
    if (isPresent(get(transition, 'effect'))) {
      return this._animate(transition);
    } else {
      return this._delay(transition);
    }
  },

  _delay(transition) {
    return timeout(get(transition, 'duration'));
  },

  _animate(transition) {
    const element = this.$(get(transition, 'element')).get(0);
    const effect = get(transition, 'effect');
    const options = getProperties(transition, ...Object.keys(transition));

    Reflect.deleteProperty(options, 'queue');
    Reflect.deleteProperty(options, 'element');

    return get(this, 'animator').animate(element, effect, options);
  }
});
