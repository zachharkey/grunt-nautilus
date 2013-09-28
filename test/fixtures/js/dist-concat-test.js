/*!
 *
 * App: Base
 *
 * Creates global {app}
 *
 *
 */
(function ( window, undefined ) {


"use strict";


// Our global, extendable app {Object}
var app = {};


/******************************************************************************
 * App extend method
*******************************************************************************/
app.extend = function ( o1, o2 ) {
	var prop,
		ret;
	
	if ( !o2 ) {
		for ( prop in o1 ) {
			app[ prop ] = o1[ prop ];
		}
		
		ret = app;
		
	} else {
		for ( prop in o2 ) {
			o1[ prop ] = o2[ prop ];
		}
		
		ret = o1;
	}
	
	return ret;
};


/******************************************************************************
 * App core namespace
*******************************************************************************/
app.core = {};


/******************************************************************************
 * App utility namespace
*******************************************************************************/
app.util = {};


/******************************************************************************
 * App support namespace
*******************************************************************************/
app.support = {};


/******************************************************************************
 * Expose global app {Object}
*******************************************************************************/
window.app = app;


})( window );



/*!
 *
 * App Util: util.log
 *
 * Simple wrapper for console logging
 *
 * @deps: app
 *
 *
 */
(function ( window, app, undefined ) {


"use strict";


/******************************************************************************
 * Console fallback
*******************************************************************************/
window.console = window.console || {};
window.console.log = window.console.log || function () {};


/******************************************************************************
 * App Extensions
*******************************************************************************/
app.util = app.extend( app.util, {
	log: function () {
		var args = [].slice.call( arguments, 0 );
		
		if ( !args.length ) {
			args.push( app );
			
		} else {
			args.unshift( "[Appjs]:" );
		}
		
		console.log.apply( console, args );
	}
});


})( window, window.app );



/*!
 *
 * App Feature: app.test
 *
 * A nice description of what this script does...
 *
 * @deps: app, app.util.log
 *
 *
 */
(function ( window, app, undefined ) {


"use strict";


// Sandbox document
var document = window.document;


/******************************************************************************
 * App Extensions
*******************************************************************************/
app = app.extend({
	test: {
		init: function () {
			app.util.log( "Initialized app.test", app.test );
		}
	}
});


/******************************************************************************
 * Execution
*******************************************************************************/
app.test.init();


})( window, window.app );