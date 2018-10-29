/**
 * The layout widget test page.
 * @copyright Juniper Networks, Inc. 2016
 * @author Miriam Hadfield <mhadfield@juniper.net>
 */

define([
    '/assets/js/widgets/baseWidgetTest.js',
], function (BaseWidgetTest) {

    var WidgetTest = function () {
        BaseWidgetTest.call(this);
        this.init(function () {
            // Renders a Layout widget from a configuration object
            require(['widgets/layout/tests/appLayout'], function (TestLayoutView) {
                new TestLayoutView({
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