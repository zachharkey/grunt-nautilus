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
        compass = g.config.get( "compass" ),
        env = (g.option( "env" ) || "development"),
        coreDirs = require( "./dirs" );

    if ( compass ) {
        compass = (compass.options || compass[ env ].options);

        // Test/make css
        if ( compass.cssDir && !g.file.exists( compass.cssDir ) ) {
            g.file.mkdir( compass.cssDir );
        }

        // Test/make img
        if ( compass.imagesDir && !g.file.exists( compass.imagesDir ) ) {
            g.file.mkdir( compass.imagesDir );
        }

        // Test/make fonts
        if ( compass.fontsDir && !g.file.exists( compass.fontsDir ) ) {
            g.file.mkdir( compass.fontsDir );
        }

        // Test/make sass
        if ( compass.sassDir && !g.file.exists( compass.sassDir ) ) {
            g.file.mkdir( compass.sassDir );
        }

        if ( !g.file.exists( compass.sassDir + "/screen.scss" ) ) {
            g.file.copy( coreDirs.app + "/templates/screen.scss", compass.sassDir + "/screen.scss" );
        }

        if ( !g.file.exists( compass.sassDir + "/controllers" ) ) {
            g.file.mkdir( compass.sassDir + "/controllers" );
            g.file.write( compass.sassDir + "/controllers/.gitkeep" );
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