/**
 * A module that builds a force directed view based on the provided JSON data.
 * @module GraphBuilder
 * @author Viswesh Subramanian <vissubra@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define([
        'lib/template_renderer/template_renderer',
        'widgets/topology/lib/tree/treeTopologyTemplates',
        'widgets/topology/lib/tooltipBuilder',
        'widgets/topology/lib/baseView',
        'widgets/topology/lib/constants',
        'widgets/topology/lib/flat/graphRegistry',
        'd3'
    ],
    function (render_template, topologyTemplates, TooltipBuilder, BaseView, topologyConstants, graphRegistry) {

        var outerGroupLocation;

        /**
         *  Draws graph topology
         *  @param {Object} graphView - graphView instance.
         *  @param {Object} config - topology config.
         *  @param {Object} events - graphView instance d3 events.
         */
        function buildTopology(graphView, config, events) {
            var baseSvg = graphView[0][0].baseViewSvg,
                svgGroup,
                sizeRegistry = graphRegistry.size,
                root,
                width = config.viewerDimensions.width,
                height = config.viewerDimensions.height,
                force,
                initialTicks = 150,
                zoomListener = d3.behavior.zoom().scaleExtent([0.5,2]).on("zoom", zoom),
                tooltipBuilder = new TooltipBuilder(),
                allowHighlight = false,
                linkedByIndex = {}, //Connection registry for easy lookup when highlighting nodes and paths.
                nodes,
                paths;

            /**
             * Function that computes graph layout and renders nodes and links
             */
            function update() {
                var normalizedLinks = [];

                //Normalize Links
                root.links.forEach(function (link) {
                    var resultLink = $.extend({}, link);

                    var sourceNode = _.find(root.nodes, function (node) {
                            return node.id === link.source;
                        }),
                        targetNode = _.find(root.nodes, function (node) {
                            return node.id === link.target;
                        });

                    resultLink['source'] = sourceNode;
                    resultLink['target'] = targetNode;

                    sourceNode && targetNode && normalizedLinks.push(resultLink);
                    linkedByIndex[link.source + "," + link.target] = 1; //connected links.
                });

                root.nodes.forEach(function (node) {
                    linkedByIndex[node.id + "," + node.id] = 1; //connected nodes (connected to self).
                });

                if (config.showArrowHead) {
                    generateArrows(svgGroup)
                }

                force = d3.layout.force()
                    .nodes(root.nodes)
                    .links(normalizedLinks)
                    .size([width, height])
                    .linkStrength(0.1)
                    .linkDistance(20)
                    .distance(150)
                    .charge(-800);

                var paths = drawLinks();
                var nodes = drawNodes();

                if (config.allowZoomAndPan) {
                    setupZoomInteraction();
                }

                var getSiblingLinks = function (source, target) {
                    var siblings = [];
                    for (var index = 0; index < normalizedLinks.length; ++index) {
                        if ((normalizedLinks[index].source.id == source.id && normalizedLinks[index].target.id == target.id) ||
                            (normalizedLinks[index].source.id == target.id && normalizedLinks[index].target.id == source.id))
                            siblings.push(normalizedLinks[index].id);
                    }
                    return siblings;
                };

                /**
                 * Generates arcs for links
                 * @param {Boolean} leftHand - used to swap path directions.
                 * @param {Object} d - d3 object.
                 * @returns {string} path d attribute.
                 * @inner
                 */
                function arcPath(leftHand, d) {
                    var source = d.source,
                        target = d.target,
                        sourcePos = getMidPos(target, source),
                        targetPos = getMidPos(source, target),
                        x1 = leftHand ? sourcePos.x : targetPos.x,
                        y1 = leftHand ? sourcePos.y : targetPos.y,
                        x2 = leftHand ? targetPos.x : sourcePos.x,
                        y2 = leftHand ? targetPos.y : sourcePos.y;

                    var dx = x2 - x1,
                        dy = y2 - y1,
                        dr = Math.sqrt(dx * dx + dy * dy),
                        drx = dr,
                        dry = dr,
                        sweep = leftHand ? 0 : 1,
                        xRotation = 0,
                        largeArc = 0,
                        siblings = getSiblingLinks(source, target),
                        siblingCount = siblings.length;

                    if (siblingCount > 1) {
                        var arcScale = d3.scale.ordinal()
                            .domain(siblings)
                            .rangePoints([1, siblingCount]);
                        drx = drx / (1 + (1 / siblingCount) * (arcScale(d.id) - 1));
                        dry = dry / (1 + (1 / siblingCount) * (arcScale(d.id) - 1));
                    }

                    /**
                     * Returns xy coordinates such that node does not intersect with path.
                     * @param  {object} source - source Node
                     * @param  {object} target - target Node
                     * @returns {object}
                     */
                    function getMidPos(source, target) {
                        var x = source.x,
                            y = source.y,
                            midValue = (size(source) / 2),
                            lowerLimitx = target.x - midValue,
                            lowerLimity = target.y - midValue,
                            uperLimitx = target.x + midValue,
                            uperLimity = target.y + midValue,
                            midpointx = (lowerLimitx + uperLimitx) / 2,
                            midpointy = (lowerLimity + uperLimity) / 2,
                            midRatio = (midpointy - y) / (midpointx - x),
                            difference,
                            finalCoordinatexy;

                        if (x <= midpointx) {
                            difference = (lowerLimitx - x);
                            finalCoordinatexy = (midRatio * difference) + y;
                            if (lowerLimity <= finalCoordinatexy && finalCoordinatexy <= uperLimity) {
                                return {x: lowerLimitx, y: finalCoordinatexy};
                            }
                        } else if (x >= midpointx) {
                            difference = (uperLimitx - x);
                            finalCoordinatexy = (midRatio * difference) + y;
                            if (lowerLimity <= finalCoordinatexy && finalCoordinatexy <= uperLimity) {
                                return {x: uperLimitx, y: finalCoordinatexy};
                            }
                        }

                        if (y <= midpointy) {
                            difference = (lowerLimity - y);
                            finalCoordinatexy = difference / midRatio + x;
                            if (lowerLimitx <= finalCoordinatexy && finalCoordinatexy <= uperLimitx) {
                                return {x: finalCoordinatexy, y: lowerLimity};
                            }
                        } else if (y >= midpointy) {
                            difference = (uperLimity - y);
                            finalCoordinatexy = difference / midRatio + x;
                            if (lowerLimitx <= finalCoordinatexy && finalCoordinatexy <= uperLimitx) {
                                return {x: finalCoordinatexy, y: uperLimity};
                            }
                        }
                    };

                    return "M" + x1 + "," + y1 + "A" + drx + ", " + dry + " " + xRotation + ", " + largeArc + ", " + sweep + " " + x2 + "," + y2;
                }

                /**
                 * Generate SVG markers
                 * @param {Object} container - baseSVG container.
                 */
                function generateArrows(container) {
                    // right arrow
                    container.append("svg:defs").selectAll("marker")
                        .data(normalizedLinks)
                        .enter().append("svg:marker")
                        .attr({
                            "id": function (d) {
                                return 'rightArrow-' + d.id;
                            },
                            "viewBox": "0 -5 10 10",
                            "refX": 15,
                            "refY": 0,
                            "markerWidth": 6,
                            "markerHeight": 6,
                            "orient": "auto"
                        })
                        .append("svg:path")
                        .attr({
                            "d": "M0,-5L10,0L0,5",
                            "class": "link-arrow",
                            "data-type": function (d) {
                                return d.type;
                            }
                        });

                    //left arrow
                    container.append("defs").selectAll("marker")
                        .data(normalizedLinks)
                        .enter().append("svg:marker")
                        .attr({
                            "id": function (d) {
                                return "leftArrow-" + d.id;
                            },
                            "viewBox": "0 -5 10 10",
                            "refX": -5,
                            "markerWidth": 6,
                            "markerHeight": 6,
                            "orient": "auto"
                        })
                        .append("path")
                        .attr({
                            "d": "M0,0L10,-5L10,5Z",
                            "class": "link-arrow",
                            "data-type": function (d) {
                                return d.type;
                            }
                        })
                }

                force.on("tick", function () {
                    nodes.attr("transform", function (d) {
                        return "translate(" + d.x + "," + d.y + ")";
                    });

                    paths.attr("d", function (d) {
                        return arcPath(true, d);
                    });
                });

                force.on("start", function () {
                    allowHighlight = false; //Do not allow highlighting during node drag to avoid flickers.
                });

                force.on("end", function () {
                    allowHighlight = true;
                    resetNodesPaths();
                });

                force.start();

                config.container.off("topology-render-complete").on("topology-render-complete", function () {
                    stabilizeVisual();
                });

            }

            /**
             * To stabilize the visual, number of initial ticks is set.
             * @inner
             */
            function stabilizeVisual() {
                for (var index = initialTicks || 200; index > 0; --index) force.tick();
                force.stop();
                center();
            }

            /**
             * Center visual
             * @inner
             */
            function center() {
                var fit = root.nodes.length > 20 ? true : false, //Implicitly decide whether to fit based on node length.
                    transitionDuration = 500,
                    bounds = svgGroup.node().getBBox(),
                    $parent = $(baseSvg[0]),
                    fullWidth = $parent.width(),
                    fullHeight = $parent.height(),
                    width = bounds.width,
                    height = bounds.height,
                    padding = 60,
                    midX = bounds.x + width / 2,
                    midY = bounds.y + height / 2;

                if (width == 0 || height == 0) return; // nothing to fit
                var scale = fit ? (0.75) / Math.max(width / fullWidth, height / fullHeight) : 1,
                    translate = [fullWidth / 2 - scale * midX, (fullHeight / 2 - scale * midY) + padding];

                //console.trace("zoomFit", translate, 0);
                svgGroup
                    .transition()
                    .duration(transitionDuration || 0) // milliseconds
                    .call(zoomListener.translate(translate).scale(scale).event);
            }

            /**
             * Returns size based on node size config.
             * @param d
             * @returns {number}
             */
            function size (d) {
                return sizeRegistry[d.size ? d.size : 'medium'].value;
            }

            /**
             * Draws nodes
             * @inner
             */
            function drawNodes() {
                nodes = svgGroup.selectAll('g.node')
                    .data(root.nodes);

                var node = nodes.enter()
                    .append('g')
                    .call(force.drag)
                    .attr('class', 'node')
                    .on({
                        'mousedown': function () {
                            if (config.allowZoomAndPan) {
                                //stopPropagation - when zoom is enabled, allow node drag.
                                d3.event.stopPropagation();
                            }
                        },
                        'click': nodeClick,
                        'mouseover': nodeMouseOver,
                        'mouseout': nodeMouseOut
                    });

                /**
                 * Returns node position based on size.
                 * @param d
                 * @returns {number}
                 */
                var nodePosition = function (d) {
                    return -(size(d) / 2);
                };

                var nodeAttributes = {
                    "width": size,
                    "height": size,
                    "x": nodePosition,
                    "y": nodePosition
                };

                node.append("image")
                    .attr(nodeAttributes)
                    .attr({
                        "xlink:href": function (d) {
                            return config.icons[d.type];
                        }
                    });

                node.append("rect")
                    .attr(nodeAttributes)
                    .attr({
                        "class": "node-selected",
                        "rx": 4,
                        "stroke-width": 3
                    });

                var titleGroup = nodes.append("g");

                titleGroup.append("title")
                    .text(function (d) {
                        return d.name;
                    });

                titleGroup.append("text")
                    .attr({
                        "x": size,
                        "class": "nodeText"
                    })
                    .text(function (d) {
                        return d.name
                    });

                nodes.exit().transition().remove();

                /**
                 * Node clicked.
                 * @param  {object} d - Node
                 * @param  {object} i - Index of the Node
                 */
                function nodeClick(d, i) {
                    d3.selectAll(".node-selected.show")
                        .classed('show', false);

                    d3.select(this)
                        .select(".node-selected")
                        .classed('show', true);
                    events.nodeClick(d, i);
                }

                /**
                 * Node moused over.
                 * @param  {object} d - Node
                 * @param  {object} i - Index of the Node
                 */
                function nodeMouseOver(d, i) {
                    var nodeEl = d3.select(this);
                    addTooltip(d, nodeEl, "NODE");
                    events.nodeMouseOver(d, i, nodeEl);

                    //Highlight neighboring nodes and links.
                    if (allowHighlight) {
                        var selectedNode = d3.select(this).datum();

                        nodes
                            .filter(function (node) {
                                return !isConnected(selectedNode, node) && !isConnected(node, selectedNode);
                            })
                            .classed('mute', true);

                        paths
                            .filter(function (path) {
                                return !isConnected(selectedNode, path.source) && !isConnected(selectedNode, path.target);
                            })
                            .classed('mute', true);
                    }

                    /**
                     * Looks up path connections registry.
                     * @param {object} a - Node
                     * @param {object} b - Node
                     * @returns {Number}
                     */
                    function isConnected(a, b) {
                        return linkedByIndex[a.id + "," + b.id];
                    }

                }

                /**
                 * Node moused out.
                 * @param  {object} d - Node
                 * @param  {object} i - Index of the Node
                 */
                function nodeMouseOut(d, i) {
                    var nodeEl = d3.select(this);
                    events.nodeMouseOut(d, i, nodeEl);

                    //Reset highlights
                    if (allowHighlight) {
                        resetNodesPaths();
                    }

                }


                return nodes;
            }

            /**
             * Draws links
             * @inner
             */
            function drawLinks() {
                var links = force.links();
                paths = svgGroup.append("svg:g").selectAll("path")
                    .data(links);

                paths.enter().append("svg:path")
                    .attr({
                        "class": function (d) {
                            return "link " + d.type;
                        },
                        "data-type": function (d) {
                            return (d.type) ? d.type : "";
                        },
                        "marker-end": function (d, i) {
                            return "url(#rightArrow-" + d.id + ")";
                        },
                        "marker-start": function (d, i) {
                            if (d.bidirectional) {
                                return "url(#leftArrow-" + d.id + ")";
                            }
                            return null;
                        }
                    })
                    .on({
                        'click': linkClick,
                        'mouseover': linkMouseOver,
                        'mouseout': linkMouseOut
                    });

                paths.exit().transition().remove();

                /**
                 * Link clicked.
                 * @param  {object} d - Node
                 * @param  {object} i - Index of the Node
                 */
                function linkClick(d, i) {
                    events.linkClick(d, i);
                }

                /**
                 * Link moused over.
                 * @param  {object} d - Node
                 * @param  {object} i - Index of the Node
                 */
                function linkMouseOver(d, i) {
                    events.linkMouseOver(d, i);
                }

                /**
                 * Link moused out.
                 * @param  {object} d - Node
                 * @param  {object} i - Index of the Node
                 */
                function linkMouseOut(d, i) {
                    events.linkMouseOut(d, i);
                }

                return paths;
            }

            /**
             * Function to add tooltip on hovering over a node or link
             * @param  {object} d - d3 object of node being hovered (in case of link icon, this object will consist of source and destination node of the link)
             * @param  {object} el - container of a node or link-icon where the mouseover event is triggered
             * @inner
             */
            function addTooltip (d, el, type) {
                var g = el[0];
                if(d && _.isObject(config.tooltip)) {
                    tooltipBuilder.addContentTooltips(g, d, config, type, config.topologyType);
                }
            }

            /**
             * Zooms visual based on scale.
             * @inner
             */
            function zoom() {
                var translatePosition = d3.event.translate;
                svgGroup.attr("transform", "translate(" + translatePosition + ")scale(" + zoomListener.scale() + ")");
            }

            /**
             * Handles zoom-in/out interaction.
             * @inner
             */
            function setupZoomInteraction() {
                // attaching zoomListener to baseSvg
                baseSvg.call(zoomListener);

                config.container.off("topology-zoom-in").on("topology-zoom-in", function () {
                    zoomin();
                });

                config.container.off("topology-zoom-out").on("topology-zoom-out", function () {
                    zoomout();
                });

                /**
                 * Handles zoom in on the visual.
                 * @inner
                 */
                function zoomin() {
                    var scaleFactor = 1.2;
                    rescale(scaleFactor);
                }

                /**
                 * Handles zoom out on the visual.
                 * @inner
                 */
                function zoomout() {
                    var currentScaleExtent = zoomListener.scaleExtent(),
                        currentScale = zoomListener.scale();

                    if (currentScale > currentScaleExtent[0]) { //Zoomout restriction based on scaleExtent defined.
                        var scaleFactor = 0.8;
                        rescale(scaleFactor);
                    }
                }

                /**
                 * Handles zoom in/out on the visual based on scaleFactor.
                 * @param {Integer} scaleFactor - topology config.
                 * @inner
                 */
                function rescale(scaleFactor) {
                    var _scaleFactor = (scaleFactor) ? scaleFactor : 1,
                        currentScale = zoomListener.scale(),
                        zoomAction = (_scaleFactor < 1) ? "zoomout" : "zoomin",
                        scale = (((currentScale * _scaleFactor) <= 3) && zoomAction === "zoomin" || (((currentScale * _scaleFactor) >= 0.1) && zoomAction === "zoomout")) ? (currentScale * _scaleFactor) : currentScale,
                        svgGroupPosition = zoomListener.translate(), //get x, y of current state of visual.
                        x = svgGroupPosition[0],
                        y = svgGroupPosition[1];

                    var transformProp = "translate(" + x + "," + y + ")scale(" + scale + ")";
                    baseSvg.select('.outer-group').transition()
                        .duration(0)
                        .attr("transform", transformProp);
                    outerGroupLocation = null;

                    zoomListener.scale(scale);
                }
            }

            /**
             * Resets nodes and path opacity.
             */
            function resetNodesPaths() {
                nodes.classed('mute', false);
                paths.classed('mute', false);
            }

            // Append a group which holds all nodes and which the zoom Listener can act upon.
            svgGroup = baseSvg.append("g").attr("class", "outer-group visible");

            // Define the root data
            root = $.extend(true, {}, config.data); //create a deep data copy from conf.
            update();
        }

        /**
         * Construct a GraphView inherited from BaseView.
         * @constructor
         * @class GraphView
         */
        var GraphView = BaseView.extend({
            /**
             * Renders the graph view.
             * @inner
             */
            renderVisual: function (options) {
                if (options && options.lastSeenLocation) {
                    outerGroupLocation = options.lastSeenLocation
                }
                this.renderGraph(options);
            },
            /**
             * Renders the graph view by calling buildTopology.
             * @inner
             */
            renderGraph: function (options) {
                var config = $.extend(true, {}, this.options);
                this.events = (options && options.events) ? options.events : d3.dispatch("nodeClick", "nodeMouseOver", "nodeMouseOut", "linkClick", "linkMouseOver", "linkMouseOut");
                d3.select(this).call(buildTopology, config, this.events);
            },
            /**
             * Returns events attached on the graph view.
             * @inner
             * @returns {Object} events object.
             */
            getEvents: function () {
                return this.events;
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

        return GraphView;
    });