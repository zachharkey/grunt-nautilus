grunt-nautilus
==============

[compass]: http://compass-style.org
[grunt-init-gruntnautilus]: http://github.com/kitajchuk/grunt-init-gruntnautilus
[grunt]: http://github.com/gruntjs/grunt
[grunt-contrib-concat]: http://github.com/gruntjs/grunt-contrib-concat
[grunt-contrib-uglify]: http://github.com/gruntjs/grunt-contrib-uglify
[grunt-contrib-jshint]: http://github.com/gruntjs/grunt-contrib-jshint
[grunt-contrib-watch]: http://github.com/gruntjs/grunt-contrib-watch
[grunt-contrib-compass]: http://github.com/gruntjs/grunt-contrib-compass



## Philosophy

After working on so many projects as a UI Developer, both personally and at agencies, a lot of things have become apparent. First off, as developers we are always growing and changing. Secondly, we reiterate on the same patterns constantly. Not without revision to said patterns, but nonetheless we are always reusing them. At a certain point, when we think we have someting pretty good we find ourselves referencing the last project to start the next project. Some copy/paste maybe? I think so. Well, grunt-nautilus aims to resolve that issue as a tool that does this for you and can grow with you. It's not for everyone. Who is it for? The following:

- Developers that enjoy clean, modular Javascript
- Developers that need a tool to make their Javascript cleaner and more modular
- Developers that like to use [compass][] to author their css
- Developers that build websites, webapps and the like



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


## Gruntfile

Take a look at your Gruntfile, it looks something like this with variations based on your answers to the grunt-init-gruntnautilus prompts:

```js
module.exports = function ( grunt ) {
	
	
	// Default paths, change them as needed.
	var pubRoot = ".",
		jsRoot = "./js",
		jsBanner = grunt.file.read( "./js/banner.txt" ),
		appRoot = jsRoot+"/app",
		distRoot = jsRoot+"/dist",
		sassRoot = "./sass",
		cssRoot = "./css",
		fontsRoot = "./fonts",
		imgRoot = "./img";
		
	
	grunt.initConfig({
		// Project meta.
		meta: {
			version: "0.1.0"
		},
		
		
		// Nautilus config.
		nautilus: {
			gruntfile: "Gruntfile.js",
			jsRoot: jsRoot,
			jsAppRoot: appRoot,
			jsDistRoot: distRoot,
			jsBanner: jsBanner,
			jsLib: "undefined",
			compass: true,
			compassConfig: {
				development: {
					options: {
						cssDir: cssRoot,
						fontsDir: fontsRoot,
						httpPath: "/",
						imagesDir: imgRoot,
						javascriptsDir: jsRoot,
						outputStyle: "expanded",
						sassDir: sassRoot
					}
				},
				
				production: {
					options: {
						cssDir: cssRoot,
						fontsDir: fontsRoot,
						httpPath: "/",
						imagesDir: imgRoot,
						javascriptsDir: jsRoot,
						noLineComments: true,
						outputStyle: "compressed",
						sassDir: sassRoot
					}
				}
			}
		}
	});
	
	
	// Load the nautilus plugin.
	grunt.loadNpmTasks( "grunt-nautilus" );
	
	
};
```

The `nautilus` object is pretty basic, just the stuff required to manage your build processes for Javascript and SASS files.



## Usage

You interface with grunt-nautilus via the `nautilus` task. The following are available to you:

- `grunt nautilus:watch`
- `grunt nautilus:concat`
- `grunt nautilus:jshint`
- `grunt nautilus:uglify`
- `grunt nautilus:build`
- `grunt nautilus:deploy`
- `grunt nautilus:compass:[development, production]`
- `grunt nautilus:appjs:[core, feature, util]:[module]`

Most of these are pretty self explanatory, but lets cover the cool things some of them do. For instance, running the `build` task will compile compass and javascript for development environments. Using the `deploy` task will do the same but for production/staging environments.



## App-js

