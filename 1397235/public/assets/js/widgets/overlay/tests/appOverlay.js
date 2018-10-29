/**
 * A view that uses the layout widget to render the overlay test pages
 *
 * @module Two vertical panels to render overlays
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */

define([
    'backbone',
    'widgets/layout/layoutWidget',
    'widgets/overlay/tests/views/widgetPanel',
    'es6!widgets/overlay/react/tests/view/reactPanel'
], function (Backbone, LayoutWidget, WidgetPanel, ReactPanel) {
    var OverlayLayout = Backbone.View.extend({

        initialize: function () {
            !this.options.pluginView && this.render();
        },

        render: function () {
            this.addLayout();
            return this;
        },

        addLayout: function () {
            var $layout = this.$el;
            this.layoutWidget = new LayoutWidget({
                container: $layout,
                panels: [{
                    type: 'row',
                    id: 'overlayPanels',
                    content: [{
                        id: "widgetPanel",
                        content: new WidgetPanel(),
                        width: 50,
                        isClosable: false,
                        isExpandable: false
                    }, {
                        id: "reactPanel",
                        content: new ReactPanel(),
                        width: 50,
                        isClosable: false,
                        isExpandable: false
                    }]
                }],
            }).build();
        }

    });

    return OverlayLayout;
});