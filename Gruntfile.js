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


module.exports = function ( grunt ) {


    "use strict";


    // Project configuration.
    grunt.initConfig({
        // Project meta.
        meta: {
            version: "0.7.0"
        },


        // Jshint config.
        jshint: {
            plugin: [
                "Gruntfile.js",
                "tasks/**/*.js"
            ]
        },


        // Clean config.
        clean: {
            plugin: [
                "test/out/js/**/*.js",
                "test/out/css/**/*.css"
            ]
        },


        // Nodeunit tests.
        nodeunit: {
            plugin: [
                "test/nautilus_tests.js"
            ]
        },


        /////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////
        //
        // PLUGIN TESTING:
        //
        // This config handles build testing for the plugin.
        // Using the "nautilus-watch" config will merge watch tasks.
        //
        /////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////
        /** Ender config. */
        ender: {
            options: {
                srcmap: "/js/lib/ender/ender",
                output: "test/src/js/lib/ender/ender",
                dependencies: ["more-jeesh"]
            }
        },


        /** Nautilus config. */
        nautilus: {
            options: {
                jsDistRoot: "test/out/js/dist",
                jsAppRoot: "test/src/js/app",
                jsLibRoot: "test/src/js/lib",
                pubRoot: "test/src",
                jsRoot: "test/src/js",
                jsGlobals: {
                    $: true
                },
                hintOn: [
                    "watch",
                    "build",
                    "deploy"
                ],
                whitespace: {
                    files: [
                        "test/src/js/app/**/*.js"
                    ],

                    watch: true
                },
                compass: {
                    cssRoot: "test/out/css",
                    sassRoot: "test/src/sass"
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
        var tasks = [
            "jshint:plugin",
            "clean:plugin",
            "nautilus:build",
            "nodeunit:plugin"
        ];

        grunt.task.run( tasks );
    });


    // Config built.
    grunt.event.on( "grunt-nautilus-done", function () {
        //console.log( grunt.config.get() );
    });


};
