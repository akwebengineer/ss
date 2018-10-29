/** Module that defines the constants used by Topology Widget
* @copyright Juniper Networks, Inc. 2017
*/

define([], function () {
    'use strict';
    var constants = {
        type:{
            tree: "tree",
            graph: "graph",
            chord: "chord",
            _graph: "_graph"
        },
        exceptions: {
            noContainerError: "No container was provided",
            noDataError: "No data was provided",
            unknownChordContext: "Chord context is unknown."
        },
        events: {
            zoomIn: "topology-zoom-in",
            zoomOut: "topology-zoom-out",
            internalEventOver: "topology-over",
            viewRenderComplete: "topology-render-complete",
            legendCollapse: "slipstream.topology.legend:collapse",
            legendExpand: "slipstream.topology.legend:expand",
            nodeClick: "slipstream.topology.node:click",
            nodeMouseOver: "slipstream.topology.node:mouseOver",
            nodeMouseOut: "slipstream.topology.node:mouseOut",
            nodeDragStop: "slipstream.topology.node:dragStop",
            addOnClick: "slipstream.topology.addOn:click",
            linkClick: "slipstream.topology.link:click",
            LinkMouseOver: "slipstream.topology.link:mouseOver",
            LinkMouseOut: "slipstream.topology.link:mouseOut",
            linkIconClick: "slipstream.topology.link.icon:click",
            LinkIconMouseOver: "slipstream.topology.link.icon:mouseOver",
            LinkIconMouseOut: "slipstream.topology.link.icon:mouseOut",
            addLink: "slipstream.topology.link:add",
            removeLink: "slipstream.topology.link:remove",
            moveLink: "slipstream.topology.link:move",
            over: "slipstream.topology.over",
            drop: "slipstream.topology.drop"
        }
    };
    return constants;
});