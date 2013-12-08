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
// TODO:
// enforce 1 export statement per module rule

// DONE:
// Build entire app namespace layout as javascript
// allow any namespaces to exist
// add main option for {app} entry points
// allow importing entire namespace directory
// transpile with module name
// build solid config of existing {app} layout
// ship with app/(core|util|controllers) as base layout
//      - lets call this the "starting point"
// enforce import location
//      - as in "app/path/to/module" and "lib/path/to/module"
//      - have the ability to import from lib
// organize app/yourshit and lib/theirshit
// have the ability to import from anywhere in jsRoot
// ensure {app} builds correctly in browser
//      - this means re-writing imports before calling .toGlobals()
//      - AND this means storing module.dependencies differently
//      - dependencies need to be compiler instances as well
module.exports = function ( grunt ) {
    
    
    "use strict";
    
    
    /*!
     * 
     * @globals
     *
     */
    var _ = grunt.util._,
        
        // Load libs
        _fs = require( "fs" ),
        _path = require( "path" ),
        _defaults = require( "./options" ),
        _jsLibs = require( "./libs" ),
        _dirs = require( "./dirs" ),
        _plugins = require( "./plugins" ),
        _utils = require( "./utils" )( grunt ),
        _logger = require( "./logger" )( grunt ),
        _compiler = require( "./compiler" )( grunt ),
        _module = require( "./module" )( grunt ),
        _config = require( "./config" )( grunt ),
        _parser = require( "./parser" )( grunt ),
        
        // Merge options
        _options = _.extend( _defaults, grunt.config.get( "nautilus" ).options ),
        
        // Compile types
        _types = {
            globals: "toGlobals"
        },
        
        // Write/read dirs
        __dist__ = _options.jsDistRoot,
        __app__ = _options.jsAppRoot,
        __lib__ = _options.jsLibRoot,
        __js__ = _options.jsRoot,
        
        // File extenstion for app
        __ext__ = ".js",
        
        // Private tmp dir for compiling
        __tmp__ = _path.join( __dist__, ".tmp" ),
        
        // Core {app} framework include
        __dep0__ = grunt.file.read( _path.join( _dirs.app, "app.js" ) ),
        __appt__ = _path.join( __tmp__, ".app"+__ext__ ),
        
        // Process function
        __func__ = function () {},
        
        // Match lib|app
        _rLib = /^lib\//,
        _rApp = /^app\//,
        
        // Match .js in filenames
        _rDotJs = /\.js$/,
        
        // Controllers
        _rController = /controller/,
        
        // Core globs for app dev
        _coresTasks = {
            watch: [__js__+"/**/*.js", "!"+__js__+"/dist/*.js"],
            jshint: [__app__+"/**/*.js"]
        },
        
        // Singleton
        _instance;
    
    
    /*!
     *
     * @functions
     *
     */
    var mergeTasks = function ( task, tasks ) {
        // 0.1 jshint on this task
        if ( _options.hintOn && _options.hintOn.indexOf( task ) !== -1 ) {
            tasks = ( _.isString( tasks ) )
                    ? [tasks]
                    : tasks;
            
            tasks.unshift( "jshint" );
            
            _logger.log( "MATCHED_HINTON", {
                task: task
            });
        }
        
        return tasks;
    };
    
    var walkDirectory = function ( path, obj ) {
        var dir = _fs.readdirSync( path );
        
        for ( var i = 0; i < dir.length; i++ ) {
            var name = dir[ i ],
                target = path+"/"+name,
                stats = _fs.statSync( target );
            
            if ( stats.isFile() ) {
                //if ( name.slice( -3 ) === __ext__ ) {
                //    obj[ name.slice( 0, -3 ) ] = {};
                //}
                
            } else if ( stats.isDirectory() ) {
                obj[ name ] = {};
                
                walkDirectory( target, obj[ name ] );
            }
        }
    };
    
    
    /*!
     * 
     * @Nautilus {Class}
     *
     */
    var Nautilus = function () {
        _instance = this;
        
        
        this.typeCheck = function () {
            if ( !_types[ _options.type ] ) {
                _logger.log( "UNSUPPORTED_TYPE", {
                    type: _options.type
                });
            }
        };
        
        /*!
         * 
         * Nautilus.prototype.load.
         *
         * Loads necessary contrib plugins.
         *
         */
        this.load = function () {
           _.each( _plugins, function ( plugin ) {
                grunt.loadNpmTasks( plugin );
                
                _logger.log( "LOAD_PLUGIN", {
                    plugin: plugin
                });
            });
            
            if ( _options.ender ) {
                grunt.loadNpmTasks( "grunt-ender" );
            }
        };
        
        /*!
         * 
         * Nautilus.prototype.layout.
         *
         * Create the application {Object} tree.
         *
         */
        this.layout = function () {
            var layout = {},
                scripts,
                app;
            
            walkDirectory( __app__, layout );
            
            scripts = _.template( __dep0__, {
                layout: JSON.stringify( layout, null, 4 ).replace( /"|'/g, "" )
            });
            
            grunt.file.write( __appt__, scripts );
            
            app = {
                src: __appt__,
                compiler: _compiler.transpile( __appt__, "app" )
            };
            
            grunt.file.write( __appt__, app.compiler[ _types[ _options.type ] ]() );
            
            _instance.objectTree = layout;
            _instance.coreDependency = app;
        };
        
        /*!
         * 
         * Nautilus.prototype.scan.
         *
         * Scan the application layout.
         *
         */
        this.scan = function () {
            var namespace,
                modules = {},
                match,
                main;
            
            if ( _.isArray( _options.main ) ) {
                main = _options.main.map(function ( el ) {
                    return _path.join( __app__, _utils.front2Back( el ) );
                });
                
            } else {
                main = _path.join( __app__, _utils.front2Back( _options.main ) );
            }
            
            match = grunt.file.expand( main );
            
            _.each( match, function ( val ) {
                var module;
                
                modules[ _utils.nameSpace( val ) ] = {
                    src: val
                };
            });
            
            _instance.modules = modules;
        };
        
        /*!
         * 
         * Nautilus.prototype.parse.
         *
         * Parse the es6 module syntax.
         *
         */
        this.parse = function () {
            var modules = {};
            
            _.each( _instance.modules, function ( val, key, list ) {
                val.compiler = _compiler.transpile( val.src, key );
                
                modules[ key ] = val;
            });
            
            _instance.modules = modules;
        };
        
        /*!
         * 
         * Nautilus.prototype.recurse.
         *
         * Recursively find module dependencies.
         *
         */
        this.recurse = function () {
            var modules = {},
                recurse
                recurse = function ( deps, module ) {
                    deps = deps || [];
                    
                    var imports = [];
                    
                    _.each( module.compiler.imports, function ( el, i, list ) {
                        imports.push( el.source.value );
                    });
                    
                    imports = _.uniq( imports );
                    
                    _.each( imports, function ( el, i, list ) {
                        var path,
                            paths;
                        
                        // Matched lib import    
                        if ( _rLib.test( el ) ) {
                            path = _path.join( __lib__, el.replace( _rLib, "" ) )
                        
                        // Matched app import    
                        } else if ( _rApp.test( el ) ) {
                            path = _path.join( __app__, el.replace( _rApp, "" ) );
                            
                        } else {
                            path = _path.join( __js__, el );
                            
                            if ( !grunt.file.exists( path+__ext__ ) ) {
                                _logger.log( "MISSING_IMPORT", {
                                    file: path
                                });
                            }
                        }
                        
                        // Matched a file
                        if ( grunt.file.isFile( path+__ext__ ) ) {
                            if ( !deps[ el ] ) {
                                var compiler = _compiler.transpile( path+__ext__, el );
                                
                                deps[ el ] = {
                                    src: path+__ext__,
                                    compiler: compiler
                                };
                                
                                deps = recurse( deps, deps[ el ] );
                            }
                        
                        // Matched a dir    
                        } else if ( grunt.file.isDir( path ) ) {
                            paths = grunt.file.expand( _path.join( path, "**/*"+__ext__ ) );
                            
                            _.each( paths, function ( el, i, list ) {
                                var moduleName = _utils.moduleName( el ),
                                    nameSpace = _utils.nameSpace( el );
                                
                                if ( !deps[ moduleName ] ) {
                                    var compiler = _compiler.transpile( el, moduleName );
                                    
                                    deps[ nameSpace ] = {
                                        src: el,
                                        compiler: compiler
                                    };
                                    
                                    deps = recurse( deps, deps[ nameSpace ] );
                                }
                            });
                            
                        } else {
                            _logger.log( "MISSING_MODULE", {
                                file: module.src
                            });
                        }
                    });
                    
                    return deps;
                };
            
            _.each( _instance.modules, function ( val, key, list ) {
                var path = _path.join( __js__, key+__ext__ );
                
                val.dependencies = recurse( {}, val );
                
                val.dependencies[ key ] = {
                    src: path,
                    compiler: _compiler.transpile( path, key )
                };
                
                modules[ key ] = val;
            });
            
            _instance.modules = modules;
        };
        
        /*!
         * 
         * Nautilus.prototype.compile.
         *
         * Compile to .tmp and set concat+uglify config.
         *
         */
        this.compile = function () {
            var modules = {};
            
            _.each( _instance.modules, function ( module, key, list ) {
                module.temporary = {
                    src: [_instance.coreDependency.src],
                    dest: _path.join( __dist__, _utils.moduleName( key )+__ext__ )
                };
                
                _.each( module.dependencies, function ( val, key, list ) {
                    var temp = _path.join( __tmp__, _utils.tempName( key )+__ext__ ),
                        file = val.compiler.string;
                    
                    if ( /^app\//.test( key ) ) {
                        file = val.compiler[ _types[ _options.type ] ]();
                        file = _parser[ _options.type ]( key, file );
                        
                    } else {
                        _logger.log( "THIRD_PARTY", {
                            src: _path.join( __js__, key )
                        });
                    }
                    
                    module.temporary.src.push( temp );
                    
                    grunt.file.write( temp, file );
                });
                
                if ( _rController.test( key ) ) {
                    var exec = _compiler.closure( "app.exec( \""+_utils.moduleName( key )+"\" );" ),
                        path = _path.join( __tmp__, _utils.tempName( key+"/exec" )+__ext__ );
                    
                    grunt.file.write( path, exec );
                    
                    module.temporary.src.push( path );
                }
                
                modules[ key ] = module;
            });
            
            _instance.modules = modules;
        };
        
        /*!
         * 
         * Nautilus.prototype.config.
         *
         * Build the grunt.initConfig
         *
         */
        this.config = function () {
            // 0.1 Config watch options
            _config.watch(
                _coresTasks.watch,
                mergeTasks( "watch", [
                    "concat",
                    "clean:temp"
                ])
            );
            
            // 0.2 Config jshint options
            _config.jshint( _coresTasks.jshint, _instance.modules );
            
            // 0.3 Config concat options
            _config.concat( _instance.modules );
            
            // 0.4 Config uglify options
            _config.uglify( _instance.modules );
            
            // 0.5 Config compass options
            if ( _options.compass ) {
                _config.compass();
            }
            
            // 0.6 Config ender options
            if ( _options.ender ) {
                _config.ender();
            }
            
            // 0.7 Config clean options
            _config.clean({
                temp: [__tmp__]
            });
        };
        
        /*!
         * 
         * Nautilus.prototype.dev.
         *
         * Log {Object}s for debugging.
         *
         */
        this.dev = function ( arg ) {
            if ( arg === "options" ) {
                _logger.console( _options );
                
            } else if ( arg === "modules" ) {
                _logger.console( _instance.modules );
                
            } else if ( arg === "config" ) {
                _logger.console( grunt.config.get() );
                
            } else if ( arg === "layout" ) {
                _logger.console( _instance.objectTree );
            }
            
            process.exit( 0 );
        };
        
        /*!
         * 
         * Nautilus.prototype.app.
         *
         * Creates a new modules for the app.
         * Can be core, controller or util.
         *
         */
        this.app = function () {
            _module.create.apply( _module, arguments );
            
            process.exit( 0 );
        };
        
        /*!
         * 
         * Nautilus.prototype.default.
         *
         * Wrapper for build task.
         *
         */
        this.default = function () {
            this.build();
        };
        
        /*!
         * 
         * Nautilus.prototype.build.
         *
         * Compile javascript and sass.
         * Uses concat and compass :expanded.
         *
         */
        this.build = function () {
            var tasks = mergeTasks( "build", [
                "concat",
                "compass:development",
                "clean:temp"
            ]);
            
            __func__ = function () {
                grunt.task.run( tasks );
            };
            
            if ( _options.ender ) {
                grunt.task.run( "ender" );
                
                __func__ = _.once( __func__ );
                
            } else {
                __func__();
            }
        };
        
        /*!
         * 
         * Nautilus.prototype.deploy.
         *
         * Compile javascript and sass.
         * Uses uglify and compass :compressed.
         *
         */
        this.deploy = function () {
            var tasks = mergeTasks( "deploy", [
                "uglify",
                "compass:production",
                "clean:temp"
            ]);
            
            __func__ = function () {
                grunt.task.run( tasks );
            };
            
            if ( _options.ender ) {
                grunt.task.run( "ender" );
                
                __func__ = _.once( __func__ );
                
            } else {
                __func__();
            }
        };
        
        /*!
         * 
         * Listen for ender builds to finish.
         * Delete ender.min.js to account for builds.
         *
         */
        grunt.event.on( "grunt_ender_build_done", function () {
            grunt.file.delete( _options.ender.options.output+".min.js", {
                force: true
            });
            
            __func__();
        });
        
        
    };
    
    
    return new Nautilus();
    
    
};