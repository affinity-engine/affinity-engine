import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { hook, initialize as initializeHook } from 'ember-hook';

moduleForComponent('affinity-engine-animation-box-wrapper', 'Integration | Component | affinity engine animation box wrapper', {
  integration: true,

  beforeEach() {
    initializeHook();
  }
});

const { run } = Ember;
const { later } = run;

test('it yields its content', function(assert) {
  assert.expect(1);

  this.render(hbs`
    {{#affinity-engine-animation-box-wrapper}}
      <div data-test={{hook "foo"}}>bar</div>
    {{/affinity-engine-animation-box-wrapper}}
  `);

  assert.equal(this.$(hook('foo')).text().trim(), 'bar');
});

test('it sends `transitions` to its child `ember-animation-box`', function(assert) {
  assert.expect(1);

  this.set('transitions', Ember.A([{ effect: { opacity: 0.5 } }]));

  this.render(hbs`{{affinity-engine-animation-box-wrapper transitions=transitions}}`);

  assert.equal(parseFloat(this.$(hook('ember_animation_box')).css('opacity')).toFixed(1), 0.5, 'transition was executed');
});

test('it sends `transitions` to its child `ember-animation-box`, all of which are performed', function(assert) {
  assert.expect(1);

  this.set('transitions', Ember.A([{ effect: { opacity: 0.5 } }, { effect: { opacity: 0.7 } }]));

  this.render(hbs`{{affinity-engine-animation-box-wrapper transitions=transitions}}`);

  assert.equal(parseFloat(this.$(hook('ember_animation_box')).css('opacity')).toFixed(1), 0.7, 'transitions were executed');
});

test('new `transitions` can be added to its queue', function(assert) {
  assert.expect(2);

  const done = assert.async();

  run(() => {
    this.set('transitions', Ember.A([{ effect: { opacity: 0.5 } }]));

    this.render(hbs`{{affinity-engine-animation-box-wrapper transitions=transitions}}`);

    assert.equal(parseFloat(this.$(hook('ember_animation_box')).css('opacity')).toFixed(1), 0.5, 'transition was executed');

    this.get('transitions').pushObject({ effect: { opacity: 0.7 } });

    later(() => {
      assert.equal(parseFloat(this.$(hook('ember_animation_box')).css('opacity')).toFixed(1), 0.7, 'second transition was executed');

      done();
    });
  });
});

test('it prepends the `transitionIn` transition on `init`', function(assert) {
  assert.expect(2);

  this.set('transitionIn', { effect: { opacity: 0.5, color: 'rgb(51, 51, 51)' } });
  this.set('transitions', Ember.A([{ effect: { opacity: 0.7 } }]));

  this.render(hbs`{{affinity-engine-animation-box-wrapper transitionIn=transitionIn transitions=transitions}}`);

  assert.equal(this.$(hook('ember_animation_box')).css('color'), 'rgb(51, 51, 51)', 'transitionIn was executed');
  assert.equal(parseFloat(this.$(hook('ember_animation_box')).css('opacity')).toFixed(1), 0.7, 'transitionIn was executed first');
});

test('it executes the `transitionOut` transition when `willTransitionOut` is true', function(assert) {
  assert.expect(4);

  const done = assert.async();

  run(() => {
    this.set('transitionOut', { effect: { opacity: 0.7 } });
    this.set('transitions', Ember.A([{ effect: { opacity: 0.5 } }]));

    this.render(hbs`{{affinity-engine-animation-box-wrapper
      transitions=transitions
      transitionOut=transitionOut
      willTransitionOut=willTransitionOut
    }}`);

    assert.equal(parseFloat(this.$(hook('ember_animation_box')).css('opacity')).toFixed(1), 0.5, 'transition was executed');

    this.set('willTransitionOut', true);

    later(() => {
      assert.equal(parseFloat(this.$(hook('ember_animation_box')).css('opacity')).toFixed(1), 0.7, 'transitionOut was executed');
      this.get('transitions').pushObject({ effect: { opacity: 0.5 } });
      this.set('willTransitionOut', false);
    }, 5);

    later(() => {
      assert.equal(parseFloat(this.$(hook('ember_animation_box')).css('opacity')).toFixed(1), 0.5, 'new transition was executed');
      this.set('willTransitionOut', true);
    }, 20);

    later(() => {
      assert.equal(parseFloat(this.$(hook('ember_animation_box')).css('opacity')).toFixed(1), 0.5, 'transitionOut was not reexecuted');

      done();
    }, 40);
  });
});

test('it triggers `didTransitionOut` after transitioning out', function(assert) {
  assert.expect(1);

  this.set('transitionOut', { effect: { opacity: 0.7 } });
  this.set('transitions', Ember.A([{ effect: { opacity: 0.5 } }]));
  this.set('didTransitionOut', () => {
    assert.equal(parseFloat(this.$(hook('ember_animation_box')).css('opacity')).toFixed(1), 0.7, 'transitionOut was executed');
  });

  this.render(hbs`{{affinity-engine-animation-box-wrapper
    transitions=transitions
    transitionOut=transitionOut
    willTransitionOut=willTransitionOut
    didTransitionOut=(action didTransitionOut)
  }}`);

  this.set('willTransitionOut', true);
});

test('it triggers `didCompleteQueue` after each queue completes', function(assert) {
  assert.expect(2);

  const done = assert.async();

  run(() => {
    this.set('transitions', Ember.A([{ effect: { opacity: 0.3 } }, { effect: { opacity: 0.5 } }]));
    this.set('didCompleteQueue', () => {
      assert.equal(parseFloat(this.$(hook('ember_animation_box')).css('opacity')).toFixed(1), 0.5, 'transition was completed');
    });

    this.render(hbs`{{affinity-engine-animation-box-wrapper
      transitions=transitions
      didCompleteQueue=(action didCompleteQueue)
    }}`);

    later(()  => {
      this.set('didCompleteQueue', () => {
        assert.equal(parseFloat(this.$(hook('ember_animation_box')).css('opacity')).toFixed(1), 0.7, 'second transition was completed');

        done();
      });

      this.get('transitions').pushObject({ effect: { opacity: 0.7 } });
    })
  });
});

test('it passes `classNames` to the `ember-animation-box`', function(assert) {
  assert.expect(3);

  this.set('classNames', 'foo bar');

  this.render(hbs`{{affinity-engine-animation-box-wrapper classNames=classNames}}`);

  assert.ok(this.$(hook('ember_animation_box')).hasClass('foo'), 'it has first class');
  assert.ok(this.$(hook('ember_animation_box')).hasClass('bar'), 'it has second class');
  assert.equal(this.$('.foo').length, 1, 'the class is only applied to the `ember-animation-box`');
});
