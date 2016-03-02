import Ember from 'ember';
import layout from './template';
import DirectableComponentMixin from 'ember-theater/mixins/ember-theater/director/directable-component';
import TransitionMixin from 'ember-theater/mixins/ember-theater/director/transition';
import TransitionObserverMixin from 'ember-theater/mixins/ember-theater/director/transition-observer';
import WindowResizeMixin from 'ember-theater/mixins/ember-theater/window-resize';
import configurable, { deepConfigurable } from 'ember-theater/macros/ember-theater/configurable';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';
import { Directable } from 'ember-theater/ember-theater/director';

const {
  Component,
  K,
  computed,
  get,
  isBlank,
  on,
  set
} = Ember;

const { run: { later } } = Ember;
const { Handlebars: { SafeString } } = Ember;

const configurablePriority = [
  'directable.attrs',
  'directable.attrs.fixture',
  'config.attrs.director.character',
  'config.attrs.globals'
];

export default Component.extend(DirectableComponentMixin, TransitionMixin, TransitionObserverMixin, WindowResizeMixin, {
  layout,

  attributeBindings: ['style'],
  classNames: ['et-character'],

  config: multitonService('ember-theater/config', 'theaterId'),

  expressionContainers: computed(() => Ember.A([])),

  expression: configurable(configurablePriority, 'expression'),
  height: configurable(configurablePriority, 'height'),
  transition: deepConfigurable(configurablePriority, 'transition'),

  changeExpression(resolve, expression, { transitionIn, transitionOut }) {
    this._transitionOutExpressions(transitionOut);
    this._transitionInExpression(resolve, expression, transitionIn);
  },

  style: computed('height', {
    get() {
      const height = get(this, 'height');

      return new SafeString(`height: ${height}%;`);
    }
  }).readOnly(),

  // during a window resize, the img dimensions get out of proportion. by forcing the browser
  // to redraw the element, we force it to also recalculate the ratios.
  handleWindowResize: on('windowResize', function() {
    this.$().css('display', 'none');

    later(() => {
      this.$().css('display', 'block');
    }, 50);
  }),

  addInitialExpression: on('didInsertElement', function() {
    const expression = get(this, 'expression');
    const transitionIn = {
      effect: { opacity: 1 },
      duration: 0
    };

    this._transitionInExpression(K, expression, transitionIn);
  }),

  _transitionOutExpressions(transitionOut = { }) {
    const expressionContainer = get(this, 'expressionContainers.firstObject');
    const directable = get(expressionContainer, 'directable');

    set(directable, 'attrs.transitionOut', transitionOut);
    get(directable, 'component').executeTransitionOut().then(() => {
      get(this, 'expressionContainers').removeObject(expressionContainer);
    });
  },

  _transitionInExpression(resolve, expression, transitionIn = { }) {
    if (isBlank(get(transitionIn, 'effect'))) {
      set(transitionIn, 'effect', { opacity: [1, 1] });
    }

    const directable = Directable.create({
      attrs: {
        resolve,
        transitionIn
      }
    });

    const expressionContainer = Ember.Object.create({
      expression,
      directable
    });

    get(this, 'expressionContainers').unshiftObject(expressionContainer);
  }
});