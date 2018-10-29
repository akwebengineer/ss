/**
 * Donut Chart Test Page.
 * @copyright Juniper Networks, Inc. 2015
 * @author Sujatha Subbarao <sujatha@juniper.net>
 */


define([
    '/assets/js/widgets/baseWidgetTest.js',
], function (BaseWidgetTest) {

    var WidgetTest = function () {
        BaseWidgetTest.call(this);
        this.init(function () {
            // Renders a donutChart widget from a configuration object
            require(['widgets/donutChart/tests/appDonutChart'], function (DonutChartView) {
                new DonutChartView({
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