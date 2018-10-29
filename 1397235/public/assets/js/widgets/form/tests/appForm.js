/**
 * A view that uses the Tab Container Widget to render form widget test pages divided by the form widget and the form component examples
 *
 * @module Form-TabContainer View
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */

define([
    'backbone',
    'widgets/tabContainer/tabContainerWidget',
    'widgets/form/tests/view/formWidgetView',
    'es6!widgets/form/react/tests/view/formReactView'
], function (Backbone, TabContainerWidget, FormWidgetView, FormReactView) {

    var FormTabContainerView = Backbone.View.extend({

        initialize: function () {
            this.$el.addClass("slipstream-widget-test-page");
            !this.options.pluginView && this.render();
        },

        render: function () {
            new TabContainerWidget({
                "container": this.$el,
                "tabs": this.getTabs(),
                "height": "auto",
                "navigation": true
            }).build();
            return this;
        },

        getTabs: function () {
            return [{
                id: "widgetPanel",
                name: "Widget",
                content: new FormWidgetView()
            }, {
                id: "reactPanel",
                name: "React",
                content: new FormReactView()
            }];
        },

        close: function () {
            //required for activity, so the afterClose callback is invoked
        }

    });

    return FormTabContainerView;
});