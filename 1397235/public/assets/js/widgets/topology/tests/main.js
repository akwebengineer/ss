/**
 * Sample implementation for Logical Topology Widget - Tree.
 * @copyright Juniper Networks, Inc. 2017
 * 
 */

define([
    '/assets/js/widgets/baseWidgetTest.js',
], function (BaseWidgetTest) {

    var WidgetTest = function () {
        BaseWidgetTest.call(this);
        this.init(function () {
            // Renders a topology widget from a configuration object
            require(['widgets/topology/tests/js/appTopology'], function(TopologyView){
                new TopologyView({
                    el: $('#main_content')
                });
            });
        });
    };
    WidgetTest.prototype = Object.create(BaseWidgetTest.prototype);
    WidgetTest.prototype.constructor = WidgetTest;

    new WidgetTest();

    return WidgetTest;
});