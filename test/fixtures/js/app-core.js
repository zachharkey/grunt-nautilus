/*!
 *
 * App Core: app.core.test
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
app.core = app.extend( app.core, {
	test: {
		init: function () {
			app.util.log( "Initialized app.core.test", app.core.test );
		}
	}
});


/******************************************************************************
 * Execution
*******************************************************************************/
app.core.test.init();


})( window, window.app );