The app-js model organizes your Javascript in the following manner:

- app/
	- app.js
	- app.log.js
	- app.site.js
	- feature/
	- util/
- lib/
- vendor/

The files within the app directory are yours. The files within the lib direcotry are usually third-party scripts that are either standalone or extensions of vendor scripts. For instance, a jQuery plugin. Lastly, the vendor scripts are for vendor libraries or frameworks like jQuery or Ender. You get some default app setup so lets look at the 3 app-js files that are built out for you:

### app.js

```js
/*!
 *
 * App: Base
 *
 * Creates global {app}
 *
 *
 */
(function ( window, undefined ) {


"use strict";


// Our global, extendable app {Object}
var app = {};


/******************************************************************************
 * App extend method
*******************************************************************************/
app.extend = function ( o1, o2 ) {
	var prop,
		ret;
	
	if ( !o2 ) {
		for ( prop in o1 ) {
			app[ prop ] = o1[ prop ];
		}
		
		ret = app;
		
	} else {
		for ( prop in o2 ) {
			o1[ prop ] = o2[ prop ];
		}
		
		ret = o1;
	}
	
	return ret;
};


/******************************************************************************
 * App utility namespace
*******************************************************************************/
app.util = {};


/******************************************************************************
 * App support namespace
*******************************************************************************/
app.support = {};


/******************************************************************************
 * Expose global app {Object}
*******************************************************************************/
window.app = app;


})( window );
```
### app.log.js

```js
/*!
 *
 * App: Log
 *
 * Simple wrapper for console logging
 *
 * @core
 *
 *
 */
(function ( window, app, undefined ) {


"use strict";


/******************************************************************************
 * Console fallback
*******************************************************************************/
window.console = window.console || {};
window.console.log = window.console.log || function () {};


/******************************************************************************
 * App Extensions
*******************************************************************************/
app = app.extend({
	log: function () {
		var args = [].slice.call( arguments, 0 );
		
		if ( !args.length ) {
			args.push( app );
			
		} else {
			args.unshift( "[Appjs]:" );
		}
		
		console.log.apply( console, args );
	}
});


})( window, window.app );
```

### app.site.js

```js
/*!
 *
 * App: Site
 *
 * Sitewide tasks to be included in all script builds
 *
 * @deps: app
 *
 *
 */
(function ( window, app, undefined ) {


"use strict";


// Sandbox document
var document = window.document;


/******************************************************************************
 * App Extensions
*******************************************************************************/
// Start coding!


/******************************************************************************
 * Execution
*******************************************************************************/
// Start coding!


})( window, window.app );
```

### appjs task

The `appjs` task allows you to specify a new module for your Javascript application using either of the 3 available levels, `core, feature and util`. The `module` argument is used to name the module as it will exist on the global `app` object. If you were to run the following:

```
grunt nautilus:appjs:feature:home
```

You would get the following at `js/app/feature/app.home.js`:

```js
/*!
 *
 * App: home
 *
 * A nice description of what this script does...
 *
 * @deps: app, app.log
 *
 *
 */
(function ( window, app, undefined ) {


"use strict";


// Sandbox document
var document = window.document;


/******************************************************************************
 * App Extensions
*******************************************************************************/
app = app.extend({
	home: {
		init: function () {
			app.log( "Initialized app.home", app.home );
		}
	}
});


/******************************************************************************
 * Execution
*******************************************************************************/
app.home.init();


})( window, window.app );
```

### appjs dependency building

By default, grunt-nautilus will look at all your feature scripts and compile each one individually with its dependencies. Using the `@deps` flag in the head comment of your app-js files allows all dependency files to be found. The compiled files are placed in the `dist` folder. For instance, the above home feature would be compiled with its dependencies and written as `js/dist/home.js`. This action hooks into the following tasks:

- `grunt nautilus:build`
- `grunt nautilus:deploy`
- `grunt nautilus:watch`



## Release History
_(Nothing yet)_
