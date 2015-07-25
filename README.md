grunt-nautilus
==============

> Build modular javascript applications and frameworks that make sense.



### Demo
- [grunt-nautilus-demo](http://grunt-nautilus.blkpdx.com/slides/)



## About
Grunt Nautilus is a tool to configure your Grunt config. This means you get to focus on making beautiful web apps, not setting them up.

It also manages a smart, micro client-side application structure for consistency in development across projects. You'll get Javascript and SASS management using contrib plugins. Nautilus uses [autoprefixer](https://github.com/postcss/autoprefixer-core) and [postcss](https://github.com/postcss/postcss) in conjunction with SASS for targeting browser support on your app.

Nautilus compiles your application into a single browser global: `app`. This scope houses all that you author for your app in a nice little package.



## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin in one of two ways:

The recommended install is via the init template. Checkout [grunt-init-gruntnautilus](http://github.com/kitajchuk/grunt-init-gruntnautilus) for info on installing the template and how to use it.




## Nautilus task
_Run this task with the `grunt nautilus` command._

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide. This is the recommended default task implementation and also what you'll see in your Gruntfile after using the init template:

```js
grunt.registerTask( "default", ["nautilus:build"] );
```


### Arguments
This plugin has some reserved task arguments. You can think of them as super-powered task configuration that you don't have to configure yourself.

#### `nautilus:build`
For development sandbox modes this argument runs nautilus core without concat and expanded css.  
Tasks: `jshint`, `jsdoc`, `concat`, `clean`, `sass`, `poscss`

#### `nautilus:deploy`
For real world environments, this argument runs nautilus core with uglification and compressed css. 
Tasks: `jshint`, `jsdoc`, `uglify`, `clean`, `sass`, `poscss`

#### `nautilus:module [, flags...]`
This argument creates a template module file for you to start from.


### Flags
There are a few optional flags available when working with grunt-nautilus.

#### --path
Type: `String`  
Default: `undefined`

This flag is used alongside the module argument to create new modules, `grunt nautilus:module --path foo/bar`. This makes a new module for you at `/path/to/your/app/foo/bar.js`.

#### --loud
Type: `Boolean`  
Default: `undefined`

Tell grunt-nautilus to log everything it is doing. This is handy for development when working on grunt-nautilus.

#### --env
Type: `String`  
Default: `undefined`

Tell grunt-nautilus to use this specified environment for executing `sass` on build and deploy.


### Options
These are the supported options for this plugin.

#### pubRoot
Type: `String`  
Default: `undefined`

Specifies the target public resources directory. Your js root is usually in this directory.

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

#### jsGlobals
Type: `Object`  
Default: ```js{app: true, console: true, module: true}```

Same as `jshint.options.globals`. Your globals will be merged with the defaults.

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

#### standAlone
Type: `Array`  
Default: `[]`

Add file names here, extension-less and relative to the app javascript directory, to be compiled to `dist` without the app object compiled on top of them.

#### browsers
Type: `String`  
Default: `"last 2 versions"`

Add the browser support you want autoprefixer-core to use.

#### jsdocs
Type: `Boolean`  
Default: `true`

Generate jsdocs for your application. Destination is to `docs` at the `jsRoot` directory.




### Usage examples
This is an example of what all nautilus options look like in context.
```js
grunt.initConfig({
    nautilus: {
        options: {
            pubRoot: "test/src",
            jsDistRoot: "test/out/js/dist",
            jsAppRoot: "test/src/js/app",
            jsLibRoot: "test/src/js/lib",
            jsRoot: "test/src/js",
            cssRoot: "test/out/css",
            sassRoot: "test/src/sass",
            jsGlobals: {
                Hammer: true,
                require: true
            },
            hintOn: [
                "watch",
                "build",
                "deploy"
            ],
            hintAt: [
                "lib/proper.js"
            ],
            standAlone: ["complex"],
            browsers: "last 3 versions",
            jsdocs: false
        }
    }
});
```



### Pull Requests
1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request