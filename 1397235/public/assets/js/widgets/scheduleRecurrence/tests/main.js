/**
 * The Schedule Recurrence Widget test page.
 * @copyright Juniper Networks, Inc. 2015
 * @author Vignesh K.
 */

define([
    '/assets/js/widgets/baseWidgetTest.js',
], function (BaseWidgetTest) {

    var WidgetTest = function () {
        BaseWidgetTest.call(this);
        this.init(function () {
            // Renders a Schedule Recurrence widget from a configuration object
            require(['widgets/scheduleRecurrence/tests/appScheduleRecurrence'], function (ScheduleRecurrenceBuilderView) {
                new ScheduleRecurrenceBuilderView({
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
