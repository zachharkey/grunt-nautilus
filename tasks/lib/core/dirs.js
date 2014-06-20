/*!
 * 
 * grunt-nautilus dirs
 * https://github.com/kitajchuk/grunt-nautilus
 *
 * Copyright (c) 2013 Brandon Kitajchuk
 * Licensed under the MIT license.
 *
 *
 */
var path = require( "path" );

module.exports = {
    app: path.join( __dirname, "../../../app" ),
    root: path.join( __dirname, "../../../" ),
    node: path.join( __dirname, "../../../node_modules" )
};