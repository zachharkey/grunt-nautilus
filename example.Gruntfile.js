/* global module:false */

module.exports = function ( grunt ) {
	
	
	// Default paths, change them as needed.
	var pubRoot = ".",
		jsRoot = "./js",
		appRoot = jsRoot+"/app",
		libRoot = jsRoot+"/lib",
		vendorRoot = jsRoot+"/vendor",
		distRoot = jsRoot+"/dist",
		sassRoot = "./sass",
		cssRoot = "./css",
		fontsRoot = "./fonts",
		imgRoot = "./img";
		
	
	grunt.initConfig({
		// Project meta.
		meta: {
			version: "0.1.0"
		},
		
		
		// Project banner.
		banner: "
			/*!\n
			 * \n
			 * \n
			 * PROJECT NAME - v<%= meta.version %> - <%= grunt.template.today('yyyy-mm-dd') %>\n
			 * @author: AUTHOR NAME\n
			 * @url: AUTHOR WEBSITE/\n
			 * Copyright (c) <%= grunt.template.today('yyyy') %>\n
			 * Licensed MIT\n
			 * \n
			 * \n
			 */\n
			 \n
		",
		
		
		// Nautilus config.
		nautilus: {
			options: {
				gruntfile: "Gruntfile.js",
				jsRoot: jsRoot,
				jsAppRoot: appRoot,
				jsDistRoot: distRoot,
				jsLib: undefined,
				
				
				
				// Both dev and prod options will be merged with options
				// and passed to grunt-contrib-compass correctly.
				compass: {
					// Shared options.
					options: {
						cssDir: cssRoot,
						fontsDir: fontsRoot,
						force: true,
						httpPath: "/",
						imagesDir: imgRoot,
						javascriptsDir: jsRoot,
						noLineComments: true,
						sassDir: sassRoot
					},
					
					// Environment specific options.
					development: {
						options: {
							environment: "development",
							outputStyle: "expanded"
						}
					},
					
					production: {
						options: {
							environment: "production",
							outputStyle: "compressed"
						}
					}
				}
			}
		}
	});
	
	
	// Load the nautilus plugin.
	grunt.loadNpmTasks( "grunt-nautilus" );
	
	
};