/*!
 * 
 * grunt-nautilus core
 * https://github.com/kitajchuk/grunt-nautilus
 *
 * Copyright (c) 2013 Brandon Kitajchuk
 * Licensed under the MIT license.
 *
 *
 */
// Expose all core objects under one namespace.
module.exports = {
    options: require( "./options" ),
    compiler: require( "./compiler" ),
    args: require( "./args" ),
    dirs: require( "./dirs" ),
    libs: require( "./libs" ),
    logger: require( "./logger" ),
    module: require( "./module" ),
    parser: require( "./parser" ),
    util: require( "./util" ),
    structure: require( "./structure" ),
    config: require( "./config" )
};