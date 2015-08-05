/*!
 * 
 * grunt-nautilus
 * https://github.com/kitajchuk/grunt-nautilus
 *
 * Copyright (c) 2015 Brandon Kitajchuk
 * Licensed under the MIT license.
 *
 * Resources
 * http://wiki.ecmascript.org/doku.php?id=harmony:modules
 *
 *
 * @todo: use grunt.config.merge
 *
 *
 * @instance
 *  _env
 *  _args
 *  _task
 *  _schema
 *
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

        // Autoprefixer
        autoprefixer = require( "autoprefixer-core" ),

        // Core node
        nodePath = require( "path" ),

        // 3rd party node
        rimraf = require( "rimraf" ),

        // nautilus core
        core = require( "./core/core" ),

        // All the goodies :-)
        options = core.options,
        flags = {
            env: grunt.option( "env" ),
            loud: grunt.option( "loud" ),
            path: grunt.option( "path" )
        },

        // Compile types
        es6Types = {
            globals: "toGlobals"
        },

        // Regex
        rQuoted = /"|'/g,
        rLib = /^lib\//,
        rApp = /^app\//,
        rGlob = /\*/,
        rJs = /\.js$/,

        // Use .jshintrc for jshint settings
        jshintrc = JSON.parse( grunt.file.read( nodePath.join( core.dirs.root, ".jshintrc" ) ) ),

        // Write/read dirs
        __css__ = options.cssRoot,
        __sass__ = options.sassRoot,
        __dist__ = options.jsDistRoot,
        __pub__ = options.pubRoot,
        __app__ = options.jsAppRoot,
        __lib__ = options.jsLibRoot,
        __js__ = options.jsRoot,
        __cwd__ = ".",

        // Jsdoc destination
        __docs__ = nodePath.join( __js__, "docs" ),

        // File extenstion for app
        __ext__ = ".js",

        // Private tmp dir for compiling
        __tmp__ = nodePath.join( __dist__, ".tmp" ),

        // Core {app} framework include
        __dep__ = grunt.file.read( nodePath.join( core.dirs.app, "app.js" ) ),

        // Core globs for app dev
        coreTasks = {
            watchJs: [__js__ + "/**/*.js", "!" + __js__ + "/dist/*.js", "!" + __js__ + "/docs/*.js"],
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
            this.setSchema();

            // What are we really doing here?
            switch ( this._task ) {
                case "module":
                    core.module.create.apply(
                        core.module,
                        flags.path.split( "/" )
                    );
                    break;

                // Default is to compile javascript
                default:
                    build = _.compose(
                        instance.taskCompile,
                        instance.taskHint,
                        instance.taskClean,
                        instance.taskWatch,
                        instance.taskSass,
                        instance.taskJsdoc,
                        instance.moduleDist,
                        instance.moduleWrite,
                        instance.moduleCompile,
                        instance.moduleRecurse,
                        instance.moduleParse,
                        instance.moduleLoad
                    );

                    // Everything starts from nothing
                    build( {} );
                    break;
            }
        },

        /**
         *
         * Nautilus execute the jsdoc task config
         * @memberof Nautilus
         * @method taskJsdoc
         * @param {object} modules The build modules object
         *
         */
        taskJsdoc: function ( modules ) {
            if ( options.jsdocs ) {
                core.config.jsdoc({
                    source: {
                        src: [__tmp__ + "/**/*.js"],

                        options: {
                            destination: __docs__
                        }
                    }
                });
            }

            return modules;
        },

        /**
         *
         * Nautilus execute the sass task config
         * @memberof Nautilus
         * @method taskSass
         * @param {object} modules The build modules object
         *
         */
        taskSass: function ( modules ) {
            var config = {
                styles: {}
            };

            if ( options.cssRoot && options.sassRoot ) {
                config.styles.options = {
                    style: (instance._env === "development" ? "expanded" : "compressed"),
                    sourcemap: "none"
                };

                config.styles.files = {};

                grunt.file.recurse( __sass__, function ( abspath, rootdir, subdir, filename ) {
                    // Ignore partials
                    if ( !/^_|^\./.test( filename ) ) {
                        var cssFile = nodePath.join( __css__, filename.replace( /\.scss|\.sass/g, ".css" ) );

                        config.styles.files[ cssFile ] = abspath;
                    }
                });

                core.config.sass( config );

                // Setup postcss for autoprefixer
                core.config.postcss({
                    options: {
                        processors: [
                            autoprefixer( {browsers: options.browsers} )
                        ]
                    },

                    dist: {
                        src: (__css__ + "/*.css")
                    }
                });
            }

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
                stylesTasks = core.util.mergeTasks( "watch", ["nautilus:sass"] ),
                watch = {
                    scripts: {
                        files: coreTasks.watchJs,
                        tasks: scriptTasks
                    }
                };

            if ( options.cssRoot && options.sassRoot ) {
                watch.styles = {
                    files: coreTasks.watchSass,
                    tasks: stylesTasks
                };
            }

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
                jshint = {
                    gruntfile: {
                        src: "Gruntfile.js"
                    }
                };

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
                var transpiled = [],
                    keyTranspiled = key + "-TRANSPILED" + (module.standalone ? "-STANDALONE" : "");

                _.each( module.dist.src, function ( el ) {
                    var splits = el.split( __tmp__ ),
                        file = splits[ 1 ];

                    // Restrict jshint to javascript in the jsApp directory
                    if ( file && grunt.file.exists( nodePath.join( __app__, file ) ) ) {
                        transpiled.push( el );
                    }
                });

                jshint[ keyTranspiled ] = {
                    src: transpiled
                };
            });

            core.config.jshint( jshint );

            return modules;
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
                tasks = [contrib];

            if ( options.jsdocs ) {
                // Fresh clean on the jsdocs dir
                rimraf.sync( __docs__ );

                tasks.push( "jsdoc" );
            }

            tasks.push( "clean:nautilus" );

            if ( options.cssRoot && options.sassRoot ) {
                tasks = tasks.concat( ["sass", "postcss"] );
            }

            tasks = core.util.mergeTasks( task, tasks );

            grunt.task.run( tasks );

            grunt.event.emit( "grunt-nautilus-done" );

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

            if ( _.isArray( options.standalone ) ) {
                options.standalone = options.standalone.map(function ( el ) {
                    return nodePath.join( __app__, core.util.front2Back( el ) );
                });

                _.each( options.standalone, function ( val ) {
                    modules[ core.util.nameSpace( val ) ] = {
                        src: ( rJs.test( val ) ) ? val : (val + __ext__),
                        standalone: true
                    };
                });
            }

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
                                file: module.src,
                                path: path
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
                    distFirst,
                    distFile;

                if ( !module.standalone ) {
                    // Create the uniquely compiled app framework file
                    distFirst = _.template( __dep__, {
                        env: instance._env,
                        schema: JSON.stringify( module.schema, null, 4 ).replace( rQuoted, "" ),
                        namespace: options.namespace
                    });

                    distFile = nodePath.join( __tmp__, ("app-core" + __ext__) );

                    grunt.file.write( distFile, distFirst );
                }

                // For standalone files, only compile what is imported
                module.dist = {
                    src: (module.standalone) ? [] : [distFile],
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
                case "sass":
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
         * @method setSchema
         *
         */
        setSchema: function () {
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


    // Return the instance
    // require( "./lib/nautilus" );
    return new Nautilus();


})( require( "grunt" ) );