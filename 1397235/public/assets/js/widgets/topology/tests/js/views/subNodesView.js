/** TEST Module that defines the topology sub nodes example view
* @copyright Juniper Networks, Inc. 2017
*/
define([
    'backbone',
    'widgets/topology/topologyWidget',
    'widgets/topology/tests/conf/topologyConfiguration',
    'widgets/topology/lib/tree/treeDataStore'
], function (Backbone, Topology, topologyConfiguration, TreeDataStore) {
    var SubNodesTopologyView = Backbone.View.extend({
        events: {},
        initialize: function () {
            var self = this;
            this.render();
        },
        render: function () {

            var topoWidth = window.innerWidth - 100;
            var topoHeight = window.innerHeight - 100;
            // position, offsetX and offsetY provided by the app-side are only used for positioning node and link tooltips.
            // for node badges, these three parameters will be overridden by the widget
            var tooltipObj = {
                "onHover": this.tooltipCb,
                "position": "right",
                offsetX: 24,
                offsetY: -12
            };

            var topologyConf = {
                data: topologyConfiguration.subNodesTopologyData,
                icons: topologyConfiguration.subNodesTopologyIcons,
                mode: "view",
                collapseChildrenThreshold: 6,
                container: this.el,
                viewerDimensions: {
                    width: topoWidth,
                    height: topoHeight,
                },
                showArrowHead: false,
                allowChildrenCollapse: true,
                allowZoomAndPan: true,
                maxLabelSize: 18,
                tooltip: tooltipObj,
                nodeSpacing: {
                    horizontalGap: 250,
                    verticalGap: 60
                },
                subNode: {
                    badgeOnClick: this.subNodeBadgeClick
                }
            };

            this.$el.on("slipstream.topology.node:click", function (evt, node) {
                console.info(node.id + " was clicked");
            });

            this.subNodesTopology =  Topology.getInstance(topologyConf, "tree");
            var result = this.subNodesTopology.build();
            return this;
        },
        subNodeBadgeClick: function (node) {
            //return false if toggle of badge must be disallowed.
            if(node.subNodes && node.subNodes.length > 3) {
                return false;
            }
            return true; //return true by default.
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

            else if(elementType == 'NODE-BADGE') {
                if (elementObj.subNodes.length > 3) {
                    tooltip_data = "<span> This is a badge for " + elementObj.name + " <br/> (toggle is not allowed) </span>";
                } else {
                    tooltip_data = "<span> This is a badge for " + elementObj.name + "</span>";
                }
            } 

            renderTooltip(tooltip_data);
        }
    });

    return SubNodesTopologyView;
});