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
	 * Register the "nautilus" task
	 * @usage: grunt nautilus:build
	 * @usage: grunt nautilus:compass:[development, production]
	 * @usage: grunt nautilus:appjs:[core, util, feature]:[module]
	 *
	 * @task: appjs
	 * @task: build
	 * @task: deploy
	 * @task: watch
	 * @task: jshint
	 * @task: uglify
	 * @task: concat
	 * @task: compass
	 *
	 */
	grunt.registerTask( "nautilus", "A grunt plugin for modular app-js development", function ( arg1, arg2, arg3 ) {
		var options = this.options();
		
		
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
			var task = nautilus[ arg1 ];
			
			task( arg2, arg3 );
			
		} else {
			grunt.fail.warn( "invalid arguments and options. grunt-nautilus has no default task." );
		}
	});
	
	
};
