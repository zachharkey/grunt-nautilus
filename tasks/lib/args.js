/*!
 * 
 * grunt-nautilus args
 * https://github.com/kitajchuk/grunt-nautilus
 *
 * Copyright (c) 2013 Brandon Kitajchuk
 * Licensed under the MIT license.
 *
 *
 */
var coreGlobal = require( "./global" );

module.exports = {
    args: [coreGlobal, coreGlobal + ".document"],
    params: [coreGlobal, "document"],
    undef: ["undefined"]
};