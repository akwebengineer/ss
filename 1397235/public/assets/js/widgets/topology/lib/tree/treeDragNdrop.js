/**
 * A module that enables drag and drop interaction on topology widget
 *
 * @module treeDragNdrop
 * @copyright Juniper Networks, Inc. 2017
 */
define([
    'widgets/topology/lib/constants'
], /** @lends TreeDragNdrop */
function (topologyConstants) {
    var isElOver = false, //Flag to check if any external element is over visualization.
        dropNodeTemp;

    /**
     * Initializes droppable interaction on the container.
     * @param {object} config - topology configuration object.
     * @param {Object} svgEl - d3 el
     * @param {object} events - d3 events.
     */
    function init(config, svgEl, events) {
        var topologyUi = new TopologyUi(svgEl);
        //Listening on over, drop events so that unit tests can be run. Unit tests cannot be run if implementation is part of over, drop droppable conf attr.
        config.container.droppable({
            over: function (evt, el) {
                var dragEl = el.helper && el.helper[0]; //dragged element
                $(this).trigger(topologyConstants.events.internalEventOver, [dragEl]); //triggering an internal 'over' event manually as droppable plugin does not trigger 'over' event.
            }
            //including drop as droppable conf attr will trigger event twice, hence ignored. over attr required to trigger 'over' event.
        }).off(topologyConstants.events.internalEventOver).on(topologyConstants.events.internalEventOver, function (evt, dragEl) {
            isElOver = true;
            $(this).trigger(topologyConstants.events.over, [dragEl, topologyUi]);
        }).off('drop dropout').on('drop dropout', function (evt, el) {
            var dropEl = el.helper && el.helper[0], //dropped element
                dataStore = config.dataStore;
            isElOver = false;
            if (!dropNodeTemp || !dataStore) {
                var baseSvg = d3.selectAll(config.container).selectAll('svg');
                topologyUi.removeDropTargets(baseSvg); //If element is dropped in unknown area, return.
                return;
            }

            $(this).trigger(topologyConstants.events.drop, [dropEl, new DropTarget(dropNodeTemp), topologyUi]);
            dropNodeTemp = null; //remove temporary node after triggering drop event to consumers.
        });

        /**
         * Constructor for the drop target. Provides helper methods on the drop target.
         * @param {Object} dropObject - d3 decorated object.
         * @constructor
         */
        function DropTarget(dropObject) {
            var dataStore = config.dataStore;
            var NODE_TYPE = (dropObject && dropObject.id) ? "node" : "link";

            /**
             * Setter for drop target
             * @param {Object} object - object which needs to be updated in dataStore.
             */
            this.set = function (object) {
                var nodeToUpdate;
                if (NODE_TYPE == "node") {
                    nodeToUpdate = dataStore.get(dropObject.id);
                    _.extend(nodeToUpdate, object);
                } else if (NODE_TYPE == "link") {
                    nodeToUpdate = dataStore.get(dropObject.target.id);
                    _.extend(nodeToUpdate.link, object);
                }

                dataStore.put(nodeToUpdate);
            };

            /**
             * Returns data model of drop target
             * @returns {Object} datamodel
             */
            this.get = function () {
                var model;
                if (NODE_TYPE == "node") {
                    model = dataStore.get(dropObject.id);
                } else if (NODE_TYPE == "link") {
                    model = dataStore.get(dropObject.target.id)['link'];
                }

                return model;
            };

            /**
             * Returns target type (node / link) of the drop target.
             * @returns {string}
             */
            this.getTargetType = function () {
                return NODE_TYPE;
            }
        }

        /**
         * Constructor to provide helper methods on the base svg.
         * @param {Object} baseSvg - d3 el
         * @constructor
         */
        function TopologyUi(svgEl) {
            var baseSvg = svgEl;
            /**
             * Displays drop targets.
             * @param {Object} dropTargets - Object with valid, invalid drop zone ids.
             */
            this.addDropTargets = function (dropZones) {
                displayDropTargets(baseSvg, dropZones);
            };
            /**
             * Removes drop targets.
             */
            this.removeDropTargets = function () {
                removeDropTargets(baseSvg);
            };
        }

        /**
         * Displays drop targets based on provided drop zone ids
         * @param {Object} baseSvg - d3 el
         * @param {Object} dropZones - Object with valid, invalid drop zone ids
         * @inner
         */
        function displayDropTargets(baseSvg, dropZones) {
            var svgContainer = d3.selectAll(baseSvg[0]);
            var links = svgContainer.selectAll('g.link'),
                nodes = svgContainer.selectAll('g.node');

            if (!_.isObject(dropZones)) return;

            var validLinkDropZones = links
                .filter(function (d) {
                    return _.contains(dropZones.valid, d.target.link.id);
                });
            var invalidLinkDropZones = links
                .filter(function (d) {
                    return _.contains(dropZones.invalid, d.target.link.id);
                });
            var validNodeDropZones = nodes
                .filter(function (d) {
                    return _.contains(dropZones.valid, d.id);
                });
            var invalidNodeDropZones = nodes
                .filter(function (d) {
                    return _.contains(dropZones.invalid, d.id);
                });
            //Link
            validLinkDropZones.selectAll('.link-anchor').classed('valid-drop-target', true);
            invalidLinkDropZones.selectAll('.link-anchor').classed('invalid-drop-target', true);
            //Node
            validNodeDropZones.selectAll('.node-anchor').classed('valid-drop-target', true);
            invalidNodeDropZones.selectAll('.node-anchor').classed('invalid-drop-target', true);
        }

        /**
         * Removes displayed drop targets and returns visual to view mode.
         * @param {Object} context - d3 el
         * @inner
         */
        function removeDropTargets(baseSvg) {
            var svgContainer = d3.selectAll(baseSvg[0]);
            var anchors = svgContainer.selectAll('.link-anchor, .node-anchor');

            anchors.classed('valid-drop-target', false);
            anchors.classed('invalid-drop-target', false);
        }

        registerEvents(events);
    }

    /**
     * Registers events for dragNdrop interaction.
     * @param {object} events - d3 events.
     */
    function registerEvents(events) {
        // d3 events
        events.on('nodeMouseOver.dragNdrop', function (d, i, nodeEl) {
            nodeMouseEnter(d, i, nodeEl)
        });

        events.on('nodeMouseOut.dragNdrop', function (d, i, nodeEl) {
            nodeMouseLeave(d, i, nodeEl)
        });

        events.on('linkIconMouseOver.dragNdrop', function (d, i, nodeEl) {
            linkIconMouseEnter(d, i, nodeEl)
        });

        events.on('linkIconMouseOut.dragNdrop', function (d, i, nodeEl) {
            linkIconMouseLeave(d, i, nodeEl)
        });
    }

    /**
     * Invoke mouse enter functionality for dragNDrop
     * @param {Object} d - d3 object
     * @param {Int} i - index
     * @param {Object} nodeEl - node where the mouseover event is triggered
     */
    function nodeMouseEnter(d, i, nodeEl) {
        var nodeAnchor = nodeEl.selectAll('.node-anchor');
        if (isElOver && (nodeAnchor.classed("valid-drop-target") || nodeAnchor.classed("invalid-drop-target"))) {
            var validDropTarget = nodeAnchor.classed("valid-drop-target");
            dropNodeTemp = validDropTarget ? d : null;
            nodeAnchor.classed('current-hover', true)
                .attr({
                    r: function () {
                        return nodeAnchor.attr('r') * 1.3;
                    }
                });
        }
    }

    /**
     * Invoke mouse leave functionality for dragNDrop
     * @param {Object} d - d3 object
     * @param {Int} i - index
     * @param {Object} nodeEl - node where the mouseover event is triggered
     */
    function nodeMouseLeave(d, i, nodeEl) {
        var nodeAnchor = nodeEl.selectAll('.node-anchor');
        var anchorCurrentlyHovered = nodeAnchor.classed('current-hover');
        if (anchorCurrentlyHovered) {
            nodeAnchor.classed('current-hover', false)
                .attr("r", function () {
                    return d3.select(this).attr('r') / 1.3;
                });

            if (nodeAnchor.classed("valid-drop-target") || nodeAnchor.classed("invalid-drop-target")) {
                dropNodeTemp = null; //remove temp node
            }
        }
    }

    /**
     * Invoke mouse enter functionality for dragNDrop
     * @param {Object} d - d3 object
     * @param {Int} i - index
     * @param linkEl - link icon where the mouseover event is triggered
     */
    function linkIconMouseEnter(d, i, linkEl) {
        var linkAnchor = linkEl.selectAll('.link-anchor');
        if (isElOver && (linkAnchor.classed("valid-drop-target") || linkAnchor.classed("invalid-drop-target"))) {
            var validDropTarget = linkAnchor.classed("valid-drop-target");
            dropNodeTemp = validDropTarget ? d : null;
            linkAnchor.classed('current-hover', true)
                .attr({
                    r: function () {
                        return linkAnchor.attr('r') * 1.3;
                    }
                });
        }
    }

    /**
     * Invoke mouse leave functionality for dragNDrop
     * @param {Object} d - d3 object
     * @param {Int} i - index
     * @param linkEl - link icon where the mouseleave event is triggered
     */
    function linkIconMouseLeave(d, i, linkEl) {
        var linkAnchor = linkEl.selectAll('.link-anchor');
        var anchorCurrentlyHovered = linkAnchor.classed('current-hover');
        if (anchorCurrentlyHovered) {
            linkAnchor.classed('current-hover', false)
                .attr("r", function () {
                    return d3.select(this).attr('r') / 1.3;
                });

            if (linkAnchor.classed("valid-drop-target") || linkAnchor.classed("invalid-drop-target")) {
                dropNodeTemp = null; //remove temp node
            }
        }
    }

    return {
        init: init
    };
});
