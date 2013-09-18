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
	
	concat: function ( test ) {
		test.expect( 1 );
		
		var actual = grunt.file.read( "test/fixtures/js/dist-concat-scripts.js" );
		var expected = grunt.file.read( "test/expected/js/dist/scripts.js" );
		
		test.equal( actual, expected, "Should use grunt-contrib-concat to concatenate app-js files." );
		
		test.done();
	}
};
