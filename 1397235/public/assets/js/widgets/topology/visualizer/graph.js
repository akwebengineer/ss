/**
 * A module that implements Graph Topology
 * @author Viswesh Subramanian <vissubra@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define([ 'lib/template_renderer/template_renderer',
    'widgets/topology/lib/flat/graphBuilder',
    'widgets/topology/lib/tree/treeTopologyTemplates',
    'widgets/topology/lib/constants',
    'widgets/topology/lib/flat/flatDataStore'
], function (render_template,
    GraphView,
    TopologyTemplates,
    topologyConstants,
    FlatDataStore
) {
        var GraphTopology = function (conf) {

            // PRIVATE MEMBERS            
            var _self,
                $userContainer = $(conf.container);
            // default parameters
            var defaultConfig = {
                allowZoomAndPan: true,
                showLegend: false,
                showArrowHead: false,
                viewerDimensions: { // size of the diagram
                    height: $userContainer.height(),
                    width: $userContainer.width()
                }
            };
            var $baseTopologyTemplate,
                $container,
                graphView,
                dataStore;

            conf.topologyType = topologyConstants.type.graph;

            /**
             * Validates provided configuration.
             * @returns {Object} validation object.
             */
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

            /**
             * Registers events to bridge interaction with graphBuilder.
             * @inner
             */
            function registerEvents() {
                var graphViewEvents = graphView.getEvents();
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
                graphViewEvents.on('nodeClick', function (d) {
                    var node = getNode(d);
                    $userContainer.trigger(topologyConstants.events.nodeClick, node); // Public Event
                });

                graphViewEvents.on('nodeMouseOver', function (d, i, nodeEl) {
                    var node = getNode(d);
                    $userContainer.trigger(topologyConstants.events.nodeMouseOver, node); // Public Event
                });

                graphViewEvents.on('nodeMouseOut', function (d, i, nodeEl) {
                    var node = getNode(d);
                    $userContainer.trigger(topologyConstants.events.nodeMouseOut, node); // Public Event
                });

                graphViewEvents.on('linkClick', function (d) {
                    var node = getNodeLink(d);
                    $userContainer.trigger(topologyConstants.events.linkClick, node); // Public Event
                });

                graphViewEvents.on('linkMouseOver', function (d) {
                    var node = getNodeLink(d);
                    $userContainer.trigger(topologyConstants.events.LinkMouseOver, node); // Public Event
                });

                graphViewEvents.on('linkMouseOut', function (d) {
                    var node = getNodeLink(d);
                    $userContainer.trigger(topologyConstants.events.LinkMouseOut, node); // Public Event
                });

                function getNode(d) {
                    return dataStore && dataStore.get(d.id);
                }

                function getNodeLink(d) {
                    return dataStore && dataStore.get(d.id);
                }
            };

            /**
             * Initializes dataStore.
             * @param {Object} conf
             * @inner
             */
            function initData(conf) {
                if (conf.dataStore instanceof FlatDataStore) { //if dataStore is provided, use it.
                    dataStore = conf.dataStore;
                } else if (!conf.dataStore && conf.data) { //if dataStore is not provided, create it.
                    dataStore = new FlatDataStore(conf.data);
                    conf.dataStore = dataStore;
                }
            }

            /**
             * Builds a graph layout.
             * @returns {Object} this.
             */
            function build() {
                _self = this;
                _self.conf.dataType = _.isObject(_self.data) ? "JSON" : "URL";
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

                    $baseTopologyTemplate = $(render_template(TopologyTemplates.baseTopology, baseTemplateConf));
                    $container = $baseTopologyTemplate.find('.topology-canvas');
                    _conf.container = $container;
                    initData(_conf); //Initialize data
                    graphView = new GraphView(_conf).render();
                    registerEvents();
                    $userContainer.append($baseTopologyTemplate);
                    viewRenderComplete(); //Inform visual that it has been rendered.
                }
                else {
                    this.confValidation = _validation;
                }

                return this;
            }

            /**
             * Destroys visual.
             */
            function destroy() {
                $baseTopologyTemplate.empty();
            }

            /**
             * Handles post processing when visual is rendered on DOM.
             * @inner
             */
            function viewRenderComplete() {
                $container.trigger(topologyConstants.events.viewRenderComplete, {}); // Private Event
            }

            /**
             * Handles reload of the visual.
             */
            function reload() {
                var _conf = $.extend(true, {}, _self.conf);
                _conf.container = $container;
                graphView.update({reset: true, redraw: true});
                $userContainer.append($baseTopologyTemplate);
                viewRenderComplete();  //Inform visual that it has been rendered.
            }

            /**
             * Updates existing configuration.
             * @param {Object} configuration - topology configuration.
             * @private
             */
            function _updateConfiguration(configuration) {
                var _conf = $.extend(true, {}, configuration);
                dataStore = new FlatDataStore(_conf.data); //resets local dataStore
                _conf.dataStore = dataStore;
                graphView.updateConfiguration(_conf);
            }

            /**
             * Adds a node or link.
             * A link object is identified by presence of 'source' & 'target' keys. Else, they are inferred as nodes.
             * @param {Object/Array} object - node / link
             */
            function add(object) {
                return dataStore.add(object);
            }

            /**
             * Updates a node or link.
             * A link object is identified by presence of 'source' & 'target' keys. Else, they are inferred as nodes.
             * @param {Object} object - node / link
             */
            function update(object) {
                return dataStore.put(object);
            }

            /**
             * Removes a node or link identified by its id.
             * @param {String} id - node / link id
             */
            function remove(id) {
                return dataStore.remove(id);
            }

            /**
             * Returns data in datastore. If id is not present, unfiltered data is returned.
             * @param id
             */
            function get(id) {
                return dataStore.get(id);
            }

            /**
             * Returns filtered results
             * @param {Object} object - filter object
             * @returns {Array} - An array of filtered objects.
             */
            function filter(object) {
                return dataStore.filter(object);
            }

            // PUBLIC MEMBERS
            this.conf = {};
            $.extend(this.conf, defaultConfig, conf);
            this.build = build;
            this.reload = reload;
            this.destroy = destroy;
            this._updateConfiguration = _updateConfiguration;

            // DataStore interfaces
            this.add = add;
            this.update = update;
            this.remove = remove;
            this.get = get;
            this.filter = filter;
        };

        return GraphTopology;
    });
