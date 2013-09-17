/*!
 *
 * App: util.<%= module %>
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
app.util = app.extend( app.util, {
	<%= module %>: {
		
	}
});


/******************************************************************************
 * Execution
*******************************************************************************/
app.log( "app.util.<%= module %>: ", app.util.<%= module %> );


})( <%= arguments %> );