'use strict';

var bbApp = bbApp || {};

(function() {
  var Trends = Backbone.Collection.extend({
    model: bbApp.Trend
  });

  bbApp.trends = new Trends();
})();