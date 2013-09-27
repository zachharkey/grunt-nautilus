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
[example.Gruntfile.js]: https://github.com/kitajchuk/grunt-nautilus/blob/master/example.Gruntfile.js



## Philosophy

After working on so many projects as a UI Developer, both personally and at agencies, a lot of things have become apparent. First off, as developers we are always growing and changing. Secondly, we reiterate on the same patterns constantly. Not without revision to said patterns, but nonetheless we are always reusing them. At a certain point, when we think we have someting pretty good we find ourselves referencing the last project to start the next project. Some copy/paste maybe? I think so. Well, grunt-nautilus aims to resolve that issue as a tool that does this for you and can grow with you. It's not for everyone. Who is it for? I have some ideas:

- Developers that enjoy clean, modular Javascript
- Developers that need a tool to make their Javascript cleaner and more modular
- Developers that like to use [compass][] to author their css
- Developers that build websites, webapps and the like
- And a bonus for developers that like using [ender][]



## Installation

If you haven't already, initialize a new Gruntfile using the [grunt-init-gruntnautilus][] template. This will build what you need to start and you can run the following:

```
npm install
```

grunt-nautilus will install the following peer dependency packages:

- [grunt][]
- [grunt-contrib-concat][]
- [grunt-contrib-uglify][]
- [grunt-contrib-jshint][]
- [grunt-contrib-watch][]
- [grunt-contrib-compass][]

If you are using the [ender][] js library, an internal, modified version of [grunt-ender][] will be utilized to manage your ender builds.


## Gruntfile

A grunt-init-gruntnautilus Gruntfile with all potential options looks like the [example.Gruntfile.js][]. The `nautilus` object is pretty basic, just the stuff required to manage your build processes for Javascript and SASS files.



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
Level args: Either of the following, `core`, `feature` or `util`.	
Module arg: The name of your appjs module. Names with hyphens and underscores will be camel cased.

This executes the concat and compass tasks together with production/staging box settings.



## Builds

The files array used to generate your js builds uses this order:

- `vendor/**/*.js`
- `lib/**/*.js`
- `app.js`
- `app/util/**/*.js`
- `app/core/**/*.js`
- `app/feature/**/*.js`
- `app.site.js`



## App-js

The app-js model organizes your Javascript in the following manner:

- app/
	- app.js
	- app.site.js
	- core/
	- feature/
	- util/
		- app.util.log.js
- lib/
- vendor/

The files within the app directory are your application files that you will author. The files within the lib direcotry are usually third-party scripts that are either standalone or extensions of vendor scripts. For instance, a jQuery plugin. Lastly, the vendor scripts are for vendor libraries like jQuery or Ender.

### appjs task

The `appjs` task allows you to specify a new module for your Javascript application using either of the 3 available levels, `core, feature and util`. The `module` argument is used to name the module as it will exist on the global `app` object. The following describes how files will be generated for you:

```
# Creates app/feature/app.home.js
grunt appjs:feature:home

# Creates app/core/app.core.Class.js
grunt appjs:core:Class

# Creates app/util/app.util.async.js
grunt appjs:util:async
```

### appjs dependency building

By default, grunt-nautilus will look at all your feature scripts and compile each one individually with its dependencies. Using the `@deps` flag in the head comment of your app-js files allows all dependency files to be found. The compiled files are placed in the `dist` folder. For instance, the above home feature would be compiled with its dependencies and written as `js/dist/home.js`. This action hooks into the following tasks:

- `grunt build`
- `grunt deploy`
- `grunt watch`



## Release History
_(Nothing yet)_
