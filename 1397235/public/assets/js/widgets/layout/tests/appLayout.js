/**
 * A view that uses the navigatioin of the tab container widget to render layouts from a configuration object
 * The configuration object contains the tabs name, the tabs content and other parameters required to build the widget.
 *
 * @module Navigation-Layout View
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([
    'backbone',
    'widgets/tabContainer/tabContainerWidget',
    'widgets/layout/tests/view/horizontalPanelsView',
    'widgets/layout/tests/view/verticalPanelsView',
    'widgets/layout/tests/view/combinedPanelsView',
    'text!widgets/layout/tests/templates/layoutExample.html',
    'lib/template_renderer/template_renderer'
], function(Backbone, TabContainerWidget, HorizontalPanelsView, VerticalPanelsView, CombinedPanelsView, example, render_template){
    var LayoutView = Backbone.View.extend({

        initialize: function () {
            this.addContent(this.$el, example);
            this.setTabItems();
            !this.options.pluginView && this.render();
        },

        render: function () {
            var $navigationContainer = this.$el.find('.layout-test');
            new TabContainerWidget({
                "container": $navigationContainer,
                "tabs": this.tabs,
                "height": "auto",
                "navigation": true
            }).build();
            return this;
        },

        setTabItems: function () {
            this.tabs = [{
                id:"HorizontalPanels",
                name:"Horizontal Panels",
                content: new HorizontalPanelsView()
            },{
                id:"VerticalPanels",
                name:"Vertical Panels",
                content: new VerticalPanelsView()
            },{
                id:"CombinedPanels",
                name:"Combined Panels",
                content: new CombinedPanelsView()
            }];
        },

        addContent:function($container, template) {
            this.$el.closest("body").addClass("slipstream-layout-widget-test-page");
            $container.append((render_template(template)));
        }

    });

    return LayoutView;
});