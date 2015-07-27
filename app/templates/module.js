/**
 *
 * @public
 * @namespace <%= globalName %>.<%= modulePath %>.<%= moduleName %>
 * @memberof <%= globalName %>.<%= modulePath %>
 * @description A nice description of what this module does...
 *
 */
var <%= moduleName %> = {
    /**
     *
     * @public
     * @method init
     * @memberof <%= globalName %>.<%= modulePath %>.<%= moduleName %>
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
     * @memberof <%= globalName %>.<%= modulePath %>.<%= moduleName %>
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
     * @memberof <%= globalName %>.<%= modulePath %>.<%= moduleName %>
     * @description Method performs onloading actions for this module.
     *
     */
    onload: function () {
        
    },


    /**
     *
     * @public
     * @method unload
     * @memberof <%= globalName %>.<%= modulePath %>.<%= moduleName %>
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
     * @memberof <%= globalName %>.<%= modulePath %>.<%= moduleName %>
     * @description Method performs cleanup after this module. Remmoves events, null vars etc...
     *
     */
    teardown: function () {
        
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default <%= moduleName %>;