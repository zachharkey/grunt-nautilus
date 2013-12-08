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
    
    // All tests.
    var allTests = [
        // Test js module file creations
        "nautilus:app:core:Foo",
        "nautilus:app:util:bar",
        "nautilus:app:controller:baz",
        "nodeunit:app",
        
        // Test compass compilations
        "compass:development",
        "compass:production",
        "nodeunit:compass",
        
        // Test concat
        "concat",
        "nodeunit:concat",
        
        // Test uglify
        "uglify",
        "nodeunit:uglify",
        
        // Test build
        "nautilus:build",
        "nodeunit:build",
        
        // Test deploy
        "nautilus:deploy",
        "nodeunit:deploy",
        
        // Test ender
        "ender",
        "nodeunit:ender"
    ];
        
    
    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                "Gruntfile.js",
                "tasks/*.js"
            ],
            
            options: {
                jshintrc: ".jshintrc"
            }
        },
        
        
        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: [
                "tmp",
                "test/expected/js/app/core/*.js",
                "test/expected/js/app/controllers/*.js",
                "test/expected/js/app/util/*.js",
                "test/expected/js/dist/*.js",
                "test/expected/js/vendor/*.js",
                "test/expected/css/*.css"
            ],
            
            inits: [
                "test/expected/js/app/app.js",
                "test/expected/sass/**/*.scss"
            ]
        },
        
        
        // Configuration to be run (and then tested).
        nautilus: {
            // Default options for testing.
            options: {
                gruntFile: "Gruntfile.js",
                jsRoot: "test/expected/js",
                jsAppRoot: "test/expected/js/app",
                jsDistRoot: "test/expected/js/dist",
                jsLibRoot: "test/expected/js/lib",
                quiet: false,
                
                
                // 3rd party plugins can be set here
                jshintGlobals: {
                    $: true,
                    ender: true,
                    Ender: true
                },
                
                
                // Specify which tasks should run jshint.
                hintAt: [],
                hintOn: [
                    "watch",
                    "build",
                    "deploy"
                ],
                
                
                // Manage the ender build.
                /*
                ender: {
                    options: {
                        output: "test/expected/js/lib/ender/ender",
                        dependencies: ["jeesh"]
                    }
                },
                */
                
                
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
                
                
                // Test buildIn scripts.
                buildIn: {
                    test_0: {
                        files: ["test/fixtures/buildins/test_0.js"],
                        priority: 0,
                        builds: ["scripts", "lame"]
                    },
                    
                    test_1: {
                        files: ["test/fixtures/buildins/test_1.js"],
                        priority: 1,
                        builds: ["scripts", "baz"]
                    },
                    
                    test_2: {
                        files: ["test/fixtures/buildins/test_2.js"],
                        priority: 2,
                        builds: ["scripts", "baz"]
                    },
                    
                    test_3: {
                        files: ["test/fixtures/buildins/test_3.js"],
                        priority: 3,
                        builds: ["scripts", "baz"]
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
    
    
    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    // Not using a grunt multi-task so running individual tests after each plugin task
    /*
    grunt.registerTask( "test", "Test each nautilus task.", function ( test ) {
        var jsTasks = [
                "default",
                "app",
                "concat",
                "uglify",
                "build",
                "deploy"
            ],
            myTasks = [
                "app",
                "build",
                "deploy",
                "default"
            ];
        
        // Clean before...
        grunt.task.run( "clean" );
        
        // No arguments, run all tests
        if ( !test ) {
            grunt.task.run( allTests );
            
        } else {
            // Handle app-js related tests
            // All js tasks will need appjs executed first
            if ( jsTasks.indexOf( test ) !== -1 ) {
                grunt.task.run([
                    "nautilus:app:core:test",
                    "nautilus:app:util:test",
                    "nautilus:app:controller:test"
                ]);
            }
            
            // Handle the compass test
            if ( test === "compass" ) {
                grunt.task.run([
                    "compass:development",
                    "compass:production"
                ]);
            }
            
            // Handle other tests
            // or finish up app-js related tests
            // excluding appjs itself
            if ( test !== "app" && myTasks.indexOf( test ) !== -1 ) {
                try {
                    grunt.task.run( "nautilus:"+test );
                    
                } catch ( error ) {
                    var throwError = new Error( "Nautilus test failed." );
                    
                    if ( error.msg ) {
                        throwError.message += ", "+error.msg+".";
                    }
                    
                    throwError.origError = error;
                    
                    grunt.log.warn( "running test "+test+" failed." );
                    
                    grunt.fail.warn( throwError );
                }
                
            } else {
                grunt.task.run( test );
            }
            
            // Run the unit test
            grunt.task.run( "nodeunit:"+test );
        }
        
        // ... and clean after.
        grunt.task.run( "clean" );
    });
    */
    
    
    // By default, lint and run all tests.
    //grunt.registerTask( "default", ["jshint", "test"] );
    

};
