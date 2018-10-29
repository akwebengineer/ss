/**
 * A module that builds a graph view.
 * @module GraphEditorBuilder
 * @author Viswesh Subramanian <vissubra@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
        'lib/template_renderer/template_renderer',
        'text!widgets/topology/lib/flat/templates/node.html',
        'text!widgets/topology/lib/flat/templates/outerTemplate.html',
        'widgets/topology/lib/flat/layouts/hierarchicalLayout',
        'widgets/topology/lib/flat/layouts/springLayout',
        'widgets/topology/lib/flat/graphEditorBuilderDnD',
        'widgets/topology/lib/tooltipBuilder',
        'jsPlumb'
    ],
    function (render_template, nodeTemplate, outerTemplate, HierarchicalLayout, SpringLayout, GraphEditorBuilderDnD, TooltipBuilder, jsPlumb) {
        /**
         * Construct a Graph View.
         * @constructor
         * @class GraphView
         */
        var GraphView = function (conf) {

            var $container = $(render_template(outerTemplate)).css({
                    width: conf.viewerDimensions.width,
                    height: conf.viewerDimensions.height
                }).appendTo(conf.container),
                data = conf.data,
                datastore = conf.dataStore,
                plumbDefaults = {
                    Connector: ["StateMachine", {
                        proximityLimit: 100,
                        curviness: 20
                    }],
                    Endpoint: ["Dot", {
                        radius: 4,
                        cssClass: "link endpoint"
                    }],
                    Anchor: "AutoDefault",
                    ReattachConnections: false,
                    ConnectionsDetachable: false,
                    Container: $container
                },
                self = this,
                $nodes,
                muteEvents = false,
                hierarchicalLayout = new HierarchicalLayout(conf),
                springLayout = new SpringLayout(conf),
                graphDnD = (conf.edit === true) && $container.addClass('edit') && new GraphEditorBuilderDnD($container),
                plumb,
                customNodeInstanceRegistry = {},
                tooltipBuilder = new TooltipBuilder();

            var dragOptions = {
                containment:true,
                stop: function(el) {
                    var $nodeEl = $(el.el),
                        node = datastore.get($nodeEl.attr('data-id'));

                    $container.trigger("nodeDragStop", [node, $nodeEl.position()]);
                }
            };

            /**
             * Builds the graph
             * @returns {Object} this
             */
            this.render = function () {
                $nodes = data.nodes.map(function (node) {
                    return generateNodeEle(node);
                });
                $container.append($nodes);

                if (conf.showArrowHead) {
                    _.extend(plumbDefaults, {
                        Overlays: [
                            ["Arrow", {
                                location: 0.97,
                                width: 8,
                                length: 8,
                                cssClass: "arrow"
                            }]
                        ]
                    });
                }

                if (_.isObject(conf.connection)) {
                    if(conf.connection.type && conf.connection.type == "Straight") {
                        _.extend(plumbDefaults, {
                            Connector: conf.connection.type
                        });
                    }
                }

                if (_.isBoolean(conf.edit)) {
                    _.extend(plumbDefaults, {
                        ConnectionsDetachable: conf.edit
                    });

                    if (conf.edit == false) {
                        _.extend(plumbDefaults, {
                            Endpoint: "Blank"
                        });
                    }
                }

                jsPlumb.ready(function() {
                    plumb = jsPlumb.getInstance(plumbDefaults);
                    plumb.draggable($nodes, dragOptions);
                    plumb.setSuspendDrawing(true);

                    _.each($nodes, function ($nodeEl) {
                        hierarchicalLayout.setNode($nodeEl);
                            initEndPoint($nodeEl);
                        }
                    );

                    generateConnections();
                    autoPositionNodes();
                    initInteractionEvents();

                    /**
                     * Binds interaction events.
                     */
                    function initInteractionEvents() {
                        $(datastore).on('dataStore.change dataStore.add dataStore.remove', function (e, obj) {
                            data = this.get();

                            switch (e.namespace) {
                                case "add":
                                    _.each(obj, function (element) {
                                        self.add(element);
                                    });
                                    break;
                                case "remove":
                                    self.remove(obj);
                                    break;
                                case "change":
                                    self.update(obj);
                                    break;
                            }
                        });

                        //Node events
                        $container.on('mouseenter mouseleave click', '.nodeContainer', function (event) {
                            var $nodeEl = $(event.currentTarget),
                                nodeId = $nodeEl.attr("data-id"),
                                node = conf.dataStore.get(nodeId),
                                data = {
                                    "id": nodeId
                                };

                            switch (event.type) {
                                case "mouseenter":
                                    addTooltip(node, $nodeEl, "NODE");
                                    $container.trigger("nodeMouseOver", data);
                                    break;
                                case "mouseleave":
                                    $container.trigger("nodeMouseOut", data);
                                    break;
                                case "click":
                                    $nodes.forEach(function($node) {
                                        $node = isCustomNode() ? $node : $node.find('.node');
                                        $node.removeClass('selected');
                                    });
                                    if(isCustomNode()) {
                                        $nodeEl.addClass('selected');
                                    } else {
                                        $nodeEl.find('.node').addClass('selected');
                                    }
                                    $container.trigger("nodeClick", data);
                                    break;
                            }
                        });

                        plumb.bind("beforeDrop", function (info) {
                            var link = info.connection.getParameters();
                            if (link.id) {
                                //Existing connection
                                var links = {
                                    links: datastore.filter({
                                        "attributes": {
                                            "source": link.source,
                                            "target": link.target
                                        }
                                    }).map(function (linkEle) {
                                        linkEle.source = $(info.connection.source).attr('data-id');
                                        linkEle.target = $(info.connection.target).attr('data-id');
                                        return linkEle;
                                    })
                                };
                                $container.trigger("moveLink", links);
                            } else {
                                //New connection
                                link.source = $(info.connection.source).attr('data-id');
                                link.target = $(info.connection.target).attr('data-id');
                                $container.trigger("addLink", link);
                            }
                        });

                        plumb.bind("connectionDetached", function (info, originalEvent) {
                            if (!originalEvent) return;
                            var link = info.connection.getParameters(),
                                links = {
                                    links: datastore.filter({"attributes": {"source": link.source, "target": link.target}})
                                };
                            $container.trigger("removeLink", links);
                        });

                    }

                    plumb.setSuspendDrawing(false, true);
                });

                return this;
            };

            /**
             * Adds a node or a link
             * @param {Object} obj - node / link
             */
            this.add = function (obj) {
                var type = getType(obj);
                if (type == "node") {
                    var $nodeEl = generateNodeEle(obj);
                    $container.append($nodeEl);
                    $nodes.push($nodeEl);

                    hierarchicalLayout.setNode($nodeEl);

                    initEndPoint($nodeEl);
                    plumb.draggable($nodeEl, dragOptions)

                } else {
                    generateConnection(obj, {newConnection: true});
                }
                autoPositionNodes();
                plumb.repaintEverything();
            };

            /**
             * Removes a node or a link
             * @param {Object} obj - node / link
             */
            this.remove = function (obj) {
                var type = getType(obj);
                if (type == "node") {
                    var $node = getNodeEl(obj.id);
                    plumb.removeAllEndpoints($node);

                    $nodes =  _.reject($nodes, function($node){
                        return $node.attr('data-id') === obj.id;
                    });
                    hierarchicalLayout.removeNode($node);
                    if(isCustomNode()) {
                        var nodeViewInstance = customNodeInstanceRegistry[obj.id];
                        nodeViewInstance && nodeViewInstance.close && nodeViewInstance.close();
                        delete customNodeInstanceRegistry[obj.id];
                    }
                    $node.remove();
                } else {
                    var links = datastore.filter({
                        "attributes": {
                            "source": obj.source,
                            "target": obj.target
                        }
                    });
                    if (links.length == 0) {
                        hierarchicalLayout.removeEdge(obj);
                        resetAllConnections();
                    } else {
                        generateConnection(obj);
                    }
                }
                autoPositionNodes();
                plumb.repaintEverything();
            };

            /**
             * Updates a node or a link
             * @param {Object} obj - node / link
             */
            this.update = function (obj) {
                var type = getType(obj);
                if (type == "node") {
                    var $node = getNodeEl(obj.id);

                    if (isCustomNode()) {
                        var nodeViewInstance = customNodeInstanceRegistry[obj.id];
                        if(nodeViewInstance && nodeViewInstance.update) { //Slipstream view as node.
                            nodeViewInstance.el = $node[0];
                            nodeViewInstance.update(obj);
                        } else { //String as node.
                            conf.customNodeView(obj, $node[0]);
                        }
                    } else {
                        obj.position && $node.css(obj.position);

                        $node.find('.node').css('background-image', 'url(' + conf.icons[obj.type] + ')');
                        $node.removeClass('small medium large').addClass(obj.size);
                        $node.find('.nodeLabel').text(obj.name);
                    }
                } else {
                    resetAllConnections();
                }
                plumb.repaintEverything();
            };

            /**
             * Reloads connections
             */
            this.reload = function () {
                resetAllConnections();
            };

            /**
             * Destroys views.
             */
            this.destroy = function () {
                if (isCustomNode()) {
                    for (var view in customNodeInstanceRegistry) {
                        customNodeInstanceRegistry[view].close && customNodeInstanceRegistry[view].close();
                    }
                }
            };

            /**
             * Function to add tooltip on hovering over a node or link icon
             * @param  {object} data - object of node / connection being hovered
             * @param  {object} el - container of a node or connection where the mouseover event is triggered
             * @param  {string} type - string specifying the mouseOver element type
             */
            var addTooltip = function (data, el, type) {
                if(data && _.isObject(conf.tooltip)) {
                    tooltipBuilder.addContentTooltips([el], data, conf, type);
                }
            };

            /**
             * Returns positions based on layout configuration
             * @param {Object} options
             * @returns {Array} - Array of nodes with position attribute.
             */
            this.getPositions = function (options) {
                var defaultConfig = (conf.layout && _.isObject(conf.layout)) ? conf.layout : {type: "hierarchical", parameters: {"orientation": "TB"}},
                    configuration = _.extend({}, defaultConfig, options);

                if (configuration.type == "hierarchical") {
                    return hierarchicalLayout.getNodePositions(configuration.parameters)
                } else if (configuration.type == "spring") {
                    return springLayout.getNodePositions(configuration.parameters);
                } else if (configuration.type == "absolute") {
                    return data.nodes;
                }
            };

            /**
             *
             * @param {String} id - node id
             * @returns {Object} node element
             */
            function getNodeEl(id) {
                return _.find($nodes, function ($ele) {
                    return $ele.attr('data-id') == id;
                });
            }

            /**
             * Resets all connections
             */
            function resetAllConnections() {
                muteEvents = true;

                plumb.setSuspendDrawing(true);
                plumb.deleteEveryConnection();
                plumb.deleteEveryEndpoint();

                initEndPoints();
                generateConnections();
                autoPositionNodes();

                plumb.setSuspendDrawing(false, true);

                muteEvents = false;
            }

            /**
             * Auto position nodes based on layout config.
             */
            function autoPositionNodes() {
                var nodesWithPositions = (conf.layout && _.isObject(conf.layout) && conf.layout.type == "absolute") ? data.nodes : self.getPositions();

                _.each(nodesWithPositions, function (node) {
                    var $nodeEl = getNodeEl(node.id),
                        position = _.extend({left: 0, top: 0}, node.position);

                    $nodeEl && $nodeEl.css({
                        left: position.left,
                        top: position.top
                    });
                });
            }

            /**
             * Initialize all end points
             */
            function initEndPoints() {
                if (conf.edit !== true) return;

                _.each($nodes, function ($nodeEl) {
                        initEndPoint($nodeEl);
                    }
                );
            }

            /**
             * Initialize a nodes end point
             * @param {Object} $nodeEl - node element
             */
            function initEndPoint($nodeEl) {
                if (conf.edit !== true) return;

                var endpointOptions = {
                    isSource: true,
                    isTarget: false,
                    cssClass: "anchor",
                    maxConnections: -1
                };

                plumb.makeTarget($nodeEl, {
                    allowLoopback: false
                });
                plumb.addEndpoint($nodeEl, endpointOptions);
            }

            /**
             * Generates connection for links
             */
            function generateConnections() {
                if (data.links.length > 0) {
                    var uniqLinks = _.uniq(data.links, true, function (link) {
                        return link.source && link.target;
                    });

                    _.each(uniqLinks, function (link) {
                        generateConnection(link);

                    });
                }
            }

            /**
             * Generates a connection between source and target
             * @param {Object} link
             * @param {Object} options
             */
            function generateConnection(link, options) {
                var sourceEl = getNodeEl(link.source),
                    targetEl = getNodeEl(link.target);

                if (!sourceEl || !targetEl) return;

                var existingConnection = plumb.getConnections({
                    source: sourceEl,
                    target: targetEl
                });

                //If a connection is already present, update overlay.
                if (existingConnection && existingConnection.length > 0) {
                    var $linkLabelOverlay = $(existingConnection[0].getOverlay('linkLabelOverlay').getElement()),
                        links = datastore.filter({
                            "attributes": {
                                "source": link.source,
                                "target": link.target
                            }
                        });

                    if (conf.linkOverlay && _.isFunction(conf.linkOverlay)) {
                        return $linkLabelOverlay.html($(conf.linkOverlay(links)));
                    }

                    return $linkLabelOverlay.html(links.length);
                }


                var connection = plumb.connect({
                    parameters: link,
                    cssClass: "link ",
                    source: sourceEl,
                    target: targetEl,
                    overlays: [
                        ["Custom", {
                            create: function (component) {
                                var links = datastore.filter({
                                        "attributes": {
                                            "source": component.getParameter('source'),
                                            "target": component.getParameter('target')
                                        }
                                    }),
                                    reducedType = conf.linkTypeReducer && _.isFunction(conf.linkTypeReducer) && conf.linkTypeReducer(links);

                                //Link customization
                                reducedType && component.addClass(reducedType);

                                //End Point customization
                                _.each(component.endpoints, function (endpoint) {
                                    endpoint.addClass(reducedType);
                                });

                                //Overlay customization
                                if (conf.linkOverlay && _.isFunction(conf.linkOverlay)) {
                                    return $(conf.linkOverlay(links));
                                }

                                //Base implementation
                                return $('<div>' + links.length + '</div>');
                            },
                            location: 0.5,
                            id: "linkLabelOverlay",
                            cssClass: "linkLabel"
                        }]
                    ],
                    anchors: [
                        ["Perimeter", {shape: "Square", anchorCount: 150}]
                    ],
                });

                //Link events
                var linkEventHandler = function (info, event) {
                    info = info.type == "Custom" ? info.component : info;

                    var link = info.getParameters(),
                        data = {
                            links: datastore.filter({"attributes": {"source": link.source, "target": link.target}})
                        };

                    switch (event.type) {
                        case "mouseover":
                            addTooltip(data, event.target, "LINK");
                            $container.trigger("linkMouseOver", data);
                            break;
                        case "mouseout":
                            $container.trigger("linkMouseOut", data);
                            break;
                        case "click":
                            $container.trigger("linkClick", data);
                            break;
                    }
                };
                ['click', 'mouseover', 'mouseout'].forEach(function (event) {
                    connection && connection.bind(event, linkEventHandler);
                });

                if (options && options.newConnection) {
                    connection.addClass('newConnection')
                }

                hierarchicalLayout.setEdge(link);
            }

            /**
             * Generate a node element based on node model
             * @param {Object} node
             * @returns {Object} jQuery element
             */
            function generateNodeEle(node) {
                if (isCustomNode()) {
                    var customView = conf.customNodeView(node);
                    if (_.isFunction(customView)) {
                        var viewInstance = new customView();
                        customNodeInstanceRegistry[node.id] = viewInstance;
                        return normalizeNode($(viewInstance.render(node).el));
                    }
                    return normalizeNode($(customView));
                }
                return $(render_template(nodeTemplate, {
                    id: node.id,
                    image: conf.icons[node.type],
                    name: node.name,
                    type: node.type,
                    size: node.size
                }));

                /**
                 * Normalizes custom nodes.
                 * @param {Object} $node
                 * @returns {Object} jQuery element
                 */
                function normalizeNode($node) {
                    return $node.addClass('nodeContainer').attr('data-id', node.id);
                }
            }

            /**
             * Returns if topology uses custom nodes.
             * @returns {boolean}
             */
            function isCustomNode() {
                return conf.customNodeView && _.isFunction(conf.customNodeView);
            }

            /**
             * Returns the object type
             * @param {Object} object - node / link
             * @returns {string}
             */
            function getType(object) {
                return (object['source'] && object['target']) ? "link" : "node";
            }

        };

        return GraphView;
    });