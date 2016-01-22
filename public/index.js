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
    var tableRows = $( 'tr' ),
      rowCount = tableRows.length,
      colCount = $( 'th' ).length,
      csvContent = "data:text/csv;charset=utf-8,",
      i, j, tableCols, tableCol, encodedUri, link, tableRow, rowString;

    // Create CSV string from data table on page
    if ( rowCount > 1 ) {

      // Iterate throw each row
      for ( i = 0; i < rowCount; i++ ) {
        rowString = '';
        tableRow = $( tableRows[ i ]);

        i === 0 ? tableCols = $( tableRow ).children( 'th' ) :
          tableCols = $( tableRow ).children( 'td' );

        // Iterate through each cell in the row, adding the text
        // to the row string, with commas to separate columns
        for ( j = 0; j < colCount; j++ ) {
          j < colCount - 1 ? rowString += $( tableCols[ j ]).text() + ',' :
            rowString += $( tableCols[ j ]).text();
        }

        // Add the row string to the CSV string. Add line breaks
        // at the ends of rows except on the final row
        i < rowCount - 1 ? csvContent += rowString + '\n' :
          csvContent += rowString;
      }
    }

    // Use CSV string to create CSV file, then download it
    encodedUri = encodeURI( csvContent );
    link = document.createElement( 'a' );
    link.setAttribute( 'href', encodedUri );
    link.setAttribute( 'download', 'monthly-data.csv');

    link.click();
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
    table = $( 'table2' ),
    labelRow = table.children( 'thead' ).children( 'tr' ),
    tbody = table.children( 'tbody' ),
    rowString = '<th>Year</th><th>Month</th>', // Date is always first column
    dateData, rowData, i, k;

    console.log(data);

    // Process data to get monthly weights
    monthWeights( data );

    // Empty existing table, and set up new one
  $( '#table2').find( 'thead' ).children( 'tr' ).empty();
  $( '#table2').find( 'tbody' ).empty();

  // After month/year, add 1 column label per search term
  for ( i = 1; i < colsLength; i++ ) {
    rowString += '<th>' + "'" + colLabels[ i ].label + "'" + ' Search Volume</th>';
  }

  // Append the string that represents the 'thead' inner HTML to the DOM,
  // then reset the rowString
  labelRow.append( rowString );
  rowString = '';

  // Create new row
  for ( i = 0; i < rowsLength; i++ ) {
    rowString += '<tr>';
    rowData = rows[ i ][ 'c' ];

    // Split dates into month & year for easier data pivoting in Excel
    dateData = rowData[ 0 ][ 'f' ].split( ' ' );
    rowString += '<td>' + dateData[ 1 ] + '</td><td>' + dateData[ 0 ] + '</td>';

    // Create a new cell in table per data point in row
    for ( k = 1; k < colsLength; k++ ) {
      rowString += '<td>' + rowData[ k ][ 'f' ] + '</td>';
    }

    // Close the row
    rowString += '</tr>';
  }

  // Append the string that represents the table's inner HTML to the DOM
  tbody.append( rowString );

  $( '#csv-div' ).removeClass( 'hidden' );
}

function monthWeights ( data ) {
  var tableData = {
      January: [],
      February: [],
      March: [],
      April: [],
      May: [],
      June: [],
      July: [],
      August: [],
      September: [],
      October: [],
      November: [],
      December: []
    },
    avgs = [],
    colsCount = data.If.length,
    dataRows = data.Jf,
    rowsCount = dataRows.length,
    i, avg, avgSum, avgTotal, key, date, month, monthSum, monthAvg, monthAvgs, monthAvgTotal;

  for ( i = 1; i < colsCount; i++ ) {
    avg = d3.mean( data.Jf, function ( d ) {
      return d.c[ i ].v;
    });
    avgs.push( avg );
  }

  for ( key in tableData ) {
    monthAvg = d3.mean( data.Jf, function ( d ) {
      date = d.c[ 0 ].f.split( ' ' );
      month = date[ 0 ];

      if ( month === key ) {
        monthSum = 0;

        for ( i = 1; i < colsCount; i++ ) {
          monthSum += d.c[ i ].v;
        }

        monthAvg = monthSum / ( colsCount - 1 );
        tableData[ key ].push( monthAvg );
      }
    })
  }

  avgSum = d3.sum( avgs, function ( d ) {
    return d;
  });

  avgTotal = avgSum / ( colsCount - 1 );

  for ( key in tableData ) {
    monthAvg = d3.mean( tableData[ key ], function ( d ) {
      return d;
    });
    tableData[ key ] = monthAvg / avgTotal;
  };

  var test = 0;

  for ( key in tableData ) {
    test += tableData[ key ];
  }
  console.log(test);
}