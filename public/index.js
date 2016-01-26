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
      i, j, k, table, tableRows, rowCount, colCount, tableCols, tableCol,
      encodedUri, link, tableRow, tableString, colElement;

    // Create CSV string from data table on page
    // Iterate through each table
    for ( i = 0; i < tableCount; i++ ) {

      table = tables[ i ];
      tableRows = $( table ).find( 'tr' );
      rowCount = tableRows.length;
      colCount = $( table ).children( 'thead' )
        .find( 'tr:nth-child(2)' )
        .children( 'th' )
        .length;

      // Iterate throw each row
      for ( j = 0; j < rowCount; j++ ) {
        tableRow = tableRows[ j ];

        colElement = j< 2 ? 'th' : 'td';
        tableCols = $( tableRow ).children( colElement );

        // Iterate through each cell in the row, adding the text
        // to the row string, with commas to separate columns
        for ( k = 0; k < colCount; k++ ) {
          csvContent += $( tableCols[ k ]).text();
          csvContent += k < colCount - 1 ? ',' : '\n';
        }

        if ( j === rowCount - 1 ) {
          csvContent += '\n';
        }
      }
    }

    // Use CSV string to create CSV file, then download it
    encodedUri = encodeURI( csvContent );
    link = document.createElement( 'a' );
    link.setAttribute( 'href', encodedUri );
    link.setAttribute( 'download', 'monthly-data.csv');

    link.click();
  });

  // Event handler for 'go to top of page' button click
  $( '#top' ).click( function ( event ) {
    window.scrollTo( 0, 0 );
  });

  // Event handler to attach/detach navbar to top of window depending
  // on scroll position
  $( window ).scroll( function ( event ) {
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

  var data = response.getDataTable(),
    colLabels = data.If,
    colsLength = colLabels.length,
    table2 = $( '#table2' ),
    thead2 = table2.children( 'thead' ),
    labelRow2 = thead2.children( 'tr' )[ 1 ],
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
      'Everyday!'
    ],
    messageCount = messages.length,
    message = messages[ Math.floor( Math.random() * messageCount )],
    weightsString, colSpan, termsString, scrollTarget, trendsArray,
    labelString, trendsString, i;

  // Handle error
  if (response.isError()) {
    alert('Error in query: ' + response.getMessage() + ' ' +
      response.getDetailedMessage());
    return;
  }

  console.log(data);

  for ( i = 1; i < colsLength; i++ ) {
    if ( colsLength > 2 && i === colsLength - 1 ) {
      termsArray.push( "and '" + colLabels[ i ].label + "'" );
    } else {
      termsArray.push( "'" + colLabels[ i ].label + "'" );
    }
  }

  // Empty existing table, and set up new one
  $( labelRow2 ).empty();
  tbody2.empty();
  $( labelRow1 ).children( '.excluded' ).removeClass( 'excluded' );
  $( labelRow1 ).children( '[data-included="0"]' ).attr( 'data-included', '1' );
  tbody1.empty();

  // Process data to get monthly weights table
  weightsString = weightsTable( data );
  tbody1.append( weightsString );

  // Process data to get raw trends table
  trendsArray = trendsTable( data );
  labelString = trendsArray[ 0 ];
  trendsString = trendsArray[ 1 ];
  $( labelRow2 ).append( labelString );
  tbody2.append( trendsString );

  // Add click listener to toggle whether or not given months are included
  // in monthly weights
  $( '.included,.excluded' ).click( function ( event ) {
    var cell = $( this ),
      col = cell.attr( 'data-col' ),
      colCells = cell.closest( 'table' ).find( '[data-col="' + col + '"]' );

    colCells.toggleClass( 'excluded' );
    colCells.toggleClass( 'included' );
    calculateWeights();
  });

  // Append the string that represents the table's inner HTML to the DOM
  colSpan = ( colsLength + 1 ).toString();
  thead2.children( 'tr' ).first().children( 'th' ).attr( 'colspan', colSpan );
  termsString = termsArray.join( ', ' );
  csvDiv.find( 'h3' ).first().text( "Here's your trends data for " +
    termsString + '.');
  csvDiv.find( 'h3' ).last().text( message );

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
    colCount = data.If.length,
    i, j, term, avgTotal, termAvgTotal, key, date, month, monthAvg, avg,
    weight, termWeight;

  // Loop through each search term, then add totals at the end
  for ( i = 1; i < colCount + 1; i++ ) {
    term = data.If[ i ] ? "'" + data.If[ i ].label + "'" : 'Monthly Weight';
    // tableData.push([ term ]);
    tableString += '<tr><td>' + term + '</td>';

    // Calculate the mean search volume of each row's mean
    // to get the overall mean
    avgTotal = d3.mean( data.Jf, function ( d ) {

      // Calculate search volume mean per row
      termAvgTotal = d3.mean( d.c, function ( e ) {
        if ( Number.isInteger( e.v )) {
          return e.v;
        }
      });
      return termAvgTotal;
    });

    if ( data.If[ i ]) {
      termAvgTotal = d3.mean( data.Jf, function ( d ) {
        return d.c[ i ].v;
      });
    } else {
      termAvgTotal = avgTotal;
    }

    // Calculate mean of each month's search volume, then % difference
    // from overall mean
    for ( j = 0; j < 12; j++ ) {

      // Calculate total mean per month across all years
      monthAvg = d3.mean( data.Jf, function ( d ) {
        date = new Date( d.c[ 0 ].v );
        month = date.getMonth();

        // Looping through month rows, if data month matches the loop number,
        // return the search volume. On last row, calculate the mean
        // for for the whole row (e.g. mean for March 2006)
        if ( j === month ) {
          if ( d.c[ i ] ) {
            avg = d.c[ i ].v;
          } else {
            avg = d3.mean( d.c, function ( e ) {
              if ( Number.isInteger( e.v )) {
                return e.v;
              }
            });
          }
          return avg;
        }
      });
      weight = ( monthAvg / avgTotal ).toFixed( 2 );
      tableString += '<td data-col="' + j + '" class="included" data-weight="' +
        weight + '">' + weight + '</td>';
    }
    termWeight = ( termAvgTotal / avgTotal ).toFixed( 2 );
    tableString += '<td class="included">' + termWeight + '</td></tr>';
  }
  return tableString;
}

