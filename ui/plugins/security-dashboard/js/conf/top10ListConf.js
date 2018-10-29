/**
 * A configuration object used to configure the top applications grid nested in a dashlet.
 *
 * @module top10ListDashlet
 * @author Dennis Park <dpark@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([ ], function () {
    var config = {};
    config.top10ListDashlet = {
        "getData" : function(){},
        "height" : '200px',
        "multiselect": false,      
        "showWidthAsPercentage" : false,
        "footer"				: false
    };
    return config;
});
