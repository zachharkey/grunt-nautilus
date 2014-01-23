/*!
 * 
 * grunt-nautilus
 * https://github.com/kitajchuk/grunt-nautilus
 *
 * Copyright (c) 2013 Brandon Kitajchuk
 * Licensed under the MIT license.
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
    var mergeTasks = function ( task, tasks ) {
        // 0.1 jshint on this task
        if ( options.hintOn && _.contains( options.hintOn, task ) ) {
            tasks = ( _.isString( tasks ) ) ? [tasks] : tasks;
            
            tasks.unshift( "jshint" );
            
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
                target = path+"/"+name,
                stats = nodeFs.statSync( target );
                
            if ( stats.isDirectory() ) {
                obj[ name ] = {};
                
                walkDirectory( target, obj[ name ] );
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
        
        // File extenstion for app
        __ext__ = ".js",
        
        // Private tmp dir for compiling
        __tmp__ = nodePath.join( __dist__, ".tmp" ),
        
        // Core {app} framework include
        __dep0__ = grunt.file.read( nodePath.join( coreDirs.app, "app.js" ) ),
        __appt__ = nodePath.join( __tmp__, ".app"+__ext__ ),
        
        // Process function
        __func__ = function () {},
        
        // Regex
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
            watchJs: [__js__+"/**/*.js", "!"+__js__+"/dist/*.js"],
            watchSass: [__sass__+"/**/*.scss"],
            jshint: [__app__+"/**/*.js"]
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
         * Nautilus.prototype.parseArgs.
         *
         * Read [arguments] and handle them.
         *
         */
        this.parseArgs = function ( args ) {
            // 0.1 grunt nautilus [, flags...]
            if ( !args.length ) {
                coreLogger.log( "MISSING_ARGUMENTS" );
                
            // 0.2 grunt nautilus:app:[:, args...] [, flags...]
            } else if ( _.first( args ) === "app" ) {
                this.appTask.apply( this, [].slice.call( args, 1 ) );
                
            // 0.3 grunt nautilus:build [, flags...]
            } else if ( _.first( args ) === "build" ) {
                this.buildTask();
                
            // 0.4 grunt nautilus:deploy [, flags...]
            } else if ( _.first( args ) === "deploy" ) {
                this.deployTask();
                
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
            
            // Load the peerDependency packages from package.json;
            this.loadPlugins();
            
            // Parse the application schema by walking the app directory.
            this.loadSchema();
            
            // Expand the files from {options.main} and create base modules.
            this.loadModules();
            
            // Parse the modules using the es6-module-transpiler node_module.
            this.parseModules();
            
            // Recursively walk up modules parsing imports as dependencies.
            this.recursiveFindModules();
            
            // Build the pre-compiled data for the final write+dist.
            this.preCompileModules();
            
            // Write all build files at once to the .tmp directory.
            this.writeModuleTmpFiles();
            
            // Use concat/uglify to compile distribution files.
            this.compileModuleDistFiles();
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
            
            scripts = _.template( __dep0__, {
                schema: JSON.stringify( schema, null, 4 ).replace( rQuoted, "" )
            });
            
            grunt.file.write( __appt__, scripts );
            
            app.src = __appt__;
            app.compiler = coreCompiler.transpile( __appt__, "app" );
            app.tmp = __appt__;
            app.fileContent = app.compiler[ es6Types[ options.type ] ]();
            
            grunt.file.delete( __appt__, {
                force: true
            });
            
            instance.schema = schema;
            instance.appCore = app;
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
                        
                        // Try looking in pubRoot or jsRoot    
                        } else {
                            _.each( [__js__, __pub__], function ( root, i, list ) {
                                var lookup = nodePath.join( root, el );
                                
                                if ( grunt.file.isFile( lookup+__ext__ ) || grunt.file.isDir( lookup ) ) {
                                    path = lookup;
                                }
                            });
                        }
                        
                        // Matched a file
                        if ( path && grunt.file.isFile( path+__ext__ ) ) {
                            if ( !deps[ el ] ) {
                                var compiler = coreCompiler.transpile( path+__ext__, el );
                                
                                deps[ el ] = {
                                    src: path+__ext__,
                                    compiler: compiler
                                };
                                
                                deps = recurse( deps, deps[ el ] );
                            }
                        
                        // Matched a dir    
                        } else if ( path && grunt.file.isDir( path ) ) {
                            paths = grunt.file.expand( nodePath.join( path, "**/*"+__ext__ ) );
                            
                            _.each( paths, function ( el, i, list ) {
                                var moduleName = coreUtils.moduleName( el ),
                                    nameSpace = coreUtils.nameSpace( el );
                                
                                if ( !deps[ moduleName ] ) {
                                    var compiler = coreCompiler.transpile( el, moduleName );
                                    
                                    deps[ nameSpace ] = {
                                        src: el,
                                        compiler: compiler
                                    };
                                    
                                    deps = recurse( deps, deps[ nameSpace ] );
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
                var path = nodePath.join( __js__, key+__ext__ );
                
                val.dependencies = {};
                val.dependencies.app = instance.appCore;
                val.dependencies = recurse( val.dependencies, val );
                val.dependencies[ key ] = {
                    src: path,
                    compiler: coreCompiler.transpile( path, key )
                };
                
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
                        val.tmp = nodePath.join( __tmp__, coreUtils.tempName( key )+__ext__ );
                    
                    // Third-party can compile from source    
                    } else {
                        coreLogger.log( "THIRD_PARTY", {
                            src: nodePath.join( key )
                        });
                    }
                    
                    module.dependencies[ key ] = val;
                });
                
                if ( rController.test( key ) ) {
                    var exec = coreCompiler.closure( "app.exec( \""+coreUtils.moduleName( key )+"\" );" ),
                        path = nodePath.join( __tmp__, coreUtils.tempName( key+"/exec" )+__ext__ );
                    
                    module.dependencies[ key+"/exec" ] = {
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
                var moduleName = coreUtils.moduleName( key );
                
                module.dist = {
                    src: [],
                    dest: nodePath.join( __dist__, moduleName+__ext__ )
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
                            var expandedPath = ( dep.tmp ) ? nodePath.join( __dist__, moduleName, fileName+__ext__ ) : dep.src;
                            var scriptPath = ( dep.tmp ) ? (__dist__+"/"+moduleName+"/"+fileName+__ext__) : dep.src;
                            
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
                            filesOptions[ jsTemplate ] = __dist__+"/"+moduleName+__ext__;
                        
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
            var scriptTasks = mergeTasks( "watch", ["concat", "clean:nautilus"] ),
                stylesTasks = "compass:"+(grunt.option( "env" ) || "development"),
                watch = {
                    scripts: {
                        files: coreTasks.watchJs,
                        tasks: scriptTasks
                    },
                    
                    compass: {
                        files: coreTasks.watchSass,
                        tasks: stylesTasks
                    },
                    
                    gruntfile: {
                        files: "Gruntfile.js",
                        tasks: "jshint:gruntfile"
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
                jshint.options = _.extend( config.options, jshintrc );
                
            } else {
                jshint.options = jshintrc;
            }
            
            if ( jshint.options.globals ) {
                jshint.options.globals = _.extend( jshint.options.globals, options.jsGlobals );
                
            } else {
                jshint.options = jshintrc;
                jshint.options.globals = options.jsGlobals;
            }
            
            jshint.gruntfile = {
                src: "Gruntfile.js"
            };
            
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
                jshint[ key ] = _.filter( module.dist.src, function ( el ) {
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
         * Nautilus.prototype.buildTask.
         *
         * Compile javascript and sass.
         * Uses concat and compass :expanded.
         *
         */
        this.buildTask = function () {
            var tasks = mergeTasks( "build", ["concat", "clean:nautilus"] );
            
            __func__ = function () {
                grunt.task.run( tasks );
            };
            
            // Check for sails-linker
            if ( options.jsTemplate ) {
                tasks.push( "sails-linker" );
            }
            
            // Check for compass
            if ( compass ) {
                tasks.push( "compass:"+(grunt.option( "env" ) || "development") );
            }
            
            // Check for ender
            if ( ender ) {
                grunt.task.run( "ender" );
                
                __func__ = _.once( __func__ );
                
            } else {
                __func__();
            }
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
            
            __func__ = function () {
                grunt.task.run( tasks );
            };
            
            // Check for compass
            if ( compass ) {
                tasks.push( "compass:"+(grunt.option( "env" ) || "production") );
            }
            
            // Check for ender
            if ( ender ) {
                grunt.task.run( "ender" );
                
                __func__ = _.once( __func__ );
                
            } else {
                __func__();
            }
        };
        
        /*!
         * 
         * Listen for ender builds to finish.
         * Delete ender.min.js because I'm an anal retentive bastard X-D
         *
         */
        grunt.event.on( "grunt_ender_build_done", function () {
            grunt.file.delete( ender.options.output+".min.js", {
                force: true
            });
            
            __func__();
        });
        
        
    };
    
    
    return new Nautilus();
    
    
};