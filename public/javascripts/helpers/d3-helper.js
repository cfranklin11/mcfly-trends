'use strict';

var bbApp = bbApp || {};

(function(d3, $) {

  bbApp.d3Helper = {

    // Query callback to process the data object
    processData: function(response) {

    // Handle errors
    if (response.isError()) {
      alert('Error in query: ' + response.getMessage() + ' ' +
        response.getDetailedMessage());
      return;
    }

    var data, colLabels, colsLength, tbody2, table1, thead1, labelRow1, tbody1,
    termsArray, csvDiv, messages, mousedown, messageCount, message,
    weightsString, colSpan, termsString, scrollTarget, trendsArray,
    labelString, trendsString, i, col, colCells, firstCol, included;

    data = response.getDataTable();
    colLabels = data.Kf;
    colsLength = colLabels.length,table2 = $( '#table2' );
    tbody2 = table2.children( 'tbody' );
    table1 = $( '#table1' );
    thead1 = table1.children( 'thead' );
    labelRow1 = thead1.children( 'tr' )[ 1 ];
    tbody1 = table1.children( 'tbody' );
    termsArray = [];
    csvDiv = $( '#csv-div' );
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
    mousedown = false;
    messageCount = messages.length;
    message = messages[ Math.floor( Math.random() * messageCount )];

    console.log(data);

    // Push search terms into an array for later
    for ( i = 1; i < colsLength; i++ ) {
      if ( colsLength > 2 && i === colsLength - 1 ) {
        termsArray.push( "and '" + colLabels[ i ].label + "'" );
      } else {
        termsArray.push( "'" + colLabels[ i ].label + "'" );
      }
    }

    // Empty existing tables, and set up new ones
    tbody2.empty();
    tbody1.children( 'tr:not(:first)' ).empty();
    tbody1.find( '.excluded' ).addClass( 'included' );
    tbody1.find( '.excluded' ).removeClass( 'excluded' );

    // Process data to get monthly weights table
    weightsString = weightsTable( data );
    tbody1.append( weightsString );

    // Process data to get raw trends table
    trendsString = trendsTable( data );
    tbody2.append( trendsString );

    // Add click listener to toggle whether or not given months are included
    // in monthly weights
    $( 'th[data-col]' ).mousedown( function ( event ) {
      var cell = $( this );

      event.preventDefault();
      col = +cell.attr( 'data-col' );
      firstCol = col;
      colCells = cell.closest( 'table' ).find( '[data-col="' + col + '"]' );
      mousedown = true;
      included = cell.hasClass( 'included' );
    })

    .mouseover( function () {
      var prevCol = col,
        prevColCells = colCells,
        cell = $( this ),
        thisIncluded = cell.hasClass( 'included' ),
        thatIncluded, toggleColCells, minCol, maxCol, spans;

      minCol = 11;
      maxCol = 0;

      col = +cell.attr( 'data-col' );
      colCells = cell.closest( 'table' ).find( '[data-col="' + col + '"]' );

      if ( mousedown && col !== prevCol && col !== firstCol ) {
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
    });

    $( document ).mouseup( function () {
      if ( mousedown ) {
        var toggleCells = $( '.table-hover' ),
          spans = $( 'th.table-hover' ).find( 'span' );

        mousedown = false;
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
    });

    // Add mouse hover effect to included columns to highlight months that user can
    // exclude
    $( 'th.included' ).hover(
      function () {
        var column = $( this ).attr( 'data-col' ),
          columnCells = $( '#table1' ).find( '[data-col="' + column + '"]' ),
          span = $( this ).find( 'span' ),
          included = $( this ).hasClass( 'included' );

        if ( !mousedown ) {
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
    );

    // Adjust table title row
    colSpan = ( colsLength + 1 ).toString();
    table2.find( 'tr' ).first().children( 'th' ).attr( 'colspan', colSpan );

    // Create message to place above top table
    termsString = termsArray.join( ', ' );
    csvDiv.find( 'h3' ).first().text( "Here's your trends data for " +
      termsString + '.');
    csvDiv.find( 'h3' ).last().text( message );

    // Reveal data tables and auto-scroll down
    csvDiv.removeClass( 'hidden' );
    scrollTarget = csvDiv[ 0 ].offsetTop;
    $( 'body' ).animate({ scrollTop: scrollTarget }, 'slow' );
  }
  };
})(d3, jQuery);