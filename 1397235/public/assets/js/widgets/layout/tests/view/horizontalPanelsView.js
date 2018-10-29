/**
 * A view that uses the layout widget to render a layout from a configuration object
 * The configuration contains the panels to render
 *
 * @module Two Horizontal Panels Layout View
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([
    'backbone',
    'widgets/layout/layoutWidget',
    'widgets/layout/tests/view/simpleGridView',
    'widgets/layout/tests/view/smallGrid'
], function(Backbone, LayoutWidget, SimpleGridViewQuickView, SmallGrid){
    var TwoPanelsLayoutView = Backbone.View.extend({

        render: function () {
            this.addLayout();
            return this;
        },

        addLayout: function () {
            var $layout = this.$el,
                self = this;
            var simpleGridPanel =  new SimpleGridViewQuickView({
                updatePanel: _.bind(self.addQuickView, self),
                toggleMaximizePanel: _.bind(self.toggleMaximizePanel, self)
            });
            this.layoutWidget = new LayoutWidget({
                container:  $layout,
                panels: [{
                    type: 'column',
                    id: 'horizontalPanels',
                    content: [{
                        id:"simpleGridWithNewPanel",
                        content:simpleGridPanel,
                        height: 70,
                        isClosable: false,
                        isExpandable: false
                    },{
                        id:"smallGrid",
                        height: 30,
                        content: new SmallGrid(),
                        isExpandable: false
                    }]
                }],
                events: {
                    onPanelClosed: this.onPanelClosed
                }
            }).build();
        },

        addQuickView: function (QuickView) {
            this.layoutWidget.toggleMaximizePanel("simpleGridWithNewPanel", false);
            this.layoutWidget.updatePanel({
                id:"smallGrid",
                height: 30,
                content: QuickView,
                isExpandable: false
            });
        },

        onPanelClosed: function (panelId, panelView) {
            console.log(panelId);
            panelView.destroy();
        },

        toggleMaximizePanel: function (QuickView) {
            this.layoutWidget.toggleMaximizePanel("simpleGridWithNewPanel");
        }

    });

    return TwoPanelsLayoutView;
});