/**
 * A view that uses the Tab Container Widget to render slider widget test pages divided by the slider widget and the slider component examples
 *
 * @module Slider-TabContainer View
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */

define([
    'backbone',
    'widgets/tabContainer/tabContainerWidget',
    'widgets/slider/tests/view/sliderWidgetView',
    'es6!widgets/slider/react/tests/view/sliderReactView'
], function(Backbone, TabContainerWidget, SliderWidgetView, SliderReactView){
    var SliderTabContainerView = Backbone.View.extend({

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
                id:"widgetPanel",
                name:"Widget",
                content: new SliderWidgetView()
            },{
                id:"reactPanel",
                name:"React",
                content: new SliderReactView()
            }];
        },

        close: function () {
            //required for activity, so the afterClose callback is invoked
        }

    });

    return SliderTabContainerView;
});