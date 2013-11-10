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
    
    appjs_core_test: function ( test ) {
        test.expect( 1 );
        
        var actual = grunt.file.read( "test/fixtures/js/app-core.js" );
        var expected = grunt.file.read( "test/expected/js/app/core/app.core.test.js" );
        
        test.equal( actual, expected, "Should parse app-js core template into app-js core file." );
        
        test.done();
    },
    
    appjs_util_test: function ( test ) {
        test.expect( 1 );
        
        var actual = grunt.file.read( "test/fixtures/js/app-util.js" );
        var expected = grunt.file.read( "test/expected/js/app/util/app.util.test.js" );
        
        test.equal( actual, expected, "Should parse app-js util template into app-js util file." );
        
        test.done();
    },
    
    appjs_controller_test: function ( test ) {
        test.expect( 1 );
        
        var actual = grunt.file.read( "test/fixtures/js/app-controller.js" );
        var expected = grunt.file.read( "test/expected/js/app/controllers/app.controller.test.js" );
        
        test.equal( actual, expected, "Should parse app-js template into app-js file." );
        
        test.done();
    }
};
