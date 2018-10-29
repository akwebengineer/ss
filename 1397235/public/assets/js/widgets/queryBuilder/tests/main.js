/**
 * The Search test page.
 * @copyright Juniper Networks, Inc. 2014
 * @author Vidushi Gupta <vidushi@juniper.net>
 */

define([
    '/assets/js/widgets/baseWidgetTest.js',
], function (BaseWidgetTest) {

    var WidgetTest = function () {
        BaseWidgetTest.call(this);
        this.init(function () {
            // Renders a Search input using the menu defined in a configuration file
            require([ 'jqueryui', 'widgets/queryBuilder/tests/appSearch'], function (jqueryui, SearchView) {
                new SearchView({
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