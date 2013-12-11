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
module.exports = function ( grunt ) {
    
    var _ = grunt.util._,
        _options = grunt.config.get( "nautilus" ).options,
        _global = require( "./global" ),
        _utils = require( "./utils" )( grunt ),
        _logger = require( "./logger" )( grunt ),
        _libs = require( "./libs" ),
        __console__ = "console.log",
        __exports__ = "__exports__",
        __applog__ = "app.log",
        _rSlash = /\//g,
        _rLib = new RegExp( _global+"\\.(?!app\/)(.*?)(?=(,|\\)))", "g" ),
        _rSyntax = /\n\}\)|;$/g,
        _rLastLine = /\n.*$/,
        _rSlashDot = /\/|\./g,
        _empty = "()";
    
    return {
        globals: function ( namespace, file ) {
            var end = file.match( _rLastLine ),
                rep = end[ 0 ].replace( _rSyntax, "" ),
                libs = rep.match( _rLib );
            
            file = file.replace(
                __exports__+"."+_utils.moduleName( namespace ),
                __exports__+"."+namespace.replace( _rSlash, "." )
            );
            
            _.each( libs, function ( lib ) {
                var module = lib.split( _rSlashDot ).reverse()[ 0 ],
                    modlow = module.toLowerCase(),
                    global;
                
                // Validate against libs insensitive
                if ( _libs[ modlow ] ) {
                    global = _libs[ module ].context;
                
                // Validate jsGlobals
                } else if ( _options.jsGlobals ) {
                    _.each( _options.jsGlobals, function ( val, key, list ) {
                        if ( key.toLowerCase() === modlow ) {
                            global = key;
                        }
                    });   
                }
                
                // Throw warning if it wasn't found
                if ( !global ) {
                    _logger.log( "GLOBAL_UNDEFINED", {
                        global: module
                    });
                }
                
                rep = rep.replace( lib, _global+"."+global );
            });
            
            if ( rep !== _empty ) {
                file = file.replace( end, rep.replace( _rSlash, "." ) );
                file = file.replace( __console__, __applog__ );
            }
            
            return file;
        }
    };
};