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
    
    
    var _ = grunt.util._;
    var defaults = require( "./lib/options" );
    var mergeOptions = function ( options ) {
        _.each( defaults, function ( val, key, list ) {
            // Use user value or merge
            if ( options[ key ] ) {
                if ( _.isObject( val ) ) {
                    options[ key ] = _.extend( options[ key ], val );
                }
            
            // Consume default value    
            } else {
                options[ key ] = val;
            }
        });
        
        grunt.config.set( "nautilus", {
            options: options
        });
        
        return grunt.config.get( "nautilus" ).options;
    };
    var options = mergeOptions( grunt.config.get( "nautilus" ).options );
    var nautilus = require( "./lib/nautilus" )( grunt, options );
    
    
    /*!
     *
     * Check if we need to create directories.
     *
     */
    require( "./lib/init" )( grunt, options );
    
    
    /*!
     *
     * Execute the nautilus stack.
     *
     */
    nautilus.parseFlags( grunt.option.flags() );
    nautilus.executeStack();
    nautilus.watchTask();
    nautilus.jsHintTask();
    nautilus.cleanTask();
    
    
    /*!
     *
     * Overthrow the "watch" task.
     *
     */
    grunt.event.on( "watch", function ( filepath, watchtask ) {
        
    });
    grunt.renameTask( "watch", "nautilus-watch" );
    grunt.registerTask( "watch", function () {
        nautilus.buildTask();
        
        grunt.task.run( "nautilus-watch" );
    });
    
    
    /*!
     * 
     * Throw error if required options are missing.
     *
     */
    grunt.config.requires(
        "nautilus",
        "nautilus.options",
        "nautilus.options.pubRoot",
        "nautilus.options.jsRoot",
        "nautilus.options.jsAppRoot",
        "nautilus.options.jsLibRoot",
        "nautilus.options.jsDistRoot"
    );
    
    
    /*!
     * 
     * Register the "nautilus" task.
     *
     * @usage: grunt nautilus [,flags...]
     *
     */
    grunt.registerTask( "nautilus", "Build modular javascript applications.", function () {
        nautilus.parseArgs( this.args );
    });
    
    
};
