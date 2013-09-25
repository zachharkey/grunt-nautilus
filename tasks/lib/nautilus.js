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
module.exports = function ( grunt ) {
	
	
	"use strict";
	
	
	/*!
	 * 
	 * Load grunt-contrib-uglify.
	 *
	 */
	var path = require( "path" ),
		enderTasks = path.join( __dirname, "../../.grunt/grunt-ender/tasks" ),
		uglify = require( "../../node_modules/grunt-contrib-uglify/tasks/lib/uglify.js" ).init( grunt ),
		uglifyOptions = {
			banner: "",
			footer: "",
			compress: {
				warnings: false
			},
			mangle: {},
			beautify: false,
			report: false
		};
	
	
	/*!
	 * 
	 * Nautilus Class object.
	 *
	 */
	var Nautilus = function () {
		var self = this;
		
		/*!
		 * 
		 * Store old concat/uglify config.
		 *
		 */
		var uglyConcat;
		
		/*!
		 * 
		 * Keep track of appJs.
		 *
		 */
		var rFeatureAppJs = /feature\/app\.(.*)\.js/;
		var rAppJsDeps = /\@deps\:\s(.*)(\r|\n)/;
		
		/*!
		 * 
		 * Publicly honored tasks.
		 *
		 */
		var tasks = [
			"default",
			"watch",
			"build",
			"deploy",
			"jshint",
			"uglify",
			"concat",
			"compass",
			"ender"
		];
		
		/*!
		 * 
		 * Supported js libs.
		 *
		 */
		var jsLibs = {
			jquery: {
				context: "jQuery",
				shorthand: "$"
			},
			
			ender: {
				context: "ender",
				shorthand: "$"
			},
			
			yui: {
				context: "YUI",
				shorthand: "Y"
			}
		};
		
		/*!
		 * 
		 * Basic method extends o2 into o1.
		 * Use force to override matching keys.
		 *
		 */
		var extend = function ( o1, o2, force ) {
			var ret = {};
			
			for ( var prop in o1 ) {
				ret[ prop ] = o1[ prop ];
			}
			
			for ( var prop in o2 ) {
				if ( ret[ prop ] && !force ) {
					continue;
					
				} else {
					ret[ prop ] = o2[ prop ];
				}
			}
			
			return ret;
		};
		
		/*!
		 * 
		 * Create app-js modules.
		 *
		 */
		var createModule = function ( level, module ) {
			var appJsDir = require( "path" ).join( __dirname, "../../app-js" ),
				config = grunt.config.get( "nautilus" ).options,
				file = ( level === "core" )
							? config.jsRoot+"/app/app."+module+".js"
							: ( level === "feature" )
								? config.jsRoot+"/app/feature/app."+module+".js"
								: config.jsRoot+"/app/util/app."+module+".js",
				fileExists = grunt.file.exists( file ),
				fileData = {
					data: {
						module: module,
						arguments: ["window", "window.app"],
						parameters: ["window", "app", "undefined"]
					}
				},
				template = ( level === "util" ) ? appJsDir+"/app-util.js" : appJsDir+"/app-core-feature.js",
				contents;
			
			if ( fileExists && !grunt.option( "force" ) ) {
				grunt.fatal( "app-js file already exists at "+file+". Use --force to override." );	
			}
			
			if ( config.jsLib && jsLibs[ config.jsLib ] ) {
				fileData.data.arguments.unshift( jsLibs[ config.jsLib ].context );
				fileData.data.parameters.unshift( jsLibs[ config.jsLib ].shorthand );
			}
			
			fileData.data.arguments = fileData.data.arguments.join( ", " );
			fileData.data.parameters = fileData.data.parameters.join( ", " );
			
			template = grunt.file.read( template );
			contents = grunt.template.process( template, fileData );
			
			grunt.file.write( file, contents );
			
			grunt.log.ok( "app-js file created at "+file+"." );
		};
		
		/*!
		 * 
		 * Find a dependency file.
		 *
		 */
		var findDependency = function ( dep, file ) {
			var config = grunt.config.get( "nautilus" ).options,
				ret;
			
			if ( grunt.file.exists( config.jsRoot+"/app/"+dep+".js" ) ) {
				ret = config.jsRoot+"/app/"+dep+".js";
				
			} else if ( grunt.file.exists( config.jsRoot+"/app/util/"+dep+".js" ) ) {
				ret = config.jsRoot+"/app/util/"+dep+".js";
				
			} else if ( grunt.file.exists( config.jsRoot+"/app/feature/"+dep+".js" ) ) {
				ret = config.jsRoot+"/app/feature/"+dep+".js";
				
			} else {
				grunt.fail.fatal( "could not file dependency file "+dep+" for file "+file.filename );
			}
			
			return ret;
		};
		
		/*!
		 * 
		 * Recursively get all dependency files for a feature script.
		 *
		 */
		var recursiveGetDeps = function ( deps, file ) {
			deps = deps || [];
			
			var js = grunt.file.read( file.abspath ),
				ds = js.match( rAppJsDeps ),
				ms = [];
			
			if ( ds ) {
				ds = ds[ 1 ].replace( /\s/g, "" ).split( "," );
				
				for ( var i = 0, len = ds.length; i < len; i++ ) {
					if ( deps.indexOf( ds[ i ] ) === -1 ) {
						var fIndex = deps.indexOf( file.filename.replace( /\.js/, "" ) ),
							fInDeps = (fIndex !== -1);
						
						if ( fInDeps ) {
							if ( fIndex === 0 ) {
								deps.unshift( ds[ i ] );
								
							} else {
								deps.splice( fIndex, 0, ds[ i ] );
							}
							
						} else {
							deps.push( ds[ i ] );
						}
						
						ms.push( ds[ i ] );
					}
				}
			}
			
			if ( ms.length ) {
				for ( var i = 0, len = ms.length; i < len; i++ ) {
					deps = recursiveGetDeps( deps, {
						abspath: findDependency( ms[ i ], file ),
						filename: ms[ i ]
					});
				}
			}
			
			return deps;
		};
		
		/*!
		 * 
		 * Build the "config" object for all feature scripts.
		 *
		 */
		var getFeatureJsConfig = function ( env ) {
			var config = grunt.config.get( "nautilus" ).options,
				task = ( env === "development" )
						? "concat"
						: "uglify",
				merge = {},
				files = [];
			
			grunt.file.recurse( config.jsRoot+"/app/feature", function ( abspath, rootdir, subdir, filename ) {
				var match = abspath.match( rFeatureAppJs );
				
				if ( match ) {
					match = match[ 1 ];
					
					files.push({
						feature: match,
						abspath: abspath,
						filename: filename
					});
				}
			});
			
			for ( var i = files.length; i--; ) {
				merge[ files[ i ].feature ] = {
					src: [config.jsRoot+"/vendor/**/*.js", config.jsRoot+"/lib/**/*.js"].concat(
						recursiveGetDeps( [], files[ i ] ).map(function ( elem, j ) {
							return findDependency( elem, files[ j ] );
							
						}).concat( [files[ i ].abspath] )
					),
					dest: config.jsDistRoot+"/"+files[ i ].feature+".js"
				};
			}
			
			return merge;
		};
		
		/*!
		 * 
		 * Compile feature scripts using concat or uglify.
		 *
		 */
		var combineFeatureJs = function ( env ) {
			var config = grunt.config.get( "nautilus" ).options,
				features = getFeatureJsConfig( env ),
				task = ( env === "development" ) ? "concat" : "uglify",
				jsBanner = config.jsBanner,
				lineBreak = "\n\n\n\n";
			
			grunt.log.writeln( "" );
			grunt.log.ok( "Building feature scripts..." );
			
			for ( var f in features ) {
				var dest = features[ f ].dest,
					src = features[ f ].src,
					concat = [],
					result;
				
				for ( var i = 0, iLen = src.length; i < iLen; i++ ) {
					if ( !grunt.file.exists( src[ i ] ) ) {
						var files = grunt.file.expand( src[ i ] );
						
						for ( var j = 0, jLen = files.length; j < jLen; j++ ) {
							if ( grunt.file.exists( files[ j ] ) ) {
								concat.push( files[ j ] );
							}
						}
						
					} else {
						concat.push( src[ i ] );
					}
				}
				
				if ( env === "production" ) {
					try {
						result = uglify.minify( concat, dest, uglifyOptions );
						
					} catch ( error ) {
						var throwError = new Error( "Uglification failed." );
						
						if ( error.msg ) {
							throwError.message += ", "+error.msg+".";
						}
						
						throwError.origError = error;
						
						grunt.log.warn( "Uglifying source '"+src+"' failed." );
						
						grunt.fail.warn( throwError );
					}
					
					result = jsBanner+(jsBanner ? lineBreak : "")+result.min;
					
				} else {
					result = jsBanner+(jsBanner ? lineBreak : "")+concat.map(function ( elem ) {
						return grunt.file.read( elem );
						
					}).join( lineBreak );
				}
					
				grunt.file.write( dest, result );
					
				grunt.log.writeln( "File "+dest+" created using "+task+"." );
			}
			
			grunt.log.ok( "Feature scripts built." );
		};
		
		/*!
		 * 
		 * Nautilus.prototype.isTask
		 *
		 * Only allow specific tasks publicly.
		 *
		 */
		this.isTask = function ( task ) {
			return tasks.indexOf( task ) !== -1;
		};
		
		/*!
		 * 
		 * Nautilus.prototype.load
		 *
		 * Loads necessary contrib plugins.
		 *
		 */
		this.load = function ( options ) {
			grunt.loadNpmTasks( "grunt-contrib-watch" );
			grunt.loadNpmTasks( "grunt-contrib-concat" );
			grunt.loadNpmTasks( "grunt-contrib-uglify" );
			grunt.loadNpmTasks( "grunt-contrib-jshint" );
			grunt.loadNpmTasks( "grunt-contrib-compass" );
			
			if ( options.ender ) {
				grunt.loadTasks( enderTasks );
			}
		};
		
		/*!
		 * 
		 * Nautilus.prototype.config
		 *
		 * Builds the full config object using options
		 * passed to the "nautilus" {Object} as a result of
		 * using the grunt-init-gruntnautilus template.
		 *
		 */
		this.config = function ( options ) {
			var js2Watch = [
					options.jsRoot+"/vendor/**/*.js",
					options.jsRoot+"/lib/**/*.js",
					options.jsAppRoot+"/**/*.js"
				],
				sass2Watch = options.compass.options.sassDir+"/**/*.scss",
				compassOptions = {
					development: {
						options: extend(
							options.compass.options,
							options.compass.development.options
						)
					},
					
					production: {
						options: extend(
							options.compass.options,
							options.compass.production.options
						)
					}
				},
				jshintGlobals = {
					app: true,
					console: true
				};
			
			uglyConcat = {
				options: {
					banner: "<%= banner %>"
				},
				
				scripts: {
					src: js2Watch,
					dest: options.jsDistRoot+"/scripts.js"
				}
			};
			
			if ( options.jsLib === "jquery" ) {
				jshintGlobals.$ = true;
				jshintGlobals.jQuery = true;
				
			} else if ( options.jsLib === "ender" ) {
				jshintGlobals.$ = true;
				jshintGlobals.ender = true;
				jshintGlobals.Ender = true;
			}
			
			grunt.config.set( "concat", uglyConcat );
			grunt.config.set( "uglify", uglyConcat );
			grunt.config.set( "jshint", {
				options: {
					curly: true,
					eqeqeq: true,
					immed: true,
					latedef: true,
					newcap: true,
					noarg: true,
					sub: true,
					undef: true,
					unused: true,
					boss: true,
					eqnull: true,
					browser: true,
					globals: jshintGlobals
				},
				
				gruntfile: {
					src: options.gruntfile
				},
				
				scripts: {
					src: js2Watch
				}
			});
			grunt.config.set( "watch", {
				gruntfile: {
					files: options.gruntfile,
					tasks: "nautilus:jshint:gruntfile"
				},
				
				scripts: {
					files: js2Watch,
					tasks: "nautilus:concat"
				},
				
				styles: {
					files: sass2Watch,
					tasks: "nautilus:compass:development"
				}
			});
			grunt.config.set( "banner", options.jsBanner );
			grunt.config.set( "compass", compassOptions );
			
			if ( options.ender ) {
				grunt.config.set( "ender", options.ender );
			}
		};
		
		/*!
		 * 
		 * Nautilus.prototype.createModule
		 *
		 * Creates a new app.*.js file.
		 * Can be core, feature or util.
		 *
		 */
		this.createModule = function ( level, module ) {
			if ( !module ) {
				grunt.fail.fatal( "you need to specify a module name" );
			}
			
			createModule( level, module );
		};
		
		/*!
		 * 
		 * Nautilus.prototype.default
		 *
		 * Wrapper for simple "build".
		 *
		 */
		this.default = function () {
			this.build();
		};
		
		/*!
		 * 
		 * Nautilus.prototype.watch
		 *
		 * Wrapper for "watch".
		 *
		 */
		this.watch = function () {
			grunt.task.run( "watch" );
		};
		
		/*!
		 * 
		 * Nautilus.prototype.ender
		 *
		 * Handles Ender's building.
		 *
		 */
		this.ender = function () {
			grunt.task.run( "ender" );
		};
		
		/*!
		 * 
		 * Nautilus.prototype.compass
		 *
		 * Handles Compass' compiling.
		 *
		 */
		this.compass = function ( arg ) {
			if ( arg === "development" ) {
				grunt.task.run( "compass:development" );
				
			} else if ( arg === "production" ) {
				grunt.task.run( "compass:production" );
				
			} else {
				grunt.fail.fatal( "compass compiling only supports 'development' and 'production' environments." );
			}
		};
		
		/*!
		 * 
		 * Nautilus.prototype.jshint
		 *
		 * Wrapper for "jshint".
		 *
		 */
		this.jshint = function ( arg ) {
			if ( arg === "gruntfile" ) {
				grunt.task.run( "jshint:gruntfile" );
				
			} else {
				grunt.task.run( "jshint:scripts" );
			}
		};
		
		/*!
		 * 
		 * Nautilus.prototype.concat
		 *
		 * Wrapper for "concat".
		 *
		 */
		this.concat = function () {
			combineFeatureJs( "development" );
			
			// build ender if applicable...
			grunt.task.run( "concat" );
		};
		
		/*!
		 * 
		 * Nautilus.prototype.build
		 *
		 * Compile scripts/sass for development.
		 *
		 */
		this.build = function () {
			combineFeatureJs( "development" );
			
			// build ender if applicable...
			grunt.task.run([
				"concat",
				"compass:development"
			]);
		};
		
		/*!
		 * 
		 * Nautilus.prototype.deploy
		 *
		 * Compile scripts/sass for production.
		 *
		 */
		this.deploy = function () {
			combineFeatureJs( "production" );
			
			// build ender if applicable...
			grunt.task.run([
				"uglify",
				"compass:production"
			]);
		};
		
		/*!
		 * 
		 * Nautilus.prototype.uglify
		 *
		 * Wrapper for "uglify".
		 *
		 */
		this.uglify = function () {
			combineFeatureJs( "production" );
			
			// build ender if applicable...
			grunt.task.run( "uglify" );
		};
		
		/*!
		 * 
		 * Watch for feature files to update
		 * Build out feature js files with dependencies.
		 *
		 */
		grunt.event.on( "watch", function ( action, filepath ) {
			var match = filepath.match( rFeatureAppJs );
			
			if ( match ) {
				match = match[ 1 ];
				
				combineFeatureJs( "development" );
			}
		});
		
		/*!
		 * 
		 * Listen for ender builds to finish
		 * Delete .min file as ender.js will compile into grunt build
		 *
		 */
		grunt.event.on( "grunt_ender_build_done", function () {
			var options = grunt.config.get( "nautilus" ).options;
			
			grunt.file.delete( options.ender.options.output+".min.js", {
				force: true
			});
		});
	};
	
	
	return new Nautilus();
	
	
};