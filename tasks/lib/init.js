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
    var compass = options.compass.options,
        args = require( "./args" )(),
        dirs = require( "./dirs" ),
        contents,
        jsLib;
    
    // Test/make css
    if ( !grunt.file.exists( compass.cssDir ) ) {
        grunt.file.mkdir( compass.cssDir );
    }
    
    // Test/make img
    if ( !grunt.file.exists( compass.imagesDir ) ) {
        grunt.file.mkdir( compass.imagesDir );
    }
    
    // Test/make fonts
    if ( !grunt.file.exists( compass.fontsDir ) ) {
        grunt.file.mkdir( compass.fontsDir );
    }
    
    // Test/make sass
    if ( !grunt.file.exists( compass.sassDir ) ) {
        grunt.file.mkdir( compass.sassDir );
    }
        
        if ( !grunt.file.exists( compass.sassDir+"/screen.scss" ) ) {
            grunt.file.write( compass.sassDir+"/screen.scss", "/* -- start styling -- */" );
        }
    
    // Test/make jsRoot
    if ( !grunt.file.exists( options.jsRoot ) ) {
        grunt.file.mkdir( options.jsRoot );
    }
    
    // Test/make js/app structure
    if ( !grunt.file.exists( options.jsRoot+"/app" ) ) {
        grunt.file.mkdir( options.jsRoot+"/app" );
        grunt.file.write( options.jsRoot+"/app/.gitkeep" );
    }
    
        if ( !grunt.file.exists( options.jsRoot+"/app/app.js" ) ) {
            grunt.file.copy( dirs.app+"/howto.js", options.jsRoot+"/app/app.js" );
        }
    
    if ( !grunt.file.exists( options.jsRoot+"/app/controllers" ) ) {
        grunt.file.mkdir( options.jsRoot+"/app/controllers" );
        grunt.file.write( options.jsRoot+"/app/controllers/.gitkeep" );
    }    
    
    if ( !grunt.file.exists( options.jsRoot+"/lib" ) ) {
        grunt.file.mkdir( options.jsRoot+"/lib" );
        grunt.file.write( options.jsRoot+"/lib/.gitkeep" );
    }
    
    grunt.log.writeln( "\nGrunt Nautilus initialized." );
    grunt.log.writeln( "\n- @kitajchuk\n" );
    
    process.exit( 0 );
};