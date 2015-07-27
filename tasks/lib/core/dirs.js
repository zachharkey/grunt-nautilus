/*!
 * 
 * grunt-nautilus dirs
 * https://github.com/kitajchuk/grunt-nautilus
 *
 * Copyright (c) 2015 Brandon Kitajchuk
 * Licensed under the MIT license.
 *
 *
 */
module.exports = (function ( p ) {

    "use strict";

    return {
        app: p.join( __dirname, "../../../app" ),
        root: p.join( __dirname, "../../../" ),
        node: p.join( __dirname, "../../../node_modules" )
    };

})( require( "path" ) );