'use strict';

var bbApp = bbApp || {};

(function($) {
  bbApp.WeightsView = Backbone.View.extend({
    el: $('#weights-div'),
    template: _.template($('#weights-view').html()),
    events: {
      'mousedown th[data-col]': 'selectMonths',
      'mouseover th[data-col]': 'highlightMonths',
      'mouseenter th.included, th.excluded': 'highlightColumns',
      'mouseleave th.included, th.excluded': 'unhighlightColumns',
      'click #reset': 'resetMonths',
    },
    mousedown: false,
    included: false,
    cells: {
      firstCell: undefined,
      previousCell: undefined,
      newCell: undefined
    },
    initialize: function() {
      this.render();
    },
    addOne: function(weight) {
      var weightView;

      weightView = new bbApp.WeightView({model: weight});
      this.$el.find('tbody').append(weightView.render().el);
    },
    selectMonths: function(event) {
      var cell;

      event.preventDefault();

      cell = $(event.currentTarget);
      this.mousedown = true;
      this.included = cell.hasClass('included');
      this.cells.firstCell = cell;
      this.cells.newCell = cell;
    },
    highlightMonths: function(event) {
      var firstCol, prevCell, prevCol, prevColCells, cell, col, colCells,
        thisIncluded, minCol, maxCol, i, toggleColCells, spans, thatIncluded;

      if (this.mousedown) {
        firstCol = +this.cells.firstCell.attr('data-col');
        prevCell = this.cells.newCell;
        this.cells.previousCell = prevCell;
        prevCol = +prevCell.attr('data-col');
        prevColCells = prevCell.closest('table').find('[data-col="' + prevCol + '"]');
        cell = $(event.currentTarget);
        this.cells.newCell = cell;
        col = +cell.attr('data-col');
        colCells = cell.closest('table').find('[data-col="' + col + '"]');
        thisIncluded = this.included;

        minCol = 11;
        maxCol = 0;

        if (col !== prevCol && col !== firstCol) {
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
      }
    },
    highlightColumns: function (event) {
      var self, column, columnCells, span, included;

      self = $(event.currentTarget);

      column = self.attr('data-col');
      columnCells = $('#table1').find('[data-col="' + column + '"]');
      span = self.find('span');
      included = self.hasClass('included');

      if (!this.mousedown) {
        columnCells.addClass('table-hover');

        if (included) {
          span.removeClass('glyphicon-ok-sign');
          span.addClass('glyphicon-remove-sign');
        } else {
          span.removeClass('glyphicon-remove-sign');
          span.addClass('glyphicon-ok-sign');
        }
      }
    },
    unhighlightColumns: function(event) {
      var self, column, columnCells, span, included;

      self = $(event.currentTarget);

      column = self.attr('data-col');
      columnCells = $('#table1').find('[data-col="' + column + '"]');
      span = self.find('span');
      included = self.hasClass('included');

      columnCells.removeClass('table-hover');

      if (included) {
        span.removeClass('glyphicon-remove-sign');
        span.addClass('glyphicon-ok-sign');
      } else {
        span.removeClass('glyphicon-ok-sign');
        span.addClass('glyphicon-remove-sign');
      }
    },
    resetMonths: function() {
      var excludedCells, excludedHeaders, spans;

      excludedCells = $('#table1').find('.excluded');
      excludedCells.removeClass('excluded');
      excludedCells.addClass('included');

      spans = $('#table1').find('th.included').find('span');
      spans.removeClass('glyphicon-remove-sign');
      spans.addClass('glyphicon-ok-sign');

      bbApp.d3Helper.recalculatePercents();
    },
    render: function() {
      this.$el.html(this.template());
      this.collection.each(this.addOne, this);

      return this;
    }
  });
})(jQuery);