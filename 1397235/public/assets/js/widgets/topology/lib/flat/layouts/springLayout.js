/**
 * Utility to position nodes and links in a spring layout
 *
 * @module SpringLayout
 * @author Viswesh Subramanian <vissubra@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */

define(['d3'], function (d3) {

    /**
     * Provides positions for nodes
     * @param {Object} conf
     * @constructor
     */
    var SpringLayout = function (conf) {

        /**
         * Returns node positions
         * @param {options} Object - options object
         * @returns {Array} returns positions for all nodes.
         */
        this.getNodePositions = function (options) {
            var data = conf.dataStore.get();

            //Force Directed Layout
            var uniqLinks = _.uniq(data.links, true, function (link) {
                return link.source && link.target;
            });
            var force = d3.layout.force()
                .nodes(JSON.parse(JSON.stringify(data.nodes))) //Creates a deep copy
                .links(uniqLinks)
                .size([conf.viewerDimensions.width, conf.viewerDimensions.height])
                .charge(-800)
                .start();


            for (var i = 0, n = uniqLinks.length; i < n * 50; ++i) force.tick();
            force.stop();

            return force.nodes().map(function (node) {
                return {
                    id: node.id,
                    position: {
                        top: Math.round(node.y),
                        left: Math.round(node.x)
                    }
                }
            });
        }

    };

    return SpringLayout;
});