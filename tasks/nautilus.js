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
		levels = [
			"core",
			"feature",
			"util"
		];
	
	
	/*!
	 * 
	 * Load the required plugins.
	 *
	 */
	nautilus.load();

	
	/*!
	 * 
	 * Build the grunt config.
	 *
	 */
	nautilus.config();
	
	
	/*!
	 * 
	 * Scan for existing app-js.
	 *
	 */
	//nautilus.scan();
	
	
	/*!
	 * 
	 * Register the "nautilus" task
	 * @usage: grunt nautilus:build
	 * @usage: grunt nautilus:core:script --app-js
	 *
	 * @task: watch
	 * @task: build
	 * @task: deploy
	 * @task: jshint
	 * @task: uglify
	 * @task: compass
	 *
	 */
	grunt.registerTask( "nautilus", "", function ( task1, task2 ) {
		console.log( arguments );
		
		if ( grunt.option( "app-js" ) ) {
			if ( levels.indexOf( task1 ) !== -1 ) {
				nautilus.createModule( task1, task2 );
			}
			
		} else if ( nautilus.isTask( task1 ) && typeof nautilus[ task1 ] === "function" ) {
			var task = nautilus[ task1 ];
			
			task( task2 );
			
		} else {
			grunt.fail.fatal( "invalid arguments and options" );
		}
	});
	
	
};
