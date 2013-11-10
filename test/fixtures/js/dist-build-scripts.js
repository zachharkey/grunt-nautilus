/*!
 *
 * App: Model
 *
 * Creates global {app}
 *
 *
 */
(function ( context, undefined ) {


"use strict";


// Our global, extendable app {Object}
var app = {},
    
    // Keep track of controller modules
    controllers = [],
    
    // Keep track of executed modules
    executed = [];


/******************************************************************************
 * App core namespace
*******************************************************************************/
app.core = {};


/******************************************************************************
 * App utility namespace
*******************************************************************************/
app.util = {};


/******************************************************************************
 * App controllers namespace
*******************************************************************************/
app.controllers = {};


/******************************************************************************
 * App log method
*******************************************************************************/
app.log = function () {
    var args = [].slice.call( arguments, 0 );
    
    if ( !args.length ) {
        args.push( app );
        
    } else {
        args.unshift( "[Appjs]:" );
    }
    
    console.log.apply( console, args );
};


/******************************************************************************
 * App exec method
*******************************************************************************/
app.exec = function ( module ) {
    var moduleName = module;
    
    if ( app.controllers[ module ] ) {
        module = app.controllers[ module ];
        
    } else if ( app.core[ module ] ) {
        module = app.core[ module ];
        
    } else if ( app.util[ module ] ) {
        module = app.util[ module ];
        
    } else {
        module = undefined;
    }
    
    if ( executed.indexOf( moduleName ) !== -1 ) {
            app.log( "Module "+moduleName+" already executed! Backing out..." );
            
    } else if ( module && typeof module.init === "function" ) {
        module.init();
        
        executed.push( moduleName );
    }
    
    return module;
};


/******************************************************************************
 * Console fallback
*******************************************************************************/
context.console = context.console || {};
context.console.log = context.console.log || function () {};


/******************************************************************************
 * Expose global app {Object}
*******************************************************************************/
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
    module.exports = app;
    
} else {
    context.app = app;
}


})( this );
console.log( "Buildin 0" );
console.log( "Buildin 1" );
console.log( "Buildin 2" );
/*!
 *
 * App Util: app.util.test
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
app.util.test = {};


/******************************************************************************
 * Execution
*******************************************************************************/
app.log( "Util module", app.util.test );


})( window, window.app );
/*!
 *
 * App Core: app.core.test
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
app.core.test = {};


/******************************************************************************
 * Execution
*******************************************************************************/
app.log( "Core module", app.core.test );


})( window, window.app );
/*!
 *
 * App: Dev
 *
 * Sitewide javascript to be included in all builds.
 *
 * If you want any feature script modules to be included
 * in the scripts.js build, list them as dependencies here.
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
// Start coding!


/******************************************************************************
 * Execution
*******************************************************************************/
// Start coding!
app.core.execFeatures();


})( window, window.app );
console.log( "Buildin 3" );