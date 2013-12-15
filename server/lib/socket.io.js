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
	
	return this;
};

exports.io = io;

})( exports );