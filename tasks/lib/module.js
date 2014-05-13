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
module.exports = function ( grunt, options ) {
    
    var _ = grunt.util._,
        
        coreLogger = require( "./logger" )( grunt, options ),
        coreUtils = require( "./utils" )( grunt, options ),
        coreDirs = require( "./dirs" ),
        rDub = /\/(\/)/g,
        reserved = [
            "log",
            "exec"
        ];
    
    return {
        create: function () {
            var args = _.toArray( arguments ).map(function ( el ) {
                    if ( el === "controller" ) {
                        el = "controllers";
                    }
                    
                    return el;
                }),
                module = coreUtils.camelCase( args.pop() ),
                namespace = args.join( "/" ),
                filePath = (options.jsAppRoot + "/" + namespace + "/" + module + ".js").replace( rDub, "$1" ),
                fileData = {
                    data: {
                        module: module,
                        namespace: namespace
                    }
                },
                template = coreDirs.app + "/templates/module.js",
                contents;
            
            if ( _.contains( reserved, args[ 0 ] ) ) {
                coreLogger.log( "NAMESPACE_RESERVED", {
                    namespace: args[ 0 ]
                });
            }
            
            if ( grunt.file.exists( filePath ) && !grunt.option( "force" ) ) {
                coreLogger.log( "MODULE_EXISTS", {
                    path: filePath
                });
            }
            
            if ( _.contains( args, "controllers" ) ) {
                template = coreDirs.app + "/templates/controller.js";
            }
            
            template = grunt.file.read( template );
            contents = grunt.template.process( template, fileData );
            
            grunt.file.write( filePath, contents );
            
            coreLogger.log( "NEW_MODULE", {
                path: filePath
            });
        }
    };
    
};