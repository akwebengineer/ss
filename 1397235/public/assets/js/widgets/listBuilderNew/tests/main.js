/**
 * The List Builder test page.
 * @copyright Juniper Networks, Inc. 2015
 * @author Eva Wang <iwang@juniper.net>
 */

define([
    '/assets/js/widgets/baseWidgetTest.js',
], function (BaseWidgetTest) {

    var WidgetTest = function () {
        BaseWidgetTest.call(this);
        this.init(function () {
            // Renders a list builder from the elements configuration file
            require(['widgets/listBuilderNew/tests/appListBuilderNew'], function (ListBuilderView) {
                new ListBuilderView({
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