/*!
 *
 * App Core: app.core.<%= module %>
 *
 * A nice description of what this script does...
 *
 * @deps: app, app.util.log
 *
 *
 */
(function ( <%= parameters %> ) {


"use strict";


// Sandbox document
var document = window.document;


/******************************************************************************
 * App Extensions
*******************************************************************************/
app.core = app.extend( app.core, {
	<%= module %>: {
		init: function () {
			app.util.log( "Initialized app.core.<%= module %>", app.core.<%= module %> );
		}
	}
});


/******************************************************************************
 * Execution
*******************************************************************************/
app.core.<%= module %>.init();


})( <%= arguments %> );