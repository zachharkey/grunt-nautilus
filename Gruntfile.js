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
            version: "0.7.3"
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
        /** Nautilus config. */
        nautilus: {
            options: {
                pubRoot: "test/src",
                jsDistRoot: "test/out/js/dist",
                jsAppRoot: "test/src/js/app",
                jsLibRoot: "test/src/js/lib",
                jsRoot: "test/src/js",
                cssRoot: "test/out/css",
                sassRoot: "test/src/sass",
                jsGlobals: {
                    $: true
                },
                hintOn: [
                    "watch",
                    "build",
                    "deploy"
                ],
                standalone: ["lynx"]
            }
        }
    });


    // These plugins provide necessary tasks.
    grunt.loadNpmTasks( "grunt-contrib-jshint" );
    grunt.loadNpmTasks( "grunt-contrib-concat" );
    grunt.loadNpmTasks( "grunt-contrib-uglify" );
    grunt.loadNpmTasks( "grunt-contrib-watch" );
    grunt.loadNpmTasks( "grunt-contrib-sass" );
    grunt.loadNpmTasks( "grunt-contrib-clean" );
    grunt.loadNpmTasks( "grunt-jsdoc" );
    grunt.loadNpmTasks( "grunt-postcss" );
    grunt.loadNpmTasks( "grunt-contrib-nodeunit" );


    // Actually load this plugin's task(s).
    grunt.loadTasks( "tasks" );


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
