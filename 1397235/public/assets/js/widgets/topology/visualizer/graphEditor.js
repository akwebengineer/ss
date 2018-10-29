/**
 * A module that implements Graph Topology
 * @author Viswesh Subramanian <vissubra@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */

define([ 'lib/template_renderer/template_renderer',
    'widgets/topology/lib/flat/graphEditorBuilder',
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
            // base template events
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

            // visual events
            $baseTopologyTemplate.on('nodeClick', function (evt, d) {
                var node = getNode(d);
                $userContainer.trigger(topologyConstants.events.nodeClick, node); // Public Event
            });

            $baseTopologyTemplate.on('nodeMouseOver', function (evt, d) {
                var node = getNode(d);
                $userContainer.trigger(topologyConstants.events.nodeMouseOver, node); // Public Event
            });

            $baseTopologyTemplate.on('nodeMouseOut', function (evt, d) {
                var node = getNode(d);
                $userContainer.trigger(topologyConstants.events.nodeMouseOut, node); // Public Event
            });

            $baseTopologyTemplate.on('nodeDragStop', function (evt, node, position) {
                $userContainer.trigger(topologyConstants.events.nodeDragStop, [node, position]); // Public Event
            });

            $baseTopologyTemplate.on('linkClick', function (evt, d) {
                $userContainer.trigger(topologyConstants.events.linkClick, d); // Public Event
            });

            $baseTopologyTemplate.on('linkMouseOver', function (evt, d) {
                $userContainer.trigger(topologyConstants.events.LinkMouseOver, d); // Public Event
            });

            $baseTopologyTemplate.on('linkMouseOut', function (evt, d) {
                $userContainer.trigger(topologyConstants.events.LinkMouseOut, d); // Public Event
            });

            $baseTopologyTemplate.on('addLink', function (evt, d) {
                $userContainer.trigger(topologyConstants.events.addLink, d); // Public Event
            });

            $baseTopologyTemplate.on('removeLink', function (evt, d) {
                $userContainer.trigger(topologyConstants.events.removeLink, d); // Public Event
            });

            $baseTopologyTemplate.on('moveLink', function (evt, d) {
                $userContainer.trigger(topologyConstants.events.moveLink, d); // Public Event
            });

            function getNode(d) {
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
                $userContainer.append($baseTopologyTemplate);
                graphView = new GraphView(_conf).render();
                registerEvents();
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
            graphView.destroy();
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
            graphView.reload();
        }

        /**
         * Returns node positions based on options.
         */
        function getPositions(options) {
            return graphView.getPositions(options);
        }

        /**
         * Updates existing configuration.
         * @param {Object} configuration - topology configuration.
         * @private
         */
        function _updateConfiguration(configuration) {
            this.destroy();
            this.conf = _.extend(this.conf, configuration);
            this.build();
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
        this.getPositions = getPositions;
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
