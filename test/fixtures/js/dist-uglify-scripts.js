!function(a){"use strict";var b={};b.extend=function(a,c){var d,e;if(c){for(d in c)a[d]=c[d];e=a}else{for(d in a)b[d]=a[d];e=b}return e},b.util={},b.support={},a.app=b}(window),function(a,b){"use strict";a.console=a.console||{},a.console.log=a.console.log||function(){},b=b.extend({log:function(){var a=[].slice.call(arguments,0);a.length?a.unshift("[Appjs]:"):a.push(b),console.log.apply(console,a)}})}(window,window.app),function(a){"use strict";a.document}(window,window.app),function(a,b){"use strict";a.document,b=b.extend({test:{init:function(){b.log("Initialized app.test",b.test)}}}),b.test.init()}(window,window.app),function(a,b){"use strict";a.document,b=b.extend({test:{init:function(){b.log("Initialized app.test",b.test)}}}),b.test.init()}(window,window.app),function(a,b){"use strict";a.document,b.util=b.extend(b.util,{test:{}}),b.log("app.util.test: ",b.util.test)}(window,window.app);