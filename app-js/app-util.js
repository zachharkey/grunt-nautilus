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
app.util = app.extend( app.util, {
	<%= module %>: function () {
		
	}
});


})( <%= arguments %> );