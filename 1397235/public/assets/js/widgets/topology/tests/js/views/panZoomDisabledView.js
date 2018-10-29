/** TEST Module that defines the topology pan/zoom disabled example view
* @copyright Juniper Networks, Inc. 2017
*/
define([
    'backbone',
    'widgets/topology/topologyWidget',
    'widgets/topology/tests/conf/topologyConfiguration',
    'widgets/topology/tests/js/views/legendView',
    'text!widgets/topology/tests/templates/fsTopoLegendTemplate.html',
    'widgets/topology/lib/tree/treeDataStore'
], function (Backbone, Topology, topologyConfiguration, LegendView, legendTemplate, TreeDataStore) {
    var FileTopologyView = Backbone.View.extend({
        events: {},
        initialize: function () {
            var self = this;
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
                allowZoomAndPan: false,
                legend: legendTemplate
            };


            this.$el.on("slipstream.topology.node:click", function (evt, node) {
                console.info("Node " + node.id + "was clicked");
            });

            this.$el.on("slipstream.topology.link:click", function (evt, node) {
                console.info("Link " + node.id + "was clicked");
            });

            this.fileTopology =  Topology.getInstance(topologyConf, "tree");
            var result = this.fileTopology.build();
            console.info(this.fileTopology.confValidation);
            return this;
        }
    });

    return FileTopologyView;
});