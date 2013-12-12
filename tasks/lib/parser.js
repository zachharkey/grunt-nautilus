/*!
 * 
 * grunt-nautilus parser
 * https://github.com/kitajchuk/grunt-nautilus
 *
 * Copyright (c) 2013 Brandon Kitajchuk
 * Licensed under the MIT license.
 *
 *
 */
module.exports = function ( grunt, options ) {
    
    var _ = grunt.util._,
    
        coreGlobal = require( "./global" ),
        coreUtils = require( "./utils" )( grunt, options ),
        coreLogger = require( "./logger" )( grunt, options ),
        coreLibs = require( "./libs" ),
        
        rSlash = /\//g,
        rLib = new RegExp( coreGlobal+"\\.(?!app\/)(.*?)(?=(,|\\)))", "g" ),
        rSyntax = /\n\}\)|;$/g,
        rLastLine = /\n.*$/,
        rSlashDot = /\/|\./g,
        empty = "()",
        
        __console__ = "console.log",
        __exports__ = "__exports__",
        __applog__ = "app.log";
    
    return {
        globals: function ( namespace, file ) {
            var end = file.match( rLastLine ),
                libs,
                rep;
            
            end = end[ 0 ].replace( rSyntax, "" );
            rep = end;
            libs = rep.match( rLib );
            
            file = file.replace(
                __exports__+"."+coreUtils.moduleName( namespace ),
                __exports__+"."+namespace.replace( rSlash, "." )
            );
            
            _.each( libs, function ( lib ) {
                var module = lib.split( rSlashDot ).reverse()[ 0 ],
                    modlow = module.toLowerCase(),
                    global;
                
                // Validate against libs insensitive
                if ( coreLibs[ modlow ] ) {
                    global = coreLibs[ module ].context;
                
                // Validate jsGlobals
                } else if ( options.jsGlobals ) {
                    _.each( options.jsGlobals, function ( val, key, list ) {
                        if ( key.toLowerCase() === modlow ) {
                            global = key;
                        }
                    });   
                }
                
                // Throw warning if it wasn't found
                if ( !global ) {
                    coreLogger.log( "GLOBAL_UNDEFINED", {
                        global: module
                    });
                }
                
                rep = rep.replace( lib, coreGlobal+"."+global );
            });
            
            if ( rep !== empty ) {
                file = file.replace( end, rep.replace( rSlash, "." ) );
                file = file.replace( __console__, __applog__ );
            }
            
            return file;
        }
    };
};