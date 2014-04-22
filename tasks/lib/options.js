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
// Flags
// expanded: bool
// loud: bool
// env: string
module.exports = {
    //buildIn: undefined,
    //env: undefined,
    //expanded: false,
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
    jsTemplate: undefined,
    main: [
        "app.js",
        "controllers/**/*.js"
    ],
    pubRoot: undefined,
    type: "globals", // Secret option for now
    whitespace: undefined
};