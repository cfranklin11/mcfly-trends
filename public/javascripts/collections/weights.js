'use strict';

var bbApp = bbApp || {};

(function () {
  var Weights = Backbone.Collection.extend({
    model: bbApp.Account
  });

  bbApp.weights = new Weights();
})();