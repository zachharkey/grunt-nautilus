!function(a,b){"use strict";var c={},d=[];c.core={},c.util={},c.controllers={},c.log=function(){var a=[].slice.call(arguments,0);a.length?a.unshift("[Appjs]:"):a.push(c),console.log.apply(console,a)},c.exec=function(a){var e=a;return a=c.controllers[a]?c.controllers[a]:c.core[a]?c.core[a]:c.util[a]?c.util[a]:b,-1!==d.indexOf(e)?c.log("Module "+e+" already executed! Backing out..."):a&&"function"==typeof a.init&&(a.init(),d.push(e)),a},a.console=a.console||{},a.console.log=a.console.log||function(){},"object"==typeof module&&module&&"object"==typeof module.exports?module.exports=c:a.app=c}(this),console.log("Buildin 0"),console.log("Buildin 1"),console.log("Buildin 2"),function(a,b){"use strict";a.document,b.util.test={},b.log("Util module",b.util.test)}(window,window.app),function(a,b){"use strict";a.document,b.core.test={},b.log("Core module",b.core.test)}(window,window.app),function(a,b){"use strict";a.document,b.core.execFeatures()}(window,window.app),console.log("Buildin 3");