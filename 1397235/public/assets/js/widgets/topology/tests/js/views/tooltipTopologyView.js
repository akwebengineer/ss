/** TEST Module that defines the topology example view
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
    var TooltipTopologyView = Backbone.View.extend({
        events: {},
        initialize: function () {
            this.render();
        },
        render: function () {

            var topoWidth = window.innerWidth - 100;
            var topoHeight = window.innerHeight - 100;

            var tooltipObj = {
                "onHover": this.tooltipCb
            };

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
                legend: legendTemplate,
                tooltip: tooltipObj
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
        },

        tooltipCb: function (elementType, elementObj, renderTooltip){
            var tooltip_data;
            if(elementType == 'LINK') {
                tooltip_data = "<a> this is <br/> link template </a>";
            }

            else if(elementObj.childrenState == "collapsed") {
                tooltip_data = "Please click here to expand";
            }
             
            else if(elementType == 'NODE') {
                tooltip_data = "<span style='color:red'> Name: " + elementObj.name + "<br/><span> <span style='color: green'> Type: "+ elementObj.type + "</span>";
            } 

            renderTooltip(tooltip_data);
        }
    });

    return TooltipTopologyView;
});