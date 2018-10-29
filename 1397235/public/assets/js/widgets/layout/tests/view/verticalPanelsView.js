/**
 * A view that uses the layout widget to render a layout from a configuration object
 * The configuration contains the panels to render
 *
 * @module Two Vertical Panels Layout View
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([
    'backbone',
    'widgets/layout/layoutWidget',
    'widgets/layout/tests/view/simpleGridQuickView'
], function (Backbone, LayoutWidget, SimpleGridQuickView) {
    var LayoutView = Backbone.View.extend({

        render: function () {
            this.addLayout();
            return this;
        },

        addLayout: function () {
            console.log("two panel layout");
            var $layout = this.$el,
                self = this;
            this.simpleGridPanel = new SimpleGridQuickView({
                updatePanel: _.bind(self.addQuickView, self)
            });
            this.layoutWidget = new LayoutWidget({
                container: $layout,
                panels: [{
                    type: 'row',
                    id: 'verticalPanels',
                    content: [{
                        id: "simpleGridWithVerticalQuickView",
                        content: this.simpleGridPanel,
                        width: 60,
                        isClosable: false
                    }]
                }],
                events: {
                    onPanelClosed: _.bind(self.onPanelClosed, self)
                }
            }).build();
        },

        addQuickView: function (quickView) {
            this.layoutWidget.updatePanel({
                id: "quickView",
                width: 40,
                content: quickView,
                isExpandable: false
            });
        },

        onPanelClosed: function (panelId, panelView) {
            this.simpleGridPanel.removeQuickView();
            console.log(panelId);
        }

    });

    return LayoutView;
});