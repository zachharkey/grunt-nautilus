/*!
 * 
 * grunt-nautilus config
 * https://github.com/kitajchuk/grunt-nautilus
 *
 * Copyright (c) 2013 Brandon Kitajchuk
 * Licensed under the MIT license.
 *
 *
 */
module.exports = function ( grunt, options ) {
    
    var _ = grunt.util._,
        coreLogger = require( "./logger" )( grunt, options ),
        mergeConfig = function ( task, settings ) {
            var config = grunt.config.get( task );
            
            // 0.1 no config exists for given task
            if ( !config ) {
                grunt.config.set( task, settings );
                
                coreLogger.log( "CONFIG_SET", {
                    task: task,
                    action: "Set"
                });
            
            // 0.2 merge nautilus config with existing config for given task
            } else {
                grunt.config.set( task, _.extend( config, settings ) );
                
                coreLogger.log( "CONFIG_SET", {
                    task: task,
                    action: "Merge"
                });
            }
        };
    
    return {
        dowatch: function ( opts ) {
            mergeConfig( "dowatch", opts );
        },
        
        jshint: function ( opts ) {
            mergeConfig( "jshint", opts );
        },
        
        clean: function ( opts ) {
            mergeConfig( "clean", opts );
        },
        
        concatUglify: function ( opts ) {
            mergeConfig( "concat", opts );
            mergeConfig( "uglify", opts );
        }
    };
    
};