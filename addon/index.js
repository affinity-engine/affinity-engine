import ConfigurableMixin from 'affinity-engine/mixins/configurable';
import ManagedFocusMixin from 'affinity-engine/mixins/managed-focus';
import ResizeMixin from 'affinity-engine/mixins/resize';

import configurable, { classNamesConfigurable, deepConfigurable, deepArrayConfigurable } from 'affinity-engine/macros/affinity-engine/configurable';
import classNames from 'affinity-engine/macros/affinity-engine/class-names';
import registrant from 'affinity-engine/macros/affinity-engine/registrant';

import deepMerge from 'affinity-engine/utils/affinity-engine/deep-merge';
import deepStub from 'affinity-engine/utils/affinity-engine/deep-stub';
import gatherTypes from 'affinity-engine/utils/affinity-engine/gather-types';
import nativeCopy from 'affinity-engine/utils/affinity-engine/native-copy';

import { initialize as initializeConfig } from 'affinity-engine/instance-initializers/affinity-engine/register-configs';

const initialize = function initialize(appInstance) {
  initializeConfig(appInstance);
};

export {
  ConfigurableMixin,
  ManagedFocusMixin,
  ResizeMixin,
  classNames,
  configurable,
  classNamesConfigurable,
  deepConfigurable,
  deepArrayConfigurable,
  registrant,
  deepMerge,
  deepStub,
  gatherTypes,
  nativeCopy,
  initialize
};
