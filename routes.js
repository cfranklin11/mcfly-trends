'use strict';

// app/routes.js

module.exports = function ( app, csv ) {

  app.get( '/', function ( req, res ) {
    res.render( 'index' );
  });

  app.get( '/csv', function ( req, res ) {

    var data = req.query.data;

    console.log(data);

    var rowCount = Object.keys( data ).length,
      csvString = '',
      rowString, i;

    for ( i = 0; i < rowCount - 1; i++ ) {
      rowString = data[ i ].join( ',' );
      console.log(rowString);
      csvString += rowString + '\n';
    }

    csvString += data[ rowCount - 1 ].join( ',' );

    res.attachment('data.csv');
    res.setHeader('Content-Type', 'text/csv');
    res.end(csvString);
  });
};