/* jshint node: true */
'use strict';

module.exports = {
  name: 'affinity-engine',

  included: function(app) {
    this._super.included(app);
  },

  safeIncluded: function(app, parent) {
    this.included(app, parent);
  }
};
