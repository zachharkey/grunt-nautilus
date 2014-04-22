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
    
    
    // Underscore 4 life.
    var _ = grunt.util._;
    
    
    // Project configuration.
    grunt.initConfig({
        // Project meta.
        meta: {
            version: "0.1.0"
        },
        
        
        // Project banner.
        banner:
            "/*!\n"+
            " * \n"+
            " * \n"+
            " * Grunt Nautilus - v<%= meta.version %> - <%= grunt.template.today('yyyy-mm-dd') %>\n"+
            " * @author: Brandon Lee Kitajchuk\n"+
            " * @url: http://github.com/kitajchuk/\n"+
            " * Copyright (c) <%= grunt.template.today('yyyy') %>\n"+
            " * Licensed MIT\n"+
            " * \n"+
            " * \n"+
            " */\n"+
            "\n",
            
            
        // Jshint config.
        jshint: {
            plugin: [
                "Gruntfile.js",
                "tasks/**/*.js"
            ]
            
            /*
            options: {
                jshintrc: ".jshintrc"
            }
            */
        },
        
        
        // Clean config.
        clean: {
            plugin: [
                "test/expected/js/**/*",
                "test/expected/css",
                "test/expected/img",
                "test/expected/fonts",
                "test/expected/sass"
            ]
        },
        
        
        // Nodeunit tests.
        nodeunit: {
            plugin: [
                "test/nautilus_test.js"
            ]
        },
        
        
        // Ender config.
        ender: {
            options: {
                srcmap: "/js/lib/ender/ender",
                output: "test/expected/js/lib/ender/ender",
                dependencies: ["more-jeesh"]
            }
        },
        
        
        /** Compass config.
        compass: {
            options: {
                cssDir: "test/expected/css",
                fontsDir: "test/expected/fonts",
                force: true,
                httpPath: "/",
                imagesDir: "test/expected/img",
                javascriptsDir: "test/expected/js",
                noLineComments: true,
                sassDir: "test/expected/sass"
            },
            
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
        },*/
        
        
        /** Merge watch config.
         Watch config.
        "nautilus-watch": {},*/
        
        
        // Nautilus config.
        nautilus: {
            options: {
                jsDistRoot: "test/expected/js/dist",
                jsAppRoot: "test/expected/js/app",
                jsLibRoot: "test/expected/js/lib",
                pubRoot: "test/expected",
                jsRoot: "test/expected/js",
                jsGlobals: {
                    KonamiCode: true
                },
                hintOn: [
                    "watch",
                    "build",
                    "deploy"
                ],
                whitespace: {
                    files: [
                        "test/expected/js/app/**/*.js"
                    ],
                    
                    watch: true
                }
            }
        }
    });
    
    
    // Actually load this plugin's task(s).
    grunt.loadTasks( "tasks" );
    
    
    // These plugins provide necessary tasks.
    grunt.loadNpmTasks( "grunt-contrib-clean" );
    grunt.loadNpmTasks( "grunt-contrib-nodeunit" );
    grunt.loadNpmTasks( "grunt-contrib-jshint" );
    
    
    // Register default task.
    grunt.registerTask( "default", ["nautilus:build"] );
    
    
    // Register the test task.
    grunt.registerTask( "test", "Test each nautilus task", function () {
        //grunt.task.run( "jshint:plugin" );
        
        grunt.log.ok( "Need to build nodeuinit test suite..." );
    });
    

};
