grunt-nautilus
==============

[compass]: http://compass-style.org
[ender]: http://ender.jit.su/
[grunt-init-gruntnautilus]: http://github.com/kitajchuk/grunt-init-gruntnautilus
[grunt]: http://github.com/gruntjs/grunt
[grunt-contrib-concat]: http://github.com/gruntjs/grunt-contrib-concat
[grunt-contrib-uglify]: http://github.com/gruntjs/grunt-contrib-uglify
[grunt-contrib-jshint]: http://github.com/gruntjs/grunt-contrib-jshint
[grunt-contrib-watch]: http://github.com/gruntjs/grunt-contrib-watch
[grunt-contrib-compass]: http://github.com/gruntjs/grunt-contrib-compass
[grunt-ender]: https://github.com/endium/grunt-ender
[app-js-util]: https://github.com/kitajchuk/app-js-util
[example.Gruntfile.js]: https://github.com/kitajchuk/grunt-nautilus/blob/master/example.Gruntfile.js



## Installation

If you haven't already, initialize a new Gruntfile using the [grunt-init-gruntnautilus][] template. This will create a Gruntfile and a package.json file. To install grunt-nautilus and its peer packages and initialize grunt-nautilus run the following:

```
# Installs packages
npm install

# Initializes grunt-nautilus' setup
grunt
```

_Note, however, that any grunt command at this point will run the grunt-nautilus initialization and exit_

### Gruntfile

A grunt-init-gruntnautilus Gruntfile looks similar to the [example.Gruntfile.js][].



## Options

### gruntfile

Type: `string`	
Default: `Gruntfile.js`		
The location of your Gruntfile


### jsRoot

Type: `string`	
Default: `./js`		
The path to your js root directory


### jsAppRoot

Type: `string`	
Default: `./js/app`		
The path to your app-js root directory


### jsDistRoot

Type: `string`	
Default: `./js/dist`	
The path where you want your js compiled


### jsLib

Type: `string`	
Default: `undefined`	
The js library you are using, if any. Can be `jquery` or `ender`


### jsAppRoot

Type: `string`	
Default: `./js/app`	
The path to your app-js root directory


### ender

Type: `object`	
Default: `undefined`		
The grunt-ender config settings. See [grunt-ender][] for more on that


### buildin

Type: `object`	
Default: `undefined`		
Option to merge extra scripts into the global scripts.js build. Example:
```js
// Named script file arrays to merge into nautilus build.
// Priority levels 0, 1, 2 and 3 determine merge position.
// 0: Before vendor
// 1: After vendor and before lib
// 2: After lib and before app
// 3: After app
buildin: {
	bower: {
		files: ["bower/jquery/jquery.js"],
		priority: 0
	}
}
```


### compass

Type: `object`	
The default for this is easiest just to show:	
```js
// Both dev and prod options will be merged with options
// and passed to grunt-contrib-compass correctly.
compass: {
	// Shared options.
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
	
	// Environment specific options.
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
}
```



## Nautilus task(s)

You can interface with grunt-nautilus via the `nautilus` task. For your typing sanctity, all nautilus tasks are also provided as standalone tasks as well. The following tasks are provided:

### grunt

Executes: `grunt nautilus:build`


### watch

Executes: `grunt nautilus:watch`	
Uses: `grunt-contrib-watch`

This watches your sass and js files.


### concat

Executes: `grunt nautilus:concat`	
Uses: `grunt-contrib-concat`

This concatenates your js files without minifying them.


### jshint

Executes: `grunt nautilus:jshint`	
Uses: `grunt-contrib-jshint`

This lints your js files.


### uglify

Executes: `grunt nautilus:uglify`	
Uses: `grunt-contrib-uglify`

This combines and compiles your js files, minifying the result.


### compass

Executes: `grunt nautilus:compass:[environment]`	
Environment arg: Accepts `development` or `production` by default. You can configure as many as you like though.	
Uses: `grunt-contrib-compass`

This generates your css files from your sass files using Compass.


### ender

Executes: `grunt nautilus:ender`	
Uses: `grunt-ender`

This manages and generates your ender builds. See [grunt-ender][] for info on passing options for this.


### build

Executes: `grunt nautilus:build`	
Uses: `grunt-contrib-concat`, `grunt-contrib-compass`

This executes the concat and compass tasks together with sandbox development settings.


### deploy

Executes: `grunt nautilus:deploy`	
Uses: `grunt-contrib-uglify`, `grunt-contrib-compass`

This executes the concat and compass tasks together with production/staging box settings.


### appjs

Executes: `grunt nautilus:appjs:[level]:[module]`	
Level args: Either of the following, `core`, `util` or `controller`.	
Module arg: The name of your appjs module. Names with hyphens and underscores will be camel cased.

This executes the concat and compass tasks together with production/staging box settings.



## Builds

There are two main files arrays utilized. One is a global `scripts.js`. For this one, any controller modules you may want included in the build need to be listed as dependencies in `app.js`. This array looks like this:

- `vendor/**/*.js`
- `lib/**/*.js`
- `app/util/**/*.js`
- `app/core/**/*.js`
	- _Any controller modules matched in app.js dependencies will stack here_
- `app.js`

The other builds are for the controller modules by name. Each controller module will compile with its dependencies to a file named the same as the module's name. For a module named `home` you would get this:

- `vendor/**/*.js`
- `lib/**/*.js`
	- _Any modules matched app.controller.home.js dependencies will stack here_
- `controllers/app.controller.home.js`



## App-Js Task

The `appjs` task allows you to specify a new module for your Javascript application using either of the 3 available levels, `core`, `util` and `controller`. The module argument is used to name the module as it will exist on the global `app` object. The following describes how files will be generated for you:

```
# Creates app/controllers/app.controller.home.js
grunt appjs:controller:home

# Creates app/core/app.core.Class.js
grunt appjs:core:Class

# Creates app/util/app.util.async.js
grunt appjs:util:async
```

_For more on how this setup works, checkout [app-js-util][]._



## Peer Packages

grunt-nautilus will install the following peer dependency packages:

- [grunt][]
- [grunt-contrib-concat][]
- [grunt-contrib-uglify][]
- [grunt-contrib-jshint][]
- [grunt-contrib-watch][]
- [grunt-contrib-compass][]

If you are using the [ender][] js library, an internal, modified version of [grunt-ender][] will be utilized to manage your ender builds.



## Release History
_(Nothing yet)_
