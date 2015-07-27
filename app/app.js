/*!
 * 
 * grunt-nautilus
 * https://github.com/kitajchuk/grunt-nautilus
 *
 * Copyright (c) 2015 Brandon Kitajchuk
 * Licensed under the MIT license.
 *
 *
 */
(function ( context, undefined ) {


"use strict";


var <%= namespace %>,

    // Handle console fallback
    console = (context.console || {
        log: function () {}
    });


/**
 *
 * @public
 * @global
 * @type {object}
 * @namespace <%= namespace %>
 * @description Global application container.
 *
 */
<%= namespace %> = <%= schema %>;


/**
 *
 * @public
 * @member env
 * @memberof <%= namespace %>
 * @description Environment setting for application logging.
 *
 */ 
<%= namespace %>.env = "<%= env %>";


/**
 *
 * @public
 * @method log
 * @memberof <%= namespace %>
 * @param {arguments} args The arguments passed to `console.log`
 * @description Console log wrapper for application.
 *
 */
<%= namespace %>.log = function () {
    // Suppress logs if not on a `dev` environment
    if ( !/^dev/.test( <%= namespace %>.env ) ) {
        return;
    }

    <%= namespace %>.log.history.push( arguments );

    if ( context.console && context.console.log ) {
        console.log( [].slice.call( arguments, 0 ) );
    }
};


/**
 *
 * @public
 * @member history
 * @memberof <%= namespace %>.log
 * @desctiption Reverse chronological log history a la {@link http://www.paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/}
 *
 */
<%= namespace %>.log.history = [];


/**
 *
 * Expose to the global scope
 *
 */
context.<%= namespace %> = <%= namespace %>;


})( this );