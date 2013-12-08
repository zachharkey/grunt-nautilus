/*
 * grunt-nautilus-test express app
 * https://github.com/kitajchuk/grunt-nautilus
 *
 * Copyright (c) 2013 Brandon Kitajchuk
 * Licensed under the MIT license.
 *
 */
(function ( exports ) {

var express = require( "express" ),

	app = express(),
	
	path = require( "path" );

app.configure(function () {
	app.use( app.router );
	app.use( express.static( path.join( __dirname, "../../" ) ) );
});

if ( process.env.NODE_ENV === "development" ) {
	app.set( "port", 5050 );
	
} else {
	app.set( "port", 8080 );
}

exports.application = app;

})( exports );