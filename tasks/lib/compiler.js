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
        _global = require( "./global" ),
        
        // Compiler Class
        Compiler = require( "es6-module-transpiler" ).Compiler;
    
    return {
        transpile: function ( filePath, module ) {
            var contents = grunt.file.read( filePath ),
                options = {
                    global: _global
                };
            
            if ( _options.type === "globals" ) {
                return new Compiler( contents, module, options );
                
            } else {
                return new Compiler( contents, module );
            }
        },
        
        closure: function ( scripts ) {
            return [
                "(function ("+_global+", app, undefined) {",
                    "  \"use strict\";",
                    "  "+scripts,
                "})("+_global+", "+_global+".app);"
                
            ].join( "\n" );
        }
    };
    
};