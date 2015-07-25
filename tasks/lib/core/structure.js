/*!
 * 
 * grunt-nautilus init
 * https://github.com/kitajchuk/grunt-nautilus
 *
 * Copyright (c) 2013 Brandon Kitajchuk
 * Licensed under the MIT license.
 *
 *
 */
// Build the default file structure
module.exports = (function ( g ) {

    "use strict";

    var o = g.config.get( "nautilus" ).options,
        coreDirs = require( "./dirs" );

    // Test/make css
    if ( o.cssRoot && !g.file.exists( o.cssRoot ) ) {
        g.file.mkdir( o.cssRoot );
    }

    // Test/make sass
    if ( o.sassRoot && !g.file.exists( o.sassRoot ) ) {
        g.file.mkdir( o.sassRoot );
    }

    if ( !g.file.exists( o.sassRoot + "/screen.scss" ) ) {
        g.file.copy( coreDirs.app + "/templates/screen.scss", o.sassRoot + "/screen.scss" );
    }

    // Test/make jsRoot
    if ( !g.file.exists( o.jsRoot ) ) {
        g.file.mkdir( o.jsRoot );
    }

    // Test/make js/app structure
    if ( !g.file.exists( o.jsRoot + "/app" ) ) {
        g.file.mkdir( o.jsRoot + "/app" );
        g.file.write( o.jsRoot + "/app/.gitkeep" );
    }

    if ( !g.file.exists( o.jsRoot + "/app/app.js" ) ) {
        g.file.copy( coreDirs.app + "/howto.js", o.jsRoot + "/app/app.js" );
    }

    if ( !g.file.exists( o.jsRoot + "/lib" ) ) {
        g.file.mkdir( o.jsRoot + "/lib" );
        g.file.write( o.jsRoot + "/lib/.gitkeep" );
    }

})( require( "grunt" ) );