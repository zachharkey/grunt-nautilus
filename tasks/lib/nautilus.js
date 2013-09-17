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
	
	
	var Nautilus = function () {
		var self = this;
		
		/*!
		 * 
		 * Keep track of appJs
		 *
		 */
		var rAppJs = /app\.(.*)\.js/;
		var rDeps = /\@deps\:\s(.*)(\r|\n)/;
		
		/*!
		 * 
		 * Publicly honored tasks
		 *
		 */
		var tasks = [
			"watch",
			"build",
			"deploy",
			"jshint",
			"uglify",
			"concat",
			"compass"
		];
		
		/*!
		 * 
		 * Supported js libs
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
		 * Default concat
		 *
		 */
		
		/*!
		 * 
		 * Internal method to create app-js modules
		 *
		 */
		var createModule = function ( level, module ) {
			var appJsDir = require( "path" ).join( __dirname, "../../app-js" ),
				config = grunt.config.get( "nautilus" ),
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
			grunt.loadNpmTasks( "grunt-contrib-qunit" );
			grunt.loadNpmTasks( "grunt-contrib-uglify" );
			grunt.loadNpmTasks( "grunt-contrib-jshint" );
			grunt.loadNpmTasks( "grunt-contrib-compass" );
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
			var config = grunt.config.get( "nautilus" ),
				js2Watch = [
					config.jsRoot+"/vendor/**/*.js",
					config.jsRoot+"/lib/**/*.js",
					config.jsRoot+"/app/**/*.js"
				],
				sass2Watch = config.compassConfig.development.options.sassDir+"/**/*.scss";
			
			grunt.config.set( "concat", {
				options: {
					banner: "<%= banner %>",
					stripBanners: true
				},
				
				scripts: {
					src: js2Watch,
					
					dest: config.jsDistRoot+"/scripts.js"
				}
			});
			grunt.config.set( "uglify", {
				options: {
					banner: "<%= banner %>"
				},
				
				scripts: {
					src: js2Watch,
					
					dest: config.jsDistRoot+"/scripts.js"
				}
			});
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
					globals: {
						$: true,
						app: true,
						jQuery: true,
						console: true
					}
				},
				
				gruntfile: {
					src: config.gruntfile
				},
				
				scripts: {
					src: js2Watch
				}
			});
			grunt.config.set( "watch", {
				gruntfile: {
					files: config.gruntfile,
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
			grunt.config.set( "banner", config.jsBanner );
			grunt.config.set( "compass", config.compassConfig );
		};
		
		/*!
		 * 
		 * Nautilus.prototype.scan
		 *
		 * Scan app-js and start the feature dependency building.
		 *
		 */
		this.scan = function () {
			
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
		 * Nautilus.prototype.compass
		 *
		 * Handles Compass' compiling.
		 *
		 */
		this.compass = function ( arg ) {
			if ( arg === "development" ) {
				grunt.task.run( "compass:development" );
				
			} else if ( grunt.option( "production" ) ) {
				grunt.task.run( "compass:production" );
				
			} else {
				grunt.fail.fatal( "compass compiling only supports 'development' and 'production' environments." );
			}
		};
		
		/*!
		 * 
		 * Nautilus.prototype.build
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
		 * Nautilus.prototype.watch
		 *
		 * Wrapper for "concat".
		 *
		 */
		this.concat = function () {
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
			grunt.task.run([
				"concat",
				"compass:development"
			]);
		};
		
		/*!
		 * 
		 * Nautilus.prototype.build
		 *
		 * Compile scripts/sass for production.
		 *
		 */
		this.deploy = function () {
			grunt.task.run([
				"uglify",
				"compass:production"
			]);
		};
		
		/*!
		 * 
		 * Nautilus.prototype.build
		 *
		 * Wrapper for "uglify".
		 *
		 */
		this.uglify = function () {
			grunt.task.run( "uglify" );
		};
		
		/*!
		 * 
		 * Handle event listeners
		 *
		 */
		grunt.event.on( "watch", function ( action, filepath ) {
			
		});
	};
	
	
	return new Nautilus();
	
	
};