/**
 * The timeZone widget test page.
 * @author Jangul Aslam <jaslam@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    '/assets/js/widgets/baseWidgetTest.js',
], function (BaseWidgetTest) {

    var WidgetTest = function () {
        BaseWidgetTest.call(this);
        this.init(function () {
            // Renders a timeZone widget from a configuration object
            require(['widgets/timeZone/tests/appTimeZone'], function (TimeZoneView) {
                new TimeZoneView({
                    el: '#main_content'
                });
            });
        });
    };
    WidgetTest.prototype = Object.create(BaseWidgetTest.prototype);
    WidgetTest.prototype.constructor = WidgetTest;

    new WidgetTest();

    return WidgetTest;
});