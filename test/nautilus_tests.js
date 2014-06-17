"use strict";

var grunt = require( "grunt" );

/*
    ======== A Handy Little Nodeunit Reference ========
    https://github.com/caolan/nodeunit
    
    Test methods:
        test.expect(numAssertions)
        test.done()
    Test assertions:
        test.ok(value, [message])
        test.equal(actual, expected, [message])
        test.notEqual(actual, expected, [message])
        test.deepEqual(actual, expected, [message])
        test.notDeepEqual(actual, expected, [message])
        test.strictEqual(actual, expected, [message])
        test.notStrictEqual(actual, expected, [message])
        test.throws(block, [error], [message])
        test.doesNotThrow(block, [error], [message])
        test.ifError(value)
*/

exports.nautilus = {

    gruntNautilusTest: function ( test ) {
        var path = require( "path" );

        test.expect( 2 );
        test.ok( grunt.file.isFile( path.join( __dirname, "out/css/screen.css" ) ), "Grunt Nautilus compiled screen.css" );
        test.ok( grunt.file.isFile( path.join( __dirname, "out/js/dist/app.js" ) ), "Grunt Nautilus compiled app.js" );
        test.done();
    }

};
