/*
 * grunt-nautilus-test server
 * https://github.com/kitajchuk/grunt-nautilus
 *
 * Copyright (c) 2013 Brandon Kitajchuk
 * Licensed under the MIT license.
 *
 */

(function () {

var _app = require( "./lib/application" ).application,
	_server = require( "http" ).Server( _app ).listen( _app.get( "port" ) ),
	_router = require( "./lib/routing" ).router( _app ),
	_sock = require( "./lib/socket.io" ).io( _server );

_sock.connected(function ( socket ) {
	
	console.log( "[grunt-nautilus test server running]" );
	
});

})();