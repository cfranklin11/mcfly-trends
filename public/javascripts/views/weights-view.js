'use strict';

var bbApp = bbApp || {};

(function($) {
  bbApp.WeightsView = Backbone.View.extend({
    el: $('#weights-div'),
    template: _.template($('#weights-view').html()),
    events: {
      'mousedown th[data-col]': 'selectMonths',
      'mouseover th[data-col]': 'highlightMonths',
      'mouseenter th.included': 'highlightColumns',
      'mouseleave th.included': 'unhighlightColumns'
    },
    mousedown: false,
    included: false,
    initialize: function() {
      this.render();
    },
    addOne: function(weight) {
      var weightView;

      weightView = new bbApp.WeightView({model: weight});
      this.$el.find('tbody').append(weightView.render().el);
    },
    selectMonths: function(event) {
      var cell, col, firstCol, colCells;

      event.preventDefault();

      cell = $(event.currentTarget);
      col = +cell.attr('data-col');
      firstCol = col;
      colCells = cell.closest('table').find('[data-col="' + col + '"]');
      this.mousedown = true;
      this.included = cell.hasClass('included');
    },
    highlightMonths: function(event) {
      var cell, col, firstCol, prevCol, colCells, prevColCells, thisIncluded,
        minCol, maxCol, i, toggleColCells, spans, thatIncluded;

      cell = $(event.currentTarget);
      col = +cell.attr('data-col');
      firstCol = col;
      prevCol = col;
      colCells = cell.closest('table').find('[data-col="' + col + '"]');
      prevColCells = colCells;
      thisIncluded = cell.hasClass('included');

      minCol = 11;
      maxCol = 0;


      if (this.mousedown && col !== prevCol && col !== firstCol) {
        if (col < firstCol) {

          for (i = 0; i < 12; i++) {
            toggleColCells = cell.closest('table').find('[data-col="' + i + '"]');
            spans = toggleColCells.find('span');
            thatIncluded = cell.closest('table').find('th[data-col="' + i + '"]').hasClass('included');

            if (col <= i && i <= firstCol) {
              toggleColCells.addClass('table-hover');

              if (thisIncluded) {
                spans.removeClass('glyphicon-ok-sign');
                spans.addClass('glyphicon-remove-sign');
              } else {
                spans.removeClass('glyphicon-remove-sign');
                spans.addClass('glyphicon-ok-sign');
              }

            } else {
              toggleColCells.removeClass('table-hover');

              if (thatIncluded) {
                spans.removeClass('glyphicon-remove-sign');
                spans.addClass('glyphicon-ok-sign');
              } else {
                spans.removeClass('glyphicon-ok-sign');
                spans.addClass('glyphicon-remove-sign');
              }
            }
          }

          minCol = col;

        } else {

          for (i = 0; i < 12; i++) {
            toggleColCells = cell.closest('table').find('[data-col="' + i + '"]');
            spans = toggleColCells.find('span');
            thatIncluded = cell.closest('table').find('th[data-col="' + i + '"]').hasClass('included');

            if (firstCol <= i && i <= col) {
              toggleColCells.addClass('table-hover');

              if (thisIncluded) {
                spans.removeClass('glyphicon-ok-sign');
                spans.addClass('glyphicon-remove-sign');
              } else {
                spans.removeClass('glyphicon-remove-sign');
                spans.addClass('glyphicon-ok-sign');
              }

            } else {
              toggleColCells.removeClass('table-hover');

              if (thatIncluded) {
                spans.removeClass('glyphicon-remove-sign');
                spans.addClass('glyphicon-ok-sign');
              } else {
                spans.removeClass('glyphicon-ok-sign');
                spans.addClass('glyphicon-remove-sign');
              }
            }
          }

          maxCol = col;
        }
      }
    },
    highlightColumns: function (event) {
      var self, column, columnCells, span;

      self = $(event.currentTarget);

      column = self.attr('data-col');
      columnCells = $('#table1').find('[data-col="' + column + '"]');
      span = self.find('span');
      this.included = self.hasClass('included');

      if (!this.mousedown) {
        columnCells.addClass('table-hover');

        if (this.included) {
          span.removeClass('glyphicon-ok-sign');
          span.addClass('glyphicon-remove-sign');
        } else {
          span.removeClass('glyphicon-remove-sign');
          span.addClass('glyphicon-ok-sign');
        }
      }
    },
    unhighlightColumns: function(event) {
      var self, column, columnCells, span;

      self = $(event.currentTarget);

      column = self.attr('data-col');
      columnCells = $('#table1').find('[data-col="' + column + '"]');
      span = self.find('span');
      this.included = self.hasClass('included');

      columnCells.removeClass('table-hover');

      if (this.included) {
        span.removeClass('glyphicon-remove-sign');
        span.addClass('glyphicon-ok-sign');
      } else {
        span.removeClass('glyphicon-ok-sign');
        span.addClass('glyphicon-remove-sign');
      }
    },
    render: function() {
      this.$el.html(this.template());
      this.collection.each(this.addOne, this);

      return this;
    }
  });
})(jQuery);