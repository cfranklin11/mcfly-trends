'use strict';

var bbApp = bbApp || {};

(function() {
  bbApp.Trend = Backbone.Model.extend({
    defaults: {
      year: 1984,
      month: 'January',
      volume: 0
    }
  });
})();