/*!
 * 
 * grunt-nautilus
 * https://github.com/kitajchuk/grunt-nautilus
 *
 * Copyright (c) 2013 Brandon Kitajchuk
 * Licensed under the MIT license.
 *
 *
 */
module.exports = function ( grunt ) {

    "use strict";

    var g = grunt,
        _ = g.util._,

        // Instantiate Nautilus
        n = require( "./lib/nautilus" );

    // These are required task options.
    g.config.requires(
        "nautilus",
        "nautilus.options",
        "nautilus.options.pubRoot",
        "nautilus.options.jsRoot",
        "nautilus.options.jsAppRoot",
        "nautilus.options.jsLibRoot",
        "nautilus.options.jsDistRoot"
    );

    // Hijack the watch task.
    g.renameTask( "watch", "nautilus-watch" );
    g.registerTask( "watch", function () {
        var watches = ["scripts", "compass", "gruntfile"],
            task = "nautilus-watch";

        n.compile( ["watch"] );

        if ( this.args.length && _.contains( watches, _.first( this.args ) ) ) {
            task += (":" + _.first( this.args ));
        }

        g.task.run( task );
    });

    // Register the nautilus task.
    g.registerTask(
        "nautilus",
        "Build modular javascript applications that make sense",
        function () {
            n.compile( this.args );
        }
    );

};
