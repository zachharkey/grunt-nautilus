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
module.exports = (function ( g ) {

    "use strict";

    var _ = g.util._,

        options = g.config.get( "nautilus" ).options,
        coreLibs = require( "./libs" ),
        coreArgs = require( "./args" ),
        rExports = new RegExp( "__exports__\\..*?(?=\\s=)", "g" ),
        rLib = new RegExp( "^window\\.(?!app\\/)(.*?)$" ),
        rSyntax = /function|\(|\)|\{|\}|;|\s|\n/g,
        rLastLine = /\n(.*?)$/,
        rFirstLine = /^(.*?)\n/,
        rSlashDot = /\/|\./g,
        rConsoleCall = /console\.log\(/g,
        appDotLogCall = "app.log(",
        closureOpen = "(function ( <%= params %> ) {",
        closureClose = "})( <%= args %> );";

    return {
        globals: function ( namespace, file ) {
            var lastLine = file.match( rLastLine ),
                firstLine = file.match( rFirstLine ),
                firstNoSyntax = firstLine[ 1 ].replace( rSyntax, "" ),
                lastNoSyntax = lastLine[ 1 ].replace( rSyntax, "" ),
                exported = file.match( rExports ),
                replaceDependencies = [],
                replaceFirsts = [],
                replaceLasts = [],
                dottedExport = namespace.replace( rSlashDot, "." ),
                firsts = firstNoSyntax.split( "," ),
                lasts = lastNoSyntax.split( "," ),
                tplOpen,
                tplClose;

            // Handle parsing module exports
            if ( exported && exported.length === 1 ) {
                file = file.replace(
                    exported[ 0 ],
                    "window." + dottedExport
                );

            // Multi-Export situations
            } else {
                _.each( exported, function ( exp ) {
                    var module = exp.split( rSlashDot ).pop();
                    
                    file = file.replace(
                        exp,
                        "window." + dottedExport + "." + module
                    );
                });
            }

            // Handle replacing the parameters and arguments for the function closure
            if ( firsts.length && lasts.length ) {
                _.each( lasts, function ( el, i ) {
                    var module = el.split( rSlashDot ).reverse()[ 0 ],
                        modlow = module.toLowerCase(),
                        globalArg,
                        globalParam;

                    if ( rLib.test( el ) ) {

                        if ( coreLibs[ modlow ] ) {
                            globalParam = coreLibs[ modlow ].context;
                            globalArg = (coreLibs[ modlow ].shorthand || coreLibs[ modlow ].context);

                        } else if ( options.jsGlobals ) {
                            _.each( options.jsGlobals, function ( val, key ) {
                                if ( key.toLowerCase() === modlow ) {
                                    globalParam = key;
                                    globalArg = key;
                                }
                            });
                        }

                        if ( globalArg && globalParam ) {
                            replaceDependencies.push( {__dependency__: firsts[ i ], replacement: globalArg} );
                            replaceFirsts.push( globalArg );
                            replaceLasts.push( ["window", globalParam].join( "." ) );
                        }

                    // Only push onto replacers if module/el !== "", so no imports...
                    } else if ( module && el ) {
                        replaceDependencies.push( {__dependency__: firsts[ i ], replacement: module} );

                        if ( module !== "window" ) {
                            replaceFirsts.push( module );
                            replaceLasts.push( el.replace( rSlashDot, "." ) );
                        }
                    }
                });

                tplOpen = _.template( closureOpen, {
                    params: coreArgs.params.concat( replaceFirsts ).concat( coreArgs.undef ).join( ", " )
                });

                tplClose = _.template( closureClose, {
                    args: coreArgs.args.concat( replaceLasts ).join( ", " )
                });

                file = file.replace( firstLine[ 1 ], tplOpen );
                file = file.replace( lastLine[ 1 ], tplClose );
            }

            // Handle all dependency replacements
            _.each( replaceDependencies, function ( el ) {
                file = file.replace( new RegExp( el.__dependency__, "g" ), el.replacement );
            });

            // Handle all console.log replacements
            file = file.replace( rConsoleCall, appDotLogCall );

            return file;
        }
    };

})( require( "grunt" ) );