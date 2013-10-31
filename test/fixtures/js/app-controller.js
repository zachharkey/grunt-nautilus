/*!
 *
 * App Controller: app.controller.test
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
app.controllers.test = {
	init: function () {
		app.log( "Executed controller module @app.controllers.test", app.controllers.test );
	}
};


/******************************************************************************
 * Execution
*******************************************************************************/
app.exec( "test" );


})( window, window.app );