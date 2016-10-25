import Ember from 'ember';
import ResizeService from 'ember-resize/services/resize';
import config from 'ember-get-config';

const { getWithDefault } = Ember;

export function initialize() {
  let application = arguments[1] || arguments[0];

  const resizeServiceDefaults = getWithDefault(config, 'resizeServiceDefaults', {
    widthSensitive: true,
    heightSensitive: true,
    debounceTimeout: 100
  });
  const injectionFactories = getWithDefault(resizeServiceDefaults, 'injectionFactories', []) ;

  application.register('config:resize-service', resizeServiceDefaults, { instantiate: false });
  application.register('service:resize', ResizeService);
  application.inject('service:resize', 'resizeServiceDefaults', 'config:resize-service');

  injectionFactories.forEach(factory => {
    application.inject(factory, 'resizeService', 'service:resize');
  });
}

export default {
  name: 'resize',
  initialize: initialize
};
