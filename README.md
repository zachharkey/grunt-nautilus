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
[example.Gruntfile.js]: https://github.com/kitajchuk/grunt-nautilus/blob/master/example.Gruntfile.js



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
- `app/util/**/*.js`
- `app/core/**/*.js`
- `app.js`

The controller builds stack like this:

- `vendor/**/*.js`
- `lib/**/*.js`
	- _Any modules matched in the controller dependencies will stack here_
- `controllers/yourcontroller`

_(Note: If the internal building blocks of Nautilus aren't quite enough for you, checkout the [buildin](#buildin) option below. It gives you all the extra build control you need.)_



## How App-Js Works
The `appjs` task allows you to specify a new module for your Javascript application using either of the 3 available levels, `core`, `util` and `controller`. Using templates, `.js` files are created for you in their respective locations. This keeps a uniform development style across the application and helps enforce the idea of modular application development. For more on how this setup works, checkout [app-js-util][].



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


### quiet

Type: `boolean`		
Default: `false`	
If set to true it suppresses logging that comes from Nautilus




## Task(s)

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
