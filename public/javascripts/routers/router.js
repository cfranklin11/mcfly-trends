'use strict';

var bbApp = bbApp || {};

(function ($) {
  var AppRouter = Backbone.Router.extend({
    routes: {
      '': 'index'
    },
    start: function() {
      Backbone.history.start();
    },
    index: function() {
      this.formView = new bbApp.FormView();
    },
    getWeightsTable: function() {
      var weights, weightsLength, weightsArray, i, model, termString,
        weightsDiv, scrollTarget;

      termString = '';
      weights = bbApp.weights;
      weightsLength = weights.length;
      weightsArray = [];

      for (i = 0; i < weightsLength - 1; i++) {
        model = weights.models[i];
        if (i === weightsLength - 2) {
          if (weightsLength > 2) {
            termString +=  'and ' + model.attributes.term + '.';
          }
            termString += model.attributes.term + '.';
        } else {
          if (weightsLength > 3) {
            termString += model.attributes.term + ', ';
          } else {
            termString += model.attributes.term + ' ';
          }
        }

        weightsArray.push(model.attributes.term);
      }

      this.nav = new bbApp.Nav({terms: termString});
      this.navView = new bbApp.NavView({model: this.nav});
      this.weightsView = new bbApp.WeightsView({collection: bbApp.weights});
      this.trendsView = new bbApp.TrendsView({
        collection: bbApp.trends,
        termCount: weightsLength - 1,
        terms: weightsArray
      });

      weightsDiv = $('#weights-div');
      scrollTarget = weightsDiv.offset();
      $( 'body' ).animate({ scrollTop: scrollTarget.top }, 'slow' );
    }
  });

  bbApp.appRouter = new AppRouter();
})(jQuery);