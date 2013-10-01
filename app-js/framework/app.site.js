/*!
 *
 * App: Site
 *
 * Sitewide tasks to be included in all script builds.
 *
 * If you want any feature script modules to be included
 * in the scripts.js build, list them as dependencies here.
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
// Start coding!


/******************************************************************************
 * Execution
*******************************************************************************/
// Start coding!
app.core.execFeatures();


})( <%= arguments %> );