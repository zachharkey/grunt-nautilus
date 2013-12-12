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
        jshint: {
            plugin: [
                "Gruntfile.js",
                "tasks/**/*.js"
            ],
            
            options: {
                jshintrc: ".jshintrc"
            }
        },
        
        
        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: [
                "test/expected/js/**/*",
                "test/expected/css",
                "test/expected/img",
                "test/expected/fonts",
                "test/expected/sass"
            ]
        },
        
        
        // Manage the ender build.
        ender: {
            options: {
                output: "test/expected/js/lib/ender/ender",
                dependencies: ["jeesh"]
            }
        },
        
        
        // Manage the compass build.
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
        
        
        // Configuration to be run (and then tested).
        nautilus: {
            // Default options for testing.
            options: {
                jsRoot: "test/expected/js",
                jsAppRoot: "test/expected/js/app",
                jsDistRoot: "test/expected/js/dist",
                jsLibRoot: "test/expected/js/lib",
                pubRoot: "test/expected",
                quiet: false,
                
                
                // 3rd party plugins can be set here
                jsGlobals: {},
                
                
                // Specify which tasks should run jshint.
                hintAt: [],
                hintOn: [
                    "watch",
                    "build",
                    "deploy"
                ],
                
                
                // Test buildIn scripts.
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
                }
            }
        },
        
        
        // Unit tests.
        nodeunit: {
            app: ["test/nautilus_app_test.js"],
            compass: ["test/nautilus_compass_test.js"],
            concat: ["test/nautilus_concat_test.js"],
            uglify: ["test/nautilus_uglify_test.js"],
            build: ["test/nautilus_build_test.js"],
            default: ["test/nautilus_build_test.js"],
            deploy: ["test/nautilus_deploy_test.js"],
            ender: ["test/nautilus_ender_test.js"]
        }
    });
    
    
    // Actually load this plugin's task(s).
    grunt.loadTasks( "tasks" );
    
    
    // These plugins provide necessary tasks.
    grunt.loadNpmTasks( "grunt-contrib-clean" );
    grunt.loadNpmTasks( "grunt-contrib-nodeunit" );
    grunt.loadNpmTasks( "grunt-contrib-jshint" );
    
    
    // Test all of grunt-nautilus' tasks in a deployment manner.
    var _tasks = {
        app: [
            "nautilus:app:sonata",
            "nautilus:app:controller:fractal",
            "nautilus:app:controller:nautilus"
        ]
    };
    
    grunt.registerTask( "test", "Test each nautilus task", function () {
        
        grunt.task.run( "jshint:plugin" );
        
        _.each( _tasks, function ( val, key, list ) {
            _.each( val, function ( el, i ) {
                grunt.task.run( el );
            });
            
            grunt.task.run( "nodeunit:"+key );
        });
        
    });
    

};
