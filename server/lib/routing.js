/*
 * grunt-nautilus-test express routing
 * https://github.com/kitajchuk/grunt-nautilus
 *
 * Copyright (c) 2013 Brandon Kitajchuk
 * Licensed under the MIT license.
 *
 */

(function ( exports ) {

var router,
	
	fs = require( "fs" ),
	
	path = require( "path" ),
	
	dir = path.join( __dirname, "../../test/expected/html/" ),
	
	_instance;

router = function ( app ) {
	if ( !(this instanceof router) ) {
		return new router( app );
	}
	
	_instance = this;
	
	this.app = app;
	this.app.get( "/", router.index );
	this.app.get( "/admin/", router.admin );
};

router.prototype.get = function ( key ) {
	return this[ key ];
};

router.index = function ( request, response ) {
	fs.readFile( dir+"index.html", "utf8", function ( error, html ) {
    	if ( !error ) {
    	    console.log( html );
    	    
    	    response.send( html );
    	}
	});
};

router.admin = function ( request, response ) {
	fs.readFile( dir+"admin.html", "utf8", function ( error, html ) {
    	if ( !error ) {
    	    response.send( html );
    	}
	});
};

exports.router = router;

})( exports );