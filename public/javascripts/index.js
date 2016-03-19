

//////////////////////////////
//// CREATE TABLE STRINGS ////
//////////////////////////////

// Calculate monthly weights table to help with creating spend plans
function weightsTable ( data ) {
  'use strict';

  var tableData = [],
    tableString = '',
    avgs = [],
    colCount = data.Kf.length,
    i, j, term, avgTotal, termAvgTotal, key, date, month, monthAvg, avg,
    weight, termWeight;

  // Loop through each search term, pushing monthly means to avgs array,
  // then add overall mean for each term at the end of the row
  for ( i = 1; i < colCount + 1; i++ ) {
    avgs.push( [] );

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
  }

  // Save overall average, multiplied by # of terms, to calculate weights
  avgTotal = avgs[ colCount - 1 ][ 12 ];

  // Loop through avgs array to build a string that will be the html table
  // Loop through the rows
  for ( i = 1; i < colCount + 1; i++ ) {
    term = data.Kf[ i ] ? "'" + data.Kf[ i ].label + "'" : 'Monthly Weight';
    tableString += '<tr><th>' + term + '</th>';

    // Loop through columns (the months), calculating the weight
    // (mean / (overall mean * # of search terms)) and adding it to the string
    for ( j = 0; j < 12; j++ ) {
      weight = (( avgs[ i - 1 ][ j ] / avgTotal) * 100 ).toFixed( 2 );
      tableString += '<td data-col="' + j + '" class="included" data-weight="' +
        weight + '">' + weight + '%</td>';
    }

    // Calculate overall term weight and add to string
    termWeight = (( avgs[ i - 1 ][ 12 ] / avgTotal ) * 100 ).toFixed( 2 );
    tableString += '<td class="included">' + termWeight + '%</td></tr>';
  }

  return tableString;
}

// Create raw trends table
function trendsTable ( data ) {
  'use strict';

  var colLabels = data.Kf,
    colsLength = colLabels.length,
    rows = data.Lf,
    rowsLength = rows.length,
    termsArray = [],
    tableString = '<tr><th>Year</th><th>Month</th>',
    monthConverter = {
      January: 'February',
      February: 'March',
      March: 'April',
      April: 'May',
      May: 'June',
      June: 'July',
      July: 'August',
      August: 'September',
      September: 'October',
      October: 'November',
      November: 'December',
      December: 'January'
    },
    dateData, rowData, rawMonth, correctMonth, date, year, i, j;

  // After month/year, add 1 column label per search term
  for ( i = 1; i < colsLength; i++ ) {
    tableString += '<th>' + "'" + colLabels[ i ].label + "'" +
      ' Search Volume</th>';
  }
  tableString += '</tr>';

  // Create new row
  for ( i = 0; i < rowsLength; i++ ) {
    tableString += '<tr>';
    rowData = rows[ i ].c;
    date = new Date( rowData[ 0 ].v );
    year = date.getFullYear();

    // Split date string into month & year, then get month only
    rawMonth = rowData[ 0 ].f.split( ' ' ).shift();

    // Convert month string to correct month
    correctMonth = monthConverter[ rawMonth ];

    // Add year/month labels to row
    tableString += '<td>' + year + '</td><td>' + correctMonth + '</td>';

    // Create a new cell in table per data point in row
    for ( j = 1; j < colsLength; j++ ) {
      if ( rowData[ j ]) {
        tableString += '<td>' + rowData[ j ].f + '</td>';
      }
    }

    // Close the row
    tableString += '</tr>';
  }
  return [ tableString ];
}

// Re-calculate monthly weights after user excludes/includes months
function calculateWeights () {
  'use strict';

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