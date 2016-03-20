'use strict';

var bbApp = bbApp || {};

(function () {
  var Weights = Backbone.Collection.extend({
    model: bbApp.Weight
  });

  bbApp.weights = new Weights();
})();