/*!
 * 
 * grunt-nautilus module
 * https://github.com/kitajchuk/grunt-nautilus
 *
 * Copyright (c) 2015 Brandon Kitajchuk
 * Licensed under the MIT license.
 *
 *
 */
module.exports = (function ( g ) {

    "use strict";

    var _ = g.util._,

        nodePath = require( "path" ),
        coreLogger = require( "./logger" ),
        coreUtils = require( "./util" ),
        coreDirs = require( "./dirs" ),
        rDub = /\/(\/)/g,
        reserved = [
            "env",
            "log"
        ];

    return {
        create: function () {
            var args = _.toArray( arguments ),
                options = g.config.get( "nautilus" ).options,
                module = coreUtils.camelCase( args.pop() ),
                filePath = nodePath.join( options.jsAppRoot, args.join( "/" ), (module + ".js") ).replace( rDub, "$1" ),
                fileData = {
                    moduleName: module,
                    globalName: options.namespace,
                    modulePath: args.join( "." )
                },
                template = coreDirs.app + "/templates/module.js",
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

            template = g.file.read( template );
            contents = _.template( template, fileData );

            g.file.write( filePath, contents );

            coreLogger.log( "NEW_MODULE", {
                path: filePath
            });
        }
    };

})( require( "grunt" ) );