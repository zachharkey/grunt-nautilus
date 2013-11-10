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
    
    compass_development: function ( test ) {
        test.expect( 1 );
        
        var actual = grunt.file.read( "test/fixtures/css/screen-development.css" );
        var expected = grunt.file.read( "test/expected/css/screen-development.css" );
        
        test.equal( actual, expected, "Should use grunt-contrib-compass to compile sass into css with development settings." );
        
        test.done();
    },
    
    compass_production: function ( test ) {
        test.expect( 1 );
        
        var actual = grunt.file.read( "test/fixtures/css/screen-production.css" );
        var expected = grunt.file.read( "test/expected/css/screen-production.css" );
        
        test.equal( actual, expected, "Should use grunt-contrib-compass to compile sass into css with production settings." );
        
        test.done();
    }
};
