/**
 * Bar Chart Test Page.
 * @copyright Juniper Networks, Inc. 2014
 * @author Sujatha Subbarao <sujatha@juniper.net>
 */

define([
    '/assets/js/widgets/baseWidgetTest.js',
], function (BaseWidgetTest) {

    var WidgetTest = function () {
        BaseWidgetTest.call(this);
        this.init(function () {
            // Renders a barChart widget from a configuration object
            require(['widgets/barChart/tests/appBarChart'], function (BarChartView) {
                new BarChartView({
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
