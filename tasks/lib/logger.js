/*!
 * 
 * grunt-nautilus logger
 * https://github.com/kitajchuk/grunt-nautilus
 *
 * Copyright (c) 2013 Brandon Kitajchuk
 * Licensed under the MIT license.
 *
 *
 */
module.exports = function ( grunt ) {
    
    var _ = grunt.util._,
        _options = grunt.config.get( "nautilus" ).options,
        _logs = {
            MISSING_MODULE: {
                type: "fatal",
                log: "Could not locate import found in <%= file %>"
            },
            
            MISSING_IMPORT: {
                type: "fatal",
                log: "Could not locate import at <%= file %>"
            },
            
            MATCHED_HINTON: {
                type: "ok",
                log: "Matched hintOn for task <%= task %>"
            },
            
            CONFIG_SET: {
                type: "ok",
                log: "<%= action %> config options for <%= task %>"
            },
            
            NEW_MODULE: {
                type: "ok",
                log: "New module created at <%= path %>"
            },
            
            MODULE_EXISTS: {
                type: "fatal",
                log: "Module already exists at <%= path %>\nUse --force to override"
            },
            
            NAMESPACE_RESERVED: {
                type: "fatal",
                log: "Cannot overwrite reserved application namespace: <%= namespace %>"
            }
        },
        _log = function ( type, msg ) {
            if ( _options.quiet ) {
                return;
            }
            
            if ( type === "warn" || type === "fatal" ) {
                grunt.fail[ type ]( msg );
                
            } else {
                grunt.log[ type ]( "[Nautilog]: "+msg );
            }
        };
    
    return {
        log: function ( key, data ) {
            var log = _logs[ key ];
        
            _log( log.type, _.template( log.log, data ) );
        },
        
        console: function () {
            console.log.apply( console, arguments );
        }
    };
    
};