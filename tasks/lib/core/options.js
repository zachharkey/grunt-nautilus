/*!
 * 
 * grunt-nautilus options
 * https://github.com/kitajchuk/grunt-nautilus
 *
 * Copyright (c) 2013 Brandon Kitajchuk
 * Licensed under the MIT license.
 *
 *
 */
// Flags
// expanded: bool
// loud: bool
// env: string
// path: string
// Merge task options with defaults and return
module.exports = (function ( g ) {

    "use strict";

    var _ = g.util._,
        d = {
            hintAt: [],
            hintOn: [],
            jsAppRoot: undefined,
            jsLibRoot: undefined,
            jsDistRoot: undefined,
            jsGlobals: {
                // Global build
                app: true,
                
                // For Sanity
                console: true,
                
                // For Gruntfile
                module: true
            },
            jsRoot: undefined,
            jsTemplate: undefined,
            main: [
                "app.js",
                "controllers/**/*.js"
            ],
            pubRoot: undefined,
            type: "globals", // Secret option for now
            whitespace: undefined
        },
        c = g.config.get( "nautilus" ),
        o = (c.options || {});

    _.each( d, function ( v, k ) {
        // Use user value or merge
        if ( o[ k ] ) {
            if ( _.isArray( v ) ) {
                o[ k ] = _.union( o[ k ], v );
                
            } else if ( _.isObject( v ) ) {
                o[ k ] = _.extend( o[ k ], v );
            }

        // Consume default value
        } else {
            o[ k ] = v;
        }
    });

    // Actually update the peer options
    g.config.set( "nautilus", {
        options: o
    });

    return o;

})( require( "grunt" ) );