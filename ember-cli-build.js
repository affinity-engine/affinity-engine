/* eslint-env node */
'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  let addon = new EmberAddon(defaults, {
    'ember-cli-babel': {
      includePolyfill: true
    },

    sassOptions: {
      extensions: 'scss'
    },

    'ember-cli-qunit': {
      useLintTree: false
    }
  });

  return addon.toTree();
}
