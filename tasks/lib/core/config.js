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
module.exports = (function ( g ) {
    
    var _ = g.util._,
        coreLogger = require( "./logger" ),
        mergeConfig = function ( task, settings ) {
            var config = g.config.get( task );
            
            // 0.1 no config exists for given task
            if ( !config ) {
                g.config.set( task, settings );
                
                coreLogger.log( "CONFIG_SET", {
                    task: task,
                    action: "Set"
                });
            
            // 0.2 merge nautilus config with existing config for given task
            } else {
                g.config.set( task, _.extend( config, settings ) );
                
                coreLogger.log( "CONFIG_SET", {
                    task: task,
                    action: "Merge"
                });
            }
        };
    
    return {
        watch: function ( opts ) {
            mergeConfig( "nautilus-watch", opts );
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
        },
        
        sailsLinker: function ( opts ) {
            mergeConfig( "sails-linker", opts );
        }
    };
    
})( require( "grunt" ) );