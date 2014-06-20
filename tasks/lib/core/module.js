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
module.exports = (function ( g ) {

    var _ = g.util._,

        coreLogger = require( "./logger" ),
        coreUtils = require( "./util" ),
        coreDirs = require( "./dirs" ),
        rDub = /\/(\/)/g,
        reserved = [
            "env",
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
                options = g.config.get( "nautilus" ).options,
                module = coreUtils.camelCase( args.pop() ),
                namespace = args.join( "/" ),
                filePath = (options.jsAppRoot + "/" + namespace + "/" + module + ".js").replace( rDub, "$1" ),
                fileData = {
                    module: module,
                    namespace: namespace
                },
                template = coreDirs.app + "/templates/module.js",
                compass = g.config.get( "compass" ),
                env = (g.option( "env" ) || "development"),
                sassPath,
                contents;

            if ( _.contains( reserved, args[ 0 ] ) ) {
                coreLogger.log( "NAMESPACE_RESERVED", {
                    namespace: args[ 0 ]
                });
            }

            if ( g.file.exists( filePath ) && !g.option( "force" ) ) {
                coreLogger.log( "MODULE_EXISTS", {
                    path: filePath
                });
            }

            if ( _.contains( args, "controllers" ) ) {
                template = coreDirs.app + "/templates/controller.js";
            }

            template = g.file.read( template );
            contents = _.template( template, fileData );

            g.file.write( filePath, contents );

            coreLogger.log( "NEW_MODULE", {
                path: filePath
            });

            // If compass options are valid, also spin up a partial...
            if ( compass ) {
                compass = compass.options || compass[ env ].options;
                
                sassPath = compass.sassDir + "/" + namespace + "/_" + module + ".scss";
                
                g.file.write( sassPath, _.template( g.file.read( coreDirs.app + "/templates/partial.scss" ), fileData ));
                
                coreLogger.log( "NEW_MODULE", {
                    path: sassPath
                });
            }
        }
    };

})( require( "grunt" ) );