// jQuery event listeners
( function ( $ ) {

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
      geoUrl, startUrl, monthUrl, dateUrl, monthDiff;

      country === '' ? geoUrl = '' :
        geoUrl = '&geo=' + encodeURIComponent( country );

      // If no dates chosen, don't specify dates in query URL
      if ( startDate === '' && endDate === '' ){
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

        if ( monthDiff < 37 ) {
          return alert( 'Start and end dates must be more than 3 years apart' +
            ' to get monthly data (otherwise, data is broken down by week)' );
        }

        monthUrl = monthDiff.toString() + 'm';
        dateUrl = '&date=' + encodeURIComponent( startUrl + ' ' + monthUrl );
      }

      var params = '?' + queryUrl + geoUrl + dateUrl +
          '&cid=TIMESERIES_GRAPH_0&export=3',
        callUrl = url + params;

    console.log(callUrl);
    getData( callUrl );
  });

  // Create CSV click listener to create & download file
  $( '#csv' ).click( function ( event ) {
    var tableRows = $( 'tr' ),
      rowCount = tableRows.length,
      colCount = $( 'th' ).length,
      data = [],
      csvContent = "data:text/csv;charset=utf-8,",
      i, j, tableCols, rowData, dataString;

    // Create array from data table on page
    if ( rowCount > 1 ) {
      for ( i = 0; i < rowCount; i++ ) {
        rowData = [];
        tableRow = $( tableRows[ i ]);

        i === 0 ? tableCols = $( tableRow ).children( 'th' ) :
          tableCols = $( tableRow ).children( 'td' );

        for ( j = 0; j < colCount; j++ ) {
          tableCol = $( tableCols[ j ] );
          if ( j > 1 && i > 0 ) {
            rowData.push( parseFloat( tableCol.text() ));
          } else {
            rowData.push( tableCol.text() );
          }
        }
        data.push( rowData );
      }
    }

    // Use array to create CSV string
    data.forEach( function ( infoArray, index ) {
      var dataString = infoArray.join(",");
      csvContent += index < data.length ? dataString + "\n" : dataString;
    });

    // Use CSV string to create CSV file, then download it
    var encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
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

  var data = response.getDataTable();
  
  $( 'thead' ).children( 'tr' ).empty();
  $( 'tbody' ).empty();

  var colLabels = data.If,
    colsLength = data.If.length,
    rows = data.Jf,
    rowsLength = rows.length,
    table = $( 'table' ),
    labelRow = table.children( 'thead' ).children( 'tr' ),
    tbody = table.children( 'tbody' ),
    rowString = '<th>Year</th><th>Month</th>', // Date is always first column
    dateData, rowData, i, k;

  table.attr( 'border', '1' );

  // After month/year, add 1 column per search term
  for ( i = 1; i < colsLength; i++ ) {
    rowString += '<th>' + colLabels[ i ].label + ' Search Volume</th>';
  }
  labelRow.append( rowString );
  rowString = '';

  for ( i = 0; i < rowsLength; i++ ) {
    rowString += '<tr>';
    rowData = rows[ i ][ 'c' ];

    // Split dates into month & year for easier data pivoting in Excel
    dateData = rowData[ 0 ][ 'f' ].split( ' ' );
    rowString += '<td>' + dateData[ 1 ] + '</td><td>' + dateData[ 0 ] + '</td>';

    for ( k = 1; k < colsLength; k++ ) {
      rowString += '<td>' + rowData[ k ][ 'f' ] + '</td>';
    }
    rowString += '</tr>';
  }
  tbody.append( rowString );
}