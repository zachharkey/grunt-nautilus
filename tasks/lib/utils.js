/*!
 * 
 * grunt-nautilus utils
 * https://github.com/kitajchuk/grunt-nautilus
 *
 * Copyright (c) 2013 Brandon Kitajchuk
 * Licensed under the MIT license.
 *
 *
 */
module.exports = function ( grunt ) {
    
    var _ = grunt.util._;
    
    return {
        camelCase: function ( str ) {
            return str.replace( /[-|_]([a-z]|[0-9])/ig, function ( all, letter ) {
                return ( ""+letter ).toUpperCase();
            });
        },
        
        front2Back: function ( str ) {
            return str.replace( /^\/|\/$/g, "" );
        },
        
        nameSpace: function ( str ) {
            return str.replace( /^.*(?=app\/|lib\/)|\..*$/g, "" );
        },
        
        moduleName: function ( str ) {
            return str.split( "/" ).reverse()[ 0 ].replace( /\..*$/, "" );
        },
        
        tempName: function ( str ) {
            return [_.uniqueId( "module_" )].concat( str.split( "/" ) ).join( "." ); 
        }
    };
};