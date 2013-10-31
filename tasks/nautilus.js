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


"use strict";


module.exports = function ( grunt ) {
	
	
	var nautilus = require( "./lib/nautilus" )( grunt ),
		tasks = [
			{
				name: "default",
				args: 0
			},
			
			{
				name: "appjs",
				args: 2
			},
			
			{
				name: "build",
				args: 0
			},
			
			{
				name: "deploy",
				args: 0
			},
			
			{
				name: "watch",
				args: 0
			},
			
			{
				name: "jshint",
				args: 0
			},
			
			{
				name: "uglify",
				args: 0
			},
			
			{
				name: "concat",
				args: 0
			},
			
			{
				name: "compass",
				args: 1
			},
			
			{
				name: "ender",
				args: 0
			}
		],
		levels = [
			"core",
			"controller",
			"util"
		];
	
	
	/*!
	 * 
	 * Register shorthand tasks to be passed off to "nautilus"
	 *
	 * @task: appjs
	 * @task: build
	 * @task: deploy
	 * @task: watch
	 * @task: jshint
	 * @task: uglify
	 * @task: concat
	 * @task: compass
	 * @task: ender
	 *
	 */
	for ( var i = 0, len = tasks.length; i < len; i++ ) {
		(function ( task ) {
			grunt.registerTask( task.name, function () {
				var command = [ "nautilus", task.name ].concat( [].slice.call( arguments, 0, task.args ) ).join( ":" );
				
				grunt.task.run( command );
			});
		})( tasks[ i ] );
	}
	
	
	/*!
	 * 
	 * Register the "nautilus" task
	 * @usage: grunt nautilus:build
	 * @usage: grunt nautilus:compass:[development, production]
	 * @usage: grunt nautilus:appjs:[core, util, controller]:[module]
	 *
	 */
	grunt.registerTask( "nautilus", "A grunt plugin for modular app-js development", function ( arg1, arg2, arg3 ) {
		var options = this.options();
		
		/*!
		 *
		 * Test init public
		 *
		 */
		if ( !grunt.file.exists( options.jsRoot+"/app/app.js" ) ) {
			nautilus.init( options );
			
			grunt.log.writeln( "" );
			grunt.log.writeln( "Grunt Nautilus has been initialized. We just created a bunch of files so you don't have to! Check it out and happy grunting!" );
			grunt.log.writeln( "" );
			grunt.log.writeln( "- Brandon Lee Kitajchuk" );
			
		} else {
			/*!
			 * 
			 * Load the required plugins.
			 *
			 */
			nautilus.load( options );
		
			
			/*!
			 * 
			 * Build the grunt config.
			 *
			 */
			nautilus.config( options );
			
			
			/*!
			 * 
			 * Parse the arguments.
			 *
			 */
			if ( arg1 === "appjs" ) {
				if ( levels.indexOf( arg2 ) !== -1 ) {
					nautilus.createModule( arg2, arg3 );
				}
				
			} else if ( nautilus.isTask( arg1 ) && typeof nautilus[ arg1 ] === "function" ) {
				nautilus[ arg1 ].apply( nautilus, [arg2, arg3] );
				
			} else {
				grunt.fail.warn( "invalid arguments and options." );
			}
		}
	});
	
	
};
