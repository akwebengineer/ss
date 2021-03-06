/**
 * Progress Bar Test Page.
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '/assets/js/widgets/baseWidgetTest.js',
], function (BaseWidgetTest) {

    var WidgetTest = function () {
        BaseWidgetTest.call(this);
        this.init(function () {
            // Renders a progressBar widget from a configuration object
            require(['widgets/progressBar/tests/appProgressBar'], function (ProgressBarView) {
                new ProgressBarView({
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


