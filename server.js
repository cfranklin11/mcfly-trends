'use strict';

// Module dependencies.
var port = process.env.PORT || 8080,
  express = require( 'express' ), //Web framework
  bodyParser = require( 'body-parser' ), //Parser for reading request body
  path = require( 'path' ), //Utilities for dealing with file paths
  morgan = require( 'morgan' ),
  methodOverride = require( 'method-override' ),

//Create server
app = express();

// set up our express application
app.use( morgan( 'dev' )); // log every request to the console
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({
  extended: false
}));
app.use( methodOverride() ); //checks request.body for HTTP method overrides

//Set client-side directory
app.use( express.static( __dirname + '/public' ));

//Routes
app.get( '/', function ( req, res ) {
  res.render( 'index' );
});

// launch ======================================================================
app.listen( port );
console.log( 'The magic happens on port ' + port );