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
	 * Some globals.
	 *
	 */
	var _options = grunt.config.get( "nautilus" ).options,
		_appJsUtil = require( "app-js-util" )( grunt, _options ),
		_each = grunt.util._.each,
		_isString = grunt.util._.isString;
	
	
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
			"build",
			"deploy",
			"app"
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
		var coreScripts2Hint = [
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
			if ( _options.quiet ) {
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
		var replaceJsRootMatches = function ( files ) {
			return files.map(function ( elem ) {
				return elem.replace( /\{jsRoot\}/, _options.jsRoot ).replace( /\{jsAppRoot\}/, _options.jsAppRoot );
			});
		};
		
		/*!
		 * 
		 * Merge user defined tasks to run alongside other tasks.
		 *
		 */
		var mergeTasks = function ( task, tasks ) {
			// Should this task use jshint?
			if ( _options.hinton && _options.hinton.indexOf( task ) !== -1 ) {
				tasks = ( _isString( tasks ) )
						? [tasks]
						: tasks;
				
				tasks.unshift( "jshint" );
				
				//nautilog( "ok", "Matched hinton for task "+task );
			}
			
			return tasks;
		};
		
		/*!
		 * 
		 * Nautilus.prototype.init
		 *
		 * Tests and builds public dir structure using nautilus' config.
		 *
		 */
		this.init = function () {
			var compass = _options.compass.options;
			
			// Test/make app-js framework
			_appJsUtil.createFramework();
			
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
		this.load = function () {
			grunt.loadNpmTasks( "grunt-contrib-watch" );
			grunt.loadNpmTasks( "grunt-contrib-concat" );
			grunt.loadNpmTasks( "grunt-contrib-uglify" );
			grunt.loadNpmTasks( "grunt-contrib-jshint" );
			grunt.loadNpmTasks( "grunt-contrib-compass" );
			
			if ( _options.ender ) {
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
		this.config = function () {
			var globalScript = (_options.globalScripts || "scripts"),
				scripts2Watch = replaceJsRootMatches( coreScripts2Watch ),
				scripts2Hint = replaceJsRootMatches( coreScripts2Hint ),
				scripts2Compile = {
					start: [],
					end: []
				},
				sass2Watch = _options.compass.options.sassDir+"/**/*.scss",
				concatOptions = {
					options: {
						banner: "<%= banner %>"
					}
				},
				compassOptions = {
					development: {
						options: extend(
							_options.compass.options,
							_options.compass.development.options
						)
					},
					
					production: {
						options: extend(
							_options.compass.options,
							_options.compass.production.options
						)
					}
				},
				jshintGlobals = {
					app: true,
					console: true,
					module: true
				};
			
			// Merge user jshint globals
			jshintGlobals = extend( jshintGlobals, _options.jshintGlobals );
			
			//nautilog( "ok", "Merging config options for jshint globals." );
			
			if ( _options.jsLib === "jquery" ) {
				jshintGlobals.$ = true;
				jshintGlobals.jQuery = true;
				
			} else if ( _options.jsLib === "ender" ) {
				jshintGlobals.$ = true;
				jshintGlobals.ender = true;
				jshintGlobals.Ender = true;
			}
			
			// Configurable via nautilus config
			grunt.config.set( "compass", compassOptions );
			
			if ( _options.ender ) {
				grunt.config.set( "ender", _options.ender );
			}
			
			// Replace matches with real dirs
			coreScripts2Compile.vendor = replaceJsRootMatches( coreScripts2Compile.vendor );
			coreScripts2Compile.lib = replaceJsRootMatches( coreScripts2Compile.lib );
			coreScripts2Compile.app = replaceJsRootMatches( coreScripts2Compile.app );
			coreScripts2Compile.dev = replaceJsRootMatches( coreScripts2Compile.dev );
			
			// Merge globalScript buildins
			_each( _options.buildin, function ( buildin, buildinName ) {
				if ( buildin.builds.indexOf( globalScript ) !== -1 ) {
					coreScripts2Compile = _appJsUtil.mergeScriptBuildin( globalScript, buildinName, coreScripts2Compile );
				}
			});
			
			// Finally, get the merged config object for concat + uglify
			scripts2Compile.start = coreScripts2Compile.vendor.concat( coreScripts2Compile.lib ).concat( coreScripts2Compile.app );
			scripts2Compile.end = coreScripts2Compile.dev;
			scripts2Compile = _appJsUtil.createCompiled(
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
					src: _options.gruntfile
				},
				
				scripts: {
					src: scripts2Hint
				}
			});
			mergeConfig( "watch", {
				gruntfile: {
					files: _options.gruntfile,
					tasks: "jshint:gruntfile"
				},
				
				scripts: {
					files: scripts2Watch,
					tasks: mergeTasks( "watch", "concat" )
				},
				
				styles: {
					files: sass2Watch,
					tasks: "compass:development"
				}
			});
		};
		
		/*!
		 * 
		 * Nautilus.prototype.app
		 *
		 * Creates a new modules for the app.
		 * Can be core, controller or util.
		 *
		 */
		this.app = function ( level, module ) {
			if ( !module ) {
				grunt.fail.fatal( "you need to specify a module name" );
			}
			
			_appJsUtil.createModule( level, module );
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
		 * Nautilus.prototype.build
		 *
		 * Compile scripts/sass for development.
		 *
		 */
		this.build = function () {
			var tasks = mergeTasks( "build", [
				"concat",
				"compass:development"
			]);
			
			// build ender if applicable...?
			grunt.task.run( tasks );
		};
		
		/*!
		 * 
		 * Nautilus.prototype.deploy
		 *
		 * Compile scripts/sass for production.
		 *
		 */
		this.deploy = function () {
			var tasks = mergeTasks( "deploy", [
				"uglify",
				"compass:production"
			]);
			
			// build ender if applicable...?
			grunt.task.run( tasks );
		};
		
		/*!
		 * 
		 * Listen for ender builds to finish
		 * Delete .min file as ender.js will compile into overall build
		 *
		 */
		grunt.event.on( "grunt_ender_build_done", function () {
			grunt.file.delete( _options.ender.options.output+".min.js", {
				force: true
			});
		});
		
		
	};
	
	
	return new Nautilus();
	
	
};