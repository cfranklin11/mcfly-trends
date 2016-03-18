///////////////////////////////
//// JQUERY EVENT HANDLERS ////
///////////////////////////////

( function ( $ ) {

  'use strict';

  // Create CSV click listener to create & download file
  // $( '#csv' ).click( function ( event ) {
  //   var tables = $( 'table' ),
  //     tableCount = tables.length,
  //     csvContent = "data:text/csv;charset=utf-8,",
  //     i, j, k, l, table, tableRows, rowCount, colCount, tableCells, rowParentName,
  //     encodedUri, link, tableRow, tableString, excluded, headRowCount, cell,
  //     tableLabel, thead, tbody, titleRows, titles, titleCount, title;

  //   // Create CSV string from data table on page
  //   // Iterate through each table
  //   for ( i = 0; i < tableCount; i++ ) {

  //     table = tables[ i ];
  //     thead = $( table ).children( 'thead' );
  //     titles = thead.find( 'h4' );
  //     titleCount = titles.length;
  //     tbody = $( table ).children( 'tbody' );
  //     tableRows = tbody.children( 'tr' );
  //     rowCount = tableRows.length;
  //     colCount = tableRows.first().children( 'th' ).length;

  //     // Add table titles separately with an extra space below
  //     for( j = 0; j < titleCount; j++ ) {
  //       title = $( titles[ j ]).text();
  //       csvContent += title + '\n';
  //     }
  //     csvContent += '\n';

  //     // Iterate through each row
  //     for ( j = 0; j < rowCount; j++ ) {
  //       tableRow = tableRows[ j ];
  //       tableCells = $( tableRow ).children( 'th,td' );


  //       // Iterate through each cell in the row, adding the text
  //       // to the row string
  //       for ( k = 0; k < colCount; k++ ) {
  //         cell = tableCells[ k ];
  //         csvContent += $( cell ).text();

  //         // Commas to separate columns, finishing with a line break
  //         // at the end of the row
  //         csvContent += k < colCount - 1 ? ',' : '\n';
  //       }
  //     }
  //     csvContent += '\n\n';
  //   }

  //   // Use CSV string to create CSV file, then download it
  //   encodedUri = encodeURI( csvContent );
  //   link = document.createElement( 'a' );
  //   link.setAttribute( 'href', encodedUri );
  //   link.setAttribute( 'download', 'monthly-data.csv');

  //   link.click();
  // });

  // // Click listener for button to reset excluded months
  // // on monthly weights table
  // $( '#reset' ).click( function () {
  //   var excludedCells = $( '#table1' ).find( '.excluded' );
  //   excludedCells.removeClass( 'excluded' );
  //   excludedCells.addClass( 'included' );
  //   calculateWeights();
  // });

  // // Event handler for 'go to top of page' button click
  // $( '#top' ).click( function () {
  // $( 'body' ).animate({ scrollTop: 0 }, 'slow' );
  // });

  // // Event handler to attach/detach navbar to top of window depending
  // // on scroll position
  // $( window ).scroll( function () {
  //   var navDiv = $( '#nav-div' ),
  //     nav = $( 'nav' ),
  //     // navPos = $('#csv-div')[ 0 ].offsetTop,
  //     navDivPos = navDiv[ 0 ].offsetTop,
  //     browserPos = window.pageYOffset;

  //   if ( browserPos > navDivPos ) {
  //     nav.addClass( 'navbar-fixed-top' );
  //   }

  //   if ( browserPos < navDivPos ) {
  //     nav.removeClass( 'navbar-fixed-top' );
  //   }
  // });
})( jQuery );

/////////////////////////
//// DATA PROCESSING ////
/////////////////////////

// Make call to Google Trends
function getData ( url ) {
  'use strict';

  var query = new google.visualization.Query( url );
  query.send( processData );
}

// Query callback to process the data object
function processData (response) {
  'use strict';

  // Handle errors
  if (response.isError()) {
    alert('Error in query: ' + response.getMessage() + ' ' +
      response.getDetailedMessage());
    return;
  }

  var data = response.getDataTable();
  console.log(data);
    var colLabels = data.Kf,
    colsLength = colLabels.length,table2 = $( '#table2' ),
    tbody2 = table2.children( 'tbody' ),
    table1 = $( '#table1' ),
    thead1 = table1.children( 'thead' ),
    labelRow1 = thead1.children( 'tr' )[ 1 ],
    tbody1 = table1.children( 'tbody' ),
    termsArray = [],
    csvDiv = $( '#csv-div' ),
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
    ],
    mousedown = false,
    test = 'a',
    messageCount = messages.length,
    message = messages[ Math.floor( Math.random() * messageCount )],
    weightsString, colSpan, termsString, scrollTarget, trendsArray,
    labelString, trendsString, i, col, colCells, firstCol, included;

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