/*
 * grunt-nautilus server
 * https://github.com/kitajchuk/grunt-nautilus
 *
 * Copyright (c) 2013 Brandon Kitajchuk
 * Licensed under the MIT license.
 *
 */

(function () {

var app = require( "./lib/application" ).application,
	server = require( "http" ).Server( app ).listen( app.get( "port" ) ),
	router = require( "./lib/routing" ).router( app ),
	sock = require( "./lib/socket.io" ).io( server );

})();