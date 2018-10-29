/**
 * Utility to position nodes and links in a hierarchical layout
 *
 * @module HierarchicalLayout
 * @author Viswesh Subramanian <vissubra@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */

define(['dagre'], function (dagre) {

    /**
     * Provides positions for nodes
     * @param {Object} conf
     * @constructor
     */
    var HierarchicalLayout = function (conf) {

        var directedGraphConf = {
                nodesep: 100,
                edgesep: 60,
                ranksep: 100,
                marginx: 50,
                marginy: 50,
                ranker: "longest-path"
            },
            self = this,
            dg = new dagre.graphlib.Graph();

        dg.setGraph(directedGraphConf);
        dg.setDefaultEdgeLabel(function () {
            return {};
        });

        /**
         * Sets node on dagre
         * @param {Object} $nodeEl - node element
         */
        this.setNode = function ($nodeEl) {
            var options = {
                width: Math.round($nodeEl.outerWidth()),
                height: Math.round($nodeEl.outerHeight())
            };
            dg.setNode($nodeEl.attr('data-id'), options);
        };

        /**
         * Removes node and its related links from dagre
         * @param {Object} $nodeEl - node element
         */
        this.removeNode = function ($nodeEl) {
            var id = $nodeEl.attr('data-id'),
                edges = dg.nodeEdges();

            //Remove edges related to node
            _.each(edges, function (edge) {
                self.removeEdge({
                    source: edge.v,
                    target: edge.w
                });
            });
            dg.removeNode(id);
        };

        /**
         * Sets link on dagre
         * @param {Object} link
         */
        this.setEdge = function (link) {
            dg.setEdge(link.source, link.target);
        };

        /**
         * Removes link from dagre
         * @param {Object} link
         */
        this.removeEdge = function (link) {
            dg.removeEdge(link.source, link.target);
        };

        /**
         * Returns node positions
         * @param {options} Object - options object
         * @returns {Array} returns positions for all nodes.
         */
        this.getNodePositions = function (options) {
            if (options) {
                var graph = dg.graph();
                graph.rankdir = options.orientation && (["TB", "BT", "LR", "RL"].indexOf(options.orientation) > -1) ? options.orientation : graph.rankdir;
                graph.ranksep = options.nodeSpacing && options.nodeSpacing.value && _.isNumber(options.nodeSpacing.value) ? options.nodeSpacing.value : graph.ranksep;
                dg.setGraph(graph);
            }

            dagre.layout(dg);

            var data = conf.dataStore.get();

            return data.nodes.map(function (node) {
                var dagreNode = dg.node(node.id);

                return {
                    id: node.id,
                    position: {
                        top: Math.round(dagreNode.y - dagreNode.height / 2),
                        left: Math.round(dagreNode.x - dagreNode.width / 2)
                    }
                }
            });
        }

    };

    return HierarchicalLayout;
});