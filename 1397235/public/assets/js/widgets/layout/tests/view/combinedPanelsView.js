/**
 * A view that uses the layout widget to render a layout from a configuration object
 * The configuration contains the panels to render
 *
 * @module Three Panels Layout View
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([
    'backbone',
    'widgets/layout/layoutWidget',
    'widgets/layout/tests/view/simpleGridPanelQuickView',
    'widgets/layout/tests/view/smallGrid'
], function(Backbone, LayoutWidget, SimpleGridPanelQuickView, SmallGrid){
    var TwoPanelsLayoutView = Backbone.View.extend({

        render: function () {
            this.addLayout();
            return this;
        },

        addLayout: function () {
            var $layout = this.$el,
                self = this;
            var simpleGridPanel =  new SimpleGridPanelQuickView({
                updatePanel: _.bind(self.addSmallGridView, self),
                updateQuickView: _.bind(self.addQuickView, self)
            });
            this.layoutWidget = new LayoutWidget({
                container:  $layout,
                panels: [{
                    type: 'column',
                    id: 'horizontalPanels',
                    content: [{
                        id:"simpleGridWithDynamicVerticalQuickView",
                        type: 'row',
                        content: [{
                            id:"simpleGridPanel",
                            content:simpleGridPanel,
                            width: 60,
                            height: 70,
                            isClosable: false
                        }]
                    },{
                        id:"smallGrid",
                        height: 30,
                        content: new SmallGrid(),
                        isExpandable: false
                    }]
                }]
            }).build();
        },

        addSmallGridView: function () {
            this.layoutWidget.updatePanel({
                id:"smallGrid",
                height: 30,
                content: new SmallGrid(),
                isExpandable: false
            });
        },

        addQuickView: function (QuickView) {
            this.layoutWidget.updatePanel({
                id:"newPanel",
                width: 40,
                content: QuickView,
                isExpandable: false
            }, {
                parentId: "simpleGridWithDynamicVerticalQuickView"
            });
        }

    });

    return TwoPanelsLayoutView;
});