///////////////////////////////
//// JQUERY EVENT HANDLERS ////
///////////////////////////////

( function ( $ ) {

  'use strict';

  // Disable submit button if there's no text in the search term field,
  // enable it if there is text
  $( '#terms' ).keyup( function () {
    var text = $( '#terms' ).val(),
      submitBtn = $( '#search-submit' ),
      submitDisabled = submitBtn.prop( 'disabled' );

    if ( text !== '' && submitDisabled ) {
      submitBtn.prop( 'disabled', false );
    }
    if ( text === '' && !submitDisabled ) {
      submitBtn.prop( 'disabled', true );
    }
  });

  // Form submit listener to make call to Google Trends
  $( 'form' ).submit( function ( event ) {
    event.preventDefault();
    var form = $( 'form' ),
      searchTerms = form.find( 'input[name=terms]' ).val(),
      country = form.find( 'select[name=country]' ).val(),
      startDate = form.find( 'input[name=start]' ).val(),
      startYM = startDate.split( '-' ),
      startYear = parseFloat( startYM[ 0 ]),
      startMonth = parseFloat( startYM[ 1 ]),
      endDate = form.find( 'input[name=end]' ).val(),
      endYM = endDate.split( '-' ),
      endYear = parseFloat( endYM[ 0 ]),
      endMonth = parseFloat( endYM[ 1 ]),
      today = new Date(),
      thisYear = today.getFullYear(),
      thisMonth = today.getMonth() + 1,
      url = form.attr( 'action' ),
      queryUrl = 'q=' + encodeURIComponent( searchTerms ),
      geoUrl, startUrl, monthUrl, dateUrl, monthDiff, params, callUrl,
      yearString, monthString;

      geoUrl = country === '' ? '' : '&geo=' + encodeURIComponent( country );

      // If no dates chosen, don't specify dates in query URL
      if ( startDate === '' && endDate === '' ) {
        dateUrl = '';

      } else {
        // Set the lower limit for date range (if year or month left blank,
        // they = NaN)
        if ( startYear < 2004 && startMonth < 1 || !startYear || !startMonth ) {
          startYear = 2004;
          startMonth = 1;
          $( 'input[name=start]' ).val( '2004-01' );
        }

        // Set the upper limit for date range (if year or month left blank,
        // they = NaN)
        if ( endYear > thisYear || endYear === thisYear &&
          endMonth > thisMonth || !endYear || !endMonth ) {
            endYear = thisYear;
            endMonth = thisMonth;
            yearString = endYear.toString();
            monthString = endMonth < 10 ? '0' + endMonth.toString() :
              endMonth.toString();
            $( 'input[name=end]' ).val( yearString + '-' + monthString );
        }

        startUrl = startMonth.toString() + '/' + startYear.toString();
        monthDiff = ( endYear - startYear ) * 12 - startMonth + endMonth + 1;

        // Month difference must be > 36 for Google Trends to return
        // data by month
        if ( monthDiff < 37 ) {
          return alert( 'Start and end dates must be more than 3 years apart' +
            ' to get monthly data (otherwise, data is broken down by week)' );
        }

        monthUrl = monthDiff.toString() + 'm';
        dateUrl = '&date=' + encodeURIComponent( startUrl + ' ' + monthUrl );
      }

      // Join URL parameter strings, then create the whole URL
      params = '?' + queryUrl + geoUrl + dateUrl +
          '&cid=TIMESERIES_GRAPH_0&export=3';
      callUrl = url + params;

    console.log(callUrl);
    getData( callUrl );
  });

  // Create CSV click listener to create & download file
  $( '#csv' ).click( function ( event ) {
    var tables = $( 'table' ),
      tableCount = tables.length,
      csvContent = "data:text/csv;charset=utf-8,",
      i, j, k, l, table, tableRows, rowCount, colCount, tableCells, rowParentName,
      encodedUri, link, tableRow, tableString, excluded, headRowCount, cell,
      tableLabel, thead, tbody, titleRows, titles, titleCount, title;

    // Create CSV string from data table on page
    // Iterate through each table
    for ( i = 0; i < tableCount; i++ ) {

      table = tables[ i ];
      thead = $( table ).children( 'thead' );
      titles = thead.find( 'h3,h4,h5,h6' );
      titleCount = titles.length;
      tbody = $( table ).children( 'tbody' );
      tableRows = tbody.children( 'tr' );
      rowCount = tableRows.length;
      colCount = tableRows.first().children( 'th' ).length;

      // Add table titles separately with an extra space below
      for( j = 0; j < titleCount; j++ ) {
        title = $( titles[ j ]).text();
        csvContent += title + '\n';
      }
      csvContent += '\n';

      // Iterate through each row
      for ( j = 0; j < rowCount; j++ ) {
        tableRow = tableRows[ j ];
        tableCells = $( tableRow ).children( 'th,td' );


        // Iterate through each cell in the row, adding the text
        // to the row string
        for ( k = 0; k < colCount; k++ ) {
          cell = tableCells[ k ];
          excluded = $( cell ).hasClass( 'excluded' );

          // Only add columns that aren't excluded from monthly weights table
          // (doesn't affect raw trends data table)
          if ( !excluded ) {
            csvContent += $( cell ).text();

            // Commas to separate columns, finishing with a line break
            // at the end of the row
            csvContent += k < colCount - 1 ? ',' : '\n';
          }
        }
      }
      csvContent += '\n\n';
    }

    // Use CSV string to create CSV file, then download it
    encodedUri = encodeURI( csvContent );
    link = document.createElement( 'a' );
    link.setAttribute( 'href', encodedUri );
    link.setAttribute( 'download', 'monthly-data.csv');

    link.click();
  });

  // Click listener for button to reset excluded months
  // on monthly weights table
  $( '#reset' ).click( function () {
    var excludedCells = $( '#table1' ).find( '.excluded' );
    excludedCells.removeClass( 'excluded' );
    excludedCells.addClass( 'included' );
    calculateWeights();
  });

  // Event handler for 'go to top of page' button click
  $( '#top' ).click( function () {
  $( 'body' ).animate({ scrollTop: 0 }, 'slow' );
  });

  // Event handler to attach/detach navbar to top of window depending
  // on scroll position
  $( window ).scroll( function () {
    var navDiv = $( '#nav-div' ),
      nav = $( 'nav' ),
      // navPos = $('#csv-div')[ 0 ].offsetTop,
      navDivPos = navDiv[ 0 ].offsetTop,
      browserPos = window.pageYOffset;

    if ( browserPos > navDivPos ) {
      nav.addClass( 'navbar-fixed-top' );
    }

    if ( browserPos < navDivPos ) {
      nav.removeClass( 'navbar-fixed-top' );
    }
  });
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

  var data = response.getDataTable(),
    colLabels = data.If,
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
  $( '[data-col]' ).mousedown( function ( event ) {
    var cell = $( this );

    event.preventDefault();
    col = +cell.attr( 'data-col' );
    firstCol = col;
    colCells = cell.closest( 'table' ).find( '[data-col="' + col + '"]' );
    mousedown = true;
    included = cell.hasClass( 'excluded' );
  })

  .mouseover( function () {
    var prevCol = col,
      prevColCells = colCells,
      cell = $( this ),
      toggleColCells, minCol, maxCol;

    minCol = 11;
    maxCol = 0;

    col = +cell.attr( 'data-col' );
    colCells = cell.closest( 'table' ).find( '[data-col="' + col + '"]' );

    if ( mousedown && col !== prevCol && col !== firstCol ) {
      if ( col < firstCol ) {

        for ( i = 0; i < 12; i++ ) {
          toggleColCells = cell.closest( 'table' ).find( '[data-col="' + i + '"]' );

          if ( col <= i && i <= firstCol ) {
            toggleColCells.addClass( 'table-hover' );
          } else {
            toggleColCells.removeClass( 'table-hover' );
          }
        }

        minCol = col;

      } else {

        for ( i = 0; i < 12; i++ ) {
          toggleColCells = cell.closest( 'table' ).find( '[data-col="' + i + '"]' );

          if ( firstCol <= i && i <= col ) {
            toggleColCells.addClass( 'table-hover' );
          } else {
            toggleColCells.removeClass( 'table-hover' );
          }
        }

        maxCol = col;
      }
    }
  });

  $( document ).mouseup( function () {
    if ( mousedown ) {
      var toggleCells = $( '.table-hover' );

      mousedown = false;
      toggleCells.removeClass( 'table-hover' );

      if ( included ) {
        toggleCells.addClass( 'included' );
        toggleCells.removeClass( 'excluded' );
      } else {
        toggleCells.addClass( 'excluded' );
        toggleCells.removeClass( 'included' );
      }

      calculateWeights();
    }
  });

  // Add mouse hover effect to included columns to highlight months that user can
  // exclude
  $( '.included' ).hover( function () {
    var column = $( this ).attr( 'data-col' ),
      columnCells = $( '#table1' ).find( '[data-col="' + column + '"]' );

    if ( !mousedown ) { columnCells.addClass( 'table-hover' ); }
  }, function () {
    var column = $( this ).attr( 'data-col' ),
      columnCells = $( '#table1' ).find( '[data-col="' + column + '"]' );

    columnCells.removeClass( 'table-hover' );
  });

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
    sums = [],
    colCount = data.If.length,
    i, j, term, sumTotal, termSumTotal, key, date, month, monthSum, sum,
    weight, termWeight;

  // Loop through each search term, then add totals at the end
  for ( i = 1; i < colCount + 1; i++ ) {
    term = data.If[ i ] ? "'" + data.If[ i ].label + "'" : 'Monthly Weight';
    tableString += '<tr><th>' + term + '</th>';

    // Calculate the mean search volume of each row's mean
    // to get the overall mean
    sumTotal = d3.sum( data.Jf, function ( d ) {

      // Calculate search volume mean per row
      termSumTotal = d3.sum( d.c, function ( e ) {
        if ( Number.isInteger( e.v )) {
          return e.v;
        }
      });
      return termSumTotal;
    });

    // Save termAvgTotal to add to table later
    if ( data.If[ i ]) {
      termSumTotal = d3.sum( data.Jf, function ( d ) {
        return d.c[ i ].v;
      });
    } else {
      termSumTotal = sumTotal;
    }

    // Calculate mean of each month's search volume, then % difference
    // from overall mean
    for ( j = 0; j < 12; j++ ) {

      // Calculate total mean per month across all years
      monthSum = d3.sum( data.Jf, function ( d ) {
        date = new Date( d.c[ 0 ].v );
        month = date.getMonth();

        // Looping through month rows, if data month matches the loop number,
        // return the search volume. On last weights table row, calculate the mean
        // for the whole trends data row 
        // (e.g. mean for March 2006 for allsearch terms)
        if ( j === month ) {
          if ( d.c[ i ] ) {
            sum = d.c[ i ].v;
          } else {
            sum = d3.sum( d.c, function ( e ) {
              if ( Number.isInteger( e.v )) {
                return e.v;
              }
            });
          }
          return sum;
        }
      });

      // Calculate weight and add to table string
      weight = (( monthSum / sumTotal ) * 100 ).toFixed( 2 );
      tableString += '<td data-col="' + j + '" class="included" data-weight="' +
        weight + '">' + weight + '%</td>';
    }
    termWeight = (( termSumTotal / sumTotal ) * 100 ).toFixed( 2 );
    tableString += '<td class="included">' + termWeight + '%</td></tr>';
  }
  return tableString;
}

// Create raw trends table
function trendsTable ( data ) {
  'use strict';

  var colLabels = data.If,
    colsLength = colLabels.length,
    rows = data.Jf,
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
      tableString += '<td>' + rowData[ j ].f + '</td>';
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
    cells = row.children( '.included' );

    for ( j = 0; j < weightsTable[ i ].length; j++ ) {
      cell = cells[ j ];
      value = (( weightsTable[ i ][ j ] / sumTotal ) * 100 ).toFixed( 2 );
      $( cell ).text( value + '%' );
    }
  }
}