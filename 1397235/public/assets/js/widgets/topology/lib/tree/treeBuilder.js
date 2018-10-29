
/*Copyright (c) 2013-2016, Rob Schmuecker
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* The name Rob Schmuecker may not be used to endorse or promote products
  derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL MICHAEL BOSTOCK BE LIABLE FOR ANY DIRECT,
INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.*/

define([
    'lib/template_renderer/template_renderer',
    'widgets/topology/lib/tree/treeTopologyTemplates',
    'widgets/topology/lib/tooltipBuilder',
    'widgets/topology/lib/baseView',
    'widgets/topology/lib/constants',
    'jqueryui',
    'widgets/topology/lib/tree/treeDragNdrop',
    'widgets/topology/lib/tree/treeRegistry',
    'd3'
],
    function (render_template, topologyTemplates, TooltipBuilder, BaseView, topologyConstants, jQueryUi, treeDragNdrop, treeRegistry) {

        var outerGroupLocation;

        /**
         * Draws Tree topology
         * @param {object} treeView - treeView instance.
         * @param {object} config - treeView configuration.
         * @param {object} events - treeView instance d3 events.
         * @constructor
         */
        function TreeVisual (treeView, config, events) {

            /**
             *  Draws tree visual in svg canvas
             *  @param  {object} dataset - current data from dataStore
             *  @param  {object} viewOptions - options required for view updates.
             */
            this.buildTopology = function (dataset, viewOptions) {
                var node,
                    dragListener,
                    diagramDragListener,
                    scale, x, y,
                    dragStarted,
                    nodes,
                    domNode,
                    nodePaths,
                    links,
                    nodesExit,
                    parentLink,
                    relCoords,
                    translateCoords,
                    panTimer,
                    nodePositionOffset = {
                        small: 7.5,
                        medium: 15,
                        large: 22.5
                    },
                    currentZoomPosition = {},
                    baseSvg = treeView[0][0].baseViewSvg,
                    loadFinished = false,
                    addOnElementLineHeight = 50,
                    tooltipBuilder = new TooltipBuilder();

                var sizeRegistry = treeRegistry.size;

                // Calculate total nodes, max label length
                var totalNodes = 0;
                var maxLabelLength = 0;
                var totalDepth = 0;
                // variables for drag/drop
                var selectedNode = null;
                var draggingNode = null;
                // panning variables
                var panSpeed = 200;
                var panBoundary = 20; // Within 20px from edges will pan when dragging.
                // Misc. variables
                var i = 0;
                var animationDuration = 0;
                var root;

                var tree = d3.layout.tree()
                    .size([ config.viewerDimensions.height, config.viewerDimensions.width ]);

                // define a d3 diagonal projection for use by the node paths later on.
                var diagonal = d3.svg.diagonal()
                    .projection(function (d) {
                        return [ d.y, d.x ];
                    });

                /**
                 * A recursive helper function for performing some setup by walking through all nodes
                 * @param  {object} parent - Parent Node
                 * @param  {function} visitFn - Callback to be executed when a node is visited
                 * @param  {function} childrenFn - Callback to be called to determine children
                 * @internal
                 */
                function visit(parent, visitFn, childrenFn) {
                    if (!parent) return;

                    visitFn(parent);

                    var children = childrenFn(parent);
                    if (children) {
                        var count = children.length;
                        for (var i = 0; i < count; i++) {
                            visit(children[ i ], visitFn, childrenFn);
                        }
                    }
                }

                // Call visit function to establish maxLabelLength
                visit(dataset, function (d) {
                    totalNodes++;
                    // maxLabelLength = Math.max(d.name.length, maxLabelLength); // Retained for future use, if needed
                    d.childrenState = "expanded";
                    if (d.children && d.children.length > config.collapseChildrenThreshold) {
                        if (!d.groupNode) {
                            var intermediateNode = {
                                name: "",
                                children: d.children,
                                childrenState: "collapsed",
                                groupNode: true,
                                depth: d.depth + 1
                            };
                            d.children = [ intermediateNode ];
                            d.childrenGrouped = true;
                            d.intermediateNode = null;
                        } else {
                            d._children = d.children; // move children to _children to detach / remove current node's children. d._children should be moved back to d.children if / when the current node's children need to be re-attached.
                            d.children = [];
                            d.childrenState = "collapsed";
                        }
                    }
                }, function (d) {
                    var children = null;
                    if (d.children && d.children.length > 0) {
                        children = d.children;
                    }
                    else if (d._children && d._children.length > 0) {
                        children = d._children;
                    }
                    return children;
                });


                function pan(domNode, direction) {
                    var speed = panSpeed;
                    if (panTimer) {
                        clearTimeout(panTimer);
                        translateCoords = d3.transform(svgGroup.attr("transform"));
                        if (direction == 'left' || direction == 'right') {
                            translateX = direction == 'left' ? translateCoords.translate[ 0 ] + speed : translateCoords.translate[ 0 ] - speed;
                            translateY = translateCoords.translate[ 1 ];
                        } else if (direction == 'up' || direction == 'down') {
                            translateX = translateCoords.translate[ 0 ];
                            translateY = direction == 'up' ? translateCoords.translate[ 1 ] + speed : translateCoords.translate[ 1 ] - speed;
                        }
                        scaleX = translateCoords.scale[ 0 ];
                        scaleY = translateCoords.scale[ 1 ];
                        scale = zoomListener.scale();
                        svgGroup.transition().attr("transform", "translate(" + translateX + "," + translateY + ")scale(" + scale + ")");
                        d3.select(domNode).select('g.node').attr("transform", "translate(" + translateX + "," + translateY + ")");
                        zoomListener.scale(zoomListener.scale());
                        zoomListener.translate([ translateX, translateY ]);
                        panTimer = setTimeout(function () {
                            pan(domNode, speed, direction);
                        }, 50);
                    }
                }


                /**
                 *  Define the zoom function for the zoomable tree
                 */
                function zoom() {
                    if (config.allowZoomAndPan) {
                        var translatePosition = d3.event.translate
                        x = translatePosition[ 0 ];
                        y = translatePosition[ 1 ];
                        svgGroup.attr("transform", "translate(" + translatePosition + ")scale(" + d3.event.scale + ")");
                    }
                }

                // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
                var zoomListener = d3.behavior.zoom().scaleExtent([ 0.1, 3 ]).on("zoom", zoom);

                function initiateDrag(d, domNode) {
                    draggingNode = d;
                    d3.select(domNode).select('.ghostCircle').attr('pointer-events', 'none');
                    d3.selectAll('.ghostCircle').attr('class', 'ghostCircle show');
                    d3.select(domNode).attr('class', 'node activeDrag');

                    svgGroup.selectAll("g.node").sort(function (a, b) { // select the parent and sort the path's
                        if (a.index != draggingNode.index) return 1; // a is not the hovered element, send "a" to the back
                        else return -1; // a is the hovered element, bring "a" to the front
                    });
                    // if nodes has children, remove the links and nodes
                    if (nodes.length > 1) {
                        // remove link paths
                        links = tree.links(nodes);
                        nodePaths = svgGroup.selectAll("path.link")
                            .data(links, function (d) {
                                return d.target.index;
                            }).remove();
                        // remove child nodes
                        nodesExit = svgGroup.selectAll("g.node")
                            .data(nodes, function (d) {
                                return d.index;
                            }).filter(function (d, i) {
                                if (d.index == draggingNode.index) {
                                    return false;
                                }
                                return true;
                            }).remove();
                    }

                    // remove parent link
                    parentLink = tree.links(tree.nodes(draggingNode.parent));
                    svgGroup.selectAll('path.link').filter(function (d, i) {
                        if (d.target.index == draggingNode.index) {
                            return true;
                        }
                        return false;
                    }).remove();

                    dragStarted = null;
                }

                // attaching zoomListener to baseSvg
                baseSvg.call(zoomListener);

                /**
                 * Define the drag listeners for drag/drop behaviour of nodes.
                 * */
                dragListener = d3.behavior.drag()
                    .on("dragstart", function (d) {
                        if (d == root) {
                            return;
                        }
                        dragStarted = true;
                        nodes = tree.nodes(d);
                        d3.event.sourceEvent.stopPropagation();
                        // it's important that we suppress the mouseover event on the node being dragged. Otherwise it will absorb the mouseover event and the underlying node will not detect it d3.select(this).attr('pointer-events', 'none');
                    })
                    .on("drag", function (d) {
                        if (d == root) {
                            return;
                        }
                        if (dragStarted) {
                            domNode = this;
                            initiateDrag(d, domNode);
                        }

                        // get coords of mouseEvent relative to svg container to allow for panning
                        relCoords = d3.mouse($('svg').get(0));
                        if (relCoords[ 0 ] < panBoundary) {
                            panTimer = true;
                            pan(this, 'left');
                        } else if (relCoords[ 0 ] > ($('svg').width() - panBoundary)) {

                            panTimer = true;
                            pan(this, 'right');
                        } else if (relCoords[ 1 ] < panBoundary) {
                            panTimer = true;
                            pan(this, 'up');
                        } else if (relCoords[ 1 ] > ($('svg').height() - panBoundary)) {
                            panTimer = true;
                            pan(this, 'down');
                        } else {
                            try {
                                clearTimeout(panTimer);
                            } catch (e) {

                            }
                        }

                        d.x0 += d3.event.dy;
                        d.y0 += d3.event.dx;
                        var node = d3.select(this);
                        node.attr("transform", "translate(" + d.y0 + "," + d.x0 + ")");
                        updateTempConnector();
                    }).on("dragend", function (d) {
                        if (d == root) {
                            return;
                        }
                        domNode = this;
                        if (selectedNode) {
                            // now remove the element from the parent, and insert it into the new elements children
                            var index = draggingNode.parent.children.indexOf(draggingNode);
                            if (index > -1) {
                                draggingNode.parent.children.splice(index, 1);
                            }
                            if (typeof selectedNode.children !== 'undefined' || typeof selectedNode._children !== 'undefined') {
                                if (typeof selectedNode.children !== 'undefined') {
                                    selectedNode.children.push(draggingNode);
                                } else {
                                    selectedNode._children.push(draggingNode);
                                }
                            } else {
                                selectedNode.children = [];
                                selectedNode.children.push(draggingNode);
                            }
                            // Make sure that the node being added to is expanded so user can see added node is correctly moved
                            expand(selectedNode);
                            endDrag();
                        } else {
                            endDrag();
                        }
                    });

                function endDrag() {
                    selectedNode = null;
                    d3.selectAll('.ghostCircle').attr('class', 'ghostCircle');
                    d3.select(domNode).attr('class', 'node');
                    // now restore the mouseover event or we won't be able to drag a 2nd time
                    d3.select(domNode).select('.ghostCircle').attr('pointer-events', '');
                    updateTempConnector();
                    if (draggingNode !== null) {
                        update(root);
                        centerNode(draggingNode);
                        draggingNode = null;
                    }
                }

                /**
                 *  Helper functions for collapsing nodes.
                 */
                function collapse(d) {
                    if (d.children) {
                        d._children = d.children;
                        d._children.forEach(collapse);
                        d.children = null;
                    }
                }

                /**
                 *  Helper functions for expanding nodes.
                 */
                function expand(d) {
                    if (d._children) {
                        d.children = d._children;
                        d.children.forEach(expand);
                        d._children = null;
                    }
                }

                var overCircle = function (d) {
                    selectedNode = d;
                    updateTempConnector();
                };
                var outCircle = function (d) {
                    selectedNode = null;
                    updateTempConnector();
                };

                /**
                 *  Function to update the temporary connector indicating dragging affiliation
                 */
                var updateTempConnector = function () {
                    var data = [];
                    if (draggingNode !== null && selectedNode !== null) {
                        // have to flip the source coordinates since we did this for the existing connectors on the original tree
                        data = [ {
                            source: {
                                x: selectedNode.y0,
                                y: selectedNode.x0
                            },
                            target: {
                                x: draggingNode.y0,
                                y: draggingNode.x0
                            }
                        }];
                    }
                    var link = svgGroup.selectAll(".templink").data(data);

                    link.enter().append("path")
                        .attr("class", "templink")
                        .attr("d", d3.svg.diagonal())
                        .attr('pointer-events', 'none');

                    link.attr("d", d3.svg.diagonal());

                    link.exit().remove();
                };


                /**
                 * Function to center node when clicked/dropped so node doesn't get lost when collapsing/moving with large amount of children.
                 * @param  {object} source - Source node to center at
                 * @param  {number} scaleFactor - Number indicating the zoom value
                 */
                function centerNode(source, scaleFactor) {
                    if (loadFinished) {
                        console.info("Current Positions: ");
                        console.info("x: " + x);
                        console.info("y: " + y);
                        var _scaleFactor = (scaleFactor) ? scaleFactor : 1;
                        var currentScale = zoomListener.scale();
                        var zoomAction = (_scaleFactor < 1) ? "zoomout" : "zoomin";
                        scale = (((currentScale * _scaleFactor) <= 3) && zoomAction === "zoomin" || (((currentScale * _scaleFactor) >= 0.1) && zoomAction === "zoomout")) ? (currentScale * _scaleFactor) : currentScale;

                        if (source) {
                            x = -source.y0;
                            y = -source.x0;
                            if (source === root) {
                                x = x * scale + config.viewerDimensions.width / 6;
                            }
                            else {
                                x = x * scale + config.viewerDimensions.width / 2;
                            }

                            y = y * scale + config.viewerDimensions.height / 2;

                            currentZoomPosition.x = x;
                            currentZoomPosition.y = y;

                        }

                        var transformProp = outerGroupLocation ? outerGroupLocation : "translate(" + x + "," + y + ")scale(" + scale + ")";
                        baseSvg.select('.outer-group').transition()
                            .duration(animationDuration)
                            .attr("transform", transformProp)
                            .attr("class", "outer-group visible");
                        outerGroupLocation = null;

                        zoomListener.scale(scale);
                        zoomListener.translate([ x, y ]);
                    }
                }

                config.container.off("topology-render-complete").on("topology-render-complete", function () {
                    updateVisual();
                });

                /**
                 * Updates visual when render is complete.
                 * @inner
                 */
                function updateVisual() {
                    var visualUpdates = viewOptions && viewOptions.visualUpdates;
                    if (!visualUpdates || visualUpdates == {}) {
                        return;
                    }

                    var expandedSubNodes = visualUpdates && visualUpdates.expandedSubNodes ? visualUpdates.expandedSubNodes : [];

                    _.each(expandedSubNodes, function (id) {
                        var node = svgGroup.selectAll("g.node").filter(function (d) {
                                return d.id == id;
                            }),
                            event = createEvent("click");

                        node.select('.nodeBadgeGroup')[0][0].dispatchEvent(event);
                    });
                };

                /**
                 * A utility method to provide cross compatibility for programmatically triggering events.
                 * @param eventName
                 * @returns {Object} Event
                 */
                function createEvent(eventName) {
                    var event;
                    if (typeof(Event) === 'function') {
                        event = new Event(eventName);
                    } else {
                        event = document.createEvent("Event");
                        event.initEvent(eventName, true, true);
                    }
                    return event;
                }

                /**
                 *  Function that toggles expand / collapse state of child nodes of a given node
                 * @param  {object} d - The node whose children need to be expanded / collapsed
                 */
                function toggleChildren(d) {
                    if (d.childrenState === "expanded") {
                        d.childrenState = "collapsed";
                        if (d.childrenGrouped) {
                            if (d.intermediateNode) {
                                var children = d.children;
                                d.intermediateNode.childrenState = "collapsed";
                                d.intermediateNode._children = children;
                                d.children = [ d.intermediateNode ];
                                d.intermediateNode = null;
                                d.childrenState = "expanded";
                            }
                            else {
                                d.childrenState = "expanded";
                                return d;
                            }
                        }
                        else {
                            d._children = d.children;
                            d.children = null;
                        }
                    }
                    else if (d.childrenState === "collapsed") {
                        d.childrenState = "expanded";
                        if (d.childrenGrouped) {

                        }
                        else if (d.groupNode) {
                            var children = d._children;
                            // d.children = null;
                            d.parent.intermediateNode = d;
                            d.parent.children = children;
                        }
                        else {
                            d.children = d._children;
                            d._children = null;
                        }

                    }
                    return d;
                }


                /**
                 * Function that is a callback when a node is clicked.
                 * @param  {object} d - Node that was clicked on
                 * @param  {object} i - Index of the Node that was clicked on
                 */
                function nodeClick(d, i) {
                    var focusNode = (d.groupNode) ? d.parent : d;
                    events.nodeClick(focusNode, d3.event);

                    d3.selectAll(".node-selected.show")
                        .attr("class", "node-selected");

                    d3.select(d3.event.currentTarget)
                        .select(".node-selected")
                        .attr("class", "node-selected show");

                    if ((!d.children && !d._children) || (d3.event.defaultPrevented) || (d.childrenGrouped && !d.intermediateNode)) return;
                    var scaleFactor = (d.childrenState === "expanded") ? (1 / 0.7) : 0.7;
                    if (config.allowChildrenCollapse) {
                        d = toggleChildren(d);
                        update(focusNode);
                        // Center the node only when zoom/pan is enabled. Otherwise nodes may go out of the view port.
                        if (config.allowZoomAndPan) {
                            centerNode(focusNode);
                        }
                    }
                }

                /**
                 * Function to add tooltip on hovering over a node or link icon
                 * @param  {object} data - d3 object of node being hovered (in case of link icon, this object will consist of source and destination node of the link)
                 * @param  {object} el - container of a node or link-icon where the mouseover event is triggered
                 * @param  {string} type - string specifying the mouseOver element type
                 */
                var addTooltip = function (data, el, type) {
                    var g = el[0];
                    if(data && _.isObject(config.tooltip)) {
                        tooltipBuilder.addContentTooltips(g, data, config, type, config.topologyType);
                    }
                };

                /**
                 * Function that checks whether a node is present in the list of nodes.
                 * If node exists, it returns the node index.
                 * If node is not found, it returns -1.
                 * @param  {object} node - current node
                 * @param  {object} nodes - list of nodes
                 * @inner
                 */
                function findNodeIndex(node, nodes) {
                    if (node && node.id) {
                        for (var index=0; index <= nodes.length; index++) {
                            if (nodes[index] && (node.id == nodes[index].id)) {
                                return index;
                            }
                        }
                    }
                    // No matching nodes found
                    return -1;
                }

                /**
                 * Function that searches a list of nodes and returns all the subNodes that have the same subNodeHostNodeId.
                 * @param  {object} node - current node
                 * @param  {object} nodes - list of nodes
                 * @inner
                 * @returns  {object} subNodes - list of subnodes with the same subNodeHostNodeId, or empty array (if no subnodes match)
                 */
                function getSubnodesArray(node, nodes) {
                    var subNodes = [];
                    if (node && node.id) {
                        for (var index=0; index <= nodes.length; index++) {
                            // parent node id matches the subNodeHostNodeId
                            if (nodes[index] && nodes[index].id == node.subNodeHostNodeId) {
                                subNodes.push(nodes[index].subNodes);
                                return subNodes;
                            }
                        }
                    }
                    return subNodes;
                }

                /**
                 * Function that is a callback when a node with a badge is clicked.
                 * A badge is displayed only on nodes that have subNodes.
                 * When badge is clicked, subNodes are either expanded or collapsed.
                 * Expand: Attach subNodes to their parent, hide the link attached to the badge node
                 * Collapse: Dettach subNodes from the parent, show the link attached to the badge node
                 * @param  {object} d - Node that was clicked on
                 * @param  {object} i - Index of the Node that was clicked on
                 * @inner
                 */
                function subNodeBadgeClick(d, i) {
                    var canToggle = true,
                        subNodeBadgeClickCb = config.subNode && config.subNode.badgeOnClick;
                    if (subNodeBadgeClickCb && _.isFunction(subNodeBadgeClickCb)) {
                        var node = config.dataStore.get(d.id),
                            returnValue = subNodeBadgeClickCb(node);
                        canToggle = _.isBoolean(returnValue) ? returnValue : true;
                    }
                    if (d.subNodes && canToggle) {
                        var action = "";
                        // Start attaching subNodes in reverse order so that they are finally laid out in the correct order as specified in the configuration file
                        // For example, if there are 3 subNodes A, B, C:
                        //   First attach C, directly below the badge node so that the layout will be Node->C
                        //   Next attach B, directly below the badge node so that updated layout will Node->B->C
                        //   Finally attach A, directly below the badge node so that updated layout will Node->A->B->C
                        for (var index = d.subNodes.length-1; index >= 0; index--) {
                            var nodeIndex = findNodeIndex(d.subNodes[index], d.parent.children);
                            if ( nodeIndex == -1) {
                                // find index of d.id in the current tree
                                var position = findNodeIndex(d, d.parent.children);
                                //Add subNodeHostNodeId on the subNode element.
                                d.subNodes[index].subNodeHostNodeId = d.id;
                                // increment position by 1 to attach the subNode directly below the clicked node badge
                                d.parent.children.splice(position+1, 0, d.subNodes[index]);
                                action = "expand";
                            } else {
                                // Remove subNode from d.parent.children
                                d.parent.children.splice(nodeIndex, 1);
                                action = "collapse";
                            }
                        }

                        if (action == "expand") {
                            // hide the link, linkimage and linkarrow for this subNode badge
                            baseSvg.select('.link.subnode-badge'+d.id+'').classed('badge-selected', true);
                            baseSvg.select("g.link.subnode-badge"+d.id+"").classed('badge-selected', true);
                            baseSvg.select('.link-arrow.link.subnode-badge'+d.id+'').classed('badge-selected', true);
                            d3.select(this)
                                .select(".node-badge.show")
                                .classed('selected', true);
                        } else {
                            // show the link, linkimage and linkarrow for this subNode badge
                            baseSvg.select(".link.subnode-badge"+d.id+"").classed('badge-selected', false);
                            baseSvg.select("g.link.subnode-badge"+d.id+"").classed('badge-selected', false);
                            baseSvg.select('.link-arrow.link.subnode-badge'+d.id+'').classed('badge-selected', false);
                            d3.select(this)
                                .select(".node-badge.show")
                                .classed('selected', false);
                        }

                        update(d.parent);
                        centerNode(d.parent);
                    }
                }

                config.container.off("topology-zoom-in").on("topology-zoom-in", function (data) {
                    zoomin();
                });

                config.container.off("topology-zoom-out").on("topology-zoom-out", function (data) {
                    zoomout();
                });

                treeDragNdrop.init(config, baseSvg, events);

                function nodeMouseOver(d, i) {
                    var nodeEl = d3.select(this);
                    events.nodeMouseOver(d, i, nodeEl);
                }

                /*
                 * Internal callback for adding tooltip on hovering over first nodeGroup.
                 */
                function nodeGroupMouseOver (d, i) {
                    var nodeEl = d3.select(this);
                    addTooltip(d, nodeEl, "NODE");
                }

                function nodeMouseOut(d, i) {
                    var nodeEl = d3.select(this);
                    events.nodeMouseOut(d, i, nodeEl);
                }

                function linkClick(d, i) {
                    events.linkClick(d, i);
                }

                function linkMouseOver(d, i) {
                    events.linkMouseOver(d, i);
                }

                function linkMouseOut(d, i) {
                    events.linkMouseOut(d, i);
                }

                function linkIconClick(d, i) {
                    events.linkIconClick(d, i);
                }

                function linkIconMouseOver(d, i) {
                    var linkEl = d3.select(this);
                    addTooltip(d, linkEl, "LINK");
                    events.linkIconMouseOver(d, i, linkEl);
                }

                function linkIconMouseOut(d, i) {
                    var linkEl = d3.select(this);
                    events.linkIconMouseOut(d, i, linkEl);
                }

                function nodeBadgeMouseOver (d, i) {
                    var badgeEl = d3.select(this);
                    addTooltip(d, badgeEl, "NODE-BADGE");
                }


                function zoomin() {
                    var scaleFactor = 1.2;
                    centerNode(undefined, scaleFactor);
                }

                function zoomout() {
                    var scaleFactor = 0.8;
                    centerNode(undefined, scaleFactor);
                }

                /** Function that draws nodes on the SVG canvas
                 * @param  {array} nodes - Array of nodes
                 * @param  {object} source - Root of the tree data
                 */
                function drawNodes(nodes, source) {

                    node = svgGroup.selectAll("g.node")
                        .data(nodes, function (d) {
                            return d.index || (d.index = ++i);
                        });

                    // Enter any new nodes at the parent's previous position.
                    var nodeEnter = node.enter().append("g")
                        .attr("class", function (d) {
                            var groupNodeClass = (!d.groupNode) ? "" : " grouped-node"
                            return "node " + groupNodeClass;
                        })
                        .attr("data-type", function(d){
                            return (d.type) ? d.type : "";
                        })
                        .attr("data-id", function(d){
                            return (d.id) ? d.id : "";
                        })
                        .attr("subnode", function (d) {
                            if (d != root && d.parent.children) {
                                for ( var index = 0; index < d.parent.children.length; index++) {
                                    if (d.parent.children[index].subNodes) {
                                        var nodeIndex = findNodeIndex(d, d.parent.children[index].subNodes);
                                        if (nodeIndex != -1) {
                                            return "true";
                                        }
                                    }
                                }
                            }
                            return null;
                        })
                        .attr("data-addOn", function (d) {
                            if (d.addOn && _.isObject(d.addOn)) {
                                return "true";
                            }
                            return null;
                        })
                        .attr("transform", function (d) {
                            return "translate(" + source.y0 + "," + source.x0 + ")";
                        })
                        .on('mouseover', nodeMouseOver)
                        .on('mouseout', nodeMouseOut);

                    var nodeGroupA = nodeEnter.append("g")
                        .attr("class", 'nodeGroup')
                        .on('click', nodeClick)
                        .on('mouseover', nodeGroupMouseOver);
                    var nodeGroupB = nodeEnter.append("g")
                        .attr("class", 'nodeBadgeGroup')
                        .on('mouseover', nodeBadgeMouseOver)
                        .on('click', subNodeBadgeClick);

                    if (config.mode === "edit") nodeEnter.call(dragListener);

                    var size = function (d) {
                        return sizeRegistry[d.size ? d.size : 'medium'].value;
                    }

                    nodeGroupA.append("circle")
                        .attr('class', function (d) {
                            //if addOn attr present, node is disabled of drop zones as users can drop on addOn.
                            return d.addOn ? "node-anchor-disabled" : "node-anchor";
                        })
                        .attr("r", function (d) {
                            return sizeRegistry[d.size ? d.size : 'medium'].nodeRadius;
                        })
                        .attr("cx", function (d) {
                            return nodePositionOffset[ d.size ] || nodePositionOffset.medium;
                        })
                        .attr("cy", 0)
                        .style("fill-opacity", 0.5);

                    nodeGroupA.append("image")
                        .attr("xlink:href", function (d) { return config.icons[ d.type ]; })
                        // width and height are required to be set for IE and Firefox
                        .attr("width", size)
                        .attr("height", size);

                    nodeGroupA.append("rect")
                        .attr("height", size)
                        .attr("width", size);

                    nodeGroupA.append("text")
                        .attr('class', 'node-innerText')
                        .style("fill-opacity", 1);

                    nodeGroupA.append("rect")
                        .attr('class', 'node-selected')
                        .attr("height", size)
                        .attr("width", size)
                        .attr("stroke-width", function (d) {
                            return sizeRegistry[d.size ? d.size : 'medium'].nodeBorder;
                        })
                        .attr("rx", 4)  // Rounded corners
                        .attr("ry", 4) // Rounded corners
                        .attr("x", function (d) {
                            return 0;
                        })
                        .attr("y", function (d) {
                            return -(nodePositionOffset[ d.size ] || nodePositionOffset.medium);
                        });

                    var nodeTitle = nodeGroupA.append("g")

                    nodeTitle.append("title")
                        .text(function (d) {
                            return d.name;
                        });

                    nodeTitle.append("text")
                        .attr("x", function (d) {
                            return d.children || d._children ? -10 : 10;
                        })
                        .attr("dy", ".35em")
                        .attr('class', 'nodeText')
                        .attr("text-anchor", function (d) {
                            return d.children || d._children ? "end" : "start";
                        })
                        .text(function (d) {
                            return d.name;
                        })
                        .style("fill-opacity", 1);

                    // phantom node to give us mouseover in a radius around it
                    nodeGroupA.append("circle")
                        .attr('class', 'ghostCircle')
                        .attr("r", 30)
                        .attr("opacity", 0.2) // change this to zero to hide the target area
                        .style("fill", "green")
                        .attr('pointer-events', 'mouseover')
                        .on("mouseover", function (node) {
                            overCircle(node);
                        })
                        .on("mouseout", function (node) {
                            outCircle(node);
                        });

                    nodeGroupB.append("rect")
                        .attr('class', function (d) {
                            var display = (d.subNodes && d != root) ? "show" : "";
                            var selected = "";
                            if (display == 'show') {
                                var nodeIndex = findNodeIndex(d.subNodes[0], d.parent.children);
                                selected = (nodeIndex > -1) ? "selected" : "";
                            }
                            return 'node-badge ' + display + ' ' + selected;
                        })
                        .attr("height", 16)
                        .attr("width", function (d) {
                            var factor = 1;
                            if (d.subNodes && d != root) {
                                //factor = 1.6 for three or more digits, factor = 1.3 for two digits, factor = 1 for one digit
                                factor = (d.subNodes.length > 100) ? 1.6 : (d.subNodes.length < 10) ? 1 : 1.3;
                            }
                            return factor * 16; //increase the rectangle's width, based on number displayed within the badge
                        })
                        .attr("x", function (d) {
                            var factor = 1;
                            if (d.subNodes && d != root) {
                                //factor = 1.8 for three or more digits, factor = 1.3 for two digits, factor = 1 for one digit
                                factor = (d.subNodes.length > 100) ? 1.8 : (d.subNodes.length < 10) ? 1 : 1.3;
                            }
                            return factor * sizeRegistry[d.size ? d.size : 'medium'].xBadgeRectLeft;
                        })
                        .attr("y", function (d) {
                            return sizeRegistry[d.size ? d.size : 'medium'].yBadgeRectLeft;
                        })
                        .attr("rx", 3)  // Rounded corners
                        .attr("ry", 3); // Rounded corners

                    nodeGroupB.append("text")
                        .attr("x", function (d) {
                            var factor = 1;
                            if (d.subNodes && d != root) {
                                //factor = 2.7 for three or more digits, factor = 1.7 for two digits, factor = 1 for one digit
                                factor = (d.subNodes.length > 100) ? 2.7 : (d.subNodes.length < 10) ? 1 : 1.7;
                            }
                            return factor * sizeRegistry[d.size ? d.size : 'medium'].xBadgeTextLeft;
                        })
                        .attr("y", function (d) {
                            return sizeRegistry[d.size ? d.size : 'medium'].yBadgeTextLeft;
                        })
                        .attr('class', 'badge-text')
                        .attr("dy", ".35em")
                        .text(function (d) {
                            return (d.subNodes && d != root) ? d.subNodes.length : "";
                        })
                        .style("fill-opacity", 1);

                    // Update the text to reflect whether node has children or not.
                    var nodeLabel = node.select('.nodeText')
                        .attr("x", function (d) {
                            var xNodeLabel = sizeRegistry[d.size ? d.size : 'medium'].xNodeLabel;
                            var xLeafNodeLabel = sizeRegistry[d.size ? d.size : 'medium'].xLeafNodeLabel;
                            // Adjust the node label placement. subNodes labels should be placed on the right
                            return (d.subNodes) ? xLeafNodeLabel : (d.children || d._children) ? xNodeLabel : xLeafNodeLabel;

                        })
                        .attr("y", function (d) {
                            var yValue = sizeRegistry[d.size ? d.size : 'medium'].yNodeLabel;
                            return d.children || d._children ? yValue : 0;
                        })
                        .attr("text-anchor", function (d) {
                            return d.children || d._children ? "middle" : "start";
                        })
                        .attr("title", function (d) {
                            return d.name;
                        })
                        .text(function (d) {
                            if (d.name.length > config.maxLabelSize)
                                return d.name.substring(0, config.maxLabelSize) + '...';
                            else
                                return d.name;
                        });

                    var subNodeLine = svgGroup.selectAll('g[subnode = "true"]').append("line")
                        .attr({ "x1": function (d) { return sizeRegistry[d.size ? d.size : 'medium'].value/2    }, // center align the line, based on size
                            "y1": function (d) { return -(sizeRegistry[d.size ? d.size : 'medium'].value/2) }, // y1 = -x1
                            "x2": function (d) { return sizeRegistry[d.size ? d.size : 'medium'].value/2    }, // center align the line, based on size
                            "y2": function (d) { return -(config.nodeSpacing.verticalGap-sizeRegistry[d.size ? d.size : 'medium'].value/2) }, //length of the line depends on verticalGap
                            "class": "subNodeLine show"
                        });

                    var nodesWithAddOn = svgGroup.selectAll('g[data-addOn = "true"]');

                    var addOnElementLine = nodesWithAddOn.append("line")
                        .attr({ "x1": function (d) { return sizeRegistry[d.size ? d.size : 'medium'].value/2 }, // center align the line, based on size
                            "y1": function (d) {
                                var value = sizeRegistry[d.size ? d.size : 'medium'].value / 2;
                                value = d.addOn.position && d.addOn.position == "bottom" ? value : (value * -1) ;
                                return value;
                            },
                            "x2": function (d) { return sizeRegistry[d.size ? d.size : 'medium'].value/2 }, // center align the line, based on size
                            "y2": function (d) {
                                var value = addOnElementLineHeight - (sizeRegistry[d.size ? d.size : 'medium'].value / 2);
                                value = d.addOn.position && d.addOn.position == "bottom" ? value : (value * -1) ;
                                return value;
                            },
                            "class": "link addOn"
                        });

                    /**
                     * Returns addOn elements size.
                     * @param d
                     * @returns {String} - size.
                     */
                    var getAddOnSize = function (d) {
                        return d.addOn.size ? d.addOn.size : 'medium';
                    };

                    /**
                     * Returns addOn elements size from sizeRegistry.
                     * @param d
                     * @returns {String} - value.
                     */
                    var addOnElementSize = function (d) {
                        return sizeRegistry[getAddOnSize(d)].value;
                    };

                    /**
                     * Returns addOn elements anchor size from sizeRegistry.
                     * @param d
                     * @returns {String} - value.
                     */
                    var addOnElementAnchorSize = function (d) {
                        return nodePositionOffset[getAddOnSize(d)];
                    };

                    var addOnElement = nodesWithAddOn.append("g")
                        .attr({
                            "class": "node addOn",
                            "data-type": function (d) {
                                return (d.type) ? d.type : "";
                            },
                            "transform": function (d, i) {
                                var generatePosition = function (position) {
                                    var addOnSize = getAddOnSize(d),
                                        nodeSize = d.size ? d.size : 'medium',
                                        xPosition = sizeRegistry[addOnSize].xAddOnEl[nodeSize],
                                        yPosition = sizeRegistry[addOnSize].yAddOnEl[position];
                                    return "translate(" + xPosition + ", " + yPosition + ")";
                                };
                                return d.addOn.position ? generatePosition(d.addOn.position) : generatePosition('top');
                            }})
                        .on('click', function (d) {
                            events.addOnClick(d, d3.event);
                        });

                    addOnElement.append("circle")
                        .attr({
                            "class": "node-anchor",
                            "r": function (d) {
                                return sizeRegistry[getAddOnSize(d)].nodeRadius;
                            },
                            "cx": addOnElementAnchorSize,
                            "cy": addOnElementAnchorSize
                        })
                        .style("fill-opacity", 0.5);

                    addOnElement.append("image")
                        .attr({
                            "xlink:href": function (d) {
                                return config.icons[d.addOn.type];
                            },
                            "width": addOnElementSize,
                            "height": addOnElementSize
                        });

                    var addOnElementTitle = addOnElement.append("g");

                    addOnElementTitle.append("title")
                        .text(function (d) {
                            return d.addOn && d.addOn.name;
                        });

                    addOnElementTitle.append("text")
                        .attr({
                            "class": "nodeText",
                            "y": function (d) {
                                return d.addOn.position && d.addOn.position == "top" ? "-10" : sizeRegistry[getAddOnSize(d)].yAddOnElLabel.bottom;
                            }})
                        .text(function (d) {
                            return d.addOn && d.addOn.name;
                        })
                        .style("fill-opacity", 1);

                    // Transition nodes to their new position.
                    var nodeUpdate = node.transition()
                        .duration(animationDuration)
                        .attr("transform", function (d, i) {
                            return "translate(" + (d.y) + "," + (d.x) + ")";
                        })
                        .each("end", function () {
                            if (!loadFinished) {
                                loadFinished = true;
                                centerNode(root);
                            }
                        });

                    // Fade the text in
                    nodeUpdate.select("text")
                        .style("fill-opacity", 1);

                    nodeUpdate.select("rect")
                        .attr("class", function (d) {
                            var cssClass = "";
                            if (d.childrenState === "collapsed") {
                                if (d.groupNode) {
                                    cssClass = "node-rect collapsed group-node";
                                }
                                else {
                                    cssClass = "node-rect collapsed";
                                }
                            }
                            else if (d.childrenState === "expanded") {
                                if (d.groupNode) {
                                    cssClass = "node-rect expanded group-node";
                                }
                                else {
                                    cssClass = "node-rect expanded";
                                }
                            } else {
                                // needed for subNodes, otherwise a rectangle is displayed over the node image
                                cssClass = "node-rect expanded";
                            }
                            cssClass += (d.size) ? (" " + d.size) : " medium ";
                            return cssClass;
                        })
                        .attr("x", function (d) {
                            // Account for 30px rect size. nodePositionOffset.medium is set to 20 so that the center of the rect aligns with the node's center
                            // return -nodePositionOffset.medium;
                            return 0;
                        })
                        .attr("y", function (d) {
                            // Account for 30px rect size. nodePositionOffset.medium is set to 20 so that the center of the rect aligns with the node's center
                            return -nodePositionOffset[ d.size ] || -nodePositionOffset.medium;
                        })
                        .attr("rx", 5)  // Rounded corners
                        .attr("ry", 5); // Rounded corners

                    nodeUpdate.select("image")
                        .attr("class", function (d) {
                            var cssClass = "";
                            if (d.childrenState === "collapsed") {
                                if (d.groupNode) {
                                    cssClass = "node-image collapsed group-node ";
                                }
                                else {
                                    cssClass = "node-image collapsed ";
                                }
                            }
                            else if (d.childrenState === "expanded") {
                                if (d.groupNode) {
                                    cssClass = "node-image expanded group-node";
                                }
                                else {
                                    cssClass = "node-image expanded";
                                }
                            }
                            cssClass += (d.size) ? (" " + d.size) : " medium ";
                            return cssClass;
                        })
                        .attr("x", function (d) {
                            // Account for 30px icon size. nodePositionOffset.medium is set to 20 so that the center of the image aligns with the node's center
                            return 0;
                            // return -nodePositionOffset.medium;
                        })
                        .attr("y", function (d) {
                            // Account for 30px icon size. nodePositionOffset.medium is set to 20 so that the center of the image aligns with the node's center
                            return -nodePositionOffset[ d.size ] || -nodePositionOffset.medium;
                        })
                        .attr("xlink:href", function (d) {
                            var iconImage = (d.type) ? config.icons[d.type] : "";
                            return iconImage;
                        });

                    nodeUpdate.select(".node-innerText")
                        .attr("x", function (d) {
                            // Account for 30px rect size.
                            // TODO: This return value needs to be modified if the rect is changed from 30px
                            var chLen = (d._children) && d._children.length;
                            if (chLen < 10) {
                                return 12;
                            }
                            else if (chLen > 9 && chLen < 100) {
                                return 8;
                            }
                            else if (chLen > 99 && chLen < 1000) {
                                return 6;
                            }
                        })
                        .attr("y", function (d) {
                            // Account for 30px rect size.
                            // TODO: This return value needs to be modified if the rect is changed from 30px
                            return 4;
                        })
                        .attr("class", function (d) {
                            var cssClass = "node-innerText ";
                            if (d.childrenState === "collapsed") {
                                if (d.groupNode) {
                                    cssClass += "collapsed group-node";
                                }
                                else {
                                    cssClass += "collapsed";
                                }
                            }
                            else if (d.childrenState === "expanded") {
                                if (d.groupNode) {
                                    cssClass += "expanded group-node";
                                }
                                else {
                                    cssClass += "expanded";
                                }
                            }
                            return cssClass;
                        })
                        .text(function (d) {
                            var text = (d._children) ? d._children.length : 0;
                            return (d.childrenState === "collapsed") ? text : "";
                        })

                    // Transition exiting nodes to the parent's new position.
                    var nodeExit = node.exit().transition()
                        .duration(animationDuration)
                        .attr("transform", function (d) {
                            return "translate(" + (source.y) + "," + (source.x) + ")";
                        })
                        .remove();

                    nodeExit.select("circle")
                        .attr("r", 0);

                    nodeExit.select("text")
                        .style("fill-opacity", 0);
                }

                /** Function that draws links on the SVG canvas
                 * @param  {array} links - Array of links
                 * @param  {object} source - Root of the tree data
                 */
                function drawLinks(links, source) {

                    var link = svgGroup.selectAll("path.link")
                        .data(links, function (d) {
                            return d.target.index;
                        });

                    // Enter any new links at the parent's previous position.
                    var linkEnter = link.enter().insert("path", "g")
                        .attr("class", function (d) {
                            if (d.target.subNodes) {
                                // check if first subNode is attached
                                var nodeIndex = findNodeIndex(d.target.subNodes[0], d.target.parent.children);
                                return (nodeIndex > -1) ? "link subnode-badge" + d.target.id + " badge-selected" : "link subnode-badge" + d.target.id + " ";
                            } else {
                                return "link"; //link styling class
                            }
                        })
                        .attr("data-type", function(d){
                            return (d.target.link && d.target.link.type) ? d.target.link.type : "";
                        })
                        .attr("d", function (d) {
                            var o = {
                                x: source.x0,
                                y: source.y0
                            };
                            return diagonal({
                                source: o,
                                target: o
                            });
                        })
                        .on('click', linkClick)
                        .on('mouseover', linkMouseOver)
                        .on('mouseout', linkMouseOut);

                    // Transition links to their new position.
                    link.transition()
                        .duration(animationDuration)
                        .attr("d", diagonal);

                    // Transition exiting nodes to the parent's new position.
                    link.exit().transition()
                        .duration(animationDuration)
                        .attr("d", function (d) {
                            var o = {
                                x: source.x,
                                y: source.y
                            };
                            return diagonal({
                                source: o,
                                target: o
                            });
                        })
                        .remove();

                    // Update the link image
                    var linkimage = svgGroup.selectAll("g.link")
                        .data(links, function (d) {
                            return d.target.index;
                        });

                    var linkimageEnter = linkimage.enter()
                        .insert("g")
                        .attr("class", function (d) {
                            if (d.target.subNodes) {
                                // check if first subNode is attached
                                var nodeIndex = findNodeIndex(d.target.subNodes[0], d.target.parent.children);
                                return (nodeIndex > -1) ? "link subnode-badge" + d.target.id + " badge-selected" : "link subnode-badge" + d.target.id + " ";
                            } else {
                                return "link"; //link styling class
                            }
                        })
                        .attr("transform", function (d) {
                            return "translate(" + source.y0 + "," + source.x0 + ")";
                        })
                        .on('click', linkIconClick)
                        .on('mouseover', linkIconMouseOver)
                        .on('mouseout', linkIconMouseOut);

                    linkimageEnter.append('circle')
                        .attr({
                            "cx": function (d) {
                                return sizeRegistry[(d.target.link && d.target.link.size) ? d.target.link.size : 'small'].xLinkAnchor;
                            },
                            "cy": function (d) {
                                return sizeRegistry[(d.target.link && d.target.link.size) ? d.target.link.size : 'small'].yLinkAnchor;
                            },
                            "class": "link-anchor",
                            "r": function (d) {
                                return sizeRegistry[(d.target.link && d.target.link.size) ? d.target.link.size : 'small'].nodeRadius;
                            },
                            opacity: "0.5"
                        });

                    linkimageEnter.append("image")
                        .attr("x", function (d) {
                            return sizeRegistry[(d.target.link && d.target.link.size) ? d.target.link.size : 'small'].xLinkImg;
                        })
                        .attr("y", function (d) {
                            return sizeRegistry[(d.target.link && d.target.link.size) ? d.target.link.size : 'small'].yLinkImg;
                        })
                        .attr("width", function (d) {
                            return sizeRegistry[(d.target.link && d.target.link.size) ? d.target.link.size : 'small'].value;
                        })
                        .attr("height", function (d) {
                            return sizeRegistry[(d.target.link && d.target.link.size) ? d.target.link.size : 'small'].value;
                        })
                        .attr("xlink:href", function (d) { return (d.target.link && d.target.link.type) ? config.icons[ d.target.link.type ] : ""; })

                    // Transition link images to their new positions
                    var linkImageUpdate = linkimage.transition()
                        .duration(animationDuration)
                        .attr("transform", function (d) {
                            return "translate(" + ((d.source.y + d.target.y) / 2) + "," + ((d.source.x + d.target.x) / 2) + ")";
                        });

                    linkImageUpdate.select('image')
                        .attr("xlink:href", function (d) {
                            var iconImage = (d.target.link && d.target.link.type) ? config.icons[ d.target.link.type ] : "";
                            return iconImage;
                        });

                    //Transition exiting link image to the parent's new position.
                    linkimage.exit().transition()
                        .duration(animationDuration)
                        .attr("transform", function (d) { return "translate(" + source.y + "," + source.x + ")"; })
                        .remove();

                    if (config.showArrowHead) {

                        var linkArrow = svgGroup.selectAll("g.link-arrow")
                            .data(links, function (d) {
                                return d.target.index;
                            });

                        var linkArrowEnter = linkArrow.enter()
                            .insert("g")
                            .attr("class", function (d) {
                                if (d.target.subNodes) {
                                // check if first subNode is attached
                                var nodeIndex = findNodeIndex(d.target.subNodes[0], d.target.parent.children);
                                    return (nodeIndex > -1) ? "link-arrow link subnode-badge" + d.target.id + " badge-selected" : "link-arrow link subnode-badge" + d.target.id + " ";
                                } else {
                                    return "link-arrow link"; //link styling class
                                }
                            })
                            .attr("data-type", function(d){
                                return (d.target.link && d.target.link.type) ? d.target.link.type : "";
                            })
                            .attr("transform", function (d) {
                                return "translate(" + source.y0 + "," + source.x0 + ")";
                            })
                            .append("polygon")
                            .attr("points", "-5 -2.5,-5 2.5,0 0");

                        // Transition link images to their new positions
                        linkArrow.transition()
                            .duration(animationDuration)
                            .attr("transform", function (d) {
                                return "translate(" + d.target.y + "," + d.target.x + ")";
                            })

                        //Transition exiting link arrow to the parent's new position.
                        linkArrow.exit().transition()
                            .duration(animationDuration)
                            .attr("transform", function (d) { return "translate(" + source.y + "," + source.x + ")"; })
                            .remove();
                    }
                }

                /** Function that computes tree layout and renders nodes and links
                 * @param  {object} source - Root of the tree data
                 */
                function update(source) {
                    // Compute the new height, function counts total children of root node and sets tree height accordingly.
                    // This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
                    // This makes the layout more consistent.
                    var levelWidth = [ 1 ];
                    var childCount = function (level, n) {
                        if (n.children && n.children.length > 0) {
                            if (levelWidth.length <= level + 1) levelWidth.push(0);
                            levelWidth[ level + 1 ] += n.children.length;
                            n.children.forEach(function (d) {
                                childCount(level + 1, d);
                            });
                        }
                    };
                    childCount(0, root);
                    var newHeight = d3.max(levelWidth) * config.nodeSpacing.verticalGap;
                    // $(".topology-outer").height(newHeight); // Can be used for showing a scrollbar on the container rather than allowing zoom + pan
                    tree = tree.size([ newHeight, config.viewerDimensions.width ]);

                    // Compute the new tree layout.
                    var nodes = tree.nodes(root).reverse();

                    // Set widths between levels based on maxLabelLength.
                    nodes.forEach(function (d) {
                        if (d.subNodeHostNodeId) {
                            var subNodes = [];
                            subNodes = getSubnodesArray(d, d.parent.children);
                            if (subNodes && subNodes[0].length > 0) {
                                var index = findNodeIndex(d, subNodes[0]);
                                // To show that they are grouped, all the subNodes have to be moved closer to the host node
                                // The subNode closest to the host node (index = 0) has to be adjusted by a smaller vertical spacing than the next subNode (index = 1)
                                // if index = 0, reduce d.x by 7
                                // if index = 1, reduce d.x by 21
                                // if index = 2, reduce d.x by 35
                                d.x = d.x - (7 * (index * 2 + 1));
                            }
                        }
                        // d.y = (d.depth * (maxLabelLength * 10)); //maxLabelLength * 10px
                        // alternatively to keep a fixed scale one can set a fixed depth per level
                        // Normalize for fixed-depth by commenting out below line
                        // d.y = (d.depth * 500); //500px per level.
                        d.y = (d.depth * config.nodeSpacing.horizontalGap);

                        // Find max depth
                        totalDepth = (d.depth > totalDepth) ? d.depth : totalDepth;
                    });

                    var links = tree.links(nodes);

                    drawNodes(nodes, source);

                    drawLinks(links, source);

                    // Stash the old positions for transition.
                    nodes.forEach(function (d) {
                        d.x0 = d.x;
                        d.y0 = d.y;
                    });

                }

                // Append a group which holds all nodes and which the zoom Listener can act upon.
                var svgGroup = baseSvg.append("g").attr("class", "outer-group");

                // Define the root
                root = $.extend(true, {}, dataset); //create a deep data copy from conf.
                root.x0 = config.viewerDimensions.height / 2;
                root.y0 = 0;

                // Layout the tree initially and center on the root node.
                update(root);
                (loadFinished) && centerNode(root);

            };

            /**
             * Method which returns visual updates which is needed on re-render.
             * For updates, the baseView sends the returned object into child view, effectively helping re-renders to retain visual state.
             * @returns {Object} visual update options.
             */
            this.getVisualUpdates = function () {
                var baseSvg = treeView[0][0].baseViewSvg,
                    expandedSubNodeBadges = baseSvg.selectAll(".node-badge.selected"),
                    expandedSubNodes = [];

                //Collect node ids for which subnodes are expanded.
                expandedSubNodeBadges.each(function (d, i) {
                    expandedSubNodes.push(d.id);
                });

                return {
                    expandedSubNodes: expandedSubNodes
                }
            }
        }

        /**
         * Construct a TreeView inherited from BaseView.
         * @constructor
         * @class TreeView
         */
        var TreeView = BaseView.extend({
            /**
             * Renders the tree view.
             * @inner
             */
            renderVisual: function (options) {
                if (options && options.lastSeenLocation) {
                    outerGroupLocation = options.lastSeenLocation
                }
                this.renderTree(options);
            },
            /**
             * Renders the tree view by calling buildTopology.
             * @inner
             */
            renderTree: function (options) {
                var config = $.extend(true, {}, this.options);
                this.events = (options && options.events) ? options.events : d3.dispatch("nodeClick", "addOnClick", "nodeDbClick", "nodeMouseOver", "nodeMouseOut", "nodeAdded", "nodeRemoved", "nodeReassigned", "linkClick", "linkMouseOver", "linkMouseOut", "linkIconClick", "linkIconMouseOver", "linkIconMouseOut");
                this.visualUpdates = (options && options.visualUpdates) ? options.visualUpdates : {};

                this.TreeTopology;
                var dataset = $.extend(true, {}, config.data); //create a deep data copy from conf.

                if (this.TreeTopology) {
                    this.TreeTopology.buildTopology(dataset, {visualUpdates: this.visualUpdates});
                } else {
                    this.TreeTopology = d3.select(this).call(TreeVisual, config, this.events);
                    this.TreeTopology.buildTopology(dataset);
                }
            },
            /**
             * Returns events attached on the tree view.
             * @inner
             * @returns {Object} events object.
             */
            getEvents: function () {
                return this.events;
            },
            /**
             * Returns current state of of the visual to help with re-render.
             * @returns {Object} visual update options
             */
            getVisualUpdates: function () {
                return this.TreeTopology.getVisualUpdates();
            },
            /**
             * Returns last seen coordinates of the outer-group SVG container.
             * @inner
             * @returns {String} transform attr.
             */
            getLastSeenLocation: function () {
                return $(this.options.container[0]).find('g.outer-group').attr('transform');
            }
        });

        return TreeView;
    });