'use strict';

var bbApp = bbApp || {};

(function(d3, $) {

  bbApp.d3Helper = {

    // Query callback to process the data object
    processData: function(response) {
      var data, colLabels, colsLength, tbody2, table1, thead1, labelRow1, tbody1,
        termsArray, csvDiv, messages, mousedown, messageCount, message,
        weightsString, colSpan, termsString, scrollTarget, trendsArray,
        labelString, trendsString, i, col, colCells, firstCol, included,
        weightsArray, totalWeight, percentsArray, termWeight, model,
        modelPercents, termPercent, percent;

      // Handle errors
      if (response.isError()) {
        alert('Error in query: ' + response.getMessage() + ' ' +
          response.getDetailedMessage());
        return;
      }

      data = response.getDataTable();
      colsLength = data.Kf.length;
      totalWeight = 0;

      for (i = 1; i < colsLength + 1; i++) {
        termString = this.createTermsArray(data, i);

        // Process data to get monthly weights table
        weightsArray = this.calculateWeights(data, i);
        termWeight = d3.sum(weightsArray, function(d) {
          return d;
        });
        totalWeight += termWeight;

        bbApp.weights.add({
          term: termString,
          monthWeights: weightsArray,
          termWeight: termWeight
        });
      }

      for (i = 0; i < bbApp.weights.length; i++) {
        model = bbApp.weights[i];
        modelPercents = model.monthWeights.map(function(d) {
          percent = d / totalWeight;
          percent = (percent * 100).toFixed(2);
          return percent;
        });
        termPercent = ((model.termWeight / totalWeight) * 100).toFixed(2);

        model.set({
          monthPercents: modelPercents,
          termPercent: termPercent;
        })
      }


      // Reveal data tables and auto-scroll down
      csvDiv.removeClass( 'hidden' );
      scrollTarget = csvDiv[ 0 ].offsetTop;
      $( 'body' ).animate({ scrollTop: scrollTarget }, 'slow' );
    },
    createTermsArray: function(data, i) {
      var term;

      // Loop through each search term, pushing monthly means to avgs array,
      // then add overall mean for each term at the end of the row
      term = data.Kf[ i ] ? "'" + data.Kf[ i ].label + "'" : 'Monthly Weight';

      return term;
    },
    calculateWeights: function (data, i) {
      var tableData, tableString, avgs, colCount, i, j, term, avgTotal,
        termAvgTotal, key, date, month, monthAvg, avg, weight, termWeight;

      tableData = [];
      tableString = '';
      avgs = [];

      // Calculate mean of each month's search volume
      for ( j = 0; j < 12; j++ ) {

        // Calculate total mean per month across all years
        monthAvg = d3.mean( data.Lf, function ( d ) {
          date = new Date( d.c[ 0 ].v );
          month = date.getMonth();

          // Looping through month rows, if data month matches the loop number,
          // return the search volume. On last weights table row, calculate the mean
          // for the whole trends data row
          // (e.g. mean for March 2006 for all search terms)
          if ( j === month ) {
            if ( d.c[ i ] ) {

              // Monthly mean per search term
              avg = d.c[ i ].v;
            } else {

              // Total mean for month
              avg = d3.mean( d.c, function ( e ) {

                // Check if data exists (when trying to get data from recent
                // months, Google Trends sometimes returns 'null' values)
                if ( e ) {
                  if ( Number.isInteger( e.v )) {
                    return e.v;
                  }
                }
              });

              // To get total monthly weights, multiply monthly means by
              // # of search terms
              avg *= colCount - 1;
            }
            return avg;
          }
        });

        avgs[ i - 1 ].push( monthAvg );
      }

      // Calculate overall mean for each search term
      termAvgTotal = d3.sum( avgs[ i - 1 ], function ( d ) {
        return d;
      });
      avgs[ i - 1 ].push( termAvgTotal );

      console.log(avgs);
      return avgs;
    },
    recalculatePercents: function() {
      var table = $( '#table1' ),
        tbody = table.children( 'tbody' ),
        rows = tbody.children( 'tr:not(:first)' ),
        rowCount = rows.length,
        weightsTable = [],
        i, j, row, cell, sumTotal, termSumTotal, monthSum, cells, value;

      // Loop through each row
      for ( i = 0; i < rowCount - 1; i++ ) {
        weightsTable.push( [] );
        row = $( rows[ i ]);

        // Loop through each cell in the row, pushing 'included' months into
        // the data array
        for ( j = 0; j < 12; j++ ) {
          cell = row.children( '[data-col="' + j + '"]' );

          if ( cell.hasClass( 'included' )) {
            weightsTable[ i ].push( Number( cell.attr( 'data-weight' )));
          } else {
            weightsTable[ i ].push( 0 );
          }
        }
      }

      // Calculate the mean search volume of each row's mean
      // to get the overall mean
      sumTotal = d3.sum( weightsTable, function ( d, i ) {

        // Calculate search volume mean per row
        termSumTotal = d3.sum( d, function ( e ) {
          return e;
        });

        // Add the row's mean to the end of the data array
        // (i.e. the last column of the table)
        weightsTable[ i ].push( termSumTotal );
        return termSumTotal;
      });

      weightsTable.push( [] );

      // Calculate mean of each month's search volume, then % difference
      // from overall mean
      for ( j = 0; j < weightsTable[ 0 ].length; j++ ) {

        // Calculate total mean per month across all years
        monthSum = d3.sum( weightsTable, function ( d, i ) {

          // Looping through month rows, if data month matches the loop number,
          // return the unmodified weight.
          return d[ j ];
        });

        weightsTable[ weightsTable.length - 1 ].push( monthSum );
      }

      console.log(weightsTable);

      // Loop through 'included' cells of weights table and the weights array
      // to change text of table cells to reflect new weights
      for ( i = 0; i < weightsTable.length; i++ ) {
        row = $( rows[ i ]);
        cells = row.children( 'td' );

        for ( j = 0; j < weightsTable[ i ].length; j++ ) {
          cell = cells[ j ];
          value = (( weightsTable[ i ][ j ] / sumTotal ) * 100 ).toFixed( 2 );
          $( cell ).text( value + '%' );
        }
      }
    }
  };
})(d3, jQuery);