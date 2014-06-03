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
 *  _args
 *  _task
 *  schema
 *  modules
 *
 * @instance.modules module
 *  src
 *  compiler
 *  dependencies
 *  dist
 *
 *
 */
module.exports = function ( grunt, options ) {
    
    
    "use strict";
    
    
    /*!
     *
     * @functions
     *
     */
    var mergeTasks = function ( task, tasks, index ) {
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
    };
    
    var walkDirectory = function ( path, obj ) {
        var dir = nodeFs.readdirSync( path );
        
        for ( var i = 0; i < dir.length; i++ ) {
            var name = dir[ i ],
                target = path + "/" + name,
                stats = nodeFs.statSync( target ),
                rjs = /\.js$/;
                
            if ( stats.isDirectory() ) {
                obj[ name ] = {};
                
                walkDirectory( target, obj[ name ] );

            } else if ( rjs.test( name ) && name !== "app.js" ) {
                obj[ name.replace( rjs, "" ) ] = {};
            }
        }
    };
    
    var mergeBuildIn = function ( filesArray, module ) {
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
    };
    
    var cleanWhiteSpace = function ( filepath ) {
        var regex = /^\s+$/m,
            rspace = /\s/g,
            content = grunt.file.read( filepath ),
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

        grunt.file.write( filepath, content );
    };
    
    
    /*!
     * 
     * @globals
     *
     */
    var _ = grunt.util._,
        
        // Load libs
        nodeFs = require( "fs" ),
        nodePath = require( "path" ),
        coreDirs = require( "./dirs" ),
        coreUtils = require( "./utils" )( grunt, options ),
        coreLogger = require( "./logger" )( grunt, options ),
        coreCompiler = require( "./compiler" )( grunt, options ),
        coreModule = require( "./module" )( grunt, options ),
        coreConfig = require( "./config" )( grunt, options ),
        coreParser = require( "./parser" )( grunt, options ),
        rimraf = require( "rimraf" ),
        
        // Supported plugin compilers
        ender = grunt.config.get( "ender" ),
        compass = grunt.config.get( "compass" ),
        
        // Compile types
        es6Types = {
            globals: "toGlobals"
        },
        
        // Write/read dirs
        __sass__ = ( compass && compass.options ) ? (compass.options.sassDir || compass[ grunt.option( "env" ) ].options.sassDir) : null,
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
        __dep0__ = grunt.file.read( nodePath.join( coreDirs.app, "app.js" ) ),
        
        // Process function
        __func__ = function () {},
        
        // Regex
        rEnderSrcMap = /\/\/#\ssourceMappingURL=(.*?)ender\.js\.map/,
        rAppModule = /\.tmp\/module-\d{1,2}-app-|\.tmp\/\.app\.js/,
        rController = /controller/,
        rQuoted = /"|'/g,
        rLib = /^lib\//,
        rApp = /^app\//,
        rGlob = /\*/,
        rDot = /\//g,
        
        // Use .jshintrc for jshint settings
        jshintrc = JSON.parse( grunt.file.read( nodePath.join( coreDirs.root, ".jshintrc" ) ) ),
        
        // Core globs for app dev
        coreTasks = {
            watchJs: [__js__ + "/**/*.js", "!" + __js__ + "/dist/*.js"],
            watchSass: [__sass__ + "/**/*.scss"],
            jshint: [__app__ + "/**/*.js"]
        },
        
        // Singleton
        instance;
    
    
    /*!
     * 
     * @Nautilus {Class}
     *
     */
    var Nautilus = function () {
        instance = this;
        
        
        /*!
         *
         * Nautilus.prototype._task.
         *
         */
        this._task = null;
        
        /*!
         *
         * Nautilus.prototype._args.
         *
         */
        this._args = null;
        
        
        /*!
         * 
         * Nautilus.prototype.parseArgs.
         *
         * Read [arguments] and handle them.
         *
         */
        this.parseArgs = function ( args ) {
            this._args = args;
            
            // 0.1 grunt nautilus [, flags...]
            if ( !args.length ) {
                coreLogger.log( "MISSING_ARGUMENTS" );
                
            // 0.2 grunt nautilus:app:[:, args...] [, flags...]
            } else if ( _.first( args ) === "app" ) {
                this._task = "app";
                
            // 0.3 grunt nautilus:build [, flags...]
            } else if ( _.first( args ) === "build" ) {
                this._task = "build";
                
            // 0.4 grunt nautilus:deploy [, flags...]
            } else if ( _.first( args ) === "deploy" ) {
                this._task = "deploy";
            
            // 0.5 grunt watch
            } else if ( _.first( args ) === "watch" ) {
                this._task = "watch";
                    
            // 0.6 grunt whitespace
            } else if ( _.first( args ) === "whitespace" ) {
                this._task = "whitespace";
                    
            } else {
                coreLogger.log( "INVALID_ARGUMENTS" );
            }
        };
        
        /*!
         * 
         * Nautilus.prototype.executeStack.
         *
         * The heavy lifting that makes it all work.
         *
         */
        this.executeStack = function () {
            // "Clean" the .tmp directory before stack calls.
            this.cleanUp();
            
            // Throw warning on unsupported es6-module-transpiler type option.
            this.checkES6Type();
            
            // Parse the application schema by walking the app directory.
            this.loadSchema();
            
            // What do we need to do...
            if ( this._task === "app" ) {
                this.appTask.apply( this, [].slice.call( this._args, 1 ) );
                
                return this;
            
            } else if ( this._task === "whitespace" ) {
                this.whiteSpaceTask();
                
                return this;
                
            // watch, build or deploy    
            } else {
                // Perform any pre-module tasks ( ender for example )
                this.preLoadModuleTasks(function () {
                    // Expand the files from {options.main} and create base modules.
                    instance.loadModules();
                    
                    // Parse the modules using the es6-module-transpiler node_module.
                    instance.parseModules();
                    
                    // Recursively walk up modules parsing imports as dependencies.
                    instance.recursiveFindModules();
                    
                    // Build the pre-compiled data for the final write+dist.
                    instance.preCompileModules();
                    
                    // Write all build files at once to the .tmp directory.
                    instance.writeModuleTmpFiles();
                    
                    // Use concat/uglify to compile distribution files.
                    instance.compileModuleDistFiles();
                    
                    // These tasks will be needed either way.
                    instance.watchTask();
                    instance.cleanTask();
                    instance.jsHintTask();
                    instance.sailsLinkerTask();
                    
                    // Execute the correct task.
                    if ( instance._task === "build" || instance._task === "watch" ) {
                        instance.buildTask();
                        
                    } else if ( instance._task === "deploy" ) {
                        instance.deployTask();
                    }
                });
            }
        };
        
        /*!
         * 
         * Nautilus.prototype.checkES6Type.
         *
         * Make sure we support the es6-module-transpiler type.
         *
         */
        this.checkES6Type = function () {
            if ( !es6Types[ options.type ] ) {
                coreLogger.log( "UNSUPPORTED_TYPE", {
                    type: options.type
                });
            }
        };
        
        /*!
         * 
         * Nautilus.prototype.loadPlugins.
         *
         * Loads necessary contrib plugins.
         *
         */
        this.loadPlugins = function () {
            var packageJson = grunt.file.read( nodePath.join( coreDirs.root, "package.json" ) ),
                peerPackages = JSON.parse( packageJson ).peerDependencies;
            
            _.each( peerPackages, function ( val, key, list ) {
                if ( key !== "grunt" ) {
                    grunt.loadNpmTasks( key );
                    
                    coreLogger.log( "LOAD_PLUGIN", {
                        plugin: key
                    });
                }
            });
        };
        
        /*!
         * 
         * Nautilus.prototype.loadSchema.
         *
         * Create the application {Object} schema.
         *
         */
        this.loadSchema = function () {
            var scripts,
                schema = {},
                app = {
                    src: null,
                    compiler: null
                };
            
            walkDirectory( __app__, schema );
            
            instance.schema = schema;
        };
        
        /*!
         * 
         * Nautilus.prototype.preLoadModuleTasks.
         *
         * Make sure we run important tasks before module parsing.
         *
         */
        this.preLoadModuleTasks = function ( callback ) {
            if ( ender ) {
                __func__ = _.once( callback );
                
                /* grunt.task.run( "ender:refresh" ); */
                grunt.task.run( "ender" );
                
            } else {
                callback();
            }
        };
        
        /*!
         * 
         * Nautilus.prototype.loadModules.
         *
         * Expand option.main and create instance modules.
         *
         */
        this.loadModules = function () {
            var main = ( _.isArray( options.main ) ) ? options.main : [options.main],
                modules = {},
                namespace,
                match;
            
            main = main.map(function ( el ) {
                return nodePath.join( __app__, coreUtils.front2Back( el ) );
            });
            
            match = grunt.file.expand( main );
            
            if ( !match.length ) {
                coreLogger.log( "MAIN_NOMATCH" );
            }
            
            _.each( match, function ( val ) {
                modules[ coreUtils.nameSpace( val ) ] = {
                    src: val
                };
            });
            
            instance.modules = modules;
        };
        
        /*!
         * 
         * Nautilus.prototype.parseModules.
         *
         * Parse the es6 module syntax.
         *
         */
        this.parseModules = function () {
            var modules = {};
            
            _.each( instance.modules, function ( val, key, list ) {
                val.compiler = coreCompiler.transpile( val.src, key );
                
                modules[ key ] = val;
            });
            
            instance.modules = modules;
        };
        
        /*!
         * 
         * Nautilus.prototype.recursiveFindModules.
         *
         * Recursively find all module dependencies for a main module.
         *
         */
        this.recursiveFindModules = function () {
            var modules = {},
                recurse = function ( deps, module ) {
                    deps = deps || {};
                    
                    var imports = [];
                    
                    _.each( module.compiler.imports, function ( el, i, list ) {
                        imports.push( el.source.value );
                    });
                    
                    imports = _.uniq( imports );
                    
                    _.each( imports, function ( el, i, list ) {
                        var path, paths;
                        
                        // Matched lib import    
                        if ( rLib.test( el ) ) {
                            path = nodePath.join( __lib__, el.replace( rLib, "" ) );
                        
                        // Matched app import    
                        } else if ( rApp.test( el ) ) {
                            path = nodePath.join( __app__, el.replace( rApp, "" ) );
                        
                        // Try looking in pubRoot or jsRoot or Gruntfile root
                        } else {
                            _.each( [__js__, __pub__, __cwd__], function ( root, i, list ) {
                                var lookup = nodePath.join( root, el );
                                
                                if ( grunt.file.isFile( lookup + __ext__ ) || grunt.file.isDir( lookup ) ) {
                                    path = lookup;
                                }
                            });
                        }
                        
                        // Matched a file
                        if ( path && grunt.file.isFile( path + __ext__ ) ) {
                            if ( !deps[ el ] ) {
                                var compiler = coreCompiler.transpile( path + __ext__, el ),
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
                            
                            _.each( paths, function ( el, i, list ) {
                                var moduleName = coreUtils.moduleName( el ),
                                    nameSpace = coreUtils.nameSpace( el );
                                
                                if ( !deps[ moduleName ] ) {
                                    var compiler = coreCompiler.transpile( el, moduleName ),
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
                            coreLogger.log( "MISSING_MODULE", {
                                file: module.src
                            });
                        }
                    });
                    
                    return deps;
                };
            
            _.each( instance.modules, function ( val, key, list ) {
                var path = nodePath.join( __js__, key + __ext__ );
                
                val.dependencies = {};
                val.dependencies = recurse( val.dependencies, val );
                val.dependencies[ key ] = {
                    src: path,
                    compiler: coreCompiler.transpile( path, key )
                };
                val.schema = {};
                
                // Create the schema actually used by each target file
                for ( var i in val.dependencies ) {
                    if ( /^app/.test( i ) ) {
                        var o = i.replace( /app/g, "" ).replace( /^\/+|\/+$/g, "" ).split( "/" ).shift();
                        
                        if ( o ) {
                            val.schema[ o ] = instance.schema[ o ];
                        }
                    }
                }
                
                modules[ key ] = val;
            });
            
            instance.modules = modules;
        };
        
        /*!
         * 
         * Nautilus.prototype.preCompileModules.
         *
         * Create the temporary data stores to write to/from.
         *
         */
        this.preCompileModules = function () {
            var modules = {};
            
            _.each( instance.modules, function ( module, key, list ) {
                var topKey = key;
                
                _.each( module.dependencies, function ( val, key, list ) {
                    var file = val.compiler.string;
                    
                    val.fileContent = file;
                    
                    // Only make temps for application
                    if ( rApp.test( key ) || key === "app" ) {
                        file = val.compiler[ es6Types[ options.type ] ]();
                        file = coreParser[ options.type ]( key, file );
                        
                        val.fileContent = file;
                        val.tmp = nodePath.join( __tmp__, coreUtils.tempName( key ) + __ext__ );
                    
                    // Third-party can compile from source
                    } else {
                        coreLogger.log( "THIRD_PARTY", {
                            src: nodePath.join( key )
                        });
                    }
                    
                    module.dependencies[ key ] = val;
                });
                
                if ( rController.test( key ) ) {
                    var exec = coreCompiler.closure( "app.exec( \"" + coreUtils.moduleName( key ) + "\" );" ),
                        path = nodePath.join( __tmp__, coreUtils.tempName( key + "/exec" ) + __ext__ );
                    
                    module.dependencies[ key + "/exec" ] = {
                        src: path,
                        fileContent: exec,
                        compiler: null,
                        tmp: path
                    };
                }
                
                modules[ topKey ] = module;
            });
            
            instance.modules = modules;
        };
        
        /*!
         * 
         * Nautilus.prototype.writeModuleTmpFiles.
         *
         * Write all temporary files for build compilations.
         *
         */
        this.writeModuleTmpFiles = function () {
            var modules = {};
            
            _.each( instance.modules, function ( module, key, list ) {
                var moduleName = coreUtils.moduleName( key ),
                    
                    // Create the uniquely compiled app framework file
                    distFirst = _.template( __dep0__, {
                        env: (grunt.option( "env" ) || "development"),
                        schema: JSON.stringify( module.schema, null, 4 ).replace( rQuoted, "" )
                    }),
                    distFile = nodePath.join( __tmp__, ".app-" + moduleName + __ext__ );
                
                grunt.file.write( distFile, distFirst );
                
                module.dist = {
                    src: [distFile],
                    dest: nodePath.join( __dist__, moduleName + __ext__ )
                };
                
                _.each( module.dependencies, function ( val, key, list ) {
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
                
                module.dist.src = mergeBuildIn( module.dist.src, moduleName );
                module.dist.src = _.uniq( module.dist.src );
                
                modules[ key ] = module;
            });
            
            instance.modules = modules;
        };
        
        /*!
         * 
         * Nautilus.prototype.compileModuleDistFiles.
         *
         * Use concat/uglify to compile the dist files.
         *
         */
        this.compileModuleDistFiles = function () {
            var config = {
                options: {
                    banner: "<%= banner %>"
                }
            };
            
            _.each( instance.modules, function ( module, key, list ) {
                config[ key ] = module.dist;
                
            });
            
            coreConfig.concatUglify( config );
        };
        
        /*!
         * 
         * Nautilus.prototype.sailsLinkerTask.
         *
         * Write expanded OR compiled js to template using sails-linker.
         *
         */
        this.sailsLinkerTask = function () {
            if ( !options.jsTemplate ) {
                return;
            }
            
            var sailsLinkerOptions = {
                options: {
                    startTag: "<!--SCRIPTS-->",
                    endTag: "<!--SCRIPTS END-->",
                    fileTmpl: "<script src=\"/%s\"></script>"
                }
            };
            
            if ( grunt.option( "expanded" ) ) {
                _.each( instance.modules, function ( module, key, list ) {
                    var moduleName = coreUtils.moduleName( key ),
                        jsTemplate = options.jsTemplate[ moduleName ],
                        files = [];
                    
                    if ( jsTemplate ) {
                        _.each( module.dependencies, function ( dep, key, list ) {
                            var fileName = key.replace( rDot, "-" );
                            var expandedPath = ( dep.tmp ) ? nodePath.join( __dist__, moduleName, fileName + __ext__ ) : dep.src;
                            var scriptPath = ( dep.tmp ) ? (__dist__ + "/" + moduleName + "/" + fileName + __ext__) : dep.src;
                            
                            grunt.file.write( expandedPath, grunt.file.read( (dep.tmp || dep.src) ) );
                            
                            files.push( scriptPath );
                        });
                        
                        files = mergeBuildIn( files, moduleName );
                        
                        var filesOptions = {};
                            filesOptions[ jsTemplate ] = files;
                        
                        sailsLinkerOptions[ key ] = {
                            files: filesOptions
                        };
                    }
                });
                
            } else {
                _.each( instance.modules, function ( module, key, list ) {
                    var moduleName = coreUtils.moduleName( key ),
                        jsTemplate = options.jsTemplate[ moduleName ];
                    
                    if ( jsTemplate ) {
                        var filesOptions = {};
                            filesOptions[ jsTemplate ] = __dist__ + "/" + moduleName + __ext__;
                        
                        sailsLinkerOptions[ key ] = {
                            files: filesOptions
                        };
                    }
                });
            }
            
            coreConfig.sailsLinker( sailsLinkerOptions );
        };
        
        /*!
         * 
         * Nautilus.prototype.watchTask.
         *
         * Make sure we watch the files nautilus is handling.
         *
         */
        this.watchTask = function () {
            var scriptTasks = mergeTasks( "watch", ["nautilus:build", "clean:nautilus"] ),
                stylesTasks = "compass:" + (grunt.option( "env" ) || "development"),
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
            
            coreConfig.watch( watch );
        };
        
        /*!
         * 
         * Nautilus.prototype.jsHintTask.
         *
         * Make sure we lint the files nautilus is parsing/compiling.
         *
         */
        this.jsHintTask = function () {
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
                jshint.options = jshintrc;
                jshint.options.globals = options.jsGlobals;
            }
            
            if ( _.isArray( options.hintAt ) && options.hintAt.length ) {
                jshint.hintAt = {
                    src: []
                };
                
                _.each( options.hintAt, function ( el, i, list ) {
                    if ( rGlob.test( el ) ) {
                        var files = grunt.file.expand( el );
                        
                        if ( files.length ) {
                            _.each( files, function ( file ) {
                                if ( _.contains( jshint.hintAt.src, file ) ) {
                                    jshint.hintAt.src.push( file );
                                }
                            });
                            
                        } else {
                            coreLogger.log( "MISSING_HINTAT", {
                                el: el
                            });
                        }
                        
                    } else if ( grunt.file.isFile( el ) && _.contains( jshint.hintAt.src, el ) ) {
                        jshint.hintAt.src.push( el );
                        
                    } else {
                        coreLogger.log( "MISSING_HINTAT", {
                            el: el
                        });
                    }
                });
            }
            
            _.each( instance.modules, function ( module, key, list ) {
                var raw = [];
                
                /* @todo: lint raw js files
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
            
            coreConfig.jshint( jshint );
        };
        
        /*!
         * 
         * Nautilus.prototype.cleanTask.
         *
         * Clean up the nautilus dirty work :).
         *
         */
        this.cleanTask = function () {
            coreConfig.clean({
                "nautilus": [__tmp__]
            });
        };
        
        this.cleanUp = function () {
            rimraf.sync( __tmp__ );
            
            if ( !grunt.option( "expanded" ) ) {
                _.each( instance.modules, function ( module, key, list ) {
                    rimraf.sync( nodePath.join( __dist__, coreUtils.moduleName( key ) ) );
                });
            }
        };
        
        /*!
         * 
         * Nautilus.prototype.appTask.
         *
         * Creates a new modules for the application schema.
         *
         */
        this.appTask = function () {
            coreModule.create.apply( coreModule, arguments );
            
            this.cleanUp();
        };
        
        /*!
         * 
         * Nautilus.prototype.whiteSpaceTask.
         *
         * Bulk clean all whitespace in files.
         *
         */
        this.whiteSpaceTask = function () {
            var files = [];
            
            if ( options.whitespace && options.whitespace.files ) {
                _.each( options.whitespace.files, function ( el, i, list ) {
                    files = files.concat( grunt.file.expand( el ) );
                });
                
                _.each( files, function ( el, i, list ) {
                    cleanWhiteSpace( el );
                    
                    coreLogger.log( "WHITESPACE_CLEANED", {
                        file: el
                    });
                });
            }
        };
        
        /*!
         * 
         * Nautilus.prototype.buildTask.
         *
         * Compile javascript and sass.
         * Uses concat and compass :expanded.
         *
         */
        this.buildTask = function () {
            var tasks = mergeTasks( "build", ["concat", "clean:nautilus"] );
            
            // Check for sails-linker
            if ( options.jsTemplate ) {
                tasks.push( "sails-linker" );
            }
            
            // Check for compass
            if ( compass ) {
                tasks.push( "compass:" + (grunt.option( "env" ) || "development") );
            }
            
            grunt.task.run( tasks );
        };
        
        /*!
         * 
         * Nautilus.prototype.deployTask.
         *
         * Compile javascript and sass.
         * Uses uglify and compass :compressed.
         *
         */
        this.deployTask = function () {
            var tasks = mergeTasks( "deploy", ["uglify", "clean:nautilus"] );
            
            // Check for compass
            if ( compass ) {
                tasks.push( "compass:" + (grunt.option( "env" ) || "production") );
            }
            
            grunt.task.run( tasks );
        };
        
        /*!
         * 
         * Listen for ender builds to finish.
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
                var file = ender.options.output + __ext__,
                    srcmap = "//# sourceMappingURL=" + ender.options.srcmap + __ext__ + ".map",
                    script = grunt.file.read( file ).replace( rEnderSrcMap, srcmap );
                
                grunt.file.write( file, script );
            }
        
            __func__();
        });
        
        
        /*!
         * 
         * Listen for watch event.
         * Cleans whitespace lines from files if option is set to true.
         *
         */
        grunt.event.on( "watch", function ( action, filepath ) {
            if ( options.whitespace && options.whitespace.watch ) {
                cleanWhiteSpace( filepath );
            }
        });
        
        
    };
    
    
    return new Nautilus();
    
    
};