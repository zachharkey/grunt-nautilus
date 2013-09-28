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