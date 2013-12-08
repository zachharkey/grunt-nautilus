/*
 * grunt-nautilus-test express routing
 * https://github.com/kitajchuk/grunt-nautilus
 *
 * Copyright (c) 2013 Brandon Kitajchuk
 * Licensed under the MIT license.
 *
 */

(function ( exports ) {

var tpl = require( "./template" ).template,
	
	router,
	
	_instance;

router = function ( app ) {
	if ( !(this instanceof router) ) {
		return new router( app );
	}
	
	_instance = this;
	
	this.app = app;
	this.app.get( "/", router.index );
	this.app.get( "/foo/", router.foo );
	this.app.get( "/bar/", router.bar );
	this.app.get( "/baz/", router.baz );
	this.app.get( "/server/*", router.denied );
	this.app.get( "/template/*", router.denied );
};

router.prototype.get = function ( key ) {
	return this[ key ];
};

router.denied = function ( request, response ) {
	response.end( "<O_o Access Denied o_O>" );
};

router.index = function ( request, response ) {
	tpl.load( "index", function ( html ) {
		response.send( tpl.render( html, {scripts: "ishmael"} ) );
	});
};

router.foo = function ( request, response ) {
	tpl.load( "foo", function ( html ) {
		response.send( tpl.render( html, {scripts: "ishmael"} ) );
	});
};

router.bar = function ( request, response ) {
	tpl.load( "bar", function ( html ) {
		response.send( tpl.render( html, {scripts: "ishmael"} ) );
	});
};

router.baz = function ( request, response ) {
	tpl.load( "baz", function ( html ) {
		response.send( tpl.render( html, {scripts: "ishmael"} ) );
	});
};

exports.router = router;

})( exports );