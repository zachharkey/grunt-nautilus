grunt-nautilus
==============

[compass]: http://compass-style.org
[ender]: http://ender.jit.su/
[grunt-init-gruntnautilus]: http://github.com/kitajchuk/grunt-init-gruntnautilus
[grunt]: http://github.com/gruntjs/grunt
[grunt-contrib]: https://github.com/gruntjs/grunt-contrib
[grunt-contrib-concat]: http://github.com/gruntjs/grunt-contrib-concat
[grunt-contrib-uglify]: http://github.com/gruntjs/grunt-contrib-uglify
[grunt-contrib-jshint]: http://github.com/gruntjs/grunt-contrib-jshint
[grunt-contrib-watch]: http://github.com/gruntjs/grunt-contrib-watch
[grunt-contrib-compass]: http://github.com/gruntjs/grunt-contrib-compass
[grunt-ender]: https://github.com/endium/grunt-ender
[app-js-util]: https://github.com/kitajchuk/app-js-util



Grunt Nautilus is a grunt plugin that greatly reduces the amount of configuration you need to do yourself when working on projects with grunt. Nautilus is built to wrap around and expose several of the most used [grunt-contrib][] plugins, including [grunt-contrib-compass][]. It even supports some non-contrib plugins that are useful such as [grunt-ender][]. In all, Nautilus exposes a handful of tasks that perform common interactions with these plugins. A few unique tasks are available with Nautilus that make it a bit more powerful.



## Installation

Getting setup with Nautilus is pretty easy. If you haven't already, initialize a new Gruntfile using the [grunt-init-gruntnautilus][] template. This will create Gruntfile.js and package.json. To install grunt-nautilus and its peer packages and initialize grunt-nautilus run the following:

```
# Installs packages
npm install

# The first grunt command execution initializes the grunt-nautilus setup
grunt
```



## How Builds Work

Two main build types exist with Nautilus and its integration with the [app-js-util][]. You will always get a generalized, global file compilation as `scripts.js`. From there, you will get individual controller compilations for every controller you define. This allows you to compartmentalize your code and load only what is necessary in certain instances.

The global scripts build stacks like this:

- `vendor/**/*.js`
- `lib/**/*.js`
- `app.js`
	- _Any modules matched in the app.js dependencies will stack here_

The controller builds stack like this:

- `vendor/**/*.js`
- `lib/**/*.js`
	- _Any modules matched in the controller dependencies will stack here_
- `controllers/yourcontroller`

_(Note: If the internal building blocks of Nautilus aren't quite enough for you, checkout the [buildIn](#buildIn) option below. It gives you all the extra build control you need.)_



## How the App Task Works
The `app` task allows you to specify a new module for your Javascript application using either of the 3 available levels, `core`, `util` and `controller`. Using templates, `.js` files are created for you in their respective locations. This keeps a uniform development style across the application and helps enforce the idea of modular application development. For more on how this setup works, checkout [app-js-util][].



## Options

### globalScripts

Type: `string`	
Default: `scripts`		
The name of your global scripts dist file.


### gruntFile

Type: `string`	
Default: `Gruntfile.js`		
The location of your Gruntfile (for jshint).


### jsRoot

Type: `string`	
Default: `./js`		
The path to your js root directory.


### jsAppRoot

Type: `string`	
Default: `./js/app`		
The path to your app-js root directory.


### jsDistRoot

Type: `string`	
Default: `./js/dist`	
The path where you want your js compiled.


### jsLib

Type: `string`	
Default: `undefined`	
The js library you are using, if any. Can be `jquery` or `ender`.


### buildIn

Type: `object`	
Default: `undefined`		
Option to merge extra scripts into specified builds. Example:
```js
// Named script file arrays to merge into nautilus build.
// Priority levels 0, 1, 2 and 3 determine merge position.
// 0: Before vendor
// 1: After vendor and before lib
// 2: After lib and before app
// 3: After app
buildin: {
	bower: {
		builds: ["scripts"],
		files: ["bower/jquery/jquery.js"],
		priority: 0
	}
}
```


### quiet

Type: `boolean`		
Default: `false`	
If set to true it suppresses logging that comes from Nautilus.



### jshintGlobals

Type: `object`		
Default: `undefined`	
Globals to merge with the globals setting for jshint.


### hintOn

Type: `array`		
Default: `undefined`	
Array of tasks that should run jshint. Can be default, watch, build or deploy.


### hintAt

Type: `array`		
Default: `undefined`	
Array of directories within jsRoot to be linted. Default is to only lint the app directory.


### ender

Type: `object`	
Default: `undefined`		
The grunt-ender config settings. See [grunt-ender][] for more on that.


### compass

Type: `object`	
The default for this is easiest just to show:	
```js
compass: {
	// Shared options.
	options: {
		// Will merge with environment options
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



## Tasks

You can interface with grunt-nautilus via the `nautilus` task. For your typing sanctity, all nautilus tasks are also provided as standalone tasks as well. The following tasks are provided:

### grunt / grunt build

Executes: `grunt nautilus:build`	
Uses: `grunt-contrib-concat`, `grunt-contrib-compass`

This executes the concat and compass tasks together with sandbox development settings.


### grunt deploy

Executes: `grunt nautilus:deploy`	
Uses: `grunt-contrib-uglify`, `grunt-contrib-compass`

This executes the concat and compass tasks together with production/staging box settings.


### grunt app

Executes: `grunt nautilus:app:[level]:[module]`	
Level args: Either of the following, `core`, `util` or `controller`.	
Module arg: The name of your appjs module. Names with hyphens and underscores will be camel cased.

This executes the concat and compass tasks together with production/staging box settings.


### grunt watch

Executes: `grunt watch`	
Uses: `grunt-contrib-watch`

This watches your sass and js files.


### grunt concat

Executes: `grunt concat`	
Uses: `grunt-contrib-concat`

This concatenates your js files without minifying them.


### grunt jshint

Executes: `grunt jshint`	
Uses: `grunt-contrib-jshint`

This lints your js files.


### grunt uglify

Executes: `grunt uglify`	
Uses: `grunt-contrib-uglify`

This combines and compiles your js files, minifying the result.


### grunt compass

Executes: `grunt compass:[environment]`	
Environment arg: Accepts `development` or `production` by default. You can configure as many as you like though.	
Uses: `grunt-contrib-compass`

This generates your css files from your sass files using Compass.


### grunt ender

Executes: `grunt ender`	
Uses: `grunt-ender`

This manages and generates your ender builds. See [grunt-ender][] for info on passing options for this.



## Peer Packages

grunt-nautilus will install the following peer dependency packages:

- [grunt][]
- [grunt-contrib-concat][]
- [grunt-contrib-uglify][]
- [grunt-contrib-jshint][]
- [grunt-contrib-watch][]
- [grunt-contrib-compass][]

If you are using the [ender][] js library, [grunt-ender][] will be utilized to manage your ender builds.



## Release History
_(Nothing yet)_
