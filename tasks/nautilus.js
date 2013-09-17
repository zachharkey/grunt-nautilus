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
	 * @usage: grunt nautilus:compass:[development, production]
	 * @usage: grunt nautilus:appjs:[core, util, feature]:namespace
	 *
	 * @task: watch
	 * @task: build
	 * @task: deploy
	 * @task: jshint
	 * @task: uglify
	 * @task: compass
	 * @task: appjs
	 *
	 */
	grunt.registerTask( "nautilus", "", function ( arg1, arg2, arg3 ) {
		if ( arg1 === "appjs" ) {
			if ( levels.indexOf( arg1 ) !== -1 ) {
				nautilus.createModule( arg2, arg3 );
			}
			
		} else if ( nautilus.isTask( arg1 ) && typeof nautilus[ arg1 ] === "function" ) {
			var task = nautilus[ arg1 ];
			
			task( arg2 );
			
		} else {
			grunt.fail.fatal( "invalid arguments and options" );
		}
	});
	
	
};
