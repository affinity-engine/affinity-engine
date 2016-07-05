import ConfigurableMixin from 'affinity-engine/mixins/configurable';
import MultitonIdsMixin from 'affinity-engine/mixins/multiton-ids';
import WindowResizeMixin from 'affinity-engine/mixins/multiton-ids';

import configurable, { deepConfigurable, deepArrayConfigurable } from 'affinity-engine/macros/affinity-engine/configurable';
import registrant from 'affinity-engine/macros/affinity-engine/registrant';

import animate from 'affinity-engine/utils/affinity-engine/animate';
import deepMerge from 'affinity-engine/utils/affinity-engine/deep-merge';
import deepStub from 'affinity-engine/utils/affinity-engine/deep-stub';
import gatherTypes from 'affinity-engine/utils/affinity-engine/gather-types';
import nativeCopy from 'affinity-engine/utils/affinity-engine/native-copy';

import { initialize as loadTranslations } from 'affinity-engine/instance-initializers/affinity-engine/load-translations';
import { initialize as initializeConfig } from 'affinity-engine/instance-initializers/affinity-engine/register-configs';

const initialize = function initialize(appInstance) {
  loadTranslations(appInstance);
  initializeConfig(appInstance);
};

export {
  ConfigurableMixin,
  MultitonIdsMixin,
  WindowResizeMixin,
  configurable,
  deepConfigurable,
  deepArrayConfigurable,
  registrant,
  animate,
  deepMerge,
  deepStub,
  gatherTypes,
  nativeCopy,
  initialize
};
