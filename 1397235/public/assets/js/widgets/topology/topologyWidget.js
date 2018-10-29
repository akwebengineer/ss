/** Module that defines Topology Widget
* @copyright Juniper Networks, Inc. 2017
*/

define([ 'widgets/topology/visualizer/tree',
    'widgets/topology/visualizer/graph',
    'widgets/topology/visualizer/graphEditor',
    'widgets/topology/visualizer/chord',
    'widgets/topology/lib/constants'
], function (TreeTopology, GraphTopology_forceDirected, GraphTopology, ChordTopology, topologyConstants) {
    'use strict';
    var TopologyWidget = {
        getInstance: function(conf, type) {
            var topologyInstance;
            switch (type) {
                case topologyConstants.type.tree:
                    topologyInstance = new TreeTopology(conf);
                    break;
                case topologyConstants.type.graph:
                    topologyInstance = new GraphTopology(conf);
                    break;
                case topologyConstants.type.chord:
                    topologyInstance = new ChordTopology(conf);
                    break;
                case topologyConstants.type._graph:
                    topologyInstance = new GraphTopology_forceDirected(conf);
                    break;
                default:
                    topologyInstance = new GraphTopology(conf);
                    break;
            }
            return topologyInstance;         
        }
    };
    return TopologyWidget;
});