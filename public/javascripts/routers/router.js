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
      var self, termString, weights, weightsLength, weightsArray, i, model,
        weightsDiv, scrollTarget;

      self = this;
      termString = '';
      weights = bbApp.weights;
      weightsLength = weights.length;
      weightsArray = [];

      for (i = 0; i < weightsLength - 1; i++) {
        model = weights.models[i];
        if (i === weightsLength - 2) {
          if (weightsLength > 2) {
            termString +=  'and ' + model.attributes.term + '.';
          } else {
            termString += model.attributes.term + '.';
          }
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

      // Create event listener to toggle active/inactive columns
      // in weights view
      $(document).mouseup(toggleMonths);

      weightsDiv = $('#nav-div');
      scrollTarget = weightsDiv.offset();
      $( 'body' ).animate({ scrollTop: scrollTarget.top }, 'slow' );

      function toggleMonths() {
        var mousedown, included, toggleCells, spans;

        mousedown = self.weightsView.mousedown;
        included = self.weightsView.included;

        if (mousedown) {
          toggleCells = $('.table-hover');
          spans = $('th.table-hover').find('span');

          self.weightsView.mousedown = false;
          toggleCells.removeClass('table-hover');

          if (included) {
            toggleCells.removeClass('included');
            toggleCells.addClass('excluded');

            spans.removeClass('glyphicon-ok-sign');
            spans.addClass('glyphicon-remove-sign');

          } else {
            toggleCells.removeClass('excluded');
            toggleCells.addClass('included');

            spans.removeClass('glyphicon-remove-sign');
            spans.addClass('glyphicon-ok-sign');
          }

          bbApp.d3Helper.recalculatePercents();
        }
      }
    }
  });

  bbApp.appRouter = new AppRouter();
})(jQuery);