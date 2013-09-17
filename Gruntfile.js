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
			tests: ["tmp"]
		},
		
		// Configuration to be run (and then tested).
		nautilus: {
			// User definable options.
			default_options: {
				options: {
					jsRoot: "./js",
					jsBanner: "./js/banner.txt",
					jsLib: undefined,
					compass: true,
					compassConfig: {
						development: {
							options: {
								cssDir: "./css",
								fontsDir: "./fonts",
								httpPath: "/",
								imagesDir: "./img",
								javascriptsDir: "./js",
								outputStyle: "expanded",
								sassDir: "./sass"
							}
						},
						
						production: {
							options: {
								cssDir: "./css",
								fontsDir: "./fonts",
								httpPath: "/",
								imagesDir: "./img",
								javascriptsDir: "./js",
								noLineComments: true,
								outputStyle: "compressed",
								sassDir: "./sass"
							}
						}
					}
				},
				
				files: {
					"tmp/default_options": [
						"test/fixtures/testing",
						"test/fixtures/123"
					]
				}
			}
			
			/*
			custom_options: {
				options: {
					
				},
				
				files: {
					"tmp/custom_options": [
						"test/fixtures/testing",
						"test/fixtures/123"
					]
				}
			}
			*/
		},
		
		// Unit tests.
		nodeunit: {
			tests: ["test/*_test.js"],
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
	grunt.registerTask( "test", ["clean", "nautilus", "nodeunit"] );
	
	// By default, lint and run all tests.
	grunt.registerTask( "default", ["jshint", "test"] );
	

};
