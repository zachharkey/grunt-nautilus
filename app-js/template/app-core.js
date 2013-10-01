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
app.core = app.core.extend( app.core, {
	<%= module %>: {
		
	}
});


/******************************************************************************
 * Execution
*******************************************************************************/
app.util.log( "Core module", app.core.<%= module %> );


})( <%= arguments %> );