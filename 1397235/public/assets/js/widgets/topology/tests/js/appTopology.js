/**
 * A view that uses topology widget and renders test pages
 *
 * @module TopologyView
 * @copyright Juniper Networks, Inc. 2017
 */

define([
    'backbone',
    'widgets/topology/tests/js/views/fsTopoView',
    'widgets/topology/tests/js/views/tooltipTopologyView',
    'widgets/topology/tests/js/views/panZoomDisabledView',
    'widgets/topology/tests/js/views/subNodesView',
    'widgets/topology/tests/js/views/defaultStylesView',
    'widgets/topology/tests/js/views/dragNdropView',
    'widgets/topology/tests/js/views/ForceDirectedView',
    'widgets/topology/tests/js/views/GraphEditorView',
    'widgets/topology/tests/js/views/GraphEditorCustomView',
    'widgets/topology/tests/js/views/GraphEditorCustomNodeView',
    'widgets/topology/tests/js/views/GraphEditorWidgetsNodeView',
    'widgets/topology/tests/js/views/ChordView',
    'text!widgets/topology/tests/templates/topologyExamples.html',
    'lib/template_renderer/template_renderer',
    'react',
    'react-dom',
    'es6!widgets/topology/react/tests/view/topologyComponentView',
], function (Backbone, FileTopologyView, TooltipTopologyView, PanZoomDisabledView, SubNodesView, DefaultStylesView, DragNdropView, ForceDirectedView, GraphEditorView, GraphEditorCustomView, GraphEditorCustomNodeView, GraphEditorCustomWidgetView, ChordView, exampleTemplate, render_template, React, ReactDOM, TopologyComponentView) {
    var TopologyView = Backbone.View.extend({

        events: {
            'click .fs_topology a': function(){this.renderTopology(FileTopologyView)},
            'click .no_pan_zoom_topology a': function(){this.renderTopology(PanZoomDisabledView)},
            'click .tooltip_topology a': function(){this.renderTopology(TooltipTopologyView)},
            'click .default_topology a': function(){this.renderTopology(DefaultStylesView)},
            'click .subnodes_topology a': function(){this.renderTopology(SubNodesView)},
            'click .dragndrop_topology a': function(){this.renderTopology(DragNdropView)},
            'click .graph_layout_topology a': function(){this.renderTopology(GraphEditorView)},
            'click .graph_layout_custom_topology a': function(){this.renderTopology(GraphEditorCustomView)},
            'click .graph_layout_custom_node_topology a': function(){this.renderTopology(GraphEditorCustomNodeView)},
            'click .graph_layout_custom_widget_topology a': function(){this.renderTopology(GraphEditorCustomWidgetView)},
            'click .chord_layout_topology a': function(){this.renderTopology(ChordView)},
            'click .react_graph_layout_topology a': function(){this.renderReactTopology("graph")},
            'click .react_chord_layout_topology a': function(){this.renderReactTopology("chord")},
            'click .react_tree_layout_topology a': function(){this.renderReactTopology("tree")}
        },
        initialize: function(){
            this.addContent(this.$el, exampleTemplate);
        },
        renderTopology: function (TopologyView) {
            this.$el.find('.test_topology_widget').hide();
            new TopologyView({
                el: '#topology_demo'
            });
        },
        renderReactTopology: function (type) {
            this.$el.find('.test_topology_widget').hide();
            ReactDOM.render(React.createElement(TopologyComponentView, {type: type}) , document.getElementById('topology_demo'));
        },
        addContent:function($container, template) {
            $container.append((render_template(template)));

        }

    });

    return TopologyView;
});