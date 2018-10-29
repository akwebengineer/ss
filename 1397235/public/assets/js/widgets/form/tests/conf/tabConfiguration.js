/**
 * A tab configuration object with the parameters required to build tabs on a tabContainer widget
 *
 * @module
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define([
    'widgets/tabContainer/tests/view/gridView',
    'widgets/tabContainer/tests/view/zonePolicyView',
    'widgets/tabContainer/tests/view/utmPolicyView',
    'widgets/grid/tests/view/nestedGridView'
], function (GridView, ZonePolicy, UTMPolicy, NestedGridView) {

    var tabConfiguration = {};

    tabConfiguration.withGrids = [{
        id:"simple",
        name: "Simple Grid",
        content: new GridView()
    },{
        id:"form1",
        name:"Form 1",
        content: new ZonePolicy()
    },{
        id:"form2",
        name:"Form 2",
        content: new UTMPolicy()
    },{
        id:"nested",
        name:"Nested Grid",
        content: new NestedGridView()
    }];

    return tabConfiguration;

});