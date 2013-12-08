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
module.exports = function ( grunt ) {
    
    var _ = grunt.util._,
        _path = require( "path" ),
        _dirs = require( "./dirs" ),
        _logger = require( "./logger" )( grunt ),
        _options = grunt.config.get( "nautilus" ).options,
        _jshintrc = JSON.parse( grunt.file.read( _path.join( _dirs.root, ".jshintrc" ) ) ),
        _jshintGlobals = {
            app: true,
            console: true,
            module: true
        },
        _concatOptions = {
            options: {
                banner: "<%= banner %>"
            }
        },
        _merge = function ( task, settings ) {
            var config = grunt.config.get( task );
            
            // 0.1 config absent for task
            if ( !config ) {
                grunt.config.set( task, settings );
                
                _logger.log( "CONFIG_SET", {
                    task: task,
                    action: "Set"
                });
            
            // 0.2 config exists for task
            } else {
                grunt.config.set( task, _.extend( config, settings ) );
                
                _logger.log( "CONFIG_SET", {
                    task: task,
                    action: "Merge"
                });
            }
        };
    
    return {
        clean: function ( options ) {
            _merge( "clean", options );
        },
        
        ender: function () {
            _merge( "ender", _options.ender );
        },
        
        compass: function () {
            var options = {};
            
            _.each( _options.compass, function ( el, i, list ) {
                if ( i !== "options" ) {
                    options[ i ] = {
                        options: _.extend( _options.compass.options, el.options )
                    };
                }
            });
            
            _merge( "compass", options );
        },
        
        jshint: function ( scripts, modules ) {
            var options = {
                options: _.extend( _jshintrc, {
                    globals: _jshintGlobals
                }),
                
                scripts: {}
            };
            
            if ( _options.jshintGlobals ) {
                _.extend( options.options.globals, _options.jshintGlobals );
            }
            
            if ( _options.hintAt ) {
                _.each( _options.hintAt, function ( dir ) {
                    var path = _path.join( _options.jsRoot, dir, "**/*.js" );
                    
                    if ( grunt.file.isDir( _path.join( _options.jsRoot, dir ) ) && scripts.indexOf( path ) === -1 ) {
                        scripts.push( path );
                    }
                });
            }
            
            if ( _options.gruntFile ) {
                options.gruntfile = {
                    src: _options.gruntFile
                };
            }
            
            options.scripts.src = scripts;
            
            _.each( modules, function ( val, key, list ) {
                options[ key ] = _.filter( val.temporary.src, function ( el ) {
                    if ( !/\.lib\./.test( el ) ) {
                        return el;
                    }
                });
            });
            
            _merge( "jshint", options );
        },
        
        watch: function ( scripts, tasks ) {
            var options = {
                    scripts: {
                        files: scripts,
                        tasks: tasks
                    }
                },
                sass;
            
            if ( _options.compass ) {
                sass = _path.join(
                    _options.compass.options.sassDir,
                    "**/*.scss"
                );
                
                options.styles = {
                    files: sass,
                    tasks: "compass:development"
                };
            }
            
            if ( _options.gruntFile ) {
                options.gruntfile = {
                    files: _options.gruntFile,
                    tasks: "jshint:gruntfile"
                };
            }
            
            _merge( "watch", options );
        },
        
        concat: function ( modules ) {
            var options = {};
            
            _.each( modules, function ( val, key, list ) {
                options[ key ] = val.temporary;
            });
            
            _merge( "concat", options );
        },
        
        uglify: function ( modules ) {
            var options = {};
            
            _.each( modules, function ( val, key, list ) {
                options[ key ] = val.temporary;
            });
            
            _merge( "uglify", options );
        }
    };
    
};