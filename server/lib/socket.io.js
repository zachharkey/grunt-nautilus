/*
 * grunt-nautilus-test socket.io
 * https://github.com/kitajchuk/grunt-nautilus
 *
 * Copyright (c) 2013 Brandon Kitajchuk
 * Licensed under the MIT license.
 *
 */

(function ( exports ) {

var io = function ( server, callback ) {
	if ( !(this instanceof io) ) {
		return new io( server, callback );
	}
	
	var self = this;
	
	this.io = require( "socket.io" ).listen( server );
	
	this.io.configure( "development", function () {
		self.io.set( "log level", 0 );
		//self.io.set( "origins", "localhost:5050" );
		self.io.set( "authorization", function ( handshake, callback ) {
			//console.log( handshake );
			
			callback( null, true );
		});
	});
	
	return this;
};

io.prototype.connected = function ( callback ) {
	var self = this;
	
	this.io.sockets.on( "connection", function ( socket ) {
		//console.log( self.io.sockets.clients().length );
		
		if ( typeof callback === "function" ) {
			callback( socket );
		}
	});
	
	return this;
};

exports.io = io;

})( exports );