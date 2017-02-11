import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { $hook, initialize as initializeHook } from 'ember-hook';
import { initializeQUnitAssertions } from 'ember-message-bus';
import { initialize as initializeEngine } from 'affinity-engine';
import multiton from 'ember-multiton-service';

const { getOwner } = Ember;
const { run: { later } } = Ember;

const Publisher = Ember.Object.extend({ eBus: multiton('message-bus', 'engineId'), engineId: 'foo' });
let publisher;

moduleForComponent('affinity-engine', 'Integration | Component | ember engine', {
  integration: true,

  beforeEach() {
    const appInstance = getOwner(this);

    initializeHook();
    initializeQUnitAssertions(appInstance, 'eBus', Ember.Object.extend({ eBus: multiton('message-bus', 'engineId'), engineId: 'foo' }));
    initializeEngine(appInstance);
    appInstance.register('ember-message-bus:publisher', Publisher);
    publisher = appInstance.lookup('ember-message-bus:publisher');
  }
});

test('`engineId` defaults to `affinity-engine-default`', function(assert) {
  assert.expect(1);

  this.render(hbs`
    {{#affinity-engine as |engine|}}
      <div data-test={{hook "engine_id"}}>{{engine.engineId}}</div>
    {{/affinity-engine}}
  `);

  assert.equal($hook('engine_id').text().trim(), 'affinity-engine-default', '`engineId` has correct default');
});

test('`engineId` can be passed in', function(assert) {
  assert.expect(1);

  this.render(hbs`
    {{#affinity-engine engineId="foo" as |engine|}}
      <div data-test={{hook "engine_id"}}>{{engine.engineId}}</div>
    {{/affinity-engine}}
  `);

  assert.equal($hook('engine_id').text().trim(), 'foo', '`engineId` is correctly set');
});

test('`config` is passed to the `configService` on init', function(assert) {
  assert.expect(1);

  const config = { };

  const configService = Ember.Object.create({
    initializeConfig(arg) {
      assert.equal(arg, config, '`config` matches the initializeConfig argument');
    }
  });

  this.setProperties({
    config,
    configService
  });

  this.render(hbs`{{affinity-engine configService=configService config=config}}`);
});

test('`fixtures` are loaded into the `fixtureStore` on init', function(assert) {
  assert.expect(4);

  const fixtures = {
    foo: 1,
    bar: 'A',
    baz: ['Z', 10],
    bal: { }
  };

  const fixtureStore = Ember.Object.create({
    add(key, value) {
      assert.equal(value, fixtures[key], `fixture ${key} is correct`);
    }
  });

  this.setProperties({
    fixtures,
    fixtureStore
  });

  this.render(hbs`{{affinity-engine fixtureStore=fixtureStore fixtures=fixtures}}`);
});

test('`destroyMultitons` triggers `multitonManager` on destroy', function(assert) {
  assert.expect(1);

  const engineId = 'foo';

  const multitonManager = Ember.Object.create({
    removeServices(arg) {
      assert.deepEqual(arg, [{ engineId }], '`removeServices` recieves the `engineId`');
    }
  });

  this.setProperties({
    multitonManager,
    engineId,
    visible: true
  });

  this.render(hbs`
    {{#if visible}}
      {{affinity-engine multitonManager=multitonManager engineId=engineId}}
    {{/if}}
  `);

  this.set('visible', false);
});

test('`isFocused` is set by the `focus` event', function(assert) {
  assert.expect(3);

  const done = assert.async();
  const focusManager = Ember.Object.create({ isFocused: false });

  this.set('focusManager', focusManager);

  this.render(hbs`{{affinity-engine focusManager=focusManager}}`);

  assert.equal(focusManager.get('isFocused'), false, '`isFocused` defaults to the focusManager value');

  $hook('affinity_engine').focus();

  assert.equal(focusManager.get('isFocused'), false, '`isFocused` is not immediately set');

  later(() => {
    assert.equal(focusManager.get('isFocused'), true, '`isFocused` is correctly set after delay');

    done();
  }, 250);
});

test('`isFocused` is lost by the `blur` event', function(assert) {
  assert.expect(3);

  const done = assert.async();
  const focusManager = Ember.Object.create({ isFocused: false });

  this.set('focusManager', focusManager);

  this.render(hbs`{{affinity-engine focusManager=focusManager isFocused=true}}`);

  assert.equal(focusManager.get('isFocused'), true, '`isFocused` can be passed in');

  $hook('affinity_engine').blur();

  assert.equal(focusManager.get('isFocused'), true, '`isFocused` is not immediately changed');

  later(() => {
    assert.equal(focusManager.get('isFocused'), false, '`isFocused` is correctly blurred after delay');

    done();
  }, 250);
});

test('`readyToRunGame` sets `isLoaded` to true', function(assert) {
  assert.expect(2);

  const done = assert.async();

  this.render(hbs`
    {{#affinity-engine engineId="foo" as |engine|}}
      <div data-test={{hook "complete_preload"}}>{{engine.isLoaded}}</div>
    {{/affinity-engine}}
  `);

  Ember.run(() => {
    assert.equal($hook('complete_preload').text().trim(), '', '`isLoaded` defaults to undefined');

    publisher.get('eBus').publish('readyToRunGame');

    Ember.run.next(() => {
      assert.equal($hook('complete_preload').text().trim(), 'true', '`isLoaded` changed to true');

      done();
    });
  });
});
