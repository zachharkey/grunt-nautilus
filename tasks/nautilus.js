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
    
    
    var _options = grunt.config.get( "nautilus" ).options,
        _isInit = grunt.file.isFile( _options.jsRoot+"/app/app.js" ),
        _each = grunt.util._.each,
        _isFunction = grunt.util._.isFunction,
        _nautilus = require( "./lib/nautilus" )( grunt ),
        _tasks = [
            "app",
            "dev",
            "build",
            "deploy",
            "default"
        ];
        
    
    if ( !_isInit ) {
        require( "./lib/init" )( grunt, _options );
    }
    
    
    /*!
     * 
     * Load the required plugins and their tasks.
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
    _nautilus.load();
    
    
    /*!
     * 
     * Perform the grunt-nautilus application building.
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
    _nautilus.layout();
    _nautilus.scan();
    _nautilus.parse();
    _nautilus.recurse();
    _nautilus.compile();
    _nautilus.config();
    
    
    /*!
     * 
     * Register other tasks.
     *
     * @task: app
     * @task: build
     * @task: deploy
     * @task: default
     *
     */
    _each( _tasks, function ( task ) {
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
    grunt.registerTask( "nautilus", "A grunt plugin for modular javascript application development.", function ( task ) {
        if ( (_tasks.indexOf( task ) !== -1) && (_isFunction( _nautilus[ task ] )) ) {
            _nautilus[ task ].apply( _nautilus, [].slice.call( arguments, 1 ) );
            
        } else {
            grunt.fail.warn( "Invalid arguments and options." );
        }
    });
    
    
};
