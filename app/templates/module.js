/*!
 *
 * App Module: <%= namespace %>/<%= module %>
 *
 * A nice description of what this module does...
 *
 *
 */
var <%= module %> = {
    init: function () {
        console.log( "<%= module %> initialized" );
    },


    isActive: function () {
        // return value
    },


    onload: function () {
        
    },


    unload: function () {
        this.teardown();
    },


    teardown: function () {
        
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default <%= module %>;