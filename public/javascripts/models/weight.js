'use strict';

var bbApp = bbApp || {};

(function() {
  bbApp.Weight = Backbone.Model.extend({
    defaults: {
      term: 'search',
      monthWeight: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      monthPercent: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2],
      totalWeight: 0,
      totalPercent: 0.5
    }
  });
})();