/*!
 * 
 * grunt-nautilus utils
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
        nodeFs = require( "fs" ),
        coreLogger = require( "./logger" );

    return {
        camelCase: function ( str ) {
            return str.replace( /[-|_]([a-z]|[0-9])/ig, function ( all, letter ) {
                return ( "" + letter ).toUpperCase();
            });
        },

        front2Back: function ( str ) {
            return str.replace( /^\/|\/$/g, "" );
        },

        nameSpace: function ( str ) {
            return str.replace( /^.*(?=app\/|lib\/)|\..*$/g, "" );
        },

        moduleName: function ( str ) {
            return str.split( "/" ).reverse()[ 0 ].replace( /\..*$/, "" );
        },

        tempName: function ( str ) {
            return [_.uniqueId( "module-" )].concat( str.split( "/" ) ).join( "-" ); 
        },

        mergeConfig: function ( task, settings ) {
            var config = g.config.get( task );

            // 0.1 no config exists for given task
            if ( !config ) {
                g.config.set( task, settings );
                
                coreLogger.log( "CONFIG_SET", {
                    task: task,
                    action: "Set"
                });

            // 0.2 merge nautilus config with existing config for given task
            } else {
                g.config.set( task, _.extend( config, settings ) );

                coreLogger.log( "CONFIG_SET", {
                    task: task,
                    action: "Merge"
                });
            }
        },

        mergeTasks: function ( task, tasks, index ) {
            // 0.1 jshint on this task
            if ( options.hintOn && _.contains( options.hintOn, task ) && task !== "watch" ) {
                tasks = ( _.isString( tasks ) ) ? [tasks] : tasks;

                if ( index ) {
                    tasks.splice( index, 0, "jshint" );

                } else {
                    tasks.unshift( "jshint" );
                }

                coreLogger.log( "MATCHED_HINTON", {
                    task: task
                });
            }

            return tasks;
        },

        getWalkedDirectory: function ( directory ) {
            var object = {},
                walker = function ( path ) {
                    var dir = nodeFs.readdirSync( path );

                    for ( var i = 0; i < dir.length; i++ ) {
                        var name = dir[ i ],
                            target = path + "/" + name,
                            stats = nodeFs.statSync( target ),
                            rjs = /\.js$/;

                        if ( stats.isDirectory() ) {
                            object[ name ] = {};

                            walker( target );

                        } else if ( rjs.test( name ) && name !== "app.js" ) {
                            object[ name.replace( rjs, "" ) ] = {};
                        }
                    }
                };

            walker( directory );

            return object;
        },

        mergeBuildIn: function ( filesArray, module ) {
            if ( !options.buildIn ) {
                return filesArray;
            }

            _.each( options.buildIn, function ( buildIn, name ) {
                var builds = ( _.isString( buildIn.builds ) ) ? [buildIn.builds] : buildIn.builds,
                    files = ( _.isString( buildIn.files ) ) ? [buildIn.files] : buildIn.files;

                if ( _.contains( builds, module ) ) {
                    if ( buildIn.priority > 0 ) {
                        filesArray = filesArray.concat( files );

                    } else {
                        filesArray = files.concat( filesArray );
                    }

                    coreLogger.log( "MERGE_BUILDIN", {
                        buildIn: name,
                        script: module
                    });
                }
            });
            
            return filesArray;
        },

        cleanWhiteSpace: function ( filepath ) {
            var regex = /^\s+$/m,
                rspace = /\s/g,
                content = g.file.read( filepath ),
                matched = content.match( regex ),
                match,
                index,
                length;

            while ( matched ) {
                match = matched[ 0 ];
                length = match.length;
                index = matched.index;
                
                content = content.substr( 0, index ) + match.replace( rspace, "" ) + content.substr( index + length );
                matched = content.match( regex );
            }

            g.file.write( filepath, content );
        }
    };

})( require( "grunt" ) );