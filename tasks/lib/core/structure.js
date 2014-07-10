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

    if ( o.compass ) {
        // Test/make css
        if ( o.compass.cssRoot && !g.file.exists( o.compass.cssRoot ) ) {
            g.file.mkdir( o.compass.cssRoot );
        }

        // Test/make img
        if ( o.compass.imgRoot && !g.file.exists( o.compass.imgRoot ) ) {
            g.file.mkdir( o.compass.imgRoot );
        }

        // Test/make fonts
        if ( o.compass.fontsRoot && !g.file.exists( o.compass.fontsRoot ) ) {
            g.file.mkdir( o.compass.fontsRoot );
        }

        // Test/make sass
        if ( o.compass.sassRoot && !g.file.exists( o.compass.sassRoot ) ) {
            g.file.mkdir( o.compass.sassRoot );
        }

        if ( !g.file.exists( o.compass.sassRoot + "/screen.scss" ) ) {
            g.file.copy( coreDirs.app + "/templates/screen.scss", o.compass.sassRoot + "/screen.scss" );
        }

        if ( !g.file.exists( o.compass.sassRoot + "/controllers" ) ) {
            g.file.mkdir( o.compass.sassRoot + "/controllers" );
            g.file.write( o.compass.sassRoot + "/controllers/.gitkeep" );
        }
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

    if ( !g.file.exists( o.jsRoot + "/app/controllers" ) ) {
        g.file.mkdir( o.jsRoot + "/app/controllers" );
        g.file.write( o.jsRoot + "/app/controllers/.gitkeep" );
    }

    if ( !g.file.exists( o.jsRoot + "/lib" ) ) {
        g.file.mkdir( o.jsRoot + "/lib" );
        g.file.write( o.jsRoot + "/lib/.gitkeep" );
    }

})( require( "grunt" ) );