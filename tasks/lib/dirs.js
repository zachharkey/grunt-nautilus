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
var _path = require( "path" );

module.exports = {
    app: _path.join( __dirname, "../../app" ),
    root: _path.join( __dirname, "../../" ),
    node: _path.join( __dirname, "../../node_modules" )
};