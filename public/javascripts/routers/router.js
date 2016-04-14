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
      var weights, weightsLength, i, model, termString, weightsDiv, scrollTarget;

      termString = '';
      weights = bbApp.weights;
      weightsLength = weights.length;

      for (i = 0; i < weightsLength - 1; i++) {
        model = weights.models[i];
        if (i === weightsLength - 2) {
          termString +=  'and ' + model.attributes.term + '.';
        } else {
          if (weightsLength > 3) {
            termString += model.attributes.term + ', ';
          } else {
            termString += model.attributes.term + ' ';
          }
        }
      }

      this.nav = new bbApp.Nav({terms: termString});
      this.navView = new bbApp.NavView({model: this.nav});

      weightsDiv = $('#weights-div');
      this.weightsView = new bbApp.WeightsView({collection: bbApp.weights});

      this.getTrendsTable();

      scrollTarget = weightsDiv.offset();
      $( 'body' ).animate({ scrollTop: scrollTarget.top }, 'slow' );
    },
    getTrendsTable: function() {

    }
  });

  bbApp.appRouter = new AppRouter();
})(jQuery);