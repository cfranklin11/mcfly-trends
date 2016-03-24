'use strict';

var bbApp = bbApp || {};

(function ($) {
  var AppRouter = Backbone.Router.extend({
    routes: {
      '': 'index',
      ':query': 'getTrends'
    },
    start: function() {
      Backbone.history.start();
    },
    index: function() {
      this.formView = new bbApp.FormView();
    },
    getTrends: function(query) {
      var callParams, callUrl;

      console.log(query);

      callParams = '?' + query + '&cid=TIMESERIES_GRAPH_0&export=3';
      callUrl = 'https://www.google.com/trends/fetchComponent' + callParams;
      bbApp.GoogleHelper.getData(callUrl);

    },
    getWeightsTable: function() {
      var weights, weightsLength, termString, weightsDiv, scrollTarget;

      termString = '';
      weights = bbApp.weights;
      weightsLength = weights.length;

      weights.each(function(model, index) {
        if (index === weightsLength) {
          termString +=  'and ' + model.attributes.term + '.';
        } else {
          termString += model.attributes.term + ', ';
        }
      });

      this.nav = new bbApp.Nav({terms: termString});
      this.navView = new bbApp.NavView({model: this.nav});

      weightsDiv = $('#weights-div');
      this.weightsView = new bbApp.WeightsView({collection: bbApp.weights});

      scrollTarget = weightsDiv.offset();

      console.log(scrollTarget)
      $( 'body' ).animate({ scrollTop: scrollTarget }, 'slow' );
    }
  });

  bbApp.appRouter = new AppRouter();
})(jQuery);