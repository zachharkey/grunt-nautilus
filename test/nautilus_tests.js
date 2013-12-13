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
    
    app_module_test: function ( test ) {
        test.expect( 1 );
        
        var actual = grunt.file.read( "test/fixtures/js/sonata.js" );
        var expected = grunt.file.read( "test/expected/js/app/sonata.js" );
        
        test.equal( actual, expected, "Should parse app module into named .js file" );
        
        test.done();
    },
    
    app_controller_test: function ( test ) {
        test.expect( 1 );
        
        var actual = grunt.file.read( "test/fixtures/js/fractal.js" );
        var expected = grunt.file.read( "test/expected/js/app/controllers/fractal.js" );
        
        test.equal( actual, expected, "Should parse app controller into named .js file" );
        
        test.done();
    },
    
    build_test: function ( test ) {
        test.expect( 1 );
        
        var actual = grunt.file.read( "test/fixtures/js/dist/fractal.js" );
        var expected = grunt.file.read( "test/expected/js/dist/fractal.js" );
        
        test.equal( actual, expected, "Should compile js using concat and es6-module-transpiler" );
        
        test.done();
    },
    
    deploy_test: function ( test ) {
        test.expect( 1 );
        
        var actual = grunt.file.read( "test/fixtures/js/dist/sonata.js" );
        var expected = grunt.file.read( "test/expected/js/dist/sonata.js" );
        
        test.equal( actual, expected, "Should compile js using uglify and es6-module-transpiler" );
        
        test.done();
    }
};
