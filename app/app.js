/*!
 *
 * App: Model
 *
 * Creates global {app}
 *
 *
 */
var app,
    
    // Keep track of controller modules
    controllers = [],
    
    // Keep track of executed modules
    executed = {},
    
    // Handle console fallback
    console = window.console || {
        log: function () {}
    };


/******************************************************************************
 * App schema.
*******************************************************************************/
app = <%= schema %>;


/******************************************************************************
 * App environment.
*******************************************************************************/
app.env = "dev";


/******************************************************************************
 * App logging. Any app.env value !== "dev" will suppress.
*******************************************************************************/
app.log = function () {
    var args = [].slice.call( arguments, 0 );
    
    if ( app.env !== "dev" ) {
        return;
    }
    
    if ( !args.length ) {
        args.push( app );
        
    } else {
        args.unshift( "[App]:" );
    }
    
    // IE8 Doesn't support .call/.apply on console.log
    if ( console.log.apply ) {
        console.log.apply( console, args );
    }
};


/******************************************************************************
 * App execution. Used for controllers. app.exec( "controller" ).
 * Applies a "one init per controller" rule like underscore's .once().
*******************************************************************************/
app.exec = function ( module ) {
    var moduleName = module;
    
    if ( app.controllers && app.controllers[ module ] ) {
        module = app.controllers[ module ];
        
    } else {
        module = undefined;
    }
    
    if ( executed[ moduleName ] ) {
            app.log( "Module "+moduleName+" already executed! Backing out..." );
            
    } else if ( module && (typeof module.init === "function") ) {
        module.init();
        
        executed[ moduleName ] = true;
    }
    
    return module;
};


/******************************************************************************
 * Export global {app}
*******************************************************************************/
export default = app;