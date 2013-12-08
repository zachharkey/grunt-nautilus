/*
 * grunt-nautilus-test templating
 * https://github.com/kitajchuk/grunt-nautilus
 *
 * Copyright (c) 2013 Brandon Kitajchuk
 * Licensed under the MIT license.
 *
 */
 
(function ( exports ) {

var fs = require( "fs" ),
	
	path = require( "path" ),

	templite = require( "templite" ),
	
	dir = path.join( __dirname, "../../test/expected/html/" );

// Add load method to templite
templite.load = function ( file, callback ) {
	fs.readFile( dir+file+".html", "utf8", function ( error, html ) {
		if ( !error && typeof callback === "function" ) {
			callback( html );
		}
	});
};

exports.template = templite;

})( exports );