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
    
    
    var _each = grunt.util._.each,
        _isFunction = grunt.util._.isFunction,
        _nautilus = require( "./lib/nautilus" )( grunt ),
        _options = grunt.config.get( "nautilus" ).options,
        _tasks = [
            {
                name: "app",
                args: 2
            },
            
            {
                name: "build",
                args: 0
            },
            
            {
                name: "deploy",
                args: 0
            },
            
            {
                name: "default",
                args: 0
            }
        ],
        _levels = [
            "core",
            "controller",
            "util"
        ];
    
    
    /*!
     * 
     * Load the required plugins and these contrib tasks will be available.
     *
     * @task: ender
     * @task: watch
     * @task: jshint
     * @task: uglify
     * @task: concat
     * @task: compass
     *
     */
    _nautilus.load();
    
    
    /*!
     * 
     * Build the grunt config.
     *
     */
    _nautilus.config();
    
    
    /*!
     * 
     * Register shorthand tasks to be passed off to "nautilus"
     *
     * @task: app
     * @task: build
     * @task: deploy
     * @task: default
     *
     */
    _each( _tasks, function ( task ) {
        grunt.registerTask( task.name, function () {
            var command = [ "nautilus", task.name ].concat( [].slice.call( arguments, 0, task.args ) ).join( ":" );
            
            grunt.task.run( command );
        });
    });
    
    
    /*!
     * 
     * Register the "nautilus" task
     *
     * @usage: grunt nautilus
     * @usage: grunt nautilus:build
     * @usage: grunt nautilus:deploy
     * @usage: grunt nautilus:app
     *
     */
    grunt.registerTask( "nautilus", "A grunt plugin for modular app-js development", function ( arg1, arg2, arg3 ) {
        /*!
         *
         * Test init public
         *
         */
        if ( !grunt.file.exists( _options.jsRoot+"/app/app.js" ) ) {
            _nautilus.init();
            
            grunt.log.writeln( "" );
            grunt.log.writeln( "Grunt Nautilus has been initialized. We just created a bunch of files so you don't have to! Check it out and happy grunting!" );
            grunt.log.writeln( "" );
            grunt.log.writeln( "- Brandon Lee Kitajchuk" );
            
        } else {
            /*!
             * 
             * Parse the arguments.
             *
             */
            if ( _nautilus.isTask( arg1 ) && typeof _isFunction( _nautilus[ arg1 ] ) ) {
                _nautilus[ arg1 ].apply( _nautilus, [arg2, arg3] );
                
            } else {
                grunt.fail.warn( "invalid arguments and options." );
            }
        }
    });
    
    
};
