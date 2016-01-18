// jQuery event listeners
( function ( $ ) {

  // Form submit listener to make call to Google Trends
  $( 'form' ).submit( function ( event ) {
    event.preventDefault();
    var form = $( 'form' ),
      searchTerms = form.find( 'input[name=terms]' ).val(),
      country = form.find( 'select[name=country]' ).val(),
      url = form.attr( 'action' ),
      queryUrl = 'q=' + encodeURIComponent( searchTerms ),
      geoUrl;

      country === '' ? geoUrl = '' : geoUrl = 'geo=' + encodeURIComponent( country );

      var params = '?' + queryUrl + '&' + geoUrl + '&' + '&cid=TIMESERIES_GRAPH_0&export=3',
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