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
    var mergeOptions = function () {
        var config = grunt.config.get( "nautilus" ),
            options = config.options || {};
        
        _.each( defaults, function ( val, key, list ) {
            // Use user value or merge
            if ( options[ key ] ) {
                if ( _.isArray( val ) ) {
                    options[ key ] = _.union( options[ key ], val );
                    
                } else if ( _.isObject( val ) ) {
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
        
        return options;
    };
    var options = mergeOptions();
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
    nautilus.executeStack();
    nautilus.cleanTask();
    nautilus.watchTask();
    nautilus.jsHintTask();
    nautilus.sailsLinkerTask();
    nautilus.cleanUp();
    
    
    /*!
     *
     * Overthrow the "watch" task.
     *
     */
    //grunt.event.on( "watch", function ( filepath, watchtask ) {
    //    console.log( "onwatch", filepath, watchtask );
    //});
    grunt.renameTask( "watch", "nautilus-watch" );
    grunt.registerTask( "watch", function () {
        var task = "nautilus-watch";
        
        nautilus.buildTask();
        
        if ( this.args.length && _.contains( ["scripts", "compass", "gruntfile"], _.first( this.args ) ) ) {
            task += ":"+_.first( this.args );
        }
        
        grunt.task.run( task );
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
     * @usage: grunt nautilus[:,args...] [,flags...]
     *
     */
    grunt.registerTask( "nautilus", "Build modular javascript applications that make sense", function () {
        nautilus.parseArgs( this.args );
    });
    
    
};
