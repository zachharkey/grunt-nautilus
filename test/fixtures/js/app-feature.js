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
app = app.core.extend({
	test: {
		init: function () {
			app.util.log( "Executed feature module @app.test", app.test );
		}
	}
});


/******************************************************************************
 * Execution
*******************************************************************************/
app.core.exec( "test" );


})( window, window.app );