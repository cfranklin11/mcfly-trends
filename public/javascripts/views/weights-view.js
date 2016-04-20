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

    // Save event data in object for column toggle event in router
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

    // Handle click on weights column
    selectMonths: function(event) {
      var cell;

      event.preventDefault();

      cell = $(event.currentTarget);
      this.mousedown = true;
      this.included = cell.hasClass('included');
      this.cells.firstCell = cell;
      this.cells.newCell = cell;
    },

    // Handle column highlight during mousedown to highlight columns between
    // column clicked and current column with cursor
    highlightMonths: function(event) {
      var firstCol, prevCell, prevCol, prevColCells, cell, col, colCells,
        thisIncluded, minCol, maxCol, i, toggleColCells, spans, thatIncluded;

      // Only active if mouse is down, keep track of first column clicked and
      // previous column hovered with object properties
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

          // Handle highlight if cursor is to the left of first column clicked
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

          // Handle highlight if cursor is to the right of first column clicked
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

    // Handle column highlighting with mouseenter (only if mouse is not down)
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

    // Handle removal of column highlighting with mouseleave
    // (only if mouse is not down)
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

    // Activate (make included) all months
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