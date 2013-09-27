/* global module:false */

module.exports = function ( grunt ) {
	
	
	// Default paths, change them as needed.
	var pubRoot = ".",
		jsRoot = "./js",
		jsBanner = grunt.file.read( "./js/banner" ),
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
		
		
		// Nautilus config.
		nautilus: {
			options: {
				gruntfile: "Gruntfile.js",
				jsRoot: jsRoot,
				jsAppRoot: appRoot,
				jsDistRoot: distRoot,
				jsBanner: jsBanner,
				jsLib: "ender",
				
				
				// Ender config.
				ender: {
					options: {
						output: vendorRoot+"/ender",
						dependencies: ["jeesh"]
					}
				},
				
				
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