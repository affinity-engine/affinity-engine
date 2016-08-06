import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { hook, initialize as initializeHook } from 'ember-hook';

const { run: { later } } = Ember;

moduleForComponent('affinity-engine-transition-box', 'Integration | Component | affinity engine transition box', {
  integration: true,

  beforeEach() {
    initializeHook()
  }
});

test('it uses initial transitions', function(assert) {
  assert.expect(1);

  this.set('transitions', [{ effect: { opacity: 0.4 } }]);

  this.render(hbs`{{affinity-engine-transition-box transitions=transitions}}`);

  assert.equal(this.$(hook('affinity_engine_transition_box')).css('opacity').toString().substring(0, 3), 0.4, 'transition executed');
});

test('it uses added transitions', function(assert) {
  assert.expect(1);

  this.set('transitions', []);

  this.render(hbs`{{affinity-engine-transition-box transitions=transitions}}`);

  this.set('transitions', [{ effect: { opacity: 0.4 } }]);

  assert.equal(this.$(hook('affinity_engine_transition_box')).css('opacity').toString().substring(0, 3), 0.4, 'transition executed');
});

test('it processes the transitions sequentially', function(assert) {
  assert.expect(2);

  this.set('transitions', [{ effect: { opacity: 0.6 } }, { effect: { padding: '1290px' } }, { effect: { opacity: 0.4 } }]);

  this.render(hbs`{{affinity-engine-transition-box transitions=transitions}}`);

  assert.equal(this.$(hook('affinity_engine_transition_box')).css('opacity').toString().substring(0, 3), 0.4, 'transitions executed in correct order');
  assert.equal(this.$(hook('affinity_engine_transition_box')).css('padding'), '1290px', 'all transitions executed');
});

test('it queues multiple transition settings', function(assert) {
  assert.expect(2);

  this.set('transitions', [{ effect: { padding: '1290px' } }]);

  this.render(hbs`{{affinity-engine-transition-box transitions=transitions}}`);

  this.set('transitions', [{ effect: { opacity: 0.6 } }]);
  this.set('transitions', [{ effect: { opacity: 0.4 } }]);

  assert.equal(this.$(hook('affinity_engine_transition_box')).css('padding'), '1290px', 'initial transitions respected');
  assert.equal(this.$(hook('affinity_engine_transition_box')).css('opacity').toString().substring(0, 3), 0.4, 'subsequent transitions executed in order');
});

test('transitions can be delayed', function(assert) {
  assert.expect(2);

  const done = assert.async();

  this.set('transitions', [{ effect: { opacity: 0.6 } }, { type: 'delay', duration: 10 }, { effect: { opacity: 0.4 } }]);

  this.render(hbs`{{affinity-engine-transition-box transitions=transitions}}`);

  assert.equal(this.$(hook('affinity_engine_transition_box')).css('opacity').toString().substring(0, 3), 0.6, 'before delay');

  later(() => {
    assert.equal(this.$(hook('affinity_engine_transition_box')).css('opacity').toString().substring(0, 3), 0.4, 'after delay');

    done();
  }, 15);
});

test('resolve is executed after last transition completes', function(assert) {
  assert.expect(1);

  const done = assert.async();
  let hasResolved = false;

  this.set('resolve', () => assert.ok(hasResolved, 'it has resolved'));
  this.set('transitions', [{ effect: { opacity: 0.6 } }, { type: 'delay', duration: 10 }, { effect: { opacity: 0.4 } }]);

  this.render(hbs`{{affinity-engine-transition-box transitions=transitions resolve=resolve}}`);

  later(() => {
    hasResolved = true;
  }, 10);

  later(() => {
    done();
  }, 15);
});

test('transitions are deleted after entering queue', function(assert) {
  assert.expect(2);

  const done = assert.async();

  this.set('transitions', [
    { effect: { padding: '123px' } },
    { type: 'delay', duration: 10 },
    { effect: { padding: '1290px' } }
  ]);

  this.render(hbs`{{affinity-engine-transition-box transitions=transitions}}`);

  later(() => {
    assert.equal(this.$(hook('affinity_engine_transition_box')).css('padding'), '1290px', 'padding queue completes');

    this.set('transitions', [{ effect: { padding: '321px' } }]);

    assert.equal(this.$(hook('affinity_engine_transition_box')).css('padding'), '321px', 'old transitions not run again');

    done();
  }, 15);
});

test('multiple queues can run concurrently', function(assert) {
  assert.expect(3);

  const done = assert.async();

  this.set('transitions', [
    { effect: { opacity: 0.6 } },
    { queue: 'padding', effect: { padding: '123px' } },
    { queue: 'padding', type: 'delay', duration: 10 },
    { queue: 'padding', effect: { padding: '1290px' } },
    { effect: { opacity: 0.4 } }
  ]);

  this.render(hbs`{{affinity-engine-transition-box transitions=transitions}}`);

  assert.equal(this.$(hook('affinity_engine_transition_box')).css('opacity').toString().substring(0, 3), 0.4, 'main queue not delayed');
  assert.equal(this.$(hook('affinity_engine_transition_box')).css('padding'), '123px', 'padding queue delayed');

  later(() => {
    assert.equal(this.$(hook('affinity_engine_transition_box')).css('padding'), '1290px', 'padding queue completes');

    done();
  }, 15);
});

test('last transition can be a custom queue', function(assert) {
  assert.expect(2);

  const done = assert.async();

  this.set('transitions', [
    { queue: 'padding', effect: { padding: '123px' } },
    { queue: 'padding', type: 'delay', duration: 10 },
    { queue: 'padding', effect: { padding: '1290px' } }
  ]);

  this.render(hbs`{{affinity-engine-transition-box transitions=transitions}}`);

  assert.equal(this.$(hook('affinity_engine_transition_box')).css('padding'), '123px', 'padding queue delayed');

  later(() => {
    assert.equal(this.$(hook('affinity_engine_transition_box')).css('padding'), '1290px', 'padding queue completes');

    done();
  }, 15);
});
