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
	 * The app-js-util Class.
	 *
	 */
	var appjs;
	
	
	/*!
	 * 
	 * Load grunt-contrib-uglify.
	 *
	 */
	var uglify = require( "../../node_modules/grunt-contrib-uglify/tasks/lib/uglify.js" ).init( grunt ),
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
		 * Regular expressions.
		 *
		 */
		var rFeatureAppJs = /feature\/app\.(.*)\.js/;
		var rAppJsDeps = /\@deps\:\s(.*)(\r|\n)/;
		var rDashHypeAlpha = /[-|_]([a-z]|[0-9])/ig;
		
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
			}
		};
		var args = ["window", "window.app"];
		var params = ["window", "app", "undefined"];
		
		/*!
		 *
		 * Core scripts
		 *
		 */
		var coreScripts2Watch = [
			"{jsRoot}/vendor/**/*.js",
			"{jsRoot}/lib/**/*.js",
			"{jsAppRoot}/**/*.js"
		];
		var coreScripts2Compile = {
			// Beginning of src array
			start: [
				"{jsRoot}/vendor/**/*.js",
				"{jsRoot}/lib/**/*.js",
				"{jsAppRoot}/app.js",
				"{jsAppRoot}/util/**/*.js",
				"{jsAppRoot}/core/**/*.js"
			],
			
			// End of src array
			end: ["{jsAppRoot}/app.site.js"]
		};
		
		/*!
		 *
		 * Branded logging
		 *
		 */
		var nautilog = function ( type, msg ) {
			grunt.log[ type ]( "[Nautilog]: "+msg );
		};
		
		/*!
		 *
		 * Camel case a hyphenated or underscored string
		 *
		 */
		var camelCase = function ( str ) {
			return str.replace( rDashHypeAlpha, function ( all, letter ) {
				return ( ""+letter ).toUpperCase();
			});
		};
		
		/*!
		 * 
		 * Basic method extends o2 into o1.
		 * Use force to override matching keys.
		 *
		 */
		var extend = function ( o1, o2, force ) {
			var ret = {},
				prop;
			
			for ( prop in o1 ) {
				ret[ prop ] = o1[ prop ];
			}
			
			for ( prop in o2 ) {
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
		var createScriptModule = function ( level, module ) {
			var module = camelCase( module ),
				templateDir = require( "path" ).join( __dirname, "../../app-js/template" ),
				config = grunt.config.get( "nautilus" ).options,
				file = ( level === "core" )
							? config.jsRoot+"/app/core/app.core."+module+".js"
							: ( level === "feature" )
								? config.jsRoot+"/app/feature/app."+module+".js"
								: config.jsRoot+"/app/util/app.util."+module+".js",
				fileExists = grunt.file.exists( file ),
				fileData = {
					data: {
						module: module,
						arguments: args,
						parameters: params
					}
				},
				template = ( level === "core" )
							? templateDir+"/app-core.js"
							: ( level === "feature" )
								? templateDir+"/app-feature.js"
								: templateDir+"/app-util.js",
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
			
			nautilog( "ok", "app-js file created at "+file+"." );
		};
		
		/*!
		 *
		 * Merge user config with nautilus' internal config settings.
		 *
		 */
		var mergeConfig = function ( task, settings ) {
			var config = grunt.config.get( task );
			
			// Not set, so set it
			if ( !config ) {
				grunt.config.set( task, settings );
				
				nautilog( "writeln", "Setting config options for "+task+"." );
			
			// Otherwise merge internal with user config	
			} else {
				grunt.config.set( task, extend( config, settings ) );
				
				nautilog( "writeln", "Merging config options for "+task+"." );
			}
		};
		
		/*!
		 * 
		 * Replace custom template tags with values from nautilus settings.
		 *
		 */
		var replaceJsRootMatches = function ( files, options ) {
			return files.map(function ( elem ) {
				return elem.replace( /\{jsRoot\}/, options.jsRoot ).replace( /\{jsAppRoot\}/, options.jsAppRoot );
			});
		};
		
		/*!
		 * 
		 * Build the "config" object for all scripts to compile.
		 *
		 */
		var buildScripts2Compile = function ( options ) {
			var deps = appjs.getScriptDependencyArray( options.jsAppRoot+"/app.site.js" ),
				ret = appjs.getFeatureScriptsConfig(),
				start = replaceJsRootMatches( coreScripts2Compile.start, options ),
				end = replaceJsRootMatches( coreScripts2Compile.end, options ),
				files = [];
			
			for ( var i = 0, len = deps.length; i < len; i++ ) {
				if ( /app\.(?!(util|core))/.test( deps[ i ] ) ) {
					files.push( appjs.findScriptDependency( deps[ i ] ) );
				}
			}
			
			return extend( ret, {
				scripts: {
					src: start.concat( files ).concat( end ),
					dest: options.jsDistRoot+"/scripts.js"
				}
			});
		};
		
		/*!
		 * 
		 * Nautilus.prototype.log
		 *
		 * Expose branded logging.
		 *
		 */
		this.log = nautilog;
		
		/*!
		 * 
		 * Nautilus.prototype.init
		 *
		 * Tests and builds public dir structure using nautilus' config.
		 *
		 */
		this.init = function ( options ) {
			var frameworkDir = require( "path" ).join( __dirname, "../../app-js/framework" ),
				compass = options.compass.options,
				template,
				contents;
			
			// Account for jsLib if not undefined
			if ( options.jsLib !== undefined && jsLibs[ jsLib ] ) {
				jsLib = jsLibs[ jsLib ];
				
				args.unshift( jsLib.context );
				params.unshift( jsLib.shorthand );
			}
			
			// Test/make css_root
			if ( !grunt.file.exists( compass.cssDir ) ) {
				grunt.file.mkdir( compass.cssDir );
			}
			
			// Test/make img_root
			if ( !grunt.file.exists( compass.imagesDir ) ) {
				grunt.file.mkdir( compass.imagesDir );
			}
			
			// Test/make fonts_root
			if ( !grunt.file.exists( compass.fontsDir ) ) {
				grunt.file.mkdir( compass.fontsDir );
			}
			
			// Test/make sass_root
			if ( !grunt.file.exists( compass.sassDir ) ) {
				grunt.file.mkdir( compass.sassDir );
			}
				
				if ( !grunt.file.exists( compass.sassDir+"/screen.scss" ) ) {
					grunt.file.write( compass.sassDir+"/screen.scss", "/* -- start styling -- */" );
				}
			
			// Test/make js_root
			if ( !grunt.file.exists( options.jsRoot ) ) {
				grunt.file.mkdir( options.jsRoot );
			}
			
			// Test/make app-js structure
			if ( !grunt.file.exists( options.jsRoot+"/app" ) ) {
				grunt.file.mkdir( options.jsRoot+"/app" );
				grunt.file.write( options.jsRoot+"/app/.gitkeep" );
			}
				
				if ( !grunt.file.exists( options.jsRoot+"/app/app.js" ) ) {
					grunt.file.copy( frameworkDir+"/app.js", options.jsRoot+"/app/app.js" );
				}
				
				if ( !grunt.file.exists( options.jsRoot+"/app/app.site.js" ) ) {
					grunt.file.copy( frameworkDir+"/app.site.js", options.jsRoot+"/app/app.site.js" );
				}
			
			if ( !grunt.file.exists( options.jsRoot+"/app/util" ) ) {
				grunt.file.mkdir( options.jsRoot+"/app/util" );
				grunt.file.write( options.jsRoot+"/app/util/.gitkeep" );
			}
				
				if ( !grunt.file.exists( options.jsRoot+"/app/util/app.util.log.js" ) ) {
					grunt.file.copy( frameworkDir+"/app.util.log.js", options.jsRoot+"/app/util/app.util.log.js" );
				}
				
			if ( !grunt.file.exists( options.jsRoot+"/app/core" ) ) {
				grunt.file.mkdir( options.jsRoot+"/app/core" );
				grunt.file.write( options.jsRoot+"/app/core/.gitkeep" );
			}
			
			if ( !grunt.file.exists( options.jsRoot+"/app/feature" ) ) {
				grunt.file.mkdir( options.jsRoot+"/app/feature" );
				grunt.file.write( options.jsRoot+"/app/feature/.gitkeep" );
			}	
			
			if ( !grunt.file.exists( options.jsRoot+"/lib" ) ) {
				grunt.file.mkdir( options.jsRoot+"/lib" );
				grunt.file.write( options.jsRoot+"/lib/.gitkeep" );
			}
			
			if ( !grunt.file.exists( options.jsRoot+"/vendor" ) ) {
				grunt.file.mkdir( options.jsRoot+"/vendor" );
				grunt.file.write( options.jsRoot+"/vendor/.gitkeep" );
			}
			
			// Replace template tags in app-js files
			template = grunt.file.read( options.jsRoot+"/app/app.site.js" );
			contents = grunt.template.process( template, {
				data: {
					arguments: args.join( ", " ),
					parameters: params.join( ", " )
				}
			});
			
			grunt.file.write( options.jsRoot+"/app/app.site.js", contents );
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
			appjs = require( "app-js-util" )( grunt, options );
			
			grunt.loadNpmTasks( "grunt-contrib-watch" );
			grunt.loadNpmTasks( "grunt-contrib-concat" );
			grunt.loadNpmTasks( "grunt-contrib-uglify" );
			grunt.loadNpmTasks( "grunt-contrib-jshint" );
			grunt.loadNpmTasks( "grunt-contrib-compass" );
			
			if ( options.ender ) {
				grunt.loadNpmTasks( "grunt-ender" );
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
			var scripts2Watch = replaceJsRootMatches( coreScripts2Watch, options ),
				scripts2Compile = buildScripts2Compile( options ),
				sass2Watch = options.compass.options.sassDir+"/**/*.scss",
				concatOptions = extend(
					{
						options: {
							banner: "<%= banner %>"
						}
					},
					
					scripts2Compile
				),
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
			
			if ( options.jsLib === "jquery" ) {
				jshintGlobals.$ = true;
				jshintGlobals.jQuery = true;
				
			} else if ( options.jsLib === "ender" ) {
				jshintGlobals.$ = true;
				jshintGlobals.ender = true;
				jshintGlobals.Ender = true;
			}
			
			// Configurable via nautilus config
			grunt.config.set( "compass", compassOptions );
			
			if ( options.ender ) {
				grunt.config.set( "ender", options.ender );
			}
			
			// Merge with possible user config
			mergeConfig( "concat", concatOptions );
			mergeConfig( "uglify", concatOptions );
			mergeConfig( "jshint", {
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
					src: scripts2Watch
				}
			});
			mergeConfig( "watch", {
				gruntfile: {
					files: options.gruntfile,
					tasks: "nautilus:jshint:gruntfile"
				},
				
				scripts: {
					files: scripts2Watch,
					tasks: "nautilus:concat"
				},
				
				styles: {
					files: sass2Watch,
					tasks: "nautilus:compass:development"
				}
			});
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
			
			createScriptModule( level, module );
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
			// build ender if applicable...?
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
			// build ender if applicable...?
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
			// build ender if applicable...?
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
			// build ender if applicable...?
			grunt.task.run( "uglify" );
		};
		
		/*!
		 * 
		 * Listen for ender builds to finish
		 * Delete .min file as ender.js will compile into overall build
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