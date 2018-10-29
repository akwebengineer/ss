/**
 * The ShortWizard test page.
 * @copyright Juniper Networks, Inc. 2014
 * @author Dennis Park <dpark@juniper.net>
 */

define([
    '/assets/js/widgets/baseWidgetTest.js',
], function (BaseWidgetTest) {

    var WidgetTest = function () {
        BaseWidgetTest.call(this);
        this.init(function () {
            // Renders a shortWizard from a configuration file
            require(['widgets/shortWizard/tests/appShortWizard'], function (OverlayView) {
                var Overlay = new OverlayView({
                    "type": "large"
                });
            });
        });
    };
    WidgetTest.prototype = Object.create(BaseWidgetTest.prototype);
    WidgetTest.prototype.constructor = WidgetTest;

    new WidgetTest();

    return WidgetTest;
});