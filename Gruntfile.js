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
            nautilus_plugin: [
                "Gruntfile.js",
                "tasks/**/*.js"
            ],
            
            options: {
                jshintrc: ".jshintrc"
            }
        },
        
        
        // Clean config.
        clean: {
            nautilus_plugin: [
                "test/expected/js/**/*",
                "test/expected/css",
                "test/expected/img",
                "test/expected/fonts",
                "test/expected/sass"
            ]
        },
        
        
        // Ender config.
        ender: {
            options: {
                output: "test/expected/js/lib/ender/ender",
                dependencies: ["jeesh"]
            }
        },
        
        
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
        },
        
        
        // Nautilus config.
        nautilus: {
            options: {
                buildIn: {
                    priorityZero: {
                        files: ["test/expected/bower_components/momentjs/moment.js"],
                        // Before main build
                        priority: 0,
                        builds: ["nautilus"]
                    },
                    
                    priorityOne: {
                        files: ["test/expected/bower_components/mustache/mustache.js"],
                        // After main build
                        priority: 1,
                        builds: ["fractal"]
                    }
                },
                expanded: false,
                hintAt: [],
                hintOn: [
                    "watch",
                    "build",
                    "deploy"
                ],
                jsAppRoot: "test/expected/js/app",
                jsDistRoot: "test/expected/js/dist",
                // These get merged into jshint globals
                jsGlobals: {},
                jsLibRoot: "test/expected/js/lib",
                jsRoot: "test/expected/js",
                main: [
                    "app.js",
                    "controllers/**/*.js"
                ],
                pubRoot: "test/expected",
                quiet: true
            }
        },
        
        
        // Unit tests.
        nodeunit: {
            nautilus: [
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
    
    
    // Test all of grunt-nautilus' tasks in a deployment manner.
    var tasks = {
        app: [
            "nautilus:app:sonata",
            "nautilus:app:controller:fractal",
            "nautilus:app:controller:nautilus"
        ]
    };
    
    grunt.registerTask( "test", "Test each nautilus task", function () {
        
        grunt.task.run( "jshint:plugin" );
        
        _.each( tasks, function ( val, key, list ) {
            _.each( val, function ( el, i ) {
                grunt.task.run( el );
            });
            
            grunt.task.run( "nodeunit:"+key );
        });
        
    });
    
    
    // Register default task.
    grunt.registerTask( "default", ["nautilus:build"] );
    

};
