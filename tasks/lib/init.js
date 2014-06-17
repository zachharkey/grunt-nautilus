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
module.exports = function ( grunt, options ) {
    var compass = grunt.config.get( "compass" ),
        env = (grunt.option( "env" ) || "development"),
        coreDirs = require( "./dirs" ),
        contents,
        jsLib;
    
    if ( compass ) {
        compass = compass.options || compass[ env ].options;
        
        // Test/make css
        if ( compass.cssDir && !grunt.file.exists( compass.cssDir ) ) {
            grunt.file.mkdir( compass.cssDir );
        }
        
        // Test/make img
        if ( compass.imagesDir && !grunt.file.exists( compass.imagesDir ) ) {
            grunt.file.mkdir( compass.imagesDir );
        }
        
        // Test/make fonts
        if ( compass.fontsDir && !grunt.file.exists( compass.fontsDir ) ) {
            grunt.file.mkdir( compass.fontsDir );
        }
        
        // Test/make sass
        if ( compass.sassDir && !grunt.file.exists( compass.sassDir ) ) {
            grunt.file.mkdir( compass.sassDir );
        }
            
            if ( !grunt.file.exists( compass.sassDir + "/screen.scss" ) ) {
                grunt.file.copy( coreDirs.app + "/templates/screen.scss", compass.sassDir + "/screen.scss" );
            }
            
            if ( !grunt.file.exists( compass.sassDir + "/controllers" ) ) {
                grunt.file.mkdir( compass.sassDir + "/controllers" );
                grunt.file.write( compass.sassDir + "/controllers/.gitkeep" );
            }
    }
    
    // Test/make jsRoot
    if ( !grunt.file.exists( options.jsRoot ) ) {
        grunt.file.mkdir( options.jsRoot );
    }
    
    // Test/make js/app structure
    if ( !grunt.file.exists( options.jsRoot + "/app" ) ) {
        grunt.file.mkdir( options.jsRoot + "/app" );
        grunt.file.write( options.jsRoot + "/app/.gitkeep" );
    }
    
        if ( !grunt.file.exists( options.jsRoot + "/app/app.js" ) ) {
            grunt.file.copy( coreDirs.app + "/howto.js", options.jsRoot + "/app/app.js" );
        }
    
    if ( !grunt.file.exists( options.jsRoot + "/app/controllers" ) ) {
        grunt.file.mkdir( options.jsRoot + "/app/controllers" );
        grunt.file.write( options.jsRoot + "/app/controllers/.gitkeep" );
    }
    
    if ( !grunt.file.exists( options.jsRoot + "/lib" ) ) {
        grunt.file.mkdir( options.jsRoot + "/lib" );
        grunt.file.write( options.jsRoot + "/lib/.gitkeep" );
    }
};