// Create trends table
function trendsTable ( data ) {
  'use strict';

  var colLabels = data.If,
    colsLength = colLabels.length,
    rows = data.Jf,
    rowsLength = rows.length,
    termsArray = [],
    tableString = '',
    rowString = '<th>Year</th><th>Month</th>', // Date is always first column
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
    rowString += '<th>' + "'" + colLabels[ i ].label + "'" +
      ' Search Volume</th>';
  }

  // Append the string that represents the 'thead' inner HTML to the DOM,
  // then reset the tableString

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
  return [ rowString, tableString ];
}

// Calculate monthly weights table to help with creating spend plans
function calculateWeights () {
  'use strict';

  var table = $( '#table1' ),
    rows = table.children( 'tbody' ).children( 'tr' ),
    rowCount = rows.length,
    colCount = table.find( 'th' ).length,
    weightsTable = [],
    i, j, row, cell, avgTotal, termAvgTotal, monthAvg, cells, value;

  // Loop through each search term, then add totals at the end
  for ( i = 0; i < rowCount - 1; i++ ) {
    weightsTable.push( [] );
    row = $( rows[ i ]);

    for ( j = 0; j < 12; j++ ) {
      cell = row.children( '[data-col="' + j + '"]' );

      if ( cell.hasClass( 'included' )) {
        weightsTable[ i ].push( Number( cell.attr( 'data-weight' )));
      }
    }
  }

  // Calculate the mean search volume of each row's mean
  // to get the overall mean
  avgTotal = d3.mean( weightsTable, function ( d, i ) {

    // Calculate search volume mean per row
    termAvgTotal = d3.mean( d, function ( e ) {
      return e;
    });
    weightsTable[ i ].push( termAvgTotal );
    return termAvgTotal;
  });

  weightsTable.push( [] );

  // Calculate mean of each month's search volume, then % difference
  // from overall mean
  for ( j = 0; j < weightsTable[ 0 ].length; j++ ) {

    // Calculate total mean per month across all years
    monthAvg = d3.mean( weightsTable, function ( d, i ) {

      // Looping through month rows, if data month matches the loop number,
      // return the search volume. On last row, calculate the mean
      // for for the whole row (e.g. mean for March 2006)
      return d[ j ];
    });
    weightsTable[ weightsTable.length - 1 ].push( monthAvg );
  }

  console.log(weightsTable);

  // Loop through each search term, then add totals at the end
  for ( i = 0; i < weightsTable.length; i++ ) {
    row = $( rows[ i ]);
    cells = row.children( '.included' );

    for ( j = 0; j < weightsTable[ i ].length; j++ ) {
      cell = cells[ j ];
      value = ( weightsTable[ i ][ j ] / avgTotal ).toFixed( 2 );
      $( cell ).text( value );
    }
  }
}