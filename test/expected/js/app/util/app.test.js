/*!
 *
 * App: util.test
 *
 * A nice description of what this script does...
 *
 * @deps: app, app.log
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
app.util = app.extend( app.util, {
	test: {
		
	}
});


/******************************************************************************
 * Execution
*******************************************************************************/
app.log( "app.util.test: ", app.util.test );


})( window, window.app );