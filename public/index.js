( function ( $ ) {
  $( 'form' ).submit( function ( event ) {
    event.preventDefault();
    var form = $( 'form' ),
      searchTerms = form.find( 'input[name=terms]' ).val(),
      country = form.find( 'select[name=country]' ).val(),
      url = form.attr( 'action' ),
      queryUrl = 'q=' + encodeURIComponent( searchTerms ),
      geoUrl;

      if ( country === '' ) {
        geoUrl = '';
      } else {
        geoUrl = 'geo=' + encodeURIComponent( country )
      }

      var params = '?' + queryUrl + '&' + geoUrl + '&' + '&cid=TIMESERIES_GRAPH_0&export=3',
        callUrl = url + params;

        console.log(callUrl);

    getData( callUrl );
  });

  $( '#csv' ).click( function ( event ) {
    var tableRows = $( 'tr' ),
      rowCount = tableRows.length,
      colCount = $( 'th' ).length,
      data = [],
      csvContent = "data:text/csv;charset=utf-8,",
      i, j, tableCols, rowData, dataString;

    if ( rowCount > 1 ) {
      for ( i = 0; i < rowCount; i++ ) {
        rowData = [];
        tableRow = $( tableRows[ i ]);

        if ( i === 0 ) {
          tableCols = $( tableRow ).children( 'th' );
        } else {
          tableCols = $( tableRow ).children( 'td' );
        }

        for ( j = 0; j < colCount; j++ ) {
          tableCol = tableCols[ j ];
          if ( j > 1 && i > 0 ) {
            rowData.push( parseFloat( $( tableCol ).text() ));
          } else {
            rowData.push( $( tableCol ).text() );
          }
        }
        data.push( rowData );
      }
    }

    data.forEach( function ( infoArray, index ) {
      var dataString = infoArray.join(",");
      csvContent += index < data.length ? dataString + "\n" : dataString;
    });

    var encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
  });
})( jQuery );

function getData ( url ) {
  var query = new google.visualization.Query( url );
  query.send( handleData );
}

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
    rowString = '<th>Year</th><th>Month</th>',
    dateLabels, i, k;

  table.attr( 'border', '1' );

  for ( i = 1; i < colLabels.length; i++ ) {
    rowString += '<th>' + colLabels[ i ].label + ' Search Volume</th>';
  }
  labelRow.append( rowString );
  rowString = '';

  for ( i = 0; i < rowsLength; i++ ) {
    rowString += '<tr>'

    dateLabels = rows[ i ][ 'c' ][ 0 ][ 'f' ].split( ' ' );
    rowString += '<td>' + dateLabels[ 1 ] + '</td><td>' + dateLabels[ 0 ] + '</td>';

    for ( k = 1; k < colsLength; k++ ) {
      rowString += '<td>' + rows[ i ][ 'c' ][ k ][ 'f' ] + '</td>'
    }
    rowString += '</tr>'
  }
  tbody.append( rowString );
}