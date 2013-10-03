/*!
 *
 * grunt-nautilus
 * https://github.com/brandonkitajchuk/grunt-nautilus
 *
 * Copyright (c) 2013 Brandon Kitajchuk
 * Licensed under the MIT license.
 *
 *
 */


"use strict";


module.exports = function ( grunt ) {
	
	// All tests.
	var allTests = [
		// Copy current framework files
		// Ensures we always use recent versions
		//"refresh",
		
		// Test appjs file creations
		"nautilus:appjs:core:test",
		"nautilus:appjs:util:test",
		"nautilus:appjs:feature:test",
		"nodeunit:appjs",
		
		// Test compass compilations
		"nautilus:compass:development",
		"nautilus:compass:production",
		"nodeunit:compass",
		
		// Test concat
		"nautilus:concat",
		"nodeunit:concat",
		
		// Test uglify
		"nautilus:uglify",
		"nodeunit:uglify",
		
		// Test build
		"nautilus:build",
		"nodeunit:build",
		
		// Test deploy
		"nautilus:deploy",
		"nodeunit:deploy",
		
		// Test ender
		"nautilus:ender",
		"nodeunit:ender"
	];
		
	
	// Project configuration.
	grunt.initConfig({
		jshint: {
			all: [
				"Gruntfile.js",
				"tasks/*.js",
				"<%= nodeunit.tests %>"
			],
			
			options: {
				jshintrc: ".jshintrc"
			}
		},
		
		// Before generating any new files, remove any previously-created files.
		clean: {
			tests: [
				"tmp",
				"test/expected/js/app/core/*.js",
				"test/expected/js/app/feature/*.js",
				"test/expected/js/app/util/*.js",
				"test/expected/js/dist/*.js",
				"test/expected/js/vendor/*.js",
				"test/expected/css/*.css"
			]
		},
		
		// Configuration to be run (and then tested).
		nautilus: {
			// Default options for testing.
			options: {
				gruntfile: "Gruntfile.js",
				jsRoot: "test/expected/js",
				jsAppRoot: "test/expected/js/app",
				jsDistRoot: "test/expected/js/dist",
				jsBanner: "",
				jsLib: undefined,
				
				ender: {
					options: {
						output: "test/expected/js/vendor/ender",
						dependencies: ["jeesh"]
					}
				},
				
				compass: {
					options: {
						cssDir: "test/expected/css",
						fontsDir: "test/expected/fonts",
						force: true,
						httpPath: "/",
						imagesDir: "test/expected/img",
						javascriptsDir: "test/expected/js",
						noLineComments: true,
					},
					
					development: {
						options: {
							environment: "development",
							outputStyle: "expanded",
							sassDir: "test/fixtures/sass/dev"
						}
					},
					
					production: {
						options: {
							environment: "production",
							outputStyle: "compressed",
							sassDir: "test/fixtures/sass/prod"
						}
					}
				}
			}
		},
		
		// Unit tests.
		nodeunit: {
			appjs: ["test/nautilus_appjs_test.js"],
			compass: ["test/nautilus_compass_test.js"],
			concat: ["test/nautilus_concat_test.js"],
			uglify: ["test/nautilus_uglify_test.js"],
			build: ["test/nautilus_build_test.js"],
			default: ["test/nautilus_build_test.js"],
			deploy: ["test/nautilus_deploy_test.js"],
			ender: ["test/nautilus_ender_test.js"]
		}
	});
	
	
	// Actually load this plugin's task(s).
	grunt.loadTasks( "tasks" );
	
	
	// These plugins provide necessary tasks.
	grunt.loadNpmTasks( "grunt-contrib-clean" );
	grunt.loadNpmTasks( "grunt-contrib-nodeunit" );
	grunt.loadNpmTasks( "grunt-contrib-jshint" );
	
	
	// Whenever the "test" task is run, first clean the "tmp" dir, then run this
	// plugin's task(s), then test the result.
	// Not using a grunt multi-task so running individual tests after each plugin task
	grunt.registerTask( "test", "Test each nautilus task.", function ( test ) {
		var jsTasks = [
			"default",
			"appjs",
			"concat",
			"uglify",
			"build",
			"deploy"
		];
		
		// Clean before...
		grunt.task.run( "clean" );
		
		// No arguments, run all tests
		if ( !test ) {
			grunt.task.run( allTests );
			
		} else {
			// Handle app-js related tests
			// All js tasks will need appjs executed first
			if ( jsTasks.indexOf( test ) !== -1 ) {
				grunt.task.run([
					"nautilus:appjs:core:test",
					"nautilus:appjs:util:test",
					"nautilus:appjs:feature:test"
				]);
			}
			
			// Handle the compass test
			if ( test === "compass" ) {
				grunt.task.run([
					"nautilus:compass:development",
					"nautilus:compass:production"
				]);
			}
			
			// Handle other tests
			// or finish up app-js related tests
			// excluding appjs itself
			if ( test !== "appjs" ) {
				try {
					grunt.task.run( "nautilus:"+test );
					
				} catch ( error ) {
					var throwError = new Error( "Nautilus test failed." );
					
					if ( error.msg ) {
						throwError.message += ", "+error.msg+".";
					}
					
					throwError.origError = error;
					
					grunt.log.warn( "running test "+test+" failed." );
					
					grunt.fail.warn( throwError );
				}
			}
			
			// Run the unit test
			grunt.task.run( "nodeunit:"+test );
		}
		
		// ... and clean after.
		grunt.task.run( "clean" );
	});
	
	
	// Copy app-js files to be utilized for testing
	grunt.registerTask( "refresh", function () {
		grunt.file.copy(
			"app-js/framework/app.js",
			"test/expected/js/app/app.js"
		);
		
		grunt.file.copy(
			"app-js/framework/app.site.js",
			"test/expected/js/app/app.site.js"
		);
		
		grunt.file.copy(
			"app-js/framework/app.util.log.js",
			"test/expected/js/app/util/app.util.log.js"
		);
		
		var tpl = grunt.file.read( "test/expected/js/app/app.site.js" );
		var cts = grunt.template.process( tpl, {
			data: {
				arguments: ["window", "window.app"].join( ", " ),
				parameters: ["window", "app", "undefined"].join( ", " )
			}
		});
		
		grunt.file.write( "test/expected/js/app/app.site.js", cts );
	});
	
	
	// By default, lint and run all tests.
	grunt.registerTask( "default", ["jshint", "test"] );
	

};
