/**
 * A view that uses the layout widget to render a grid on a layout
 * The configuration contains the panels to render
 *
 * @module Two Vertical Panels Layout View
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([
    'backbone',
    'widgets/layout/layoutWidget',
    'widgets/grid/tests/view/simpleGrid_simplified',
    'widgets/grid/tests/view/listNestedGridView',
    'text!widgets/grid/tests/templates/simplifiedGridTitle.html'
], function(Backbone, LayoutWidget, SimpleGridSimplified, ListNestedGrid, SimplifiedGridTitle){
    var LayoutView = Backbone.View.extend({

        initialize: function () {
            this.addContainers();
            this.render();
        },

        render: function () {
            this.addLayout();
            return this;
        },

        addLayout: function () {
            var $layout = this.$layoutWrapperContainer,
                self = this;
            var simpleGridPanel =  new SimpleGridSimplified({
                updateRightPanel: _.bind(self.updateRightPanel, self),
                toggleMainPanel: _.bind(self.toggleMainPanel, self),
                destroyRightPanel: _.bind(self.destroyRightPanel, self)
            });
            this.layoutWidget = new LayoutWidget({
                container:  $layout,
                panels: [{
                    type: 'row',
                    id: 'verticalPanels',
                    content: [{
                        id:"simplifiedGridWithNestedGrid",
                        content: simpleGridPanel,
                        width: 60,
                        isClosable: false
                    }]
                }],
                events: {
                    onPanelClosed: this.onPanelClosed
                }
            }).build();
            this.toggleMainPanel(true); //maximize main panel
        },

        updateRightPanel: function () {
            this.layoutWidget.updatePanel({
                id:"nestedGrid",
                width: 40,
                content: new ListNestedGrid(),
                isExpandable: false
            }, undefined);
        },

        //status: false (default size), true (maximize, no controls)
        toggleMainPanel: function (status) {
            this.layoutWidget.toggleMaximizePanel("simplifiedGridWithNestedGrid", status);
        },

        destroyRightPanel: function () {
            this.layoutWidget.destroyPanel("nestedGrid");
        },

        onPanelClosed: function (panelId, panelView) {
            console.log(panelId);
        },

        addContainers: function () {
            this.$el.append(SimplifiedGridTitle);
            this.$layoutWrapperContainer = this.$el.find('.layout-test-wrapper');
        }

    });

    return LayoutView;
});