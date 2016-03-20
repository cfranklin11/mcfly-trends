'use strict';

var bbApp = bbApp || {};

(function($) {
  bbApp.WeightsView = Backbone.View.extend({
    el: $('#weights-div'),
    tagName: 'div',
    template: _.template($('#weights-view').html()),
    events: {
      'th[data-col] mousedown': 'selectMonths',
      'th[data-col] mouseover': 'highlightMonths',
      'document mouseup': 'toggleMonths',
      'th.included': 'highlightColumns'
    },
    mousedown: false,
    initialize: function() {
      this.render();
    },
    render: function() {
      var i, messages, messageCount, message, weights, term, termsArray,
        termsString, weightsLength;

      messages = [
        'Enjoy!',
        'Rock on!',
        'Keep it real!',
        'Wango the tango!',
        'Buen provecho!',
        'Bon appetit!',
        'Bom proveito!',
        "L'chaim!",
        'Cheers!',
        'Salud!',
        'Salut!',
        'Seize the day!',
        'Everyday!',
        'Booyah!',
        'Hoowah!'
      ];
      messageCount = messages.length;
      message = messages[ Math.floor( Math.random() * messageCount )];
      termsArray = [];
      weights = bbApp.weights;
      weightsLength = weights.length;

      for (i = 0; i < weightsLength; i++) {
        termsArray.push(weights[i]['term']);
      }
      termsString = termsArray.join( ', ' );

      this.$el.html(this.template());
      this.$el.find( 'h3' ).first().text( "Here's your trends data for " +
        termsString + '.');
      this.$el.find( 'h3' ).last().text( message );

      return this;
    },
    selectMonths: function() {
      var cell, col, firstCol, colCells, included;

      event.preventDefault();

      cell = $(this);
      col = +cell.attr( 'data-col' );
      firstCol = col;
      colCells = cell.closest( 'table' ).find( '[data-col="' + col + '"]' );
      this.mousedown = true;
      included = cell.hasClass( 'included' );
    },
    highlightMonths: function() {
      var prevCol = col,
        prevColCells = colCells,
        cell = $( this ),
        thisIncluded = cell.hasClass( 'included' ),
        thatIncluded, toggleColCells, minCol, maxCol, spans;

      minCol = 11;
      maxCol = 0;

      col = +cell.attr( 'data-col' );
      colCells = cell.closest( 'table' ).find( '[data-col="' + col + '"]' );

      if ( this.mousedown && col !== prevCol && col !== firstCol ) {
        if ( col < firstCol ) {

          for ( i = 0; i < 12; i++ ) {
            toggleColCells = cell.closest( 'table' ).find( '[data-col="' + i + '"]' );
            spans = toggleColCells.find( 'span' );
            thatIncluded = cell.closest( 'table' ).find( 'th[data-col="' + i + '"]' ).hasClass( 'included' );

            if ( col <= i && i <= firstCol ) {
              toggleColCells.addClass( 'table-hover' );

              if ( thisIncluded ) {
                spans.removeClass( 'glyphicon-ok-sign' );
                spans.addClass( 'glyphicon-remove-sign' );
              } else {
                spans.removeClass( 'glyphicon-remove-sign' );
                spans.addClass( 'glyphicon-ok-sign' );
              }

            } else {
              toggleColCells.removeClass( 'table-hover' );

              if ( thatIncluded ) {
                spans.removeClass( 'glyphicon-remove-sign' );
                spans.addClass( 'glyphicon-ok-sign' );
              } else {
                spans.removeClass( 'glyphicon-ok-sign' );
                spans.addClass( 'glyphicon-remove-sign' );
              }
            }
          }

          minCol = col;

        } else {

          for ( i = 0; i < 12; i++ ) {
            toggleColCells = cell.closest( 'table' ).find( '[data-col="' + i + '"]' );
            spans = toggleColCells.find( 'span' );
            thatIncluded = cell.closest( 'table' ).find( 'th[data-col="' + i + '"]' ).hasClass( 'included' );

            if ( firstCol <= i && i <= col ) {
              toggleColCells.addClass( 'table-hover' );

              if ( thisIncluded ) {
                spans.removeClass( 'glyphicon-ok-sign' );
                spans.addClass( 'glyphicon-remove-sign' );
              } else {
                spans.removeClass( 'glyphicon-remove-sign' );
                spans.addClass( 'glyphicon-ok-sign' );
              }

            } else {
              toggleColCells.removeClass( 'table-hover' );

              if ( thatIncluded ) {
                spans.removeClass( 'glyphicon-remove-sign' );
                spans.addClass( 'glyphicon-ok-sign' );
              } else {
                spans.removeClass( 'glyphicon-ok-sign' );
                spans.addClass( 'glyphicon-remove-sign' );
              }
            }
          }

          maxCol = col;
        }
      }
    },
    toggleMonths: function() {
      if ( this.mousedown ) {
        var toggleCells = $( '.table-hover' ),
          spans = $( 'th.table-hover' ).find( 'span' );

        this.mousedown = false;
        toggleCells.removeClass( 'table-hover' );

        if ( included ) {
          toggleCells.removeClass( 'included' );
          toggleCells.addClass( 'excluded' );

          spans.removeClass( 'glyphicon-ok-sign' );
          spans.addClass( 'glyphicon-remove-sign' );

        } else {
          toggleCells.removeClass( 'excluded' );
          toggleCells.addClass( 'included' );

          spans.removeClass( 'glyphicon-remove-sign' );
          spans.addClass( 'glyphicon-ok-sign' );
        }

        calculateWeights();
      }
    },
    highlightColumns: function() {
      var self;

      self = this;

      function () {
        var column = $( this ).attr( 'data-col' ),
          columnCells = $( '#table1' ).find( '[data-col="' + column + '"]' ),
          span = $( this ).find( 'span' ),
          included = $( this ).hasClass( 'included' );

        if ( !self.mousedown ) {
          columnCells.addClass( 'table-hover' );

          if ( included ) {
            span.removeClass( 'glyphicon-ok-sign' );
            span.addClass( 'glyphicon-remove-sign' );
          } else {
            span.removeClass( 'glyphicon-remove-sign' );
            span.addClass( 'glyphicon-ok-sign' );
          }
        }
      },

      function () {
        var column = $( this ).attr( 'data-col' ),
          columnCells = $( '#table1' ).find( '[data-col="' + column + '"]' ),
          span = $( this ).find( 'span' ),
          included = $( this ).hasClass( 'included' );

        columnCells.removeClass( 'table-hover' );

        if ( included ) {
          span.removeClass( 'glyphicon-remove-sign' );
          span.addClass( 'glyphicon-ok-sign' );
        } else {
          span.removeClass( 'glyphicon-ok-sign' );
          span.addClass( 'glyphicon-remove-sign' );
        }
      }
    }
  });
})(jQuery);