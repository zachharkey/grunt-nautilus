/*!
 *
 * App Util: app.util.<%= module %>
 *
 * A nice description of what this script does...
 *
 * @deps: app
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
app.util = app.core.extend( app.util, {
	<%= module %>: {
		
	}
});


/******************************************************************************
 * Execution
*******************************************************************************/
app.util.log( "Util module", app.util.<%= module %> );


})( <%= arguments %> );