import gatherModules from 'ember-theater/utils/gather-modules';

export function initialize(application) {
  const scenes = gatherModules('ember-theater\/director\/scenes');

  scenes.forEach((scene, sceneName) => {
    application.register(`scene:${sceneName}`, scene, { instantiate: false, singleton: false });
  });
}

export default {
  name: 'ember-theater/director/register-scenes',
  initialize: initialize
};
