/*!
 *
 * Welcome to grunt-nautilus
 * https://github.com/kitajchuk/grunt-nautilus
 *
 * Copyright (c) 2013 Brandon Kitajchuk
 * Licensed under the MIT license.
 *
 *
 * Application Layout:
 * -----------------------------------------------------------------
 * Keep all your application files in the app dir in your js root.
 *      @example: static/js/app/yourmodules...
 *
 * Keep all your third party files in the lib dir in your js root.
 *      @example: static/js/lib/theirmodules...
 *
 *
 * Using Controllers:
 * -----------------------------------------------------------------
 * Controllers are how scripts are compiled and built,
 * that is to say they are the "control" files or starting points
 * for your applications. Controllers build into their own scripts
 * and can be included as such on your web pages.
 *      - @example: static/js/app/controllers/foo.js
 *      - This will compile to static/js/dist/foo.js
 *      - The compiled script will include all dependencies.
 *
 * Controllers assume an init method that can be called via app.exec().
 * A basic contoller template looks like this:
 * var fooController = {
 *       init: function () {
 *       
 *       }
 * };
 *
 * export default = fooController;
 *
 * In the compiled build this script will execute:
 * app.exec( "fooController" );
 *
 *
 * Using the ES6 syntax for modules:
 * -----------------------------------------------------------------
 * This plugin uses the es6-module-transpiler to parse es6 syntax
 * allowing you to write modular applications with layouts that
 * make sense. https://github.com/square/es6-module-transpiler.
 *
 * Importing Modules
 *      - @example: import { bar } from "app/foo/bar";
 *      - @example: import { baz as _baz } from "app/foo/baz";
 *      - @example: import $ from "lib/jquery";
 *
 * Exporting Modules
 *      - @example: export default = foo;
 *      - @example: export { foo };
 *      - @example: export { foo, bar, baz }
 *
 *
 */