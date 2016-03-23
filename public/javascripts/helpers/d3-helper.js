'use strict';

var bbApp = bbApp || {};

(function(d3, $) {

  bbApp.d3Helper = {

    // Query callback to process the data object
    processData: function(response) {
      var data, colsLength, totalWeight, weights, i, termString, weightsArray,
        termWeight, model, modelWeights, modelPercents, termPercent;

      // Handle errors
      if (response.isError()) {
        alert('Error in query: ' + response.getMessage() + ' ' +
          response.getDetailedMessage());
        return;
      }

      data = response.getDataTable();
      colsLength = data.Kf.length;
      totalWeight = 0;
      weights = bbApp.weights;

      for (i = 1; i < colsLength + 1; i++) {
        termString = this.createTermsArray(data, i);

        // Process data to get monthly weights table
        weightsArray = this.calculateWeights(data, colsLength, i);
        termWeight = d3.sum(weightsArray, sumCalc(d));
        totalWeight += termWeight;

        console.log(weightsArray);

        weights.add({
          term: termString,
          monthWeights: weightsArray,
          termWeight: termWeight
        });
      }

      for (i = 0; i < weights.length; i++) {
        model = weights[i];
        modelWeights = model.monthWeights;

        modelPercents = modelWeights.map(this.calculatePercent(value, modelWeights));
        termPercent = this.calculatePercent(model.termWeight, modelWeights);

        model.set({
          monthPercents: modelPercents,
          termPercent: termPercent
        });
      }
      // // Reveal data tables and auto-scroll down
      // csvDiv.removeClass( 'hidden' );
      // scrollTarget = csvDiv[ 0 ].offsetTop;
      // $( 'body' ).animate({ scrollTop: scrollTarget }, 'slow' );

      function sumCalc(d) {
        return d;
      }
    },
    createTermsArray: function(data, i) {
      return data.Kf[ i ] ? "'" + data.Kf[ i ].label + "'" : 'Monthly Weight';
    },
    calculateWeights: function (data, length, i) {
      var tableData, tableString, avgs, j, monthAvg, date, month, avg,
        termAvgTotal;

      tableData = [];
      tableString = '';
      avgs = [];

      // Calculate mean of each month's search volume
      for ( j = 0; j < 12; j++ ) {

        // Calculate total mean per month across all years
        monthAvg = d3.mean( data.Lf, monthAvgCalc(d));
        avgs[ i - 1 ].push( monthAvg );
      }

      // Calculate overall mean for each search term
      termAvgTotal = d3.sum( avgs[ i - 1 ], function ( d ) {
        return d;
      });
      avgs[ i - 1 ].push( termAvgTotal );

      console.log(avgs);
      return avgs;

      function monthAvgCalc(d) {
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
            avg = d3.mean( d.c, avgCalc(e));

            // To get total monthly weights, multiply monthly means by
            // # of search terms
            avg *= length - 1;
          }
          return avg;
        }
      }

      function avgCalc(d) {
        // Check if data exists (when trying to get data from recent
        // months, Google Trends sometimes returns 'null' values)
        if ( d ) {
          if ( Number.isInteger( d.v )) {
            return d.v;
          }
        }
      }
    },
    calculatePercent: function(value, i, array) {
      var total;
      total = d3.sum(array, function(d) {
        return d;
      });
      return ((value / total) * 100).toFixed(2);
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
        monthSum = d3.sum( weightsTable, sumCalc(d));

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

      function sumCalc(d) {
        return d[j];
      }
    }
  };
})(d3, jQuery);