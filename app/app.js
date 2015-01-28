/*!
 * 
 * grunt-nautilus
 * https://github.com/kitajchuk/grunt-nautilus
 *
 * Copyright (c) 2013 Brandon Kitajchuk
 * Licensed under the MIT license.
 *
 *
 */
(function ( window, undefined ) {


var app,
    
    // Keep track of controller modules
    controllers = [],
    
    // Keep track of executed modules
    executed = {},
    
    // Handle console fallback
    console = (window.console || {
        log: function () {}
    });


/**
 *
 * App {object}
 * @namespace app
 * @memberof! <global>
 *
 */
app = <%= schema %>;


/**
 *
 * Environment setting
 * @member env
 * @memberof app
 *
 */ 
app.env = "<%= env %>";


/**
 *
 * Console.log polyfill
 * @method log
 * @memberof app
 *
 */
app.log = function () {
    if ( !/^dev/.test( app.env ) ) {
        return;
    }
    
    app.log.history.push( arguments );

    if ( window.console && window.console.log ) {
        console.log( [].slice.call( arguments, 0 ) );
    }
};


/**
 *
 * Log history
 * @member history
 * @memberof app.log
 *
 */
app.log.history = [];


/**
 *
 * Controller executor
 * @method exec
 * @param {string} module The name of the module controller to execute
 * @memberof app
 * @example app.exec( "foo" )
 *
 */
app.exec = function ( module ) {
    var moduleName = module;
    
    if ( app.controllers && app.controllers[ module ] ) {
        module = app.controllers[ module ];
        
    } else {
        module = undefined;
    }
    
    if ( executed[ moduleName ] ) {
            app.log( "Module " + moduleName + " already executed! Backing out..." );
            
    } else if ( module && (typeof module.init === "function") ) {
        module.init();
        
        executed[ moduleName ] = true;
    }
    
    return module;
};


/**
 *
 * Expose app to global scope
 *
 */
window.app = app;


})( window );
