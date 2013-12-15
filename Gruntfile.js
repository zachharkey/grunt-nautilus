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
            ],
            
            options: {
                jshintrc: ".jshintrc"
            }
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
        
        
        // Ender config.
        /*
        ender: {
            options: {
                output: "test/expected/js/lib/ender/ender",
                dependencies: ["jeesh"]
            }
        },
        */
        
        
        // Compass config.
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
        },
        
        
        // Nautilus config.
        nautilus: {
            options: {
                buildIn: {
                    priorityZero: {
                        files: ["test/expected/bower_components/momentjs/moment.js"],
                        priority: 1,
                        builds: ["app"]
                    },
                    
                    priorityOne: {
                        files: ["test/expected/bower_components/mustache/mustache.js"],
                        priority: 0,
                        builds: ["app"]
                    }
                },
                hintAt: [],
                hintOn: [
                    //"watch",
                    //"build",
                    //"deploy"
                ],
                jsAppRoot: "test/expected/js/app",
                jsDistRoot: "test/expected/js/dist",
                // These get merged into jshint globals
                jsGlobals: {
                    angular: true,
                    jQuery: true,
                    $: true
                },
                jsLibRoot: "test/expected/js/lib",
                jsRoot: "test/expected/js",
                jsTemplate: {
                    application: "test/expected/html/index.html"
                },
                main: [
                    "docs/application.js"
                ],
                pubRoot: "test/expected"
            }
        },
        
        
        // Nodeunit tests.
        nodeunit: {
            plugin: [
                "test/nautilus_test.js"
            ]
        }
    });
    
    
    // Actually load this plugin's task(s).
    grunt.loadTasks( "tasks" );
    
    
    // These plugins provide necessary tasks.
    grunt.loadNpmTasks( "grunt-contrib-clean" );
    grunt.loadNpmTasks( "grunt-contrib-nodeunit" );
    grunt.loadNpmTasks( "grunt-contrib-jshint" );
    
    
    // Register the test task.
    grunt.registerTask( "test", "Test each nautilus task", function () {
        grunt.task.run( "jshint:nautilus" );
        
        grunt.log.ok( "Need to build nodeuinit test suite..." );
    });
    
    
    // Register default task.
    grunt.registerTask( "default", ["nautilus:build"] );
    

};
