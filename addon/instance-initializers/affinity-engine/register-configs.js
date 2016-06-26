export function initialize(appInstance) {
  appInstance.registerOptionsForType('affinity-engine/config', { instantiate: false });
}

export default {
  name: 'affinity-engine/register-configs',
  initialize
};
