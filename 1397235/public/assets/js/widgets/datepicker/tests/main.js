/**
 * The Datepicker test page.
 * @copyright Juniper Networks, Inc. 2014
 * @author vidushi gupta <vidushi@juniper.net>
 */

define([
    '/assets/js/widgets/baseWidgetTest.js',
], function (BaseWidgetTest) {

    var WidgetTest = function () {
        BaseWidgetTest.call(this);
        this.init(function () {
            // Renders a programmatic approach of datepicker
            require(['widgets/datepicker/tests/appTestProgrammatic'], function (DatepickerView) {
                new DatepickerView({});
            });
            // Renders a declarative approach of datepicker
            require(['widgets/datepicker/tests/appDatepicker'], function (DatepickerView) {
                new DatepickerView({
                    el: $("#main_content")
                });
            });
        });
    };
    WidgetTest.prototype = Object.create(BaseWidgetTest.prototype);
    WidgetTest.prototype.constructor = WidgetTest;

    new WidgetTest();

    return WidgetTest;
});