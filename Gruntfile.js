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
				"test/expected/js/app/app.test.js",
				"test/expected/js/app/feature/*.js",
				"test/expected/js/app/util/*.js",
				"test/expected/js/dist/*.js",
				"test/expected/css/*.css"
			]
		},
		
		// Configuration to be run (and then tested).
		nautilus: {
			// Default options for testing.
			options: {
				gruntfile: "",
				jsRoot: "test/expected/js",
				jsAppRoot: "test/expected/js/app",
				jsDistRoot: "test/expected/js/dist",
				jsBanner: "",
				jsLib: undefined,
				compass: true,
				compassConfig: {
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
			deploy: ["test/nautilus_deploy_test.js"]
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
	grunt.registerTask( "test", [
		"clean",
		
		// Test app-js file creations
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
		
		"clean"
	]);
	
	// By default, lint and run all tests.
	grunt.registerTask( "default", ["jshint", "test"] );
	

};
