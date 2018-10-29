/**
 * The Time widget test page.
 * @author Jangul Aslam <jaslam@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    '/assets/js/widgets/baseWidgetTest.js',
], function (BaseWidgetTest) {

    var WidgetTest = function () {
        BaseWidgetTest.call(this);
        this.init(function () {
            // Renders a programmatic form and incorporates the elements of Time widget
            require(['widgets/time/tests/appTestProgrammatic'], function (TimeView) {
                new TimeView({});
            });

            // Renders a declarative form and incorporates the elements of Time widget
            require(['widgets/time/tests/appTime'], function (TimeView) {
                new TimeView({
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