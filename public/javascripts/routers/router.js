'use strict';

var bbApp = bbApp || {};

(function () {
  var AccountRouter = Backbone.Router.extend({
    routes: {
      '': 'index',
      ':query': 'trends'
    },
    start: function() {
      Backbone.history.start();
    },
    index: function() {
      this.formView = new bbApp.FormView();
    },
    trends: function(query) {
      var callParams, callUrl;

      console.log(query);

      callParams = '?' + query + '&cid=TIMESERIES_GRAPH_0&export=3';
      callUrl = 'https://www.google.com/trends/fetchComponent' + callParams;
      bbApp.GoogleHelper.getData(callUrl);
    }
  });

  bbApp.AccountRouter = new AccountRouter();
})();