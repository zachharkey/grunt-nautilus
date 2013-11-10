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
console.log( "Buildin 3" );