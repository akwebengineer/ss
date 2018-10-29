/**
 * A module that builds a chord view based on the provided JSON data.
 * @module ChordBuilder
 * @author Viswesh Subramanian <vissubra@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define([
        'lib/template_renderer/template_renderer',
        'widgets/topology/lib/tree/treeTopologyTemplates',
        'widgets/topology/lib/tooltipBuilder',
        'widgets/topology/lib/baseView',
        'widgets/topology/lib/constants',
        'widgets/topology/lib/chord/chordRegistry',
        'widgets/topology/lib/chord/matrixFactory',
        'd3'
    ],
    function (render_template, topologyTemplates, TooltipBuilder, BaseView, topologyConstants, chordRegistry, matrixFactory) {

        var outerGroupLocation;

        /**
         *  Draws Chord topology
         *  @param {Object} chordView - chordView instance.
         *  @param {Object} config - topology config.
         *  @param {Object} events - chordView instance d3 events.
         */
        function ChordVisual (chordView, config, events) {
            var baseSvg = chordView[0][0].baseViewSvg,
                svgGroup,
                sizeRegistry = chordRegistry.layout,
                width = config.viewerDimensions.width,
                height = config.viewerDimensions.height,
                zoomListener = d3.behavior.zoom().scaleExtent([0.5,2]).on("zoom", zoom),
                margin = sizeRegistry.margin,
                chordWidth = width - sizeRegistry.topologyPadding,
                chordHeight = height - sizeRegistry.topologyPadding,
                innerRadius = (chordHeight / 2) - sizeRegistry.topologyPadding,
                colors = d3.scale.ordinal().range(['#655aa5', '#b073ae','#96a5aa', '#6398cf', '#000000', '#33afb0', '#697fe0', '#7186ac', '#ada97f', '#afa0a9','#b291ad']), //Default chord colors.
                tooltipBuilder = new TooltipBuilder();

            // Append a group which holds all nodes and which the zoom Listener can act upon.
            svgGroup = baseSvg.append("g").attr("class", "outer-group visible");

            if (outerGroupLocation) {
                svgGroup.attr("transform", transformProp);
            } else {
                svgGroup.attr("transform", null);
            }

            d3.select(baseSvg[0][0]).attr("viewBox","0 0 " + width + " "+height);

            var chord = d3.layout.chord()
                .padding(sizeRegistry.chordPadding)
                .sortGroups(d3.descending)
                .sortSubgroups(d3.ascending);

            var matrix = matrixFactory
                .layout(chord)
                .filter(function (item, row, column) {
                    //Build square matrix which is required to render chord visual.
                    return (item.source === row.name && item.target === column.name) ||
                        (item.source === column.name && item.target === row.name);
                })
                .reduce(function (items, row, column) {
                    //Deduce chord value for links from source to target and target to source.
                    var value;
                    if (!items[0]) {
                        value = 0;
                    } else {
                        value = items.reduce(function (m, n) {
                            if (row === column) {
                                return m + (n.flow1 + n.flow2);
                            } else {
                                return m + (n.source === row.name ? n.flow1: n.flow2);
                            }
                        }, 0);
                    }
                    return {value: value, data: items};
                });

            var arc = d3.svg.arc()
                .innerRadius(innerRadius)
                .outerRadius(innerRadius + sizeRegistry.arcWidth);

            var path = d3.svg.chord()
                .radius(innerRadius);

            var container = svgGroup.append("g")
                .attr("class", "container")
                .attr("transform", "translate(" + ((chordWidth / 2) + margin) + "," + ((chordHeight / 2) + margin) + ")");

            if (config.allowZoomAndPan) {
                setupZoomInteraction();
            }

            /**
             * Draws chords visual
             * @param {object} dataset - original dataset with nodes and links array.
             * @param {Object} options - update configuration.
             */
            this.drawChords = function (dataset, options) {

                if (options && !options.lastSeenLocation) {
                    baseSvg.select('.outer-group').attr('transform', null);
                }

                var linkMetric = config.chordContext;

                if (options && options.context) {
                    linkMetric = options.context;
                }

                var data = generateNormalizedLinks(dataset, linkMetric);

                matrix.data(data)
                    .resetKeys()
                    .addKeys(['source', 'target'], function(link, key) { //Providing callback function to retain sourceNode and targetNode for drawing use.
                        return link[key+"Node"];
                    })
                    .update();

                var nodes = container.selectAll("g.node")
                    .data(matrix.groups(), function (d) { return d._id; });

                var nodesEnter = nodes.enter()
                    .append("g")
                    .attr("class", "node");

                nodesEnter.append("path")
                    .style("pointer-events", "none")
                    .style("fill", function (d) { return colors(d._id); })
                    .attr("d", arc);

                var nodeText = function (d) {
                    return d.node && d.node.data && d.node.data.name;
                };

                var nodeLabel = nodesEnter.append("text")
                    .attr("dy", ".35em")
                    .on("click", nodeClick)
                    .on("mouseover", nodeMouseOver)
                    .on("mouseout", nodeMouseOut)
                    .text(nodeText);

                nodes.select("path")
                    .transition().duration(2000)
                    .attrTween("d", matrix.groupTween(arc));

                var nodeLabelUpdate = nodes.select("text")
                    .transition()
                    .duration(2000)
                    .attr("transform", function (d) {
                        d.angle = (d.startAngle + d.endAngle) / 2;
                        var r = "rotate(" + (d.angle * 180 / Math.PI - 90) + ")";
                        var t = " translate(" + (innerRadius + 26) + ")";
                        return r + t + (d.angle > Math.PI ? " rotate(180)" : " rotate(0)");
                    })
                    .text(nodeText)
                    .attr("text-anchor", function (d) {
                        return d.angle > Math.PI ? "end" : "begin";
                    });

                nodes.exit().select("text").attr("fill", "orange");
                nodes.exit().select("path").remove();

                nodes.exit().transition().duration(1000)
                    .style("opacity", 0).remove();

                var chords = container.selectAll("path.chord")
                    .data(matrix.chords(), function (d) { return d._id; });

                var chordClass  = function (d) {
                    var returnVal = "chord ";
                    var link = _.first(d.source.value.data);

                    if(d.source._id === d.target._id && link && link.orphanLink) {
                        returnVal = returnVal + " hide"; //Hide Orphan nodes ribbons.
                    }

                    return returnVal;
                };

                chords.enter().append("path")
                    .attr("class", chordClass)
                    .attr("data-type", function (d) {
                        var links = getLinks(d);

                        return links && config.linkTypeReducer && _.isFunction(config.linkTypeReducer) ? config.linkTypeReducer(links) : "";
                    })
                    .style("fill", function (d) {
                        return colors(d.source._id);
                    })
                    .attr("d", path)
                    .on("click", linkClick)
                    .on("mouseover", linkMouseOver)
                    .on("mouseout", linkMouseOut);

                var chordsUpdate = chords.transition().duration(2000)
                    .attrTween("d", matrix.chordTween(path))
                    .attr("class", chordClass);

                chords.exit().remove();

                /**Interaction Events ****/

                /**
                 * Node clicked.
                 * @param  {object} d - Node
                 * @param  {object} i - Index of the Node
                 */
                function nodeClick(d, i) {
                    var nodeEl = d3.select(this);

                    events.nodeClick(d, i, nodeEl);
                }

                /**
                 * Node moused over.
                 * @param  {object} d - Node
                 * @param  {object} i - Index of the Node
                 */
                function nodeMouseOver(d, i) {
                    var nodeEl = d3.select(this),
                        node = config.dataStore.get(d.node.data.id);
                    dimChords(d);

                    addTooltip(node, nodeEl, "NODE");
                    events.nodeMouseOver(d, i, nodeEl);
                }

                /**
                 * Node moused out.
                 * @param  {object} d - Node
                 * @param  {object} i - Index of the Node
                 */
                function nodeMouseOut(d, i) {
                    var nodeEl = d3.select(this);
                    resetChords(d);

                    events.nodeMouseOut(d, i, nodeEl);
                }

                /**
                 * Link clicked.
                 * @param  {object} d - Link
                 * @param  {object} i - Index of the Link
                 */
                function linkClick(d, i) {
                    events.linkClick(d, i);
                }

                /**
                 * Link moused over.
                 * @param  {object} d - Link
                 * @param  {object} i - Index of the Link
                 */
                function linkMouseOver(d, i) {
                    var linkEl = d3.select(this),
                        links = getLinks(d);

                    addTooltip(links, linkEl, "LINK");
                    dimChords(d);

                    events.linkMouseOver(d, i);
                }

                /**
                 * Link moused out.
                 * @param  {object} d - Link
                 * @param  {object} i - Index of the Link
                 */
                function linkMouseOut(d, i) {
                    resetChords(d);
                    events.linkMouseOut(d, i);
                }

                /**
                 * Reset Chords visual cues.
                 * @param {object} d
                 */
                function resetChords(d) {
                    container.selectAll("path.chord").style("opacity",0.9);
                }

                /**
                 * Dim all chords except the hovered over chord.
                 * @param {object} d - Link
                 */
                function dimChords(d) {
                    container.selectAll("path.chord").style("opacity", function (chord) {
                        if (d.source) { // Compare Chord Ids
                            return (chord._id === d._id) ? 0.9: 0.0;
                        } else { // Compare Group Ids
                            return (chord.source._id === d._id || chord.target._id === d._id) ? 0.9: 0.1;
                        }
                    });
                }

                /**
                 * Returns links from dataStore based on d.
                 * @param {object} - Link
                 * @returns {Array} links retrieved from dataStore
                 */
                function getLinks(d) {
                    var chord = _.first(d.source.value.data);
                    if (!chord) return;
                    var flow1 = config.dataStore.filter({"type":"link", "attributes":{"source": chord.source, "target": chord.target}}),
                        flow2 = config.dataStore.filter({"type":"link", "attributes":{"source": chord.target, "target": chord.source}});
                    return flow1.concat(flow2);
                }
            };

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
             * Generate normalized data for Chord diagram.
             * @param {object} dataset - original dataset with nodes and links array.
             * @param {string} context - Chord context - count or weight.
             * @returns {Array}
             */
            function generateNormalizedLinks(dataset, context) {
                var linkMetric = context ? context : "count",
                    originalNodes = dataset.nodes,
                    originalLinks = dataset.links,
                    maxFlow1 = 1,
                    maxFlow2 = 1,
                    maxFlow = 1;

                //get unique links
                //loop through every unique links and add flow1, flow2
                var uniqLinks = _.uniq(originalLinks, true, function (p) {
                    p.flow1 = 1;
                    p.flow2 = 1;

                    //extract sourceNode and targetNode
                    p.sourceNode = _.findWhere(originalNodes, {id: p.source});
                    p.targetNode = _.findWhere(originalNodes, {id: p.target});

                    return p.source && p.target;
                });

                //Build flows between source and targets.
                for (var index = 0; index < originalLinks.length; index++) {
                    var originalLink = originalLinks[index];
                    var flow1Link = _.findWhere(uniqLinks, {source: originalLink.source, target: originalLink.target});
                    if (flow1Link) {
                        flow1Link.flow1 += (linkMetric == "weight" ? parseInt(originalLink.weight || 0) : 1);
                    }
                    var flow2Link = _.findWhere(uniqLinks, {source: originalLink.target, target: originalLink.source});
                    if (flow2Link) {
                        flow2Link.flow2 += (linkMetric == "weight") ? parseInt(originalLink.weight || 0) : 1;
                    }
                }

                maxFlow1 = _.max(uniqLinks, function (link) {
                    return link.flow1;
                }).flow1;
                maxFlow2 = _.max(uniqLinks, function (link) {
                    return link.flow2;
                }).flow2;
                maxFlow = _.max([maxFlow1, maxFlow2]); //Find highest flow numerical value to calculate relative chord widths for Orphan nodes.

                //Create links with 0 flow for orphan nodes.
                for (var index = 0; index < originalNodes.length; index++) {
                    var node = originalNodes[index],
                        sourceFound = _.findWhere(uniqLinks, {source: node.id}),
                        targetFound = _.findWhere(uniqLinks, {target: node.id});

                    if (!sourceFound && !targetFound) {
                        uniqLinks.push({
                            source: node.id,
                            target: node.id,
                            sourceNode: node,
                            targetNode: node,
                            id: node.id + "-transient",
                            name: node.id + "-transient",
                            flow1: maxFlow * .1,
                            flow2: maxFlow * .1,
                            type: "contacted_default",
                            orphanLink: true
                        })
                    }
                }
                return uniqLinks;
            }

        }

        /**
         * Construct a ChordView inherited from BaseView.
         * @constructor
         * @class ChordView
         */
        var ChordView = BaseView.extend({
            /**
             * Renders the chord view.
             * @inner
             */
            renderVisual: function (options) {
                if (options && options.lastSeenLocation) {
                    outerGroupLocation = options.lastSeenLocation
                }
                this.renderChord(options);
            },
            /**
             * Renders the chord view by calling buildTopology.
             * @inner
             */
            renderChord: function (options) {
                var config = $.extend(true, {}, this.options);
                this.events = (options && options.events) ? options.events : d3.dispatch("nodeClick", "nodeMouseOver", "nodeMouseOut", "linkClick", "linkMouseOver", "linkMouseOut");

                this.chordTopology;
                var dataset = $.extend(true, {}, config.data); //create a deep data copy from conf.

                if (options && !options.redraw) {
                    this.chordTopology.drawChords(dataset, options);
                } else {
                    this.chordTopology = d3.select(this).call(ChordVisual, config, this.events);
                    this.chordTopology.drawChords(dataset);
                }

            },
            /**
             * Returns events attached on the chord view.
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

        return ChordView;
    });