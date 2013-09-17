/*!
 *
 * App: <%= module %>
 *
 * A nice description of what this script does...
 *
 * @deps: app, app.log
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
app = app.extend({
	<%= module %>: {
		init: function () {
			app.log( "Initialized app.<%= module %>", app.<%= module %> );
		}
	}
});


/******************************************************************************
 * Execution
*******************************************************************************/
app.<%= module %>.init();


})( <%= arguments %> );