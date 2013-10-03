/*!
 *
 * App Core: app.core.test
 *
 * A nice description of what this script does...
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
app.core = app.core.extend( app.core, {
	test: {
		
	}
});


/******************************************************************************
 * Execution
*******************************************************************************/
app.util.log( "Core module", app.core.test );


})( window, window.app );