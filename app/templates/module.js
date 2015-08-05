/**
 *
 * @public
 * @namespace <%= namespace %>
 * @memberof <%= memberof %>
 * @description A nice description of what this module does...
 *
 */
var <%= module %> = {
    /**
     *
     * @public
     * @method init
     * @memberof <%= namespace %>
     * @description Method runs once when window loads.
     *
     */
    init: function () {
        console.log( "<%= module %> initialized" );
    },


    /**
     *
     * @public
     * @method isActive
     * @memberof <%= namespace %>
     * @description Method informs PageController of active status.
     * @returns {boolean}
     *
     */
    isActive: function () {
        // return value
    },


    /**
     *
     * @public
     * @method onload
     * @memberof <%= namespace %>
     * @description Method performs onloading actions for this module.
     *
     */
    onload: function () {
        
    },


    /**
     *
     * @public
     * @method unload
     * @memberof <%= namespace %>
     * @description Method performs unloading actions for this module.
     *
     */
    unload: function () {
        this.teardown();
    },


    /**
     *
     * @public
     * @method teardown
     * @memberof <%= namespace %>
     * @description Method performs cleanup after this module. Remmoves events, null vars etc...
     *
     */
    teardown: function () {
        
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default <%= module %>;