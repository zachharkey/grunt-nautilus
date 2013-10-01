/*!
 *
 * App Feature: app.<%= module %>
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
app = app.core.extend({
	<%= module %>: {
		init: function () {
			app.util.log( "Executed feature module @app.<%= module %>", app.<%= module %> );
		}
	}
});


/******************************************************************************
 * Execution
*******************************************************************************/
app.core.exec( "<%= module %>" );


})( <%= arguments %> );