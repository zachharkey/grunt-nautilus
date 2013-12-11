/*!
 * 
 * grunt-nautilus options
 * https://github.com/kitajchuk/grunt-nautilus
 *
 * Copyright (c) 2013 Brandon Kitajchuk
 * Licensed under the MIT license.
 *
 *
 */
module.exports = {
    buildIn: undefined,
    compass: undefined,
    ender: undefined,
    gruntFile: "Gruntfile.js",
    hintAt: [],
    hintOn: [],
    jsAppRoot: undefined,
    jsLibRoot: undefined,
    jsDistRoot: undefined,
    jsGlobals: {
        // Global build
        app: true,
        
        // For Sanity
        console: true,
        
        // For Gruntfile
        module: true
    },
    jsRoot: undefined,
    main: [
        "app.js",
        "controllers/**/*.js"
    ],
    pubRoot: undefined,
    type: "globals", // Secret option for now
    quiet: false
};