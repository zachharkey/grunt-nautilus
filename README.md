grunt-nautilus
==============

> Build modular javascript applications and frameworks that make sense

[ender]: http://ender.jit.su/
[compass]: http://compass-style.org
[grunt]: http://github.com/gruntjs/grunt
[grunt-ender]: https://github.com/endium/grunt-ender
[grunt-contrib-watch]: http://github.com/gruntjs/grunt-contrib-watch
[grunt-contrib-clean]: https://github.com/gruntjs/grunt-contrib-clean
[grunt-contrib-concat]: http://github.com/gruntjs/grunt-contrib-concat
[grunt-contrib-uglify]: http://github.com/gruntjs/grunt-contrib-uglify
[grunt-contrib-jshint]: http://github.com/gruntjs/grunt-contrib-jshint
[grunt-contrib-compass]: http://github.com/gruntjs/grunt-contrib-compass
[es6-module-transpiler]: https://github.com/square/es6-module-transpiler
[grunt-init-gruntnautilus]: http://github.com/kitajchuk/grunt-init-gruntnautilus

### Built on grunt-nautilus
- [Nike Community](http://nike.com/community/) - Tagged  Version [0.3.20](https://github.com/kitajchuk/grunt-nautilus/releases/tag/v0.3.20)
- [WordsUp Communication](http://wordsupcommunication.com/) - Latest Version


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

### Peer dependencies
This plugin loads a handful of other grunt plugins as peer dependencies. If you're using this plugin, you won't need to load any of the following yourself:
 - [grunt-contrib-jshint][]
 - [grunt-contrib-concat][]
 - [grunt-contrib-uglify][]
 - [grunt-contrib-watch][]
 - [grunt-contrib-compass][]
 - [grunt-contrib-clean][]
 - [grunt-ender]



## Nautilus task
_Run this task with the `grunt nautilus` command._

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

This is the recommended default task implementation and also what you'll see in your Gruntfle if you used the init template:

```js
grunt.registerTask( "default", ["nautilus:build"] );
```


### Arguments
This plugin has some reserved task arguments. You can think of them as super-powered task configuration that you don't have to configure yourself. Some of the tasks executed by the `build` and `deploy` arguments are optional. For instance, if you don't have anything specified for the `hintOn` option, jshint will not run. Likewise, if you don't have grunt config specified for `compass` or `ender` those will not run as well. This is the nice thing about this plugin. It does a lot but not too much. If you configure for what it looks for, you don't have to do much yourself.

#### `nautilus:build`
For development sandbox modes this argument runs nautilus core without uglification.  
Tasks: `jshint`, `concat`, `clean`, `sails-linker`, `compass`, `ender`

#### `nautilus:deploy`
For real world environments, this argument runs nautilus core with uglification.  
Tasks: `jshint`, `uglify`, `clean`, `compass`, `ender`

#### `nautilus:module [, flags...]`
This argument creates templated module files for you using the es6 module syntax.

#### `nautilus:whitespace`
This argument uses the `whitespace` config settings to bulk clean trailing whitespace lines.


### Flags
There are a few optional flags available when working with grunt-nautilus.

#### --path
Type: `String`  
Default: `undefined`

This flag is used alongside the module argument to create new modules, `grunt nautilus:module --path foo/bar`. This makes a new module for you at `/path/to/your/app/foo/bar.js`.

#### --loud
Type: `Boolean`  
Default: `undefined`

Tell grunt-nautilus to log everything it is doing. This is handy for development of the plugin and for understanding how the plugin works from a user's perspective. But, ultimately, these logs will become cumbersome to see and you likely won't want this running all the time.

#### --env
Type: `String`  
Default: `undefined`

Tell grunt-nautilus to use this specified environment for executing `compass` on build and deploy. For example, if you prefer to use the environment `dev` over `development`, pass `grunt nautilus:build --env dev` or the equivalent `grunt nautilus:build --env=dev`.


### Options
These are the supported options for this plugin. It may be helpfull to glance over an example of a [Gruntfile with all available options and configuration specified](#example-gruntfile-with-all-specified-options-and-configuration) to get an idea of what all you can let grunt-nautilus handle for you.

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
Default: ```js{app: true, console: true, module: true}```

Same as `jshint.options.globals`. Your globals will be merged with the defaults.

#### jsTemplate
Type: `Object`  
Default: `undefined`

Configuration to be used with [grunt-sails-linker][].

#### main
Type: `Array`  
Default: ```js["app.js", "controllers/**/*.js"]```

Specifies target control js relative to `jsAppRoot`. Your dist files are compiled from these.

#### hintOn
Type: `Array`  
Default: `undefined`

A list of tasks that you would like js linting to occur on.

#### hintAt
Type: `Array`  
Default: `undefined`

A list of non-app files that you would like js linting to occur against.

#### whitespace
Type: `Object`  
Default: `undefined`

Set this with `files` array and `watch` flag properties if you would like trailing whitespace cleaned. The `files` property should be an array and supports standard Grunt globbing patterns.




### Usage examples

#### Using jsGlobals
The jsGlobals option is an object that will be merged with jshint.options.globals.
```js
grunt.initConfig({
    nautilus: {
        options: {
            jsGlobals: {
                $: true,
                jQuery: true
            }
        }
    }
});
```

#### Using hintOn and hintAt
The hintOn option specifies tasks you want linting to run on. The hintAt option specifies files outside of your authored app you want to be linted.
```js
grunt.initConfig({
    nautilus: {
        options: {
            hintOn: [
                "watch",
                "build",
                "deploy"
            ],
            hintAt: [
                "lib/plugins/**/*.js"
            ]
        }
    }
});
```

### Example Gruntfile with ALL specified options and configuration
This is a helpful example of all the options and configuration grunt-nautilus will work with. The `compass` and `ender` config is totally optional. If present though, grunt-nautilus will execute `compass:development` on the build task and `compass:production` on the deploy task. Optionally, you can pass a `--env` flag with a value to override what compass environment is called. If the ender config is present than grunt-nautilus will execute your ender build on every build/deploy task execution ensuring your dist js is always up to date with your latest ender config.
```js
module.exports = function ( grunt ) {
    var pubRoot = ".",
        sassRoot = "./sass",
        cssRoot = "./css",
        fontsRoot = "./fonts",
        imgRoot = "./img",
        jsRoot = "./js",
        appRoot = jsRoot+"/app",
        libRoot = jsRoot+"/lib",
        distRoot = jsRoot+"/dist";
        
    grunt.initConfig({
        // Nautilus config.
        nautilus: {
            options: {
                hintAt: [],
                hintOn: [
                    "watch",
                    "build",
                    "deploy"
                ],
                jsAppRoot: appRoot,
                jsDistRoot: distRoot,
                jsGlobals: {
                    $: true,
                    ender: true
                },
                jsLibRoot: libRoot,
                jsRoot: jsRoot,
                jsTemplate: {
                    myApp: "index.html"
                },
                main: [
                    "myApp.js"
                ],
                pubRoot: pubRoot
            }
        },
        // Compass config. ( optional )
        compass: {
            options: {
                cssDir: cssRoot,
                fontsDir: fontsRoot,
                force: true,
                httpPath: "/",
                imagesDir: imgRoot,
                javascriptsDir: jsRoot,
                noLineComments: true,
                sassDir: sassRoot
            },
            development: {
                options: {
                    environment: "development",
                    outputStyle: "expanded"
                }
            },
            production: {
                options: {
                    environment: "production",
                    outputStyle: "compressed"
                }
            }
        },
        // Ender config. ( optional )
        ender: {
            options: {
                output: libRoot+"/ender/ender",
                dependencies: ["jeesh"]
            }
        }
    });
    
    grunt.loadNpmTasks( "grunt-nautilus" );
    
    grunt.registerTask( "default", ["nautilus:build"] );
};
```




## Authoring applications
This plugin uses the [es6-module-transpiler][] to parse es6 syntax within your application files. This means you get to write clean, modular applicational code that compiles into a full application object for the browser. I highly recommend checking out the documentation on [supported es6 syntax](https://github.com/square/es6-module-transpiler#supported-es6-module-syntax) for the module. This plugin supports all syntax the module supports but implements a custom compiled output. The `globals` output is used internally, however it undergoes extra parsing to output a clean application object to the global scope of the browser document.

Any application schema can be created using the `app` argument and passing it any number of additional arguments. The arguments are parsed into a directory path with the last argument being the module js file. A core application file will preceed all your modules in the dependency stack for dist js builds. This file creates the base global app that is used for the custom compiled output of your application. You can review that core file [here](https://github.com/kitajchuk/grunt-nautilus/blob/master/app/app.js).

Module import paths will be relative to your `jsRoot` option:
 - `import { baz } from "app/foo/bar/baz";`
 - `import "lib/ender/ender";`

In terms of looking up module imports, grunt-nautilus will look in the following places: `jsAppRoot`, `jsRoot`, `pubRoot` and lastly from the `Gruntfile` location. This should be more than enough in terms of application organization in conjunction with using third party package managers like npm or bower. When using third party imports that don't utilize the es6 export syntax, grunt-nautilus will try to find a global to match it to. A config of popular js libs is maintained internally to try to do this. If your import is not found there, the `jsGlobals` option will be referenced. If no match is found, the import will be assumed global and included in the dist stack but not sandboxed into the current modules closure.

### Example application module
To create a new `index` controller module for you application run the following:
```shell
grunt nautilus:app:controller:index
```
A new module controller will be generated for you at app/controllers/index.js within your jsRoot.
```js
var index = {
    init: function () {
        
    }
};

export default = index;
```
Now run `grunt nautilus:build` and you're controller will compile to this:
```js
(function( window, document, undefined ) {
  "use strict";
  
  var index = {
      init: function () {
          
      }
  };

  window.app.controllers.index = index;
})( window, window.document );
```
Now add an import, say you're managing your jQuery build with bower:
```js
import "bower_components/jquery/jquery";

var index = {
    init: function () {
        
    }
};

export default = index;
```
Which will compile to the following, sandboxing jQuery as $ into your closure for this module and ensuring jQuery is compiled into your dist js above your module in the stack:
```js
(function( window, document, $, undefined ) {
  "use strict";
  
  var index = {
      init: function () {
          
      }
  };

  window.app.controllers.index = index;
})( window, window.document, window.jQuery );
```

### Assigning modules to variables
You can directly assign a module to a variable for use in your application. This syntax would assume the baz module is an object with properties that can be individually imported:
```js
import { bot } from "app/foo/bar/baz";

var index = {
    init: function () {
        
    }
};

export default = index;
```
This will compile to the following:
```js
(function( window, document, baz, undefined ) {
  "use strict";
  
  var bot = baz.bot;
  
  var index = {
      init: function () {
          
      }
  };

  window.app.controllers.index = index;
})( window, window.document, window.app.foo.bar.baz );
```
To put this in context, the baz module may look something like this:
```js
var bot = "bot";
var bat = "bat";

export { bot, bat };
```

### Assuming the global app
Alternatively, the global `app` object is assumed for you application and you can do plain imports and reference modules in a global scope manner as well:
```js
import "app/foo/bar/baz";

var index = {
    init: function () {
        console.log( app.foo.bar.baz );
    }
};

export default = index;
```
This is a nice way to import third party scripts like jQuery or ender where you would want the sandboxed `$` as opposed to a variable assigned `$`.




## Release History
- 0.3.20 Stable early release
- 0.4.0  Beta es6-module-transpiler release
- 0.4.7  Stable es6-module-transpiler release