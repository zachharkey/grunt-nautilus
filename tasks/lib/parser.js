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
        
        rExports = new RegExp( "__exports__\\..*?(?=\\s=)", "g" ),
        rLib = new RegExp( "^" + coreGlobal + "\\.(?!app\\/)(.*?)$" ),
        rSyntax = /function|\(|\)|\{|\}|;|\s|\n/g,
        rLastLine = /\n(.*?)$/,
        rFirstLine = /^(.*?)\n/,
        rSlashDot = /\/|\./g,
        rNew = /\n|\r/g,
        rConsoleCall = /console\.log\(/g,
        
        appDotLogCall = "app.log(";
    
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
                lasts = lastNoSyntax.split( "," );
            
            // Handle parsing module exports
            if ( exported && exported.length === 1 ) {
                file = file.replace(
                    exported[ 0 ],
                    coreGlobal + "." + dottedExport
                );
            
            // Multi-Export situations
            } else {
                _.each( exported, function ( exp ) {
                    var module = exp.split( rSlashDot ).pop();
                    
                    file = file.replace(
                        exp,
                        coreGlobal + "." + dottedExport + "." + module
                    );
                });
            }
            
            // Handle replacing the parameters and arguments for the function closure
            if ( firsts.length && lasts.length ) {
                _.each( lasts, function ( el, i, list ) {
                    var module = el.split( rSlashDot ).reverse()[ 0 ],
                        modlow = module.toLowerCase(),
                        globalArg,
                        globalParam;
                    
                    if ( rLib.test( el ) ) {
                        
                        if ( coreLibs[ modlow ] ) {
                            globalParam = coreLibs[ modlow ].context;
                            globalArg = (coreLibs[ modlow ].shorthand || coreLibs[ modlow ].context);
                            
                        } else if ( options.jsGlobals ) {
                            _.each( options.jsGlobals, function ( val, key, list ) {
                                if ( key.toLowerCase() === modlow ) {
                                    globalParam = key;
                                    globalArg = key;
                                }
                            });
                        }
                        
                        if ( globalArg && globalParam ) {
                            replaceDependencies.push( {__dependency__: firsts[ i ], replacement: globalArg} );
                            replaceFirsts.push( globalArg );
                            replaceLasts.push( [coreGlobal, globalParam].join( "." ) );
                        }
                        
                    } else {
                        replaceDependencies.push( {__dependency__: firsts[ i ], replacement: module} );
                        replaceFirsts.push( module );
                        replaceLasts.push( el.replace( rSlashDot, "." ) );
                    }
                });
                
                file = file.replace( firstLine[ 1 ], "(function( " + replaceFirsts.join( ", " ) + " ) {" );
                file = file.replace( lastLine[ 1 ], "})( " + replaceLasts.join( ", " ) + " );" );
            }
            
            // Handle all dependency replacements
            _.each( replaceDependencies, function ( el, i, list ) {
                file = file.replace( new RegExp( el.__dependency__, "g" ), el.replacement );
            });
            
            // Handle all console.log replacements
            file = file.replace( rConsoleCall, appDotLogCall );
            
            return file;
        }
    };
};