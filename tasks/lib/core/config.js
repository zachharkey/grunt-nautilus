/*!
 * 
 * grunt-nautilus config
 * https://github.com/kitajchuk/grunt-nautilus
 *
 * Copyright (c) 2015 Brandon Kitajchuk
 * Licensed under the MIT license.
 *
 *
 */
module.exports = (function () {

    "use strict";

    var coreUitls = require( "./util" );

    return {
        watch: function ( opts ) {
            coreUitls.mergeConfig( "nautilus-watch", opts );
        },

        jshint: function ( opts ) {
            coreUitls.mergeConfig( "jshint", opts );
        },

        clean: function ( opts ) {
            coreUitls.mergeConfig( "clean", opts );
        },

        sass: function ( opts ) {
            coreUitls.mergeConfig( "sass", opts );
        },

        postcss: function ( opts ) {
            coreUitls.mergeConfig( "postcss", opts );
        },

        jsdoc: function ( opts ) {
            coreUitls.mergeConfig( "jsdoc", opts );
        },

        concatUglify: function ( opts ) {
            coreUitls.mergeConfig( "concat", opts );
            coreUitls.mergeConfig( "uglify", opts );
        }
    };

})();