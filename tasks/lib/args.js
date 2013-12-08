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
module.exports = function () {
    return {
        arguments: [
            "window",
            "app",
            "undefined"
        ],
        
        parameters: [
            "window",
            "window.app"
        ]
    };
};