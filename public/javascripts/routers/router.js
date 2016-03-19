'use strict';

var bbApp = bbApp || {};

(function () {
  var AccountRouter = Backbone.Router.extend({
    routes: {
      '': 'index',
      ':terms': 'trends'
    },
    start: function() {
      Backbone.history.start();
    },
    index: function() {
      this.formView = new bbApp.FormView();
    },
    trends: function() {

    }
  });

  bbApp.AccountRouter = new AccountRouter();
})();