grunt-nautilus
==============

> Build modular javascript applications that make sense

[ender]: http://ender.jit.su/
[compass]: http://compass-style.org
[grunt]: http://github.com/gruntjs/grunt
[grunt-ender]: https://github.com/endium/grunt-ender
[grunt-contrib-watch]: http://github.com/gruntjs/grunt-contrib-watch
[grunt-contrib-clean]: https://github.com/gruntjs/grunt-contrib-clean
[grunt-contrib-concat]: http://github.com/gruntjs/grunt-contrib-concat
[grunt-contrib-uglify]: http://github.com/gruntjs/grunt-contrib-uglify
[grunt-contrib-jshint]: http://github.com/gruntjs/grunt-contrib-jshint
[grunt-sails-linker]: https://github.com/Zolmeister/grunt-sails-linker
[grunt-contrib-compass]: http://github.com/gruntjs/grunt-contrib-compass
[es6-module-transpiler]: https://github.com/square/es6-module-transpiler
[grunt-init-gruntnautilus]: http://github.com/kitajchuk/grunt-init-gruntnautilus


## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin in one of two ways:

The recommended install is via the init template. Checkout [grunt-init-gruntnautilus][] for info on installing the template and how to use it. The other way is to simply install with npm and configure your Gruntfile:

```shell
npm install grunt-nautilus --save-dev
```
Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks( "grunt-nautilus" );
```




## Nautilus task
_Run this task with the `grunt nautilus` command._

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.


### Arguments
This plugin has some reserved task arguments. You can think of them as super-powered task configuration that you don't have to configure.

#### `nautilus:build`
For development sandbox modes this argument runs nautilus core without uglification.

#### `nautilus:deploy`
For real world environments, this argument runs nautilus core with uglification.

#### `nautilus:app[:args...]`
This argument creates new js files for you from starter templates using the es6 module syntax.


### Options

#### jsRoot
Type: `String`  
Default: `undefined`

Specifies the target js directory.

#### jsAppRoot
Type: `String`  
Default: `undefined`

Specifies the target app directory within the js root.

#### jsLibRoot
Type: `String`  
Default: `undefined`

Specifies the target lib directory within the js root.

#### jsDistRoot
Type: `String`  
Default: `undefined`

Specifies the target dist directory within the js root.

#### pubRoot
Type: `String`  
Default: `undefined`

Specifies the target public resources directory. Your js root is usually in this directory.

#### jsGlobals
Type: `Object`  
Default: `{app: true, console: true, module: true}`

Same as `jshint.options.globals`. Your globals will be merged with the defaults.

#### jsTemplate
Type: `Object`  
Default: `undefined`

Configuration for the `--expanded` flag to be used with `[grunt-sails-linker][]`.

#### main
Type: `Array`  
Default: `["app.js", "controllers/**/*.js"]`

Specifies target control js relative to `jsAppRoot`. Your dist files are compiled from these.

#### hintOn
Type: `Array`  
Default: `undefined`

A list of tasks that you would like js linting to occur on.

#### hintAt
Type: `Array`  
Default: `undefined`

A list of non-app files that you would like js linting to occur against.




### Usage examples

#### Using jsGlobals
```js
// Project configuration.
grunt.initConfig({
    nautilus: {
        options: {
            // Merged with jshint.options.globals.
            jsGlobals: {
                $: true,
                jQuery: true
            }
        }
    }
});
```

#### Using hintOn and hintAt
```js
// Project configuration.
grunt.initConfig({
    nautilus: {
        options: {
            // Tasks to be linted with jshint.
            hintOn: [
                "watch",
                "build",
                "deploy"
            ],
            
            // Files outside of app to be linted.
            // Typically you would only want to lint
            // your own, authored files. In case you
            // want to do otherwise, this is useful.
            hintAt: [
                "lib/plugins/**/*.js"
            ]
        }
    }
});
```

#### Using jsTemplate
This option allows you to bind a template to a dist js build. If the `--expanded` flag is present, [grunt-sails-linker][] will be used to write all scripts that make up your dist js as separate `<script>` elements to your template. Sometimes this can make javascript debugging easier than going through one giant, concatenated file in dev sandbox mode.
```js
// Project configuration.
grunt.initConfig({
    nautilus: {
        options: {
            // Bind your admin.js dist js to a template
            jsTemplate: {
                admin: "templates/admin/index.html"
            }
        }
    }
});
```
Without this option, you would have something like this in a template somewhere:
```html
<script src="/js/dist/application.js"></script>
```
Using this option along with the `--expanded` flag could output something like this:
```html
<!--SCRIPTS-->
<script src="/js/dist/application/app.js"></script>
<script src="/bower_components/jquery/jquery.js"></script>
<script src="/bower_components/angular/angular.js"></script>
<script src="/bower_components/angular-route/angular-route.js"></script>
<script src="/bower_components/angular-resource/angular-resource.js"></script>
<script src="/bower_components/angular-ui-router/release/angular-ui-router.js"></script>
<script src="/js/dist/application/app-docs-controllers.js"></script>
<script src="/js/dist/application/app-docs-application.js"></script>
<!--SCRIPTS END-->
```




## Authoring applications
This plugin uses the [es6-module-transpiler][] to parse es6 syntax within your application files. This means you get to write clean, modular applicational code that compiles into a full application object for the browser. I highly recommend checking out the documentation on [supported es6 syntax](https://github.com/square/es6-module-transpiler#supported-es6-module-syntax) for the module. This plugin supports all syntax the module supports but implements a custom compiled output. The `globals` output is used internally, however it undergoes extra parsing to output a clean application object to the global scope of the browser document.

Any application schema can be created using the `app` argument and passing it any number of additional arguments. The arguments are parsed into a directory path with the last argument being the module js file. A core application file will preceed all your modules in the dependency stack for dist js builds. This file creates the base global app that is used for the custom compiled output of your application. You can review that core file [here](https://github.com/kitajchuk/grunt-nautilus/blob/master/app/app.js).

### Example application module
To create a new `index` controller module for you application run the following:
```shell
grunt nautilus:app:controller:index
```
A new module controller will be generated for you at app/controllers/index.js within your jsRoot.
```js
/*!
 *
 * App Controller: controllers/index
 *
 * A nice description of what this controller does...
 *
 *
 */

var index = {
    init: function () {
        
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default = index;
```
Now run `grunt nautilus:build` and you're controller will compile to this:
```js
(function(window) {
  "use strict";
  /*!
   *
   * App Controller: controllers/index
   *
   * A nice description of what this controller does...
   *
   *
   */

  var index = {
      init: function () {
          
      }
  };


  /******************************************************************************
   * Export
  *******************************************************************************/
  window.app.controllers.index = index;
})(window);
```





### Release History
- 0.3.20 Last stable release
- 0.4.0  Current beta release