/*!
 * 
 * grunt-nautilus compiler
 * https://github.com/kitajchuk/grunt-nautilus
 *
 * Copyright (c) 2013 Brandon Kitajchuk
 * Licensed under the MIT license.
 *
 *
 */
module.exports = function ( grunt, options ) {
    
    var jsLibs = require( "./libs" ),
        global = require( "./global" ),
        
        // Compiler Class
        Compiler = require( "es6-module-transpiler" ).Compiler;
    
    return {
        transpile: function ( filePath, module ) {
            var contents = grunt.file.read( filePath ),
                options = {
                    global: global
                };
            
            if ( options.type === "globals" ) {
                return new Compiler( contents, module, options );
                
            } else {
                return new Compiler( contents, module );
            }
        },
        
        closure: function ( scripts ) {
            return [
                "(function ( " + global + ", app, undefined ) {",
                    "  \"use strict\";",
                    "  " + scripts,
                "})( " + global + ", " + global + ".app );"
                
            ].join( grunt.util.linefeed );
        }
    };
    
};