/*!
 * 
 * grunt-nautilus compiler
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
        coreArgs = require( "./args" ),
        coreDirs = require( "./dirs" ),

        Compiler = require( "es6-module-transpiler" ).Compiler;

    return {
        transpile: function ( filePath, module ) {
            var contents = g.file.read( filePath ),
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
            var template = g.file.read( coreDirs.app + "/templates/closure.js" ),
                rendered = _.template( template, {
                    args: coreArgs.args.join( ", " ),
                    params: coreArgs.params.concat( coreArgs.undef ).join( ", " ),
                    scripts: scripts
                });

            return rendered;
        }
    };

})( require( "grunt" ) );