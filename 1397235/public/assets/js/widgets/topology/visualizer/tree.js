/**
 * A module that implements Tree Topology
 * @copyright Juniper Networks, Inc. 2017
 */

define([ 'lib/template_renderer/template_renderer',
    'widgets/topology/lib/tree/treeBuilder',
    'widgets/topology/lib/tree/treeTopologyTemplates',
    'widgets/topology/lib/constants',
    'widgets/topology/lib/tree/treeDataStore'
], function (render_template,
    TreeView,
    treeTopologyTemplates,
    topologyConstants,
    TreeDataStore
) {
        var TreeTopology = function (conf) {

            // PRIVATE MEMBERS            
            var _self,
                $userContainer = $(conf.container);
            // default parameters
            var defaultConfig = {
                allowChildrenCollapse: true,
                allowZoomAndPan: true,
                showLegend: false,
                showArrowHead: false,
                collapseChildrenThreshold: Number.MAX_VALUE,
                nodeSpacing: {
                    horizontalGap: 150,
                    verticalGap: 100
                },
                mode: "view",
                maxLabelSize: 16, // truncate labels with ellipsis if maxLabelSize is exceeded
                viewerDimensions: { // size of the diagram
                    height: $userContainer.height(),
                    width: $userContainer.width()
                }
            };
            var $baseTopologyTemplate,
                $container,
                treeView,
                dataStore;

            conf.topologyType = topologyConstants.type.tree;

            function validateConfiguration() {
                var validation = {};
                try {
                    // validate if container exists
                    if (!_self.conf.container) {
                        throw topologyConstants.exceptions.noContainerError;
                    }
                    //check if dataStore or data exists
                    if (!_self.conf.dataStore && !_self.conf.data) {
                        throw topologyConstants.exceptions.noDataError;
                    }
                    validation.isValid = true;
                    validation.errorMessage = undefined;
                } catch (e) {
                    validation.isValid = false;
                    validation.errorMessage = e;
                }
                return validation;
            }

            function registerEvents() {
                var treeViewEvents = treeView.getEvents();
                // Non d3 events
                $baseTopologyTemplate.on("click", ".topology-zoom-in", function (evt) {
                    $container.trigger(topologyConstants.events.zoomIn, {}); // Private Event                   
                });
                $baseTopologyTemplate.on("click", ".topology-zoom-out", function (evt) {
                    $container.trigger(topologyConstants.events.zoomOut, {}); // Private Event
                });
                $baseTopologyTemplate.on("click", ".topology-reset", function (evt) {
                    reload();
                });
                $baseTopologyTemplate.on("click", ".topology-legend-icon", function (evt) {
                    var $elem = $baseTopologyTemplate.find(".legend-view-container");
                    if ($elem.hasClass("legend-expanded")) {
                        $elem.removeClass("legend-expanded").addClass("legend-collapsed");
                        $userContainer.trigger(topologyConstants.events.legendCollapse, {}); // Public Event
                    }
                    else if ($elem.hasClass("legend-collapsed")) {
                        $elem.removeClass("legend-collapsed").addClass("legend-expanded");
                        $userContainer.trigger(topologyConstants.events.legendExpand, {}); // Public Event
                    }
                });

                // d3 events
                treeViewEvents.on('nodeAdded', function (d, i) {
                    var node = getNode(d);
                    _self.onNodeAdd(node, i);
                });

                treeViewEvents.on('nodeRemoved', function (d, i) {
                    var node = getNode(d);
                    _self.onNodeRemove(node, i);
                });

                treeViewEvents.on('nodeReassigned', function (d, i) {
                    var node = getNode(d);
                    _self.onNodeReassign(d, i); // Needs further investigation on the data that needs to be passed to the method (Previous parent, New parent etc.)
                });

                treeViewEvents.on('nodeClick', function (d) {
                    var node = getNode(d);
                    $userContainer.trigger(topologyConstants.events.nodeClick, node); // Public Event
                });

                treeViewEvents.on('nodeMouseOver', function (d, i, nodeEl) {
                    var node = getNode(d);
                    $userContainer.trigger(topologyConstants.events.nodeMouseOver, node); // Public Event
                });

                treeViewEvents.on('nodeMouseOut', function (d, i, nodeEl) {
                    var node = getNode(d);
                    $userContainer.trigger(topologyConstants.events.nodeMouseOut, node); // Public Event
                });

                treeViewEvents.on('addOnClick', function (d) {
                    var node = getNode(d);
                    $userContainer.trigger(topologyConstants.events.addOnClick, node.addOn); // Public Event
                });

                treeViewEvents.on('linkClick', function (d) {
                    var node = getNodeLink(d);
                    $userContainer.trigger(topologyConstants.events.linkClick, node); // Public Event
                });

                treeViewEvents.on('linkMouseOver', function (d) {
                    var node = getNodeLink(d);
                    $userContainer.trigger(topologyConstants.events.LinkMouseOver, node); // Public Event
                });

                treeViewEvents.on('linkMouseOut', function (d) {
                    var node = getNodeLink(d);
                    $userContainer.trigger(topologyConstants.events.LinkMouseOut, node); // Public Event
                });

                treeViewEvents.on('linkIconClick', function (d) {
                    var node = getNodeLink(d);
                    $userContainer.trigger(topologyConstants.events.linkIconClick, node); // Public Event
                });

                treeViewEvents.on('linkIconMouseOver', function (d, i, linkIconEl) {
                    var node = getNodeLink(d);
                    $userContainer.trigger(topologyConstants.events.LinkIconMouseOver, node); // Public Event
                });

                treeViewEvents.on('linkIconMouseOut', function (d, i, linkIconEl) {
                    var node = getNodeLink(d);
                    $userContainer.trigger(topologyConstants.events.LinkIconMouseOut, node); // Public Event
                });

                function getNode(d) {
                    if (d.subNodeHostNodeId) { //If element is subNode.
                        var node = dataStore.get(d.subNodeHostNodeId);
                        return getSubNode(node.subNodes, d.id);
                    }
                    return dataStore && dataStore.get(d.id);
                }

                function getNodeLink(d) {
                    if (d.target.subNodeHostNodeId) { //If link belongs to a subNode
                        var node = dataStore.get(d.target.subNodeHostNodeId);
                        return getSubNode(node.subNodes, d.target.id);
                    }
                    return dataStore && dataStore.get(d.target.id);
                }

                function getSubNode(subNodes, id) {
                    var subNode = subNodes.filter(function (obj) {
                        return obj.id == id;
                    });
                    return subNode.length ? subNode[0] : node;
                }
            };

            function initData(conf) {
                if (conf.dataStore instanceof TreeDataStore) { //if dataStore is provided, use it.
                    dataStore = conf.dataStore;
                } else if (!conf.dataStore && conf.data) { //if dataStore is not provided, create it.
                    dataStore = new TreeDataStore(conf.data);
                    conf.dataStore = dataStore;
                }
            }

            function build() {
                _self = this;
                _self.conf.dataType = _.isObject(_self.data) ? "JSON" : "URL";
                _self.conf.collapseChildrenThreshold = (_self.conf.collapseChildrenThreshold) && ((_self.conf.allowChildrenCollapse) ? _self.conf.collapseChildrenThreshold : defaultConfig.collapseChildrenThreshold);
                var _conf = $.extend(true, {}, _self.conf);
                var _validation = validateConfiguration();
                if (_validation.isValid) {
                    var baseTemplateConf = {};
                    if (_conf.legend) {
                        baseTemplateConf.showLegend = true;
                        baseTemplateConf.legendView = (_.isFunction(_conf.legend.render)) ? _conf.legend.render() : _conf.legend;
                    }
                    else {
                        baseTemplateConf.showLegend = false;
                        baseTemplateConf.legendView = "";
                    }
                    baseTemplateConf.allowZoomAndPan = _conf.allowZoomAndPan;

                    $baseTopologyTemplate = $(render_template(treeTopologyTemplates.baseTopology, baseTemplateConf));
                    $container = $baseTopologyTemplate.find('.topology-canvas');
                    _conf.container = $container;
                    initData(_conf); //Initialize data
                    treeView = new TreeView(_conf).render();
                    registerEvents();
                    $userContainer.append($baseTopologyTemplate);
                }
                else {
                    this.confValidation = _validation;
                }

                return this;
            };

            function destroy() {
                $baseTopologyTemplate.empty();
            }

            function reload() {
                var _conf = $.extend(true, {}, _self.conf);
                _conf.container = $container;
                treeView.update({reset: true, redraw: true}); //If reset is true, tree views position and zoom level are reseted to initial state.
                $userContainer.append($baseTopologyTemplate);
            }

            /**
             * Updates existing configuration.
             * @param {Object} configuration - topology configuration.
             * @private
             */
            function _updateConfiguration(configuration) {
                var _conf = $.extend(true, {}, configuration);
                dataStore = new TreeDataStore(_conf.data); //resets local dataStore
                _conf.dataStore = dataStore;
                treeView.updateConfiguration(_conf);
            }

            /**
             * Adds a node.
             * @param {String} id - node id
             * @param {Object} object - node
             */
            function addNode(id, object) {
                return dataStore.add(id, object);
            }

            /**
             * Updates a node.
             * @param {Object} object - node
             */
            function updateNode(object) {
                return dataStore.put(object);
            }

            /**
             * Removes a node identified by its id.
             * @param {String} id - node id
             */
            function removeNode(id) {
                return dataStore.remove(id);
            }

            /**
             * Returns data in datastore accounting for add, remove, put operations.
             * @param id
             */
            function get(id) {
                return dataStore.get(id);
            }

            // PUBLIC MEMBERS
            this.conf = {};
            $.extend(this.conf, defaultConfig, conf);
            this.build = build;
            this.reload = reload;
            this.destroy = destroy;
            this._updateConfiguration = _updateConfiguration;

            // DataStore interfaces
            this.addNode = addNode;
            this.updateNode = updateNode;
            this.removeNode = removeNode;
            this.get = get;

            // Abstract methods to be implemented by apps
            this.onNodeAdd = function (d, i) { };
            this.onNodeRemove = function (d, i) { };
            this.onNodeReassign = function (d, i) { };
        };

        return TreeTopology;
    });
