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
// need a better "is-init" condition
module.exports = function ( grunt ) {
    
    
    "use strict";
    
    
    var _ = grunt.util._,
        Nautilus = require( "./lib/nautilus" )( grunt ),
        _path = require( "path" ),
        _options = grunt.config.get( "nautilus" ).options,
        _isInit = (grunt.file.isDir( _path.join( _options.jsRoot, "app" ) )),
        _tasks = [
            "app",
            "dev",
            "build",
            "deploy",
            "default"
        ];
        
    
    /*!
     * 
     * Initialize the setup.
     *
     */
    if ( !_isInit ) {
        if ( !grunt.option( "init" ) ) {
            grunt.fail.warn( "Initialize grunt-nautilus with `grunt --init`" );
            
        } else {
            require( "./lib/init" )( grunt, _options );
        }
    
    /*!
     * 
     * Perform the grunt-nautilus building.
     *
     * @task: ender
     * @task: watch
     * @task: clean
     * @task: jshint
     * @task: uglify
     * @task: concat
     * @task: compass
     *
     * Load required plugins and their tasks.
     *
     * @task: ender
     * @task: watch
     * @task: clean
     * @task: jshint
     * @task: uglify
     * @task: concat
     * @task: compass
     *
     */
    } else {
        Nautilus.typeCheck();
        Nautilus.load();
        Nautilus.layout();
        Nautilus.scan();
        Nautilus.parse();
        Nautilus.recurse();
        Nautilus.compile();
        Nautilus.config();
    }
    
    
    /*!
     * 
     * Register other tasks.
     *
     * @task: app
     * @task: dev
     * @task: build
     * @task: deploy
     * @task: default
     *
     */
    _.each( _tasks, function ( task ) {
        grunt.registerTask( task, function () {
            var command = [ "nautilus", task ].concat( [].slice.call( arguments, 0 ) ).join( ":" );
                
            grunt.task.run( command );
        });
    });
    
    
    /*!
     * 
     * Register the "nautilus" task.
     *
     * @usage: grunt nautilus
     *
     */
    grunt.registerTask( "nautilus", "A grunt plugin for modular, javascript application development.", function ( task ) {
        if ( (_.contains( _tasks, task )) && (_.isFunction( Nautilus[ task ] )) ) {
            Nautilus[ task ].apply( Nautilus, [].slice.call( arguments, 1 ) );
            
        } else {
            grunt.fail.warn( "Invalid arguments and options." );
        }
    });
    
    
};
