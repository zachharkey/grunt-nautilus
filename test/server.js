/*!
 *
 * grunt-nautilus node server.
 *
 * @author: kitajchuk
 *
 */
var express = require( "express" ),
    app = express(),
    path = require( "path" ),
    http = require( "http" );

app.use( express.static( __dirname ) );
app.set( "port", 5050 );

http.Server( app ).listen( app.get( "port" ) );

// For serving grunt-nautilus as webroot
app.get( "/", function ( request, response ) {
    response.send( 200 );
});

// We are running
console.log( "> Running express server on port " + app.get( "port" ) );