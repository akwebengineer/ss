/**
 * TimeSeries Chart Test Page.
 * @copyright Juniper Networks, Inc. 2015
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
 */

define([
    '/assets/js/widgets/baseWidgetTest.js',
], function (BaseWidgetTest) {

    var WidgetTest = function () {
        BaseWidgetTest.call(this);
        this.init(function () {
            // Renders a timeSeriesChart widget from a configuration object
            require(['widgets/timeSeriesChart/tests/appTSChart'], function (TimeSeriesChartView) {
                new TimeSeriesChartView({
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