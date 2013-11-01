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
	
	
	var _ = grunt.util._;
	var q = false;
	
	
	/*!
	 * 
	 * Nautilus Class object.
	 *
	 */
	var Nautilus = function () {
		var self = this;
		
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
		 * Core scripts
		 *
		 */
		var coreScripts2Watch = [
			"{jsRoot}/vendor/**/*.js",
			"{jsRoot}/lib/**/*.js",
			"{jsAppRoot}/**/*.js"
		];
		var coreScripts2Compile = {
			vendor: ["{jsRoot}/vendor/**/*.js"],
			lib: ["{jsRoot}/lib/**/*.js"],
			app: ["{jsAppRoot}/util/**/*.js", "{jsAppRoot}/core/**/*.js"],
			dev: ["{jsAppRoot}/app.js"]
		};
		
		/*!
		 *
		 * Branded logging
		 *
		 */
		var nautilog = function ( type, msg ) {
			if ( q ) {
				return;
			}
			
			grunt.log[ type ]( "[Nautilog]: "+msg );
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
		 * Merge user config with nautilus' internal config settings.
		 *
		 */
		var mergeConfig = function ( task, settings ) {
			var config = grunt.config.get( task );
			
			// Not set, so set it
			if ( !config ) {
				grunt.config.set( task, settings );
				
				nautilog( "ok", "Setting config options for "+task+"." );
			
			// Otherwise merge internal with user config	
			} else {
				grunt.config.set( task, extend( config, settings ) );
				
				nautilog( "ok", "Merging config options for "+task+"." );
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
		 * Nautilus.prototype.init
		 *
		 * Tests and builds public dir structure using nautilus' config.
		 *
		 */
		this.init = function ( options ) {
			var compass = options.compass.options,
				appjs = require( "app-js-util" )( grunt, options );
			
			// Test/make app-js framework
			appjs.createFramework();
			
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
			
			return true;
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
			var appjs = require( "app-js-util" )( grunt, options ),
				globalScript = (options.globalScripts || "scripts"),
				scripts2Watch = replaceJsRootMatches( coreScripts2Watch, options ),
				scripts2Compile = {
					start: [],
					end: []
				},
				sass2Watch = options.compass.options.sassDir+"/**/*.scss",
				concatOptions = {
					options: {
						banner: "<%= banner %>"
					}
				},
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
					console: true,
					module: true
				};
			
			// Set the quiet option
			q = options.quiet;
			
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
			
			// Replace matches with real dirs
			coreScripts2Compile.vendor = replaceJsRootMatches( coreScripts2Compile.vendor, options );
			coreScripts2Compile.lib = replaceJsRootMatches( coreScripts2Compile.lib, options );
			coreScripts2Compile.app = replaceJsRootMatches( coreScripts2Compile.app, options );
			coreScripts2Compile.dev = replaceJsRootMatches( coreScripts2Compile.dev, options );
			
			// Merge globalScript buildins
			_.each( options.buildin, function ( buildin, i ) {
				if ( buildin.builds.indexOf( globalScript ) !== -1 ) {
					nautilog( "ok", "Merging files array for buildin '"+i+"'." );
					
					coreScripts2Compile = appjs.mergeScriptBuildin( globalScript, buildin, coreScripts2Compile );
				}
			});
			
			// Finally, get the merged config object for concat + uglify
			scripts2Compile.start = coreScripts2Compile.vendor.concat( coreScripts2Compile.lib ).concat( coreScripts2Compile.app );
			scripts2Compile.end = coreScripts2Compile.dev;
			scripts2Compile = appjs.createCompiled(
				scripts2Compile.start,
				scripts2Compile.end
			);
			concatOptions = extend( concatOptions, scripts2Compile );
			
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
					unused: false,
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
		 * Can be core, controller or util.
		 *
		 */
		this.createModule = function ( level, module ) {
			if ( !module ) {
				grunt.fail.fatal( "you need to specify a module name" );
			}
			
			require( "app-js-util" )( grunt, grunt.config.get( "nautilus" ).options )
				.createModule( level, module );
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