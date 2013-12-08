module.exports = function ( grunt ) {
    
    var _ = grunt.util._,
        _utils = require( "./utils" )( grunt ),
        _libs = require( "./libs" ),
        __console__ = "console.log",
        __exports__ = "__exports__",
        __applog__ = "app.log",
        _rSlash = /\//g,
        _rLib = /window\.([^app.].*?)(?=(,|\)))/g,
        _rSyntax = /\n\}\)|;$/g,
        _rLastLine = /\n.*$/;
    
    return {
        globals: function ( namespace, file ) {
            var end = file.match( _rLastLine ),
                rep = end = end[ 0 ].replace( _rSyntax, "" ),
                libs = rep.match( _rLib );
            
            file = file.replace(
                __exports__+"."+_utils.moduleName( namespace ),
                __exports__+"."+namespace.replace( _rSlash, "." )
            );
            
            _.each( libs, function ( lib ) {
                var module = lib.split( "/" ).reverse()[ 0 ];
                
                if ( _libs[ module ] ) {
                    module = _libs[ module ].context;
                }
                
                rep = rep.replace( lib, "window."+module );
            });
            
            file = file.replace( end, rep.replace( _rSlash, "." ) );
            
            file = file.replace( __console__, __applog__ );
            
            return file;
        }
    };
};