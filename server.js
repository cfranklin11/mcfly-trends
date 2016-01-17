'use strict';

// Module dependencies.
var port = process.env.PORT || 8080,
  express = require( 'express' ), //Web framework
  bodyParser = require( 'body-parser' ), //Parser for reading request body
  path = require( 'path' ), //Utilities for dealing with file paths
  morgan = require( 'morgan' ),
  methodOverride = require( 'method-override' );

  // For setting up access to Twitter's open API
  // var twitter = require( './config/twitter-api.js' );

//Create server
var app = express();

// set up our express application
app.use( morgan( 'dev' )); // log every request to the console
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({
  extended: false
}));
app.use( methodOverride() ); //checks request.body for HTTP method overrides

//Allow cross-origin resource sharing
// app.use( function ( req, res, next ) {
//   res.header( 'Access-Control-Allow-Origin', '*' );
//   res.header( 'Access-Control-Allow-Headers', 'X-Requested-With' );
//   next();
// });

//Set client-side directory
app.use( express.static( __dirname + '/public' ));

//Routes
// load our routes and pass in our app and fully configured passport
require( './routes.js' )( app );

// launch ======================================================================
app.listen( port );
console.log( 'The magic happens on port ' + port );