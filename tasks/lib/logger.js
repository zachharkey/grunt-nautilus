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
                type: "warn",
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
                type: "warn",
                log: "Module already exists at <%= path %>\nUse --force to override"
            },
            
            NAMESPACE_RESERVED: {
                type: "warn",
                log: "Cannot overwrite reserved application namespace: <%= namespace %>"
            },
            
            LOAD_PLUGIN: {
                type: "ok",
                log: "Loading plugin <%= plugin %>"
            },
            
            UNSUPPORTED_TYPE: {
                type: "warn",
                log: "You are trying to use an unsupported compile type: <%= type %>"
            },
            
            THIRD_PARTY: {
                type: "ok",
                log: "Not transpiling 3rd party script: <%= src %>"
            },
            
            MISSING_HINTAT: {
                type: "warn",
                log: "Pattern for options.hintAt not matched: <%= el %>"
            },
            
            MERGE_BUILDIN: {
                type: "ok",
                log: "Merging buildIn <%= buildIn %> for <%= script %>"
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