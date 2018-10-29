/** TEST Module that defines the topology example view
* @copyright Juniper Networks, Inc. 2017
*/
define([
    'backbone',
    'widgets/topology/topologyWidget',
    'widgets/topology/tests/conf/topologyConfiguration',
    'widgets/topology/tests/js/views/legendView',
    'text!widgets/topology/tests/templates/fsTopoLegendTemplate.html',
    'text!widgets/topology/tests/templates/dataStoreControlsTemplate.html',
    'widgets/topology/lib/tree/treeDataStore',
    'lib/template_renderer/template_renderer'
], function (Backbone, Topology, topologyConfiguration, LegendView, legendTemplate, dataStoreControlsTemplate, TreeDataStore, render_template) {
    var FileTopologyView = Backbone.View.extend({
        events: {
            'click .getdata': 'getData',
            'click .addnode': 'addNode',
            'click .updatenode': 'updateNode',
            'click .deletenode': 'deleteNode'
        },
        initialize: function () {
            this.render();
        },
        render: function () {

            var topoWidth = window.innerWidth - 100;
            var topoHeight = window.innerHeight - 100;

            var topologyConf = {
                data: topologyConfiguration.fileTopologyData,
                icons: topologyConfiguration.fileTopologyIcons,
                mode: "view",
                collapseChildrenThreshold: 6,
                container: this.el,
                viewerDimensions: {
                    width: topoWidth,
                    height: topoHeight,
                },
                showArrowHead: true,
                allowChildrenCollapse: true,
                allowZoomAndPan: true,
                // legend: new LegendView()
                legend: legendTemplate
            };


            this.$el.on("slipstream.topology.node:click", function (evt, node) {
                console.info("Node " + node.id + "was clicked");
                var selectedDataEl = $(this).find('.selectednode');
                selectedDataEl.val(JSON.stringify(node));
            });

            this.$el.on("slipstream.topology.link:click", function (evt, node) {
                console.info("Link " + node.id + "was clicked");
            });

            this.fileTopology =  Topology.getInstance(topologyConf, "tree");
            var result = this.fileTopology.build();
            console.info(this.fileTopology.confValidation);

            var $dataStoreControls = $(render_template(dataStoreControlsTemplate));
            this.$el.prepend($dataStoreControls);

            return this;
        },
        getData : function () {
            var nodeDataEl = this.$el.find('.nodedata');
            nodeDataEl.val(JSON.stringify(this.fileTopology.get()));
        },
        updateNode: function () {
            var selectedDataEl = this.$el.find('.selectednode'),
                node =  selectedDataEl.val().trim();
            if(!node) return;
            console.info("updateNode called from fsTopoView");
            this.fileTopology.updateNode(JSON.parse(node));
        },
        addNode: function () {
            var selectedDataEl = this.$el.find('.selectednode'),
                nodestr = selectedDataEl.val().trim();
            if(!nodestr) return;
            var node =  JSON.parse(nodestr);
            console.info("addNode called from fsTopoView");
            this.fileTopology.addNode(node.id, node.children);
        },
        deleteNode: function () {
            var selectedDataEl = this.$el.find('.selectednode'),
                nodestr = selectedDataEl.val().trim();
            if(!nodestr) return;
            var node =  JSON.parse(nodestr);
            console.info("deleteNode called from fsTopoView");
            this.fileTopology.removeNode(node.id);
        }
    });

    return FileTopologyView;
});