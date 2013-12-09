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
    
    
    var Nautilus = require( "./lib/nautilus" )( grunt ),
        _ = grunt.util._,
        _options = grunt.config.get( "nautilus" ).options,
        _isInit = grunt.file.isFile( _options.jsRoot+"/app/app.js" ),
        _isNonTask = false,
        _tasks = [
            "app",
            "dev",
            "build",
            "deploy",
            "default"
        ],
        _nonTasks = [
            "app"
        ];
        
    
    /*!
     * 
     * Initialize the setup.
     *
     */
    if ( !_isInit ) {
        require( "./lib/init" )( grunt, _options );
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
        _isNonTask = (_.contains( _nonTasks, task ));
        
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
        if ( !_isNonTask ) {
            Nautilus.typeCheck();
            Nautilus.load();
            Nautilus.layout();
            Nautilus.scan();
            Nautilus.parse();
            Nautilus.recurse();
            Nautilus.compile();
            Nautilus.config();
        }
        
        if ( (_.contains( _tasks, task )) && (_.isFunction( Nautilus[ task ] )) ) {
            Nautilus[ task ].apply( Nautilus, [].slice.call( arguments, 1 ) );
            
        } else {
            grunt.fail.warn( "Invalid arguments and options." );
        }
    });
    
    
};
