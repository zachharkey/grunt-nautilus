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


    var _ = grunt.util._;


    // Project configuration.
    grunt.initConfig({
        // Project meta.
        meta: {
            version: "0.5.5"
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
                //"Gruntfile.js",
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


        /** Compass config. */
        compass: {
            options: {
                cssDir: "test/out/css",
                force: true,
                httpPath: "/",
                noLineComments: true,
                sassDir: "test/src/sass"
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
        grunt.task.run( "jshint:plugin" );
        grunt.task.run( "clean:plugin" );
        grunt.task.run( "nautilus:build" );
        grunt.task.run( "nodeunit:plugin" );
    });


};
