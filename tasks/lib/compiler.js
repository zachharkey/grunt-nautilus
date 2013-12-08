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
module.exports = function ( grunt ) {
    
    var _options = grunt.config.get( "nautilus" ).options,
        _jsLibs = require( "./libs" ),
        
        // Compiler Class
        Compiler = require( "es6-module-transpiler" ).Compiler;
    
    return {
        transpile: function ( filePath, module, options ) {
            var contents = grunt.file.read( filePath );
            
            return new Compiler( contents, module, options );
        },
        
        closure: function ( scripts ) {
            return [
                "(function (window, app, undefined) {",
                    "  \"use strict\";",
                    "  "+scripts,
                "})(window, window.app);"
                
            ].join( "\n" );
        }
    };
    
};