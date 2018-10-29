/**
 * Line Chart Test Page.
 * @copyright Juniper Networks, Inc. 2016
 * @author Sujatha Subbarao <sujatha@juniper.net>
 */

define([
    '/assets/js/widgets/baseWidgetTest.js',
], function (BaseWidgetTest) {

    var WidgetTest = function () {
        BaseWidgetTest.call(this);
        this.init(function () {
            // Renders a lineChart widget from a configuration object
            require(['widgets/lineChart/tests/appLineChart'], function (LineChartView) {
                new LineChartView({
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