/**
 * The card layout widget test page
 * @copyright Juniper Networks, Inc. 2017
 * @author Miriam Hadfield <mhadfield@juniper.net>
 */

define([
    '/assets/js/widgets/baseWidgetTest.js',
], function (BaseWidgetTest) {

    var WidgetTest = function () {
        BaseWidgetTest.call(this);
        this.init(function () {
            // Renders a card layout widget from a configuration object
            require(['widgets/cardLayout/tests/appCardLayout'], function (TestCardLayoutView) {
                new TestCardLayoutView({
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
