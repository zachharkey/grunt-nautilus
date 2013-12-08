/*!
 * 
 * grunt-nautilus module
 * https://github.com/kitajchuk/grunt-nautilus
 *
 * Copyright (c) 2013 Brandon Kitajchuk
 * Licensed under the MIT license.
 *
 *
 */
module.exports = function ( grunt ) {
    
    var _options = grunt.config.get( "nautilus" ).options,
        _logger = require( "./logger" )( grunt ),
        _utils = require( "./utils" )( grunt ),
        _dirs = require( "./dirs" ),
        _reserved = [
            "log",
            "exec"
        ],
        _ = grunt.util._;
    
    return {
        create: function () {
            var args = _.toArray( arguments ).map(function ( el ) {
                    if ( el === "controller" ) {
                        el = "controllers";
                    }
                    
                    return el;
                }),
                module = _utils.camelCase( args.pop() ),
                namespace = args.join( "/" ),
                filePath = _options.jsAppRoot+"/"+namespace+"/"+module+".js",
                fileData = {
                    data: {
                        module: module,
                        namespace: namespace
                    }
                },
                template = _dirs.app+"/templates/module.js",
                contents;
            
            if ( _reserved.indexOf( args[ 0 ] ) !== -1 ) {
                _logger.log( "NAMESPACE_RESERVED", {
                    namespace: args[ 0 ]
                });
            }
            
            if ( grunt.file.exists( filePath ) && !grunt.option( "force" ) ) {
                _logger.log( "MODULE_EXISTS", {
                    path: filePath
                });
            }
            
            if ( args.indexOf( "controllers" ) !== -1 ) {
                template = _dirs.app+"/templates/controller.js";
            }
            
            template = grunt.file.read( template );
            contents = grunt.template.process( template, fileData );
            
            grunt.file.write( filePath, contents );
            
            _logger.log( "NEW_MODULE", {
                path: filePath
            });
        }
    };
    
};