/*!
 *
 * App Util: app.util.test
 *
 * A nice description of what this script does...
 *
 * @deps: app
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
app.util = app.core.extend( app.util, {
	test: {
		
	}
});


/******************************************************************************
 * Execution
*******************************************************************************/
app.util.log( "Util module", app.util.test );


})( window, window.app );