/**
 * Require JS main module for inclusion in landing page
 * 
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    '/assets/js/widgets/baseWidgetTest.js',
], function (BaseWidgetTest) {

    var WidgetTest = function () {
        BaseWidgetTest.call(this);
        this.init(function () {
            // Renders a confirmationDialog widget
            require(['widgets/confirmationDialog/tests/appConfirmationDialog'], function (TestConfirmationDialogView) {
                new TestConfirmationDialogView({
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