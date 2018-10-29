/**
 * The Number Stepper Widget test page.
 * @copyright Juniper Networks, Inc. 2014
 * @author Swena Gupta <gswena@juniper.net>
 */

define([
    '/assets/js/widgets/baseWidgetTest.js',
], function (BaseWidgetTest) {

    var WidgetTest = function () {
        BaseWidgetTest.call(this);
        this.init(function () {
            // Renders a numberStepper widget from a configuration object
            require(['widgets/numberStepper/tests/appNumberStepper'], function (NumberStepperView) {
                new NumberStepperView({
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