/*!
 * 
 * grunt-nautilus
 * https://github.com/kitajchuk/grunt-nautilus
 *
 * Copyright (c) 2013 Brandon Kitajchuk
 * Licensed under the MIT license.
 *
 * Resources
 * http://wiki.ecmascript.org/doku.php?id=harmony:modules
 *
 *
 * @instance
 *  _env
 *  _args
 *  _task
 *  _schema
 *
 * @module
 *  src
 *  compiler
 *  dependencies
 *  dist
 *  schema
 *
 *
 */
module.exports = (function ( grunt ) {


    "use strict";


    var _ = grunt.util._,

        // Core node
        nodePath = require( "path" ),

        // 3rd party node
        rimraf = require( "rimraf" ),

        // nautilus core
        core = require( "./core/core" ),

        // All the goodies :-)
        options = core.options,
        ender = grunt.config.get( "ender" ),
        compass = grunt.config.get( "compass" ),
        flags = {
            env: grunt.option( "env" ),
            loud: grunt.option( "loud" ),
            path: grunt.option( "path" ),
            
        },

        // Compile types
        es6Types = {
            globals: "toGlobals"
        },

        // Pre-compile Process function
        onAfterEnder = function () {},

        // Regex
        rEnderSrcMap = /\/\/#\ssourceMappingURL=(.*?)ender\.js\.map/,
        rAppModule = /\.tmp\/module-\d{1,2}-app-|\.tmp\/\.app\.js/,
        rController = /controller/,
        rQuoted = /"|'/g,
        rLib = /^lib\//,
        rApp = /^app\//,
        rGlob = /\*/,

        // Use .jshintrc for jshint settings
        jshintrc = JSON.parse( grunt.file.read( nodePath.join( core.dirs.root, ".jshintrc" ) ) ),

        // Write/read dirs
        __sass__ = ( compass && compass.options ) ? ( compass[ flags.env ] ) ? compass[ flags.env ].options.sassDir : compass.options.sassDir : null,
        __dist__ = options.jsDistRoot,
        __pub__ = options.pubRoot,
        __app__ = options.jsAppRoot,
        __lib__ = options.jsLibRoot,
        __js__ = options.jsRoot,
        __cwd__ = ".",

        // File extenstion for app
        __ext__ = ".js",

        // Private tmp dir for compiling
        __tmp__ = nodePath.join( __dist__, ".tmp" ),

        // Core {app} framework include
        __dep__ = grunt.file.read( nodePath.join( core.dirs.app, "app.js" ) ),

        // Core globs for app dev
        coreTasks = {
            watchJs: [__js__ + "/**/*.js", "!" + __js__ + "/dist/*.js"],
            watchSass: [__sass__ + "/**/*.scss"],
            jshint: [__app__ + "/**/*.js"]
        },

        // Singleton
        instance;


    /**
     *
     * Grunt javascript application manager
     * @constructor Nautilus
     * @memberof! <global>
     *
     */
    var Nautilus = function () {
        return (instance || this.init.apply( this, arguments ));
    };


    Nautilus.prototype = {
        constructor: Nautilus,

        /**
         *
         * Nautilus constructor method
         * @memberof Nautilus
         * @method init
         *
         */
        init: function () {
            instance = this;

            /**
             *
             * Nautilus task defined
             * @memberof Nautilus
             * @member _task
             * @private
             *
             */
            this._task = null;

            /**
             *
             * Nautilus args applied
             * @memberof Nautilus
             * @member _args
             * @private
             *
             */
            this._args = null;

            // Load the peer packages
            this.plugins();
        },

        /**
         *
         * Nautilus plugin loader
         * @memberof Nautilus
         * @method plugins
         *
         */
        plugins: function () {
            var packageJson = grunt.file.read( nodePath.join( core.dirs.root, "package.json" ) ),
                peerPackages = JSON.parse( packageJson ).peerDependencies;
            
            _.each( peerPackages, function ( val, key ) {
                if ( key !== "grunt" ) {
                    grunt.loadNpmTasks( key );
                    
                    core.logger.log( "LOAD_PLUGIN", {
                        plugin: key
                    });
                }
            });
        },

        /**
         *
         * Nautilus application compiler
         * @memberof Nautilus
         * @method compile
         * @param {object} args The arguments called with the task
         *
         */
        compile: function ( args ) {
            var build;

            this.setArgs( args );
            this.setTask();
            this.setEnv();
            this.doClean();
            this.tryType();
            this.setScheme();

            // What are we really doing here?
            switch ( this._task ) {
                case "module":
                    core.module.create.apply(
                        core.module,
                        flags.path.split( "/" )
                    );
                    break;

                case "whitespace":
                    this.doCleanLines();
                    break;

                // Default is to compile javascript
                default:
                    this.doPreTasks(function () {
                        build = _.compose(
                            instance.taskCompile,
                            instance.taskHint,
                            instance.taskClean,
                            instance.taskWatch,
                            instance.moduleDist,
                            instance.moduleWrite,
                            instance.moduleCompile,
                            instance.moduleRecurse,
                            instance.moduleParse,
                            instance.moduleLoad
                        );

                        // Everything starts from nothing
                        build( {} );
                    });
                    break;
            }
        },

        /**
         *
         * Nautilus execute the final grunt task sequence
         * @memberof Nautilus
         * @method taskCompile
         * @param {object} modules The build modules object
         * @fires grunt-nautilus-done
         *
         */
        taskCompile: function ( modules ) {
            var task = ( instance._task === "deploy" ) ? instance._task : "build",
                contrib = ( instance._task === "deploy" ) ? "uglify" : "concat",
                tasks = core.util.mergeTasks( task, [contrib, "clean:nautilus"] );

            // Check for compass
            if ( compass ) {
                tasks.push( "compass:" + instance._env );
            }

            grunt.task.run( tasks );

            grunt.event.emit( "grunt-nautilus-done" );

            return modules;
        },

        /**
         *
         * Nautilus execute the watch task config
         * @memberof Nautilus
         * @method taskWatch
         * @param {object} modules The build modules object
         *
         */
        taskWatch: function ( modules ) {
            var scriptTasks = core.util.mergeTasks( "watch", ["nautilus:build", "clean:nautilus"] ),
                stylesTasks = "compass:" + instance._env,
                watch = {
                    scripts: {
                        files: coreTasks.watchJs,
                        tasks: scriptTasks
                    },
                    compass: {
                        files: coreTasks.watchSass,
                        tasks: stylesTasks
                    }
                };

            core.config.watch( watch );

            return modules;
        },

        /**
         *
         * Nautilus execute the clean task config
         * @memberof Nautilus
         * @method taskClean
         * @param {object} modules The build modules object
         *
         */
        taskClean: function ( modules ) {
            core.config.clean({
                "nautilus": [__tmp__]
            });

            return modules;
        },

        /**
         *
         * Nautilus execute the jshint task config
         * @memberof Nautilus
         * @method taskHint
         * @param {object} modules The build modules object
         *
         */
        taskHint: function ( modules ) {
            var config = grunt.config.get( "jshint" ),
                jshint = {};

            if ( config && config.options ) {
                jshint.options = _.extend( jshintrc, config.options );

            } else {
                jshint.options = jshintrc;
            }

            if ( jshint.options.globals ) {
                jshint.options.globals = _.extend( jshint.options.globals, options.jsGlobals );

            } else {
                jshint.options.globals = options.jsGlobals;
            }

            if ( _.isArray( options.hintAt ) && options.hintAt.length ) {
                jshint.hintAt = {
                    src: []
                };

                _.each( options.hintAt, function ( el ) {
                    if ( rGlob.test( el ) ) {
                        var files = grunt.file.expand( el );

                        if ( files.length ) {
                            _.each( files, function ( file ) {
                                if ( _.contains( jshint.hintAt.src, file ) ) {
                                    jshint.hintAt.src.push( file );
                                }
                            });

                        } else {
                            core.logger.log( "MISSING_HINTAT", {
                                el: el
                            });
                        }

                    } else if ( grunt.file.isFile( el ) && _.contains( jshint.hintAt.src, el ) ) {
                        jshint.hintAt.src.push( el );

                    } else {
                        core.logger.log( "MISSING_HINTAT", {
                            el: el
                        });
                    }
                });
            }

            _.each( modules, function ( module, key ) {
                /* @todo: lint raw js files
                var raw = [];

                _.each( module.dependencies, function ( dep, key, list ) {
                    if ( rApp.test( key ) ) {
                        raw.push( dep.src );
                    }
                });

                jshint[ key + "-RAW" ] = raw;
                */

                // lint parsed .tmp js files
                jshint[ key + "-PARSED" ] = _.filter( module.dist.src, function ( el ) {
                    if ( rAppModule.test( el ) ) {
                        return el;
                    }
                });
            });

            core.config.jshint( jshint );

            return modules;
        },

        /**
         *
         * Nautilus initial module layout compilation
         * @memberof Nautilus
         * @method moduleLoad
         * @param {object} modules The build modules object
         *
         */
        moduleLoad: function ( modules ) {
            var main = ( _.isArray( options.main ) ) ? options.main : [options.main],
                match;

            main = main.map(function ( el ) {
                return nodePath.join( __app__, core.util.front2Back( el ) );
            });

            match = grunt.file.expand( main );

            if ( !match.length ) {
                core.logger.log( "MAIN_NOMATCH" );
            }

            _.each( match, function ( val ) {
                modules[ core.util.nameSpace( val ) ] = {
                    src: val
                };
            });

            return modules;
        },

        /**
         *
         * Nautilus run modules through es6-transpiler
         * @memberof Nautilus
         * @method moduleParse
         * @param {object} modules The build modules object
         *
         */
        moduleParse: function ( modules ) {
            _.each( modules, function ( val, key ) {
                val.compiler = core.compiler.transpile( val.src, key );

                modules[ key ] = val;
            });

            return modules;
        },

        /**
         *
         * Nautilus recursively build module dependency listings
         * @note This breaks if 2 modules import 1 another
         * @memberof Nautilus
         * @method moduleRecurse
         * @param {object} modules The build modules object
         *
         */
        moduleRecurse: function ( modules ) {
            var recurse = function ( deps, module ) {
                    deps = deps || {};

                    var imports = [];

                    _.each( module.compiler.imports, function ( el ) {
                        imports.push( el.source.value );
                    });

                    imports = _.uniq( imports );

                    _.each( imports, function ( el ) {
                        var path, paths;

                        // Matched lib import    
                        if ( rLib.test( el ) ) {
                            path = nodePath.join( __lib__, el.replace( rLib, "" ) );

                        // Matched app import    
                        } else if ( rApp.test( el ) ) {
                            path = nodePath.join( __app__, el.replace( rApp, "" ) );

                        // Try looking in pubRoot or jsRoot or Gruntfile root
                        } else {
                            _.each( [__js__, __pub__, __cwd__], function ( root ) {
                                var lookup = nodePath.join( root, el );
                                
                                if ( grunt.file.isFile( lookup + __ext__ ) || grunt.file.isDir( lookup ) ) {
                                    path = lookup;
                                }
                            });
                        }

                        // Matched a file
                        if ( path && grunt.file.isFile( path + __ext__ ) ) {
                            if ( !deps[ el ] ) {
                                var compiler = core.compiler.transpile( path + __ext__, el ),
                                    dep = {
                                        src: path + __ext__,
                                        compiler: compiler
                                    };

                                deps = recurse( deps, dep );

                                deps[ el ] = dep;
                            }

                        // Matched a dir    
                        } else if ( path && grunt.file.isDir( path ) ) {
                            paths = grunt.file.expand( nodePath.join( path, "**/*" + __ext__ ) );

                            _.each( paths, function ( el ) {
                                var moduleName = core.util.moduleName( el ),
                                    nameSpace = core.util.nameSpace( el );

                                if ( !deps[ moduleName ] ) {
                                    var compiler = core.compiler.transpile( el, moduleName ),
                                        dep = {
                                            src: el,
                                            compiler: compiler
                                        };

                                    deps = recurse( deps, dep );
                                    
                                    deps[ nameSpace ] = dep;
                                }
                            });

                        // No matches in available locations    
                        } else {
                            core.logger.log( "MISSING_MODULE", {
                                file: module.src
                            });
                        }
                    });

                    return deps;
                };

            _.each( modules, function ( val, key ) {
                var path = nodePath.join( __js__, key + __ext__ );

                val.dependencies = {};
                val.dependencies = recurse( val.dependencies, val );
                val.dependencies[ key ] = {
                    src: path,
                    compiler: core.compiler.transpile( path, key )
                };
                val.schema = {};

                // Create the schema actually used by each target file
                for ( var i in val.dependencies ) {
                    if ( /^app/.test( i ) ) {
                        var o = i.replace( /app/g, "" ).replace( /^\/+|\/+$/g, "" ).split( "/" ).shift();

                        if ( o ) {
                            val.schema[ o ] = instance._schema[ o ];
                        }
                    }
                }

                modules[ key ] = val;
            });

            return modules;
        },

        /**
         *
         * Nautilus figure out where to write temp files
         * @memberof Nautilus
         * @method moduleCompile
         * @param {object} modules The build modules object
         *
         */
        moduleCompile: function ( modules ) {
            _.each( modules, function ( module, key ) {
                var topKey = key;

                _.each( module.dependencies, function ( val, key ) {
                    var file = val.compiler.string;

                    val.fileContent = file;

                    // Only make temps for application
                    if ( rApp.test( key ) || key === "app" ) {
                        file = val.compiler[ es6Types[ options.type ] ]();
                        file = core.parser[ options.type ]( key, file );
                        
                        val.fileContent = file;
                        val.tmp = nodePath.join( __tmp__, core.util.tempName( key ) + __ext__ );

                    // Third-party can compile from source, don't fuck wit it!
                    } else {
                        core.logger.log( "THIRD_PARTY", {
                            src: nodePath.join( key )
                        });
                    }

                    module.dependencies[ key ] = val;
                });

                if ( rController.test( key ) ) {
                    var exec = core.compiler.closure( "app.exec( \"" + core.util.moduleName( key ) + "\" );" ),
                        path = nodePath.join( __tmp__, core.util.tempName( key + "/exec" ) + __ext__ );
                    
                    module.dependencies[ key + "/exec" ] = {
                        src: path,
                        fileContent: exec,
                        compiler: null,
                        tmp: path
                    };
                }

                modules[ topKey ] = module;
            });

            return modules;
        },

        /**
         *
         * Nautilus write the temp files for compilation to .tmp
         * @memberof Nautilus
         * @method moduleWrite
         * @param {object} modules The build modules object
         *
         */
        moduleWrite: function ( modules ) {
            _.each( modules, function ( module, key ) {
                var moduleName = core.util.moduleName( key ),

                    // Create the uniquely compiled app framework file
                    distFirst = _.template( __dep__, {
                        env: instance._env,
                        schema: JSON.stringify( module.schema, null, 4 ).replace( rQuoted, "" )
                    }),
                    distFile = nodePath.join( __tmp__, ".app-" + moduleName + __ext__ );

                grunt.file.write( distFile, distFirst );

                module.dist = {
                    src: [distFile],
                    dest: nodePath.join( __dist__, moduleName + __ext__ )
                };

                _.each( module.dependencies, function ( val ) {
                    if ( val.compiler && val.compiler.imports.length ) {
                        _.each( val.compiler.imports, function ( imp ) {
                            var mod = module.dependencies[ imp.source.value ];

                            if ( mod && mod.tmp ) {
                                grunt.file.write( mod.tmp, mod.fileContent );

                                module.dist.src.push( mod.tmp );
                            }
                        });
                    }

                    if ( val.tmp ) {
                        grunt.file.write( val.tmp, val.fileContent );

                        module.dist.src.push( val.tmp );

                    } else {
                        module.dist.src.push( val.src );
                    }
                });

                module.dist.src = core.util.mergeBuildIn( module.dist.src, moduleName );
                module.dist.src = _.uniq( module.dist.src );

                modules[ key ] = module;
            });

            return modules;
        },

        /**
         *
         * Nautilus create grunt config for module dist directives
         * @memberof Nautilus
         * @method moduleDist
         * @param {object} modules The build modules object
         *
         */
        moduleDist: function ( modules ) {
            var config = {
                options: {
                    banner: "<%= banner %>"
                }
            };

            _.each( modules, function ( module, key ) {
                config[ key ] = module.dist;
            });

            core.config.concatUglify( config );

            return modules;
        },

        /**
         *
         * Nautilus set the arguments passed from grunt command
         * @memberof Nautilus
         * @method setArgs
         * @param {object} args The command-line arguments for grunt
         *
         */
        setArgs: function ( args ) {
            this._args = args;
        },

        /**
         *
         * Nautilus set the task to be used
         * @memberof Nautilus
         * @method setTask
         *
         */
        setTask: function () {
            var task = _.first( this._args );

            if ( !this._args.length ) {
                core.logger.log( "MISSING_ARGUMENTS" );
            }

            switch ( task ) {
                case "module":
                case "build":
                case "deploy":
                case "watch":
                case "whitespace":
                    this._task = task;
                    break;

                default:
                    core.logger.log( "INVALID_ARGUMENTS" );
                    break;
            }
        },

        /**
         *
         * Nautilus set the environment used
         * @memberof Nautilus
         * @method setEnv
         *
         */
        setEnv: function () {
            this._env = (flags.env || ( this._task === "deploy" ) ? "production" : "development");
        },

        /**
         *
         * Nautilus set the application object layout
         * @memberof Nautilus
         * @method setScheme
         *
         */
        setScheme: function () {
            this._schema = core.util.getWalkedDirectory( __app__ );
        },

        /**
         *
         * Nautilus perform a full .tmp clean with rimraf
         * @memberof Nautilus
         * @method doClean
         *
         */
        doClean: function () {
            rimraf.sync( __tmp__ );
        },

        /**
         *
         * Nautilus parse and cleanout whitespace in application javascript
         * @memberof Nautilus
         * @method doCleanLines
         *
         */
        doCleanLines: function () {
            var files = [];

            if ( options.whitespace && options.whitespace.files ) {
                _.each( options.whitespace.files, function ( el ) {
                    files = files.concat( grunt.file.expand( el ) );
                });

                _.each( files, function ( el ) {
                    core.util.cleanWhiteSpace( el );

                    core.logger.log( "WHITESPACE_CLEANED", {
                        file: el
                    });
                });
            }
        },

        /**
         *
         * Nautilus execute async pre-compile necessary tasks before compiling
         * @memberof Nautilus
         * @method doPreTasks
         * @param {function} cb The callback to fire
         *
         */
        doPreTasks: function ( cb ) {
            if ( ender ) {
                onAfterEnder = _.once( cb );

                // Waiting for pull request
                // https://github.com/endium/grunt-ender/pull/4
                // grunt.task.run( "ender:refresh" );
                grunt.task.run( "ender" );

            } else {
                cb();
            }
        },

        /**
         *
         * Nautilus test the compile type, currently only "globals" is supported
         * @memberof Nautilus
         * @method tryType
         *
         */
        tryType: function () {
            if ( !es6Types[ options.type ] ) {
                core.logger.log( "UNSUPPORTED_TYPE", {
                    type: options.type
                });
            }
        }
    };


    // grunt event management

    /**
     * 
     * Listen for ender builds to finish.
     * Added to grunt-ender:
     * https://github.com/endium/grunt-ender/pull/2
     * Ender.js files that are created on build:
     * ender.js
     * ender.js.map
     * ender.min.js
     * ender.min.js.map
     *
     */
    grunt.event.on( "grunt_ender_build_done", function () {
        // This would need to know how to serve static assets, for instance on a caribou project:
        // //# sourceMappingURL=resources/public/js/lib/ender/ender.js.map would need to actually be:
        // //# sourceMappingURL=/js/lib/ender/ender.js.map

        // The only way to do this is to have the plugin user define that for us.
        // This is an unofficial grunt-ender option we'll use to accomplish this.
        if ( ender.options.srcmap ) {
            var file = (ender.options.output + __ext__),
                srcmap = ("//# sourceMappingURL=" + ender.options.srcmap + __ext__ + ".map"),
                script = grunt.file.read( file ).replace( rEnderSrcMap, srcmap );
            
            grunt.file.write( file, script );
        }

        onAfterEnder();
    });


    /**
     * 
     * Listen for watch event.
     * Cleans whitespace lines from files if option is set to true.
     *
     */
    grunt.event.on( "watch", function ( action, filepath ) {
        if ( options.whitespace && options.whitespace.watch ) {
            core.util.cleanWhiteSpace( filepath );
        }
    });


    // Return the instance
    // require( "./lib/nautilus" );
    return new Nautilus();


})( require( "grunt" ) );