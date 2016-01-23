'use strict';

// jQuery event listeners
( function ( $ ) {

  // Disable submit button if there's no text in the search term field,
  // enable it if there is text
  $( '#terms' ).keyup( function ( event ) {
    var text = $( '#terms' ).val(),
      submitBtn = $( '#search-submit' ),
      submitDisabled = submitBtn.prop( 'disabled' );

    if ( text !== '' && submitDisabled ) { submitBtn.prop( 'disabled', false );}
    if ( text === '' && !submitDisabled ) { submitBtn.prop( 'disabled', true );}
  })

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
      geoUrl, startUrl, monthUrl, dateUrl, monthDiff, params, callUrl, yearString, monthString;

      country === '' ? geoUrl = '' :
        geoUrl = '&geo=' + encodeURIComponent( country );

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
        if ( endYear > thisYear || endYear === thisYear && endMonth > thisMonth ||
          !endYear || !endMonth ) {
            endYear = thisYear;
            endMonth = thisMonth;
            yearString = endYear.toString();
            endMonth < 10 ? monthString = '0' + endMonth.toString() :
              monthString = endMonth.toString();
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
      encodedUri, link, tableRow, rowString;

    // Create CSV string from data table on page
    // Iterate through each table
    for ( i = 0; i < tableCount; i++ ) {

      table = tables[ i ];
      tableRows = $( table ).find( 'tr' );
      rowCount = tableRows.length;
      colCount = $( table ).children( 'thead' )
        .find( 'tr:nth-child(2)' )
        .children( 'th' )
        .length

      // Iterate throw each row
      for ( j = 0; j < rowCount; j++ ) {
        tableRow = tableRows[ j ];

        j < 2 ? tableCols = $( tableRow ).children( 'th' ) :
          tableCols = $( tableRow ).children( 'td' );

        // Iterate through each cell in the row, adding the text
        // to the row string, with commas to separate columns
        for ( k = 0; k < colCount; k++ ) {
          csvContent += $( tableCols[ k ]).text();
          k < colCount - 1 ? csvContent += ',' : csvContent += '\n';
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

// Make call to Google Trends
function getData ( url ) {
  var query = new google.visualization.Query( url );
  query.send( handleData );
}

// Query callback to process the data object
function handleData (response) {
  if (response.isError()) {
    alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
    return;
  }

  var data = response.getDataTable(),
    colLabels = data.If,
    colsLength = data.If.length,
    rows = data.Jf,
    rowsLength = rows.length,
    table2 = $( '#table2' ),
    thead2 = table2.children( 'thead' ),
    labelRow = thead2.children( 'tr' )[ 1 ],
    tbody2 = table2.children( 'tbody' ),
    table1 = $( '#table1' ),
    tbody1 = table1.children( 'tbody' ),
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
    termsArray = [],
    csvDiv = $( '#csv-div' ),
    dateData, rowData, rawMonth, correctMonth, date, year, i, k, weightsString,
    colSpan, termsString, scrollTarget;

  console.log(data);

  // Empty existing table, and set up new one
  $( labelRow ).empty();
  tbody2.empty();
  tbody1.empty();

  // Process data to get monthly weights
  weightsString = monthWeights( data );
  tbody1.append( weightsString );

  // After month/year, add 1 column label per search term
  for ( i = 1; i < colsLength; i++ ) {
    if ( colsLength > 2 && i === colsLength - 1 ) {
      termsArray.push( "and '" + colLabels[ i ].label + "'" );
    } else {
      termsArray.push( "'" + colLabels[ i ].label + "'" );
    }

    rowString += '<th>' + "'" + colLabels[ i ].label + "'" + ' Search Volume</th>';
  }

  // Append the string that represents the 'thead' inner HTML to the DOM,
  // then reset the rowString
  $( labelRow ).append( rowString );
  rowString = '';

  // Create new row
  for ( i = 0; i < rowsLength; i++ ) {
    rowString += '<tr>';
    rowData = rows[ i ].c;
    date = new Date( rowData[ 0 ].v );
    year = date.getFullYear();

    // Split date string into month & year, then get month only
    rawMonth = rowData[ 0 ].f.split( ' ' ).shift();

    // Convert month string to correct month
    correctMonth = monthConverter[ rawMonth ];

    // Add year/month labels to row
    rowString += '<td>' + year + '</td><td>' + correctMonth + '</td>';

    // Create a new cell in table per data point in row
    for ( k = 1; k < colsLength; k++ ) {
      rowString += '<td>' + rowData[ k ].f + '</td>';
    }

    // Close the row
    rowString += '</tr>';
  }

  // Append the string that represents the table's inner HTML to the DOM
  tbody2.append( rowString );
  colSpan = ( colsLength + 1 ).toString();
  thead2.children( 'tr' ).first().children( 'th' ).attr( 'colspan', colSpan );
  termsString = termsArray.join( ', ' );
  csvDiv.find( 'h3' ).first().text( "Here's your trends data for " + termsString + '.');

  csvDiv.removeClass( 'hidden' );
  scrollTarget = csvDiv[ 0 ].offsetTop;
  // window.scrollTo( 0, scrollTarget );
  $( 'body' ).animate({ scrollTop: scrollTarget }, 'slow' );
}

// Calculate monthly weights table to help with creating spend plans
function monthWeights ( data ) {
  var tableData = [],
    tableString = '',
    avgs = [],
    colCount = data.If.length,
    i, j, term, avgTotal, avg, key, date, month, monthAvg, monthAvgTotal;

  // Loop through each search term, then add totals at the end
  for ( i = 1; i < colCount + 1; i++ ) {
    data.If[ i ] ? term = data.If[ i ].label : term = 'Monthly Weight';
    // tableData.push([ term ]);
    tableString += '<tr><td>' + "'" + term + "'" + '</td>';

    // Calculate the mean search volume of each row's mean
    // to get the overall mean
    avgTotal = d3.mean( data.Jf, function ( d ) {

      // Calculate search volume mean per row
      avg = d3.mean( d.c, function ( e ) {
        if ( Number.isInteger( e.v )) {
          return e.v;
        }
      });

      return avg;
    });

    if ( data.If[ i ]) {
      avg = d3.mean( data.Jf, function ( d ) {
        return d.c[ i ].v;
      });
    } else {
      avg = avgTotal;
    }

    // Calculate mean of each month's search volume, then % difference
    // from overall mean
    for ( j = 0; j < 12; j++ ) {

      // Calculate total mean per month across all years
      monthAvgTotal = d3.mean( data.Jf, function ( d ) {
        date = new Date( d.c[ 0 ].v );
        month = date.getMonth();

        // Looping through month rows, if data month matches the loop number,
        // return the search volume. On last row, calculate the mean
        // for for the whole row (e.g. mean for March 2006)
        if ( j === month ) {
          if ( d.c[ i ] ) {
            monthAvg = d.c[ i ].v;
          } else {
            monthAvg = d3.mean( d.c, function ( e ) {
              if ( Number.isInteger( e.v )) {
                return e.v;
              }
            });
          }

          return monthAvg;
        }
      });

      tableString += '<td>' + ( monthAvgTotal / avgTotal ).toFixed( 2 ) + '</td>';
      // tableData[ i - 1 ].push( monthAvgTotal / avgTotal );
    }

    tableString += '<td>' + ( avg / avgTotal ).toFixed( 2 ) + '</td></tr>';
  }

  return tableString;
}