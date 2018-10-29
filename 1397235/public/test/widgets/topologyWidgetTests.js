define([
    'widgets/topology/topologyWidget',
    'widgets/topology/lib/constants',
    'widgets/topology/lib/tree/treeDataStore',
    'widgets/topology/lib/flat/flatDataStore',
    'd3'
], function (Topology, topologyConstants, TreeDataStore, FlatDataStore) {
    describe('Topology Widget - Unit tests:', function () {

        // Polyfill for MouseEvent
        // Used for simulating d3 mouse events
        var MouseEvent;

        // Polyfills DOM4 CustomEvent
        function _MouseEvent(eventType, params) {
            params = params || { bubbles: false, cancelable: false };
            var mouseEvent = document.createEvent('MouseEvent');
            mouseEvent.initMouseEvent(eventType, params.bubbles, params.cancelable, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

            return mouseEvent;
        }
        _MouseEvent.prototype = Event.prototype;

        MouseEvent = _MouseEvent;
        // End polyfill

        var $el = $('#test_topology'),
            containerId = 0;

        var tooltipObj = {
            "functionBefore": function() {
                return "test tooltip";
            }
        };

        var subNodesArray1 = [
            {
                "name": "Link A",
                "id": "1121A",
                "type": "file_malicious",
                "link": {
                    "type": "sub_node_link"
                }
            },
            {
                "name": "Link B",
                "id": "1121B",
                "type": "file_malicious",
                "link": {
                    "type": "sub_node_link"
                }
            },
            {
                "name": "Link E",
                "id": "1122Ds",
                "type": "file_malicious",
                "link": {
                    "type": "sub_node_link"
                }
            }
        ];

        var subNodesArray2 = [
            {
                "name": "Link C",
                "id": "1122C",
                "type": "file_malicious",
                "link": {
                    "type": "sub_node_link"
                }
            },
            {
                "name": "Link D",
                "id": "1122D",
                "type": "file_malicious",
                "link": {
                    "type": "sub_node_link"
                }
            }
        ];

        var forceDirectedTopologyData = {
            nodes: [
                {name: "node1", id: "123_node", type: "vpn", size: "medium"},
                {name: "node2", id: "456_node", type: "internet_breakout", size: "medium"},
                {name: "node3", id: "457_node", type: "hub", size: "medium"}
            ],
            links: [
                {source: "123_node", target: "456_node", id: "445_link", name: "445_link", bidirectional: true, type: "bidirectional_link", weight:10},
                {source: "123_node", target: "457_node", id: "449_link", name: "449_link", type: "contacted_default", weight:0}
            ]
        };

        var forceDirectedTopologyConf = {
            data: forceDirectedTopologyData,
            icons: {
                "vpn": "img/icon_VPN.svg",
                "internet_breakout": "img/icon_internet_breakout.svg",
                "hub": "img/icon_hub.svg"
            },
            showArrowHead: true,
            legend: '<div id="test-legend"></div>',
            allowZoomAndPan: true,
            tooltip: tooltipObj
        };

        var topologyConf = {
            data: {
                "name": "File 1",
                "id": "Node100",
                "children": [
                    {
                        "name": "File 1-1",
                        "id": "9da54794-9816-488f-9cb1-37c2b169bf70",
                        "type": "file_suspected",
                        "children": [],
                        "subNodes": subNodesArray1,
                        "link": {
                            "id": "9da54794-9816-488f-9cb1-37c2b169bf70Link",
                            "type": "started_default"
                        }
                    },
                    {
                        "name": "File 1-2",
                        "id": "ffb00ac2-6e7c-42aa-b5d7-5e2a7f1d5ac1",
                        "type": "file_malicious",
                        "children": [],
                        "subNodes": subNodesArray2,
                        "link": {
                            "id": "ffb00ac2-6e7c-42aa-b5d7-5e2a7f1d5ac1Link",
                            "type": "started_default"
                        }
                    }
                ],
                "icon": "file_default",
                "type": "fs-topo-node",
                "link": {
                    "id": "Node100Link",
                    "type": "fs-topo-link"
                }
            },
            icons: {
                "file_malicious": "img/icon_file_malicious.svg",
                "file_suspected": "img/icon_file_suspected.svg",
                "file_default": "img/icon_file_default.svg",
                "internet_suspected": "img/icon_internet_suspected.svg",
                "dropped_default": "img/icon_dropped_default.svg",
                "started_default": "img/icon_started_default.svg",
                "contacted_default": "img/icon_contacted_default.svg"
            },
            mode: "view",
            collapseChildrenThreshold: 6,
            viewerDimensions: {
                width: 1024,
                height: 768,
            },
            showLegend: true,
            legend: '<div id="test-legend"></div>',
            showArrowHead: true,
            tooltip: tooltipObj
        }

        var createContainer = function () {
            var $container = $("<div id = topology-container-id" + containerId++ + "></div>");
            $el.append($container);
            return $container;
        };

        var cleanUp = function (thisObj) {
            thisObj.topologyInstance.destroy();
        };

        describe('Topology Interface', function () {
            before(function () {
                var conf = topologyConf;
                conf.container = createContainer();
                this.topologyInstance = Topology.getInstance(conf, "tree");
            });
            it('should exist', function () {
                this.topologyInstance.should.exist;
            });
            it('build() should exist', function () {
                assert.isFunction(this.topologyInstance.build, 'The topology visualizer must have a function named build.');
            });
            it('destroy() should exist', function () {
                assert.isFunction(this.topologyInstance.destroy, 'The topology visualizer must have a function named destroy.');
            });
            it('reload() should exist', function () {
                assert.isFunction(this.topologyInstance.reload, 'The topology visualizer must have a function named reload.');
            });
        });

        describe('Topology Interface - Graph layout', function () {
            before(function () {
                var conf = forceDirectedTopologyConf;
                conf.container = createContainer();
                this.topologyInstance = Topology.getInstance(conf, "_graph");
            });
            after(function () {
                this.topologyInstance = null;
            });
            it('should exist', function () {
                this.topologyInstance.should.exist;
            });
            it('build() should exist', function () {
                assert.isFunction(this.topologyInstance.build, 'The topology visualizer must have a function named build.');
            });
            it('destroy() should exist', function () {
                assert.isFunction(this.topologyInstance.destroy, 'The topology visualizer must have a function named destroy.');
            });
            it('reload() should exist', function () {
                assert.isFunction(this.topologyInstance.reload, 'The topology visualizer must have a function named reload.');
            });
            it('add() should exist', function () {
                assert.isFunction(this.topologyInstance.add, 'The topology visualizer must have a function named add.');
            });
            it('update() should exist', function () {
                assert.isFunction(this.topologyInstance.update, 'The topology visualizer must have a function named update.');
            });
            it('remove() should exist', function () {
                assert.isFunction(this.topologyInstance.remove, 'The topology visualizer must have a function named remove.');
            });
            it('get() should exist', function () {
                assert.isFunction(this.topologyInstance.get, 'The topology visualizer must have a function named get.');
            });
            it('filter() should exist', function () {
                assert.isFunction(this.topologyInstance.filter, 'The topology visualizer must have a function named filter.');
            });
        });

        describe('Topology Interface - Graph Editor layout', function () {
            before(function () {
                var conf = forceDirectedTopologyConf;
                conf.container = createContainer();
                this.topologyInstance = Topology.getInstance(conf);
            });
            after(function () {
                this.topologyInstance = null;
            });
            it('should exist', function () {
                this.topologyInstance.should.exist;
            });
            it('build() should exist', function () {
                assert.isFunction(this.topologyInstance.build, 'The topology visualizer must have a function named build.');
            });
            it('destroy() should exist', function () {
                assert.isFunction(this.topologyInstance.destroy, 'The topology visualizer must have a function named destroy.');
            });
            it('reload() should exist', function () {
                assert.isFunction(this.topologyInstance.reload, 'The topology visualizer must have a function named reload.');
            });
            it('getPositions() should exist', function () {
                assert.isFunction(this.topologyInstance.getPositions, 'The topology visualizer must have a function named getPositions.');
            });
            it('add() should exist', function () {
                assert.isFunction(this.topologyInstance.add, 'The topology visualizer must have a function named add.');
            });
            it('update() should exist', function () {
                assert.isFunction(this.topologyInstance.update, 'The topology visualizer must have a function named update.');
            });
            it('remove() should exist', function () {
                assert.isFunction(this.topologyInstance.remove, 'The topology visualizer must have a function named remove.');
            });
            it('get() should exist', function () {
                assert.isFunction(this.topologyInstance.get, 'The topology visualizer must have a function named get.');
            });
            it('filter() should exist', function () {
                assert.isFunction(this.topologyInstance.filter, 'The topology visualizer must have a function named filter.');
            });
        });

        describe('Topology Interface - Chord layout', function () {
            before(function () {
                var conf = forceDirectedTopologyConf;
                conf.container = createContainer();
                this.topologyInstance = Topology.getInstance(conf, "chord");
            });
            after(function () {
                this.topologyInstance = null;
            });
            it('should exist', function () {
                this.topologyInstance.should.exist;
            });
            it('build() should exist', function () {
                assert.isFunction(this.topologyInstance.build, 'The topology visualizer must have a function named build.');
            });
            it('destroy() should exist', function () {
                assert.isFunction(this.topologyInstance.destroy, 'The topology visualizer must have a function named destroy.');
            });
            it('reload() should exist', function () {
                assert.isFunction(this.topologyInstance.reload, 'The topology visualizer must have a function named reload.');
            });
            it('add() should exist', function () {
                assert.isFunction(this.topologyInstance.add, 'The topology visualizer must have a function named add.');
            });
            it('update() should exist', function () {
                assert.isFunction(this.topologyInstance.update, 'The topology visualizer must have a function named update.');
            });
            it('remove() should exist', function () {
                assert.isFunction(this.topologyInstance.remove, 'The topology visualizer must have a function named remove.');
            });
            it('get() should exist', function () {
                assert.isFunction(this.topologyInstance.get, 'The topology visualizer must have a function named get.');
            });
            it('filter() should exist', function () {
                assert.isFunction(this.topologyInstance.filter, 'The topology visualizer must have a function named filter.');
            });
            it('setChordContext() should exist', function () {
                assert.isFunction(this.topologyInstance.setChordContext, 'The topology visualizer must have a function named setChordContext.');
            });
        });

        describe('Validate Configuration', function () {
            beforeEach(function () {
                this.container = createContainer();
            });
            it('should render topology when all necessary configuration is provided ', function () {
                var _conf = $.extend(true, {}, topologyConf);
                _conf.container = this.container;
                var containerContent_Before = $(_conf.container).find('.topology-widget-container');
                this.topologyInstance = Topology.getInstance(_conf, "tree");
                this.topologyInstance.build();
                var containerContent_After = $(_conf.container).find('.topology-widget-container');
                assert.notEqual(containerContent_Before, containerContent_After, "");
            });
            it('should not render topology when no container is provided ', function () {
                var _conf = $.extend(true, {}, topologyConf);
                _conf.container = undefined;
                this.topologyInstance = Topology.getInstance(_conf, "tree");
                var result = this.topologyInstance.build();
                assert.equal(result.confValidation.errorMessage, topologyConstants.exceptions.noContainerError, "");
            });
            it('should not render legend when no Legend information is provided ', function () {
                var _conf = $.extend(true, {}, topologyConf);
                _conf.container = this.container;
                _conf.legend = undefined;
                var containerLength_Before = $(_conf.container).find('.topology-widget-container').length;
                this.topologyInstance = Topology.getInstance(_conf, "tree");
                this.topologyInstance.build();
                assert.equal($(_conf.container).find('.topology-legend').length, 0, "");
            });
            it('should not render zoom/pan icon when allowZoomAndPan is set to false ', function () {
                var _conf = $.extend(true, {}, topologyConf);
                _conf.container = this.container;
                _conf.allowZoomAndPan = false;
                var containerLength_Before = $(_conf.container).find('.topology-widget-container').length;
                this.topologyInstance = Topology.getInstance(_conf, "tree");
                this.topologyInstance.build();
                assert.equal($(_conf.container).find('.topology-external-controls').length, 0, "");
            });
            it('should attach a title to the node label', function () {
                var _conf = $.extend(true, {}, topologyConf);
                _conf.container = this.container;
                this.topologyInstance = Topology.getInstance(_conf, "tree");
                this.topologyInstance.build();
                var $svgContainer = this.container.find('.topology-canvas');
                var $node = $svgContainer.find("g.node").first().find('g').first();
                var title = $node.find("g").find("title")[0];
                assert.isTrue(title.textContent.length > 0, "node title exists" );
            });
            it('should have ellipsis in the node label when it exceeds maxLabelSize', function () {
                var _conf = $.extend(true, {}, topologyConf);
                _conf.container = this.container;
                _conf.maxLabelSize = 3;
                this.topologyInstance = Topology.getInstance(_conf, "tree");
                this.topologyInstance.build();
                var $svgContainer = this.container.find('.topology-canvas');
                var $node = $svgContainer.find("g.node").first().find('g').first();
                var label = $node.find("g").find("text")[0].textContent;
                if (label.length > _conf.maxLabelSize) {
                    var last3 = label.substr(label.length - 3);
                    assert.isTrue(last3 == "...", "ellipsis exists in the node label" );
                }
            });
            it('should ensure visual is responsive by default', function () {
                var _conf = $.extend(true, {}, topologyConf);
                _conf.container = this.container;
                this.topologyInstance = Topology.getInstance(_conf, "tree");
                this.topologyInstance.build();

                var $svgContainer = $(_conf.container).find('.topology-outer');
                assert.isTrue($svgContainer[0].hasAttribute('preserveAspectRatio'), "visual is responsive");
            });
        });

        describe('Validate Configuration - Graph layout', function () {
            beforeEach(function () {
                this.container = createContainer();
            });
            afterEach(function () {
                this.topologyInstance = null;
                this.container = null;
            });
            it('should render topology when all necessary configuration is provided ', function () {
                var _conf = $.extend(true, {}, forceDirectedTopologyConf);
                _conf.container = this.container;
                var containerContent_Before = $(_conf.container).find('.topology-widget-container');
                this.topologyInstance = Topology.getInstance(_conf, "_graph");
                this.topologyInstance.build();
                var containerContent_After = $(_conf.container).find('.topology-widget-container');
                assert.notEqual(containerContent_Before, containerContent_After, "Topology is rendered");
            });
            it('should not render topology when no container is provided ', function () {
                var _conf = $.extend(true, {}, forceDirectedTopologyConf);
                _conf.container = undefined;
                this.topologyInstance = Topology.getInstance(_conf, "_graph");
                var result = this.topologyInstance.build();
                assert.equal(result.confValidation.errorMessage, topologyConstants.exceptions.noContainerError, "error thrown when no container is provided");
            });
            it('should not render legend when no Legend information is provided ', function () {
                var _conf = $.extend(true, {}, forceDirectedTopologyConf);
                _conf.container = this.container;
                _conf.legend = undefined;
                this.topologyInstance = Topology.getInstance(_conf, "_graph");
                this.topologyInstance.build();
                assert.equal($(_conf.container).find('.topology-legend').length, 0, "should not render legend");
            });
            it('should not render zoom/pan icon when allowZoomAndPan is set to false ', function () {
                var _conf = $.extend(true, {}, forceDirectedTopologyConf);
                _conf.container = this.container;
                _conf.allowZoomAndPan = false;
                this.topologyInstance = Topology.getInstance(_conf, "_graph");
                this.topologyInstance.build();
                assert.equal($(_conf.container).find('.topology-external-controls').length, 0, "External controls not rendered");
            });
            it('should ensure visual is responsive by default', function () {
                var _conf = $.extend(true, {}, forceDirectedTopologyConf);
                _conf.container = this.container;
                this.topologyInstance = Topology.getInstance(_conf, "_graph");
                this.topologyInstance.build();

                var $svgContainer = $(_conf.container).find('.topology-outer');
                assert.isTrue($svgContainer[0].hasAttribute('preserveAspectRatio'), "visual is responsive");
            });
            it('should generate arrow markers when showArrowHead is set to true', function () {
                var _conf = $.extend(true, {}, forceDirectedTopologyConf);
                _conf.container = this.container;
                this.topologyInstance = Topology.getInstance(_conf, "_graph");
                this.topologyInstance.build();

                var $svgContainer = $(_conf.container).find('.topology-outer');
                var markers = $svgContainer.find('marker');
                assert.isTrue(markers.length > 0, "markers are generated");
            });
            it('should generate bidirectional arrow markers when bidirectional is set to true', function () {
                var _conf = $.extend(true, {}, forceDirectedTopologyConf);
                _conf.container = this.container;
                this.topologyInstance = Topology.getInstance(_conf, "_graph");
                this.topologyInstance.build();

                var $svgContainer = $(_conf.container).find('.topology-outer');
                var $link = $svgContainer.find('path.link[data-type="bidirectional_link"]');

                assert.isTrue($link.length == 1, "A bidirectional link has been generated");
                var leftArrowMarker = $link.attr('marker-start');
                var RightArrowMarker = $link.attr('marker-end');
                assert.isTrue(leftArrowMarker.length > 0, 'Left arrow exists');
                assert.isTrue(RightArrowMarker.length > 0, 'Right arrow exists');
            });
        });

        describe('Validate Configuration - Graph Editor layout', function () {
            beforeEach(function () {
                this.container = createContainer();
            });
            afterEach(function () {
                this.topologyInstance = null;
                this.container = null;
            });
            it('should render topology when all necessary configuration is provided ', function () {
                var _conf = $.extend(true, {}, forceDirectedTopologyConf);
                _conf.container = this.container;
                var containerContent_Before = $(_conf.container).find('.topology-widget-container');
                this.topologyInstance = Topology.getInstance(_conf);
                this.topologyInstance.build();
                var containerContent_After = $(_conf.container).find('.topology-widget-container');
                assert.notEqual(containerContent_Before, containerContent_After, "Topology is rendered");
            });
            it('should not render topology when no container is provided ', function () {
                var _conf = $.extend(true, {}, forceDirectedTopologyConf);
                _conf.container = undefined;
                this.topologyInstance = Topology.getInstance(_conf);
                var result = this.topologyInstance.build();
                assert.equal(result.confValidation.errorMessage, topologyConstants.exceptions.noContainerError, "error thrown when no container is provided");
            });
            it('should not render legend when no Legend information is provided ', function () {
                var _conf = $.extend(true, {}, forceDirectedTopologyConf);
                _conf.container = this.container;
                _conf.legend = undefined;
                this.topologyInstance = Topology.getInstance(_conf);
                this.topologyInstance.build();
                assert.equal($(_conf.container).find('.topology-legend').length, 0, "should not render legend");
            });
            it('should not render zoom/pan icon when allowZoomAndPan is set to false ', function () {
                var _conf = $.extend(true, {}, forceDirectedTopologyConf);
                _conf.container = this.container;
                _conf.allowZoomAndPan = false;
                this.topologyInstance = Topology.getInstance(_conf);
                this.topologyInstance.build();
                assert.equal($(_conf.container).find('.topology-external-controls').length, 0, "External controls not rendered");
            });
            it('should generate arrow markers when showArrowHead is set to true', function () {
                var _conf = $.extend(true, {}, forceDirectedTopologyConf);
                _conf.container = this.container;
                this.topologyInstance = Topology.getInstance(_conf);
                this.topologyInstance.build();

                var $svgContainer = $(_conf.container).find('.topology-outer');
                var markers = $svgContainer.find('.arrow');
                assert.isTrue(markers.length > 0, "markers are generated");
            });
            it('should render requested layout - hierarchical', function () {
                var _conf = $.extend(true, {}, forceDirectedTopologyConf);
                _conf.layout = {
                    type: "hierarchical"
                };
                _conf.container = this.container;
                this.topologyInstance = Topology.getInstance(_conf);
                this.topologyInstance.build();

                var $container = $(_conf.container).find('.topology-outer');
                var rootNodeId = (this.topologyInstance.get()).nodes[0].id;
                var $nodeEl = $container.find('.nodeContainer[data-id ='+rootNodeId+']');
                assert.isTrue($nodeEl.css('top').length > 0, 'top position is applied on node');
                assert.isTrue($nodeEl.css('left').length > 0, 'left position is applied on node');
            });
            it('should render requested layout - spring', function () {
                var _conf = $.extend(true, {}, forceDirectedTopologyConf);
                _conf.layout = {
                    type: "spring"
                };
                _conf.container = this.container;
                this.topologyInstance = Topology.getInstance(_conf);
                this.topologyInstance.build();

                var $container = $(_conf.container).find('.topology-outer');
                var rootNodeId = (this.topologyInstance.get()).nodes[0].id;
                var $nodeEl = $container.find('.nodeContainer[data-id ='+rootNodeId+']');
                assert.isTrue($nodeEl.css('top').length > 0, 'top position is applied on node');
                assert.isTrue($nodeEl.css('left').length > 0, 'left position is applied on node');
            });
            it('should render requested layout - absolute', function () {
                forceDirectedTopologyConf.data.nodes[0].position = {left: 500, top: 50};
                var _conf = $.extend(true, {}, forceDirectedTopologyConf);
                _conf.layout = {
                    type: "absolute"
                };
                _conf.container = this.container;
                this.topologyInstance = Topology.getInstance(_conf);
                this.topologyInstance.build();

                var $container = $(_conf.container).find('.topology-outer');
                var rootNode = (this.topologyInstance.get()).nodes[0];
                var rootNodeId = rootNode.id;
                var rootPosition = rootNode.position;
                var $nodeEl = $container.find('.nodeContainer[data-id ='+rootNodeId+']');
                assert.isTrue($nodeEl.css('top') ==  rootPosition.top+'px', 'top position is applied on node');
                assert.isTrue($nodeEl.css('left') == rootPosition.left+'px', 'left position is applied on node');
            });
            it('should return appropriate positions based on layout', function () {
                var _conf = $.extend(true, {}, forceDirectedTopologyConf);
                _conf.container = this.container;
                this.topologyInstance = Topology.getInstance(_conf);
                this.topologyInstance.build();

                //hierarchical
                var position1 = this.topologyInstance.getPositions({
                    type: "hierarchical"
                })[0].position;

                var position2 = this.topologyInstance.getPositions({
                    type: "hierarchical",
                    parameters: {
                        orientation: "LR"
                    }
                })[0].position;

                //spring
                var position3 = this.topologyInstance.getPositions({
                    type: "spring"
                })[0].position;

                assert.notEqual(position1.top, position2.top, "Root node position differ for different orientations");
                assert.notEqual(position1.top, position3.top, "hierarchical root node position is different from spring root node position");
            });
            it('should set appropriate positions based on nodeSpacing', function () {
                var _conf = $.extend(true, {}, forceDirectedTopologyConf);
                _conf.container = this.container;
                this.topologyInstance = Topology.getInstance(_conf);
                this.topologyInstance.build();

                //hierarchical
                var nodeSpacing = 180;
                var nodes = this.topologyInstance.getPositions({
                    type: "hierarchical",
                    parameters: {
                        orientation: "LR",
                        nodeSpacing: {value:nodeSpacing}
                    }
                });

                assert.isTrue((nodes[1].position.left - nodes[0].position.left) == nodeSpacing, 'nodes are positioned according to nodeSpacing config');
            });
            it('validate default and straight connection curves', function () {
                var _conf = $.extend(true, {}, forceDirectedTopologyConf);
                _conf.container = this.container;
                this.topologyInstance = Topology.getInstance(_conf);
                this.topologyInstance.build();

                var $container = $(_conf.container).find('.topology-outer');
                var path = $container.find('.link').find('path').attr('d');

                assert.isTrue(path.indexOf('C') > -1,'StateMachine default connector type is rendered');
                assert.isTrue(path.indexOf('L') == -1,'Straight connector type is not rendered');
            });
            it('validate customNodeView callback', function () {
                var _conf = $.extend(true, {}, forceDirectedTopologyConf);
                _conf.container = this.container;
                _conf.customNodeView = function(node) {
                    return function MyView() {
                        this.render = function(node) {
                            var data = $.extend({}, node, {
                                image: topologyConf.icons[node.type]
                            });
                            this.el = "<div class=\"customContainer\">\n" +
                                "    <div class=\"customNode\">\n" +
                                "        <span class=\"customlabel\">"+node.name+"</span>\n" +
                                "    </div>\n" +
                                "</div>"
                            return this;
                        };
                        this.update = function(node) {
                            $node = $(this.el);
                            $node.find('.customlabel').text(node.name);
                        }
                    }
                };
                this.topologyInstance = Topology.getInstance(_conf);
                this.topologyInstance.build();

                var $container = $(_conf.container).find('.topology-outer');
                var $nodes = $container.find('.customContainer');
                assert.equal($nodes.length, forceDirectedTopologyConf.data.nodes.length, "Nodes are rendered");

                var updatedData = {
                    "name": "Hello",
                    "id": "123_node"
                };
                this.topologyInstance.update(updatedData);
                var $updatedNode = $container.find('.customContainer').first();
                assert.equal($updatedNode.find('.customlabel').text(), updatedData.name, "custom view update method is called and Node is updated");
            });
        });

        describe('Validate Configuration - Chord layout', function () {
            beforeEach(function () {
                this.container = createContainer();
            });
            afterEach(function () {
                this.topologyInstance = null;
                this.container = null;
            });
            it('should render topology when all necessary configuration is provided ', function () {
                var _conf = $.extend(true, {}, forceDirectedTopologyConf);
                _conf.container = this.container;
                var containerContent_Before = $(_conf.container).find('.topology-widget-container');
                this.topologyInstance = Topology.getInstance(_conf, "chord");
                this.topologyInstance.build();
                var containerContent_After = $(_conf.container).find('.topology-widget-container');
                assert.notEqual(containerContent_Before, containerContent_After, "Topology is rendered");
            });
            it('should not render topology when no container is provided ', function () {
                var _conf = $.extend(true, {}, forceDirectedTopologyConf);
                _conf.container = undefined;
                this.topologyInstance = Topology.getInstance(_conf, "chord");
                var result = this.topologyInstance.build();
                assert.equal(result.confValidation.errorMessage, topologyConstants.exceptions.noContainerError, "error thrown when no container is provided");
            });
            it('should not render legend when no Legend information is provided ', function () {
                var _conf = $.extend(true, {}, forceDirectedTopologyConf);
                _conf.container = this.container;
                _conf.legend = undefined;
                this.topologyInstance = Topology.getInstance(_conf, "chord");
                this.topologyInstance.build();
                assert.equal($(_conf.container).find('.topology-legend').length, 0, "should not render legend");
            });
            it('should not render zoom/pan icon when allowZoomAndPan is set to false ', function () {
                var _conf = $.extend(true, {}, forceDirectedTopologyConf);
                _conf.container = this.container;
                _conf.allowZoomAndPan = false;
                this.topologyInstance = Topology.getInstance(_conf, "chord");
                this.topologyInstance.build();
                assert.equal($(_conf.container).find('.topology-external-controls').length, 0, "External controls not rendered");
            });
            it('should ensure visual is responsive by default', function () {
                var _conf = $.extend(true, {}, forceDirectedTopologyConf);
                _conf.container = this.container;
                this.topologyInstance = Topology.getInstance(_conf, "chord");
                this.topologyInstance.build();

                var $svgContainer = $(_conf.container).find('.topology-outer');
                assert.isTrue($svgContainer[0].hasAttribute('preserveAspectRatio'), "visual is responsive");
            });
        });

        describe('Validate Events', function () {
            beforeEach(function () {
                var _conf = $.extend(true, {}, topologyConf);
                this.container = createContainer();
                _conf.container = this.container;
                _conf.dataStore = new TreeDataStore(_conf.data);
                _conf.legend = {
                    render: function () {
                        return '<div id="test-legend"></div>';
                    }
                };
                this.topologyInstance = Topology.getInstance(_conf, "tree");
                this.topologyInstance.build();
            });
            afterEach(function () {
                cleanUp(this);
            });
            it('should trigger an internal event called topology-zoom-in when zoomin button is clicked', function () {
                var $svgContainer = this.container.find('.topology-canvas');
                $svgContainer.on('topology-zoom-in', function (evt) {
                    evt.should.exist;
                });
                this.container.find('.topology-zoom-in').trigger('click');
            });
            it('should trigger an internal event called topology-zoom-out when zoomout button is clicked', function () {
                var $svgContainer = this.container.find('.topology-canvas');
                $svgContainer.on('topology-zoom-out', function (evt) {
                    evt.should.exist;
                });
                this.container.find('.topology-zoom-out').trigger('click');
            });
            it('should trigger a public event called slipstream.topology.node:click when a node is clicked', function () {
                var $svgContainer = this.container.find('.topology-canvas');
                var evt = new MouseEvent("click");
                var $node = $svgContainer.find("g.node").first().find('g').first();
                this.container.on("slipstream.topology.node:click", function (evt, node) {
                    node.id.should.exist;
                });
                $node[ 0 ].dispatchEvent(evt);
            });
            it('should trigger a public event called slipstream.topology.node:mouseOver when a node is hovered over', function () {
                var $svgContainer = this.container.find('.topology-canvas');
                var evt = new MouseEvent("mouseover");
                var $node = $svgContainer.find("g.node").first();
                this.container.on("slipstream.topology.node:mouseOver", function (evt, node) {
                    node.id.should.exist;
                });
                $node[ 0 ].dispatchEvent(evt);
            });
            it('should trigger a public event called slipstream.topology.node:mouseOut when a node is hovered out of', function () {
                var $svgContainer = this.container.find('.topology-canvas');
                var evt = new MouseEvent("mouseout");
                var $node = $svgContainer.find("g.node").first();
                this.container.on("slipstream.topology.node:mouseOut", function (evt, node) {
                    node.id.should.exist;
                });
                $node[ 0 ].dispatchEvent(evt);
            });
            it('should trigger a public event called slipstream.topology.link:click when a link is clicked', function () {
                var $svgContainer = this.container.find('.topology-canvas');
                var evt = new MouseEvent("click");
                var $link = $svgContainer.find("path.link").first();
                this.container.on("slipstream.topology.link:click", function (evt, link) {
                    link.id.should.exist;
                });
                $link[ 0 ].dispatchEvent(evt);
            });
            it('should trigger a public event called slipstream.topology.link:mouseOver when a link is hovered over', function () {
                var $svgContainer = this.container.find('.topology-canvas');
                var evt = new MouseEvent("mouseover");
                var $link = $svgContainer.find("path.link").first();
                this.container.on("slipstream.topology.link:mouseOver", function (evt, link) {
                    link.id.should.exist;
                });
                $link[ 0 ].dispatchEvent(evt);
            });
            it('should trigger a public event called slipstream.topology.link:mouseOut when a link is hovered out of', function () {
                var $svgContainer = this.container.find('.topology-canvas');
                var evt = new MouseEvent("mouseout");
                var $link = $svgContainer.find("path.link").first();
                this.container.on("slipstream.topology.link:mouseOut", function (evt, link) {
                    link.id.should.exist;
                });
                $link[ 0 ].dispatchEvent(evt);
            });
            it('should trigger a public event called slipstream.topology.link.icon:click when a link icon is clicked', function () {
                var $svgContainer = this.container.find('.topology-canvas');
                var evt = new MouseEvent("click");
                var $linkIcon = $svgContainer.find("g.link").first();
                this.container.on("slipstream.topology.link.icon:click", function (evt, linkIcon) {
                    linkIcon.id.should.exist;
                });
                $linkIcon[ 0 ].dispatchEvent(evt);
            });
            it('should trigger a public event called slipstream.topology.link.icon:mouseOver when a link icon  is hovered over', function () {
                var $svgContainer = this.container.find('.topology-canvas');
                var evt = new MouseEvent("mouseover");
                var $linkIcon = $svgContainer.find("g.link").first();
                this.container.on("slipstream.topology.link.icon:mouseOver", function (evt, linkIcon) {
                    linkIcon.id.should.exist;
                });
                $linkIcon[ 0 ].dispatchEvent(evt);
            });
            it('should trigger a public event called slipstream.topology.link.icon:mouseOut when a link icon  is hovered out of', function () {
                var $svgContainer = this.container.find('.topology-canvas');
                var evt = new MouseEvent("mouseout");
                var $linkIcon = $svgContainer.find("g.link").first();
                this.container.on("slipstream.topology.link.iconv:mouseOut", function (evt, linkIcon) {
                    linkIcon.id.should.exist;
                });
                $linkIcon[ 0 ].dispatchEvent(evt);
            });
            it('should reload the topology when reload button is clicked', function () {
                var _conf = $.extend(true, {}, topologyConf);
                _conf.container = this.container;
                var containerContent_Before = $(_conf.container).find('.topology-canvas');
                this.topologyInstance = Topology.getInstance(_conf, "tree");
                this.topologyInstance.build();
                _conf.container.find('.topology-reset').trigger('click');
                var containerContent_After = $(_conf.container).find('.topology-canvas');
                assert.notEqual(containerContent_Before, containerContent_After, "");
            });
            it('should reset the topology position when reload button is clicked', function () {
                var _conf = $.extend(true, {}, topologyConf);
                _conf.container = this.container;
                //Move the visual to a different position and click reset.
                var containerContent_Before = $(_conf.container).find('.outer-group').attr('transform', 'translate(486.781494140625,80.33658391779124)scale(1)');
                _conf.container.find('.topology-reset').trigger('click');
                var containerContent_After = $(_conf.container).find('.outer-group').attr('transform');
                assert.notEqual(containerContent_Before, containerContent_After, "");
            });
            it('should expand legend when legend button is clicked', function () {
                var $svgContainer = this.container.find('.topology-canvas');
                this.container.find('.topology-legend-icon').trigger('click');
                assert.isTrue(this.container.find(".legend-view-container").hasClass("legend-expanded"), "");
            });
            it('should collapse legend when legend button is clicked after expanding', function () {
                var $svgContainer = this.container.find('.topology-canvas');
                var $legendButton = this.container.find('.topology-legend-icon');
                $legendButton.trigger('click');
                $legendButton.trigger('click');
                assert.isFalse(this.container.find(".legend-view-container").hasClass("legend-expanded"), "");
            });
        });

        describe('Validate Events - Graph layout', function () {
            beforeEach(function () {
                var _conf = $.extend(true, {}, forceDirectedTopologyConf);
                this.container = createContainer();
                _conf.container = this.container;
                _conf.legend = {
                    render: function () {
                        return '<div id="test-legend"></div>';
                    }
                };
                this.topologyInstance = Topology.getInstance(_conf, "_graph");
                this.topologyInstance.build();
            });
            afterEach(function () {
                cleanUp(this);
            });
            it('should trigger an internal event called topology-zoom-in when zoomin button is clicked', function () {
                var $svgContainer = this.container.find('.topology-canvas');
                $svgContainer.on('topology-zoom-in', function (evt) {
                    evt.should.exist;
                });
                this.container.find('.topology-zoom-in').trigger('click');
            });
            it('should trigger an internal event called topology-zoom-out when zoomout button is clicked', function () {
                var $svgContainer = this.container.find('.topology-canvas');
                $svgContainer.on('topology-zoom-out', function (evt) {
                    evt.should.exist;
                });
                this.container.find('.topology-zoom-out').trigger('click');
            });
            it('should trigger a public event called slipstream.topology.node:click when a node is clicked', function () {
                var $svgContainer = this.container.find('.topology-canvas');
                var evt = new MouseEvent("click");
                var $node = $svgContainer.find("g.node").first();
                this.container.on("slipstream.topology.node:click", function (evt, node) {
                    node.id.should.exist;
                });
                $node[ 0 ].dispatchEvent(evt);
            });
            it('should trigger a public event called slipstream.topology.node:mouseOver when a node is hovered over', function () {
                var $svgContainer = this.container.find('.topology-canvas');
                var evt = new MouseEvent("mouseover");
                var $node = $svgContainer.find("g.node").first();
                this.container.on("slipstream.topology.node:mouseOver", function (evt, node) {
                    node.id.should.exist;
                });
                $node[ 0 ].dispatchEvent(evt);
            });
            it('should trigger a public event called slipstream.topology.node:mouseOut when a node is hovered out of', function () {
                var $svgContainer = this.container.find('.topology-canvas');
                var evt = new MouseEvent("mouseout");
                var $node = $svgContainer.find("g.node").first();
                this.container.on("slipstream.topology.node:mouseOut", function (evt, node) {
                    node.id.should.exist;
                });
                $node[ 0 ].dispatchEvent(evt);
            });
            it('should trigger a public event called slipstream.topology.link:click when a link is clicked', function () {
                var $svgContainer = this.container.find('.topology-canvas');
                var evt = new MouseEvent("click");
                var $link = $svgContainer.find("path.link").first();
                this.container.on("slipstream.topology.link:click", function (evt, link) {
                    link.id.should.exist;
                });
                $link[ 0 ].dispatchEvent(evt);
            });
            it('should trigger a public event called slipstream.topology.link:mouseOver when a link is hovered over', function () {
                var $svgContainer = this.container.find('.topology-canvas');
                var evt = new MouseEvent("mouseover");
                var $link = $svgContainer.find("path.link").first();
                this.container.on("slipstream.topology.link:mouseOver", function (evt, link) {
                    link.id.should.exist;
                });
                $link[ 0 ].dispatchEvent(evt);
            });
            it('should trigger a public event called slipstream.topology.link:mouseOut when a link is hovered out of', function () {
                var $svgContainer = this.container.find('.topology-canvas');
                var evt = new MouseEvent("mouseout");
                var $link = $svgContainer.find("path.link").first();
                this.container.on("slipstream.topology.link:mouseOut", function (evt, link) {
                    link.id.should.exist;
                });
                $link[ 0 ].dispatchEvent(evt);
            });
            it('should reload the topology when reload button is clicked', function () {
                var _conf = $.extend(true, {}, topologyConf);
                _conf.container = this.container;
                var containerContent_Before = $(_conf.container).find('.topology-canvas');
                this.topologyInstance = Topology.getInstance(_conf, "tree");
                this.topologyInstance.build();
                _conf.container.find('.topology-reset').trigger('click');
                var containerContent_After = $(_conf.container).find('.topology-canvas');
                assert.notEqual(containerContent_Before, containerContent_After, "");
            });
            it('should expand legend when legend button is clicked', function () {
                this.container.find('.topology-legend-icon').trigger('click');
                assert.isTrue(this.container.find(".legend-view-container").hasClass("legend-expanded"), "");
            });
            it('should collapse legend when legend button is clicked after expanding', function () {
                var $legendButton = this.container.find('.topology-legend-icon');
                $legendButton.trigger('click');
                $legendButton.trigger('click');
                assert.isFalse(this.container.find(".legend-view-container").hasClass("legend-expanded"), "");
            });
        });

        describe('Validate Events - Graph Editor layout', function () {
            beforeEach(function () {
                var _conf = $.extend(true, {}, forceDirectedTopologyConf);
                this.container = createContainer();
                _conf.container = this.container;
                _conf.legend = {
                    render: function () {
                        return '<div id="test-legend"></div>';
                    }
                };
                this.topologyInstance = Topology.getInstance(_conf);
                this.topologyInstance.build();
            });
            afterEach(function () {
                cleanUp(this);
            });
            it('should trigger an internal event called topology-zoom-in when zoomin button is clicked', function () {
                var $svgContainer = this.container.find('.topology-canvas');
                $svgContainer.on('topology-zoom-in', function (evt) {
                    evt.should.exist;
                });
                this.container.find('.topology-zoom-in').trigger('click');
            });
            it('should trigger an internal event called topology-zoom-out when zoomout button is clicked', function () {
                var $svgContainer = this.container.find('.topology-canvas');
                $svgContainer.on('topology-zoom-out', function (evt) {
                    evt.should.exist;
                });
                this.container.find('.topology-zoom-out').trigger('click');
            });
            it('should trigger a public event called slipstream.topology.node:click when a node is clicked', function () {
                var $svgContainer = this.container.find('.topology-canvas');
                var $node = $svgContainer.find(".node").first();
                this.container.on("slipstream.topology.node:click", function (evt, node) {
                    node.id.should.exist;
                });
                $node.click();
            });
            it('should trigger a public event called slipstream.topology.node:mouseOver when a node is hovered over', function () {
                var $svgContainer = this.container.find('.topology-canvas');
                var $node = $svgContainer.find(".node").first();
                this.container.on("slipstream.topology.node:mouseOver", function (evt, node) {
                    node.id.should.exist;
                });
                $node.mouseover();
            });
            it('should trigger a public event called slipstream.topology.node:mouseOut when a node is hovered out of', function () {
                var $svgContainer = this.container.find('.topology-canvas');
                var $node = $svgContainer.find(".node").first();
                this.container.on("slipstream.topology.node:mouseOut", function (evt, node) {
                    node.id.should.exist;
                });
                $node.mouseout();
            });
            it('should trigger a public event called slipstream.topology.link:click when a link is clicked', function () {
                var $svgContainer = this.container.find('.topology-canvas');
                var $link = $svgContainer.find(".linkLabel").first();
                this.container.on("slipstream.topology.link:click", function (evt, link) {
                    link.links.should.exist;
                });
                $link.click();
            });
            it('should trigger a public event called slipstream.topology.link:mouseOver when a link is hovered over', function () {
                var $svgContainer = this.container.find('.topology-canvas');
                var $link = $svgContainer.find(".linkLabel").first();
                this.container.on("slipstream.topology.link:mouseOver", function (evt, link) {
                    link.links.should.exist;
                });
                $link.mouseover();
            });
            it('should trigger a public event called slipstream.topology.link:mouseOut when a link is hovered out of', function () {
                var $svgContainer = this.container.find('.topology-canvas');
                var $link = $svgContainer.find(".linkLabel").first();
                this.container.on("slipstream.topology.link:mouseOut", function (evt, link) {
                    link.links.should.exist;
                });
                $link.mouseout();
            });
            it('should reload the topology when reload button is clicked', function () {
                var _conf = $.extend(true, {}, topologyConf);
                _conf.container = this.container;
                var containerContent_Before = $(_conf.container).find('.topology-outer');

                _conf.container.find('.topology-reset').click();
                var containerContent_After = $(_conf.container).find('.topology-outer');
                assert.notEqual(containerContent_Before, containerContent_After, "");
            });
            it('should expand legend when legend button is clicked', function () {
                this.container.find('.topology-legend-icon').trigger('click');
                assert.isTrue(this.container.find(".legend-view-container").hasClass("legend-expanded"), "");
            });
            it('should collapse legend when legend button is clicked after expanding', function () {
                var $legendButton = this.container.find('.topology-legend-icon');
                $legendButton.trigger('click');
                $legendButton.trigger('click');
                assert.isFalse(this.container.find(".legend-view-container").hasClass("legend-expanded"), "");
            });
        });

        describe('Validate Events - Chord layout', function () {
            beforeEach(function () {
                var _conf = $.extend(true, {}, forceDirectedTopologyConf);
                this.container = createContainer();
                _conf.container = this.container;
                _conf.legend = {
                    render: function () {
                        return '<div id="test-legend"></div>';
                    }
                };
                this.topologyInstance = Topology.getInstance(_conf, "chord");
                this.topologyInstance.build();
            });
            afterEach(function () {
                cleanUp(this);
            });
            it('should trigger an internal event called topology-zoom-in when zoomin button is clicked', function () {
                var $svgContainer = this.container.find('.topology-canvas');
                $svgContainer.on('topology-zoom-in', function (evt) {
                    evt.should.exist;
                });
                this.container.find('.topology-zoom-in').trigger('click');
            });
            it('should trigger an internal event called topology-zoom-out when zoomout button is clicked', function () {
                var $svgContainer = this.container.find('.topology-canvas');
                $svgContainer.on('topology-zoom-out', function (evt) {
                    evt.should.exist;
                });
                this.container.find('.topology-zoom-out').trigger('click');
            });
            it('should trigger a public event called slipstream.topology.node:click when a node is clicked', function () {
                var $svgContainer = this.container.find('.topology-canvas');
                var evt = new MouseEvent("click");
                var $node = $svgContainer.find("g.node").first();
                this.container.on("slipstream.topology.node:click", function (evt, node) {
                    node.id.should.exist;
                });
                $node[ 0 ].dispatchEvent(evt);
            });
            it('should trigger a public event called slipstream.topology.node:mouseOver when a node is hovered over', function () {
                var $svgContainer = this.container.find('.topology-canvas');
                var evt = new MouseEvent("mouseover");
                var $node = $svgContainer.find("g.node").first();
                this.container.on("slipstream.topology.node:mouseOver", function (evt, node) {
                    node.id.should.exist;
                });
                $node[ 0 ].dispatchEvent(evt);
            });
            it('should trigger a public event called slipstream.topology.node:mouseOut when a node is hovered out of', function () {
                var $svgContainer = this.container.find('.topology-canvas');
                var evt = new MouseEvent("mouseout");
                var $node = $svgContainer.find("g.node").first();
                this.container.on("slipstream.topology.node:mouseOut", function (evt, node) {
                    node.id.should.exist;
                });
                $node[ 0 ].dispatchEvent(evt);
            });
            it('should trigger a public event called slipstream.topology.link:click when a link is clicked', function () {
                var $svgContainer = this.container.find('.topology-canvas');
                var evt = new MouseEvent("click");
                var $link = $svgContainer.find("path.chord").eq(1);
                this.container.on("slipstream.topology.link:click", function (evt, link) {
                    link.should.exist;
                });
                $link[ 0 ].dispatchEvent(evt);
            });
            it('should trigger a public event called slipstream.topology.link:mouseOver when a link is hovered over', function () {
                var $svgContainer = this.container.find('.topology-canvas');
                var evt = new MouseEvent("mouseover");
                var $link = $svgContainer.find("path.chord").eq(1);
                this.container.on("slipstream.topology.link:mouseOver", function (evt, link) {
                    link.should.exist;
                });
                $link[ 0 ].dispatchEvent(evt);
            });
            it('should trigger a public event called slipstream.topology.link:mouseOut when a link is hovered out of', function () {
                var $svgContainer = this.container.find('.topology-canvas');
                var evt = new MouseEvent("mouseout");
                var $link = $svgContainer.find("path.chord").eq(1);
                this.container.on("slipstream.topology.link:mouseOut", function (evt, link) {
                    link.should.exist;
                });
                $link[ 0 ].dispatchEvent(evt);
            });
            it('should reload the topology when reload button is clicked', function () {
                var _conf = $.extend(true, {}, topologyConf);
                _conf.container = this.container;
                var containerContent_Before = $(_conf.container).find('.topology-canvas');
                this.topologyInstance = Topology.getInstance(_conf, "chord");
                this.topologyInstance.build();
                _conf.container.find('.topology-reset').trigger('click');
                var containerContent_After = $(_conf.container).find('.topology-canvas');
                assert.notEqual(containerContent_Before, containerContent_After, "");
            });
            it('should expand legend when legend button is clicked', function () {
                this.container.find('.topology-legend-icon').trigger('click');
                assert.isTrue(this.container.find(".legend-view-container").hasClass("legend-expanded"), "");
            });
            it('should collapse legend when legend button is clicked after expanding', function () {
                var $legendButton = this.container.find('.topology-legend-icon');
                $legendButton.trigger('click');
                $legendButton.trigger('click');
                assert.isFalse(this.container.find(".legend-view-container").hasClass("legend-expanded"), "");
            });
        });

        describe('Validate Tooltips', function () {
            beforeEach(function () {
                var _conf = $.extend(true, {}, topologyConf);
                this.container = createContainer();
                _conf.container = this.container;
                _conf.legend = {
                    render: function () {
                        return '<div id="test-legend"></div>';
                    }
                };
                this.topologyInstance = Topology.getInstance(_conf, "tree");
                this.topologyInstance.build();
            });
            afterEach(function () {
                cleanUp(this);
            });
            it('should display a tooltip when a node is hovered over', function () {
                var svgContainer = this.container.find('.topology-canvas');
                var evt = new MouseEvent("mouseover");
                var node = svgContainer.find("g.node").first();
                var nodeGroup = node.find('.nodeGroup')[0];
                nodeGroup.dispatchEvent(evt);
                var isTooltipstered = $(nodeGroup).data('tooltipster-ns') && $(nodeGroup).data('tooltipster-ns').length > 0;
                assert.equal(isTooltipstered, true, "Tooltip is attached to the node being hovered" );
            });
            it('should remove the tooltip when a node is hovered out of', function () {
                var svgContainer = this.container.find('.topology-canvas');
                var evt = new MouseEvent("mouseout");
                var node = svgContainer.find("g.node").first();
                var nodeGroup = node.find('.nodeGroup')[0];
                nodeGroup.dispatchEvent(evt);
                var isTooltipstered = $(nodeGroup).data('tooltipster-ns') && $(nodeGroup).data('tooltipster-ns').length > 0;
                assert.equal(!isTooltipstered, true, "Tooltip is removed on node:mouseout" );
            });
            it('should display a tooltip when a link icon is hovered over', function () {
                var svgContainer = this.container.find('.topology-canvas');
                var evt = new MouseEvent("mouseover");
                var linkIcon = svgContainer.find("g.link").first();
                var icon = $(linkIcon[0]);
                linkIcon[ 0 ].dispatchEvent(evt);
                var isTooltipstered = $(icon).data('tooltipster-ns') && $(icon).data('tooltipster-ns').length > 0;
                assert.equal(isTooltipstered, true, "Tooltip is attached to the link icon being hovered" );
            });
            it('should remove the tooltip when the link icon is hovered out of', function () {
                var svgContainer = this.container.find('.topology-canvas');
                var evt = new MouseEvent("mouseout");
                var linkIcon = svgContainer.find("g.link").first();
                var icon = $(linkIcon[0]);
                linkIcon[ 0 ].dispatchEvent(evt);
                var isTooltipstered = $(icon).data('tooltipster-ns') && $(icon).data('tooltipster-ns').length > 0;
                assert.equal(!isTooltipstered, true, "Tooltip is removed on link-icon:mouseout" );
            });
            it('should display a tooltip when a node-badge is hovered over', function () {
                var svgContainer = this.container.find('.topology-canvas');
                var evt = new MouseEvent("mouseover");
                var nodeBadge = svgContainer.find("g.node").eq(1).find('.node-badge').parent()[0]; //get the badge.
                nodeBadge.dispatchEvent(evt); //click badge.
                var isTooltipstered = $(nodeBadge).data('tooltipster-ns') && $(nodeBadge).data('tooltipster-ns').length > 0;
                assert.equal(isTooltipstered, true, "Tooltip is attached to the node badge being hovered" );
            });
            it('should remove the tooltip when a node-badge is hovered out of', function () {
                var svgContainer = this.container.find('.topology-canvas');
                var evt = new MouseEvent("mouseout");
                var nodeBadge = svgContainer.find("g.node").eq(1).find('.node-badge').parent()[0]; //get the badge.
                nodeBadge.dispatchEvent(evt); //click badge.
                var isTooltipstered = $(nodeBadge).data('tooltipster-ns') && $(nodeBadge).data('tooltipster-ns').length > 0;
                assert.equal(!isTooltipstered, true, "Tooltip is removed on the node-badge:mouseout" );
            });

        });

        describe('Validate Tooltips - Graph layout', function () {
            beforeEach(function () {
                var _conf = $.extend(true, {}, forceDirectedTopologyConf);
                this.container = createContainer();
                _conf.container = this.container;
                _conf.legend = {
                    render: function () {
                        return '<div id="test-legend"></div>';
                    }
                };
                this.topologyInstance = Topology.getInstance(_conf, "_graph");
                this.topologyInstance.build();
            });
            afterEach(function () {
                cleanUp(this);
            });
            it('should display a tooltip when a node is hovered over', function () {
                var svgContainer = this.container.find('.topology-canvas');
                var evt = new MouseEvent("mouseover");
                var node = svgContainer.find("g.node").first();

                node[0].dispatchEvent(evt);
                var isTooltipstered = $(node).data('tooltipster-ns') && $(node).data('tooltipster-ns').length > 0;
                assert.equal(isTooltipstered, true, "Tooltip is attached to the node being hovered" );
            });
            it('should remove the tooltip when a node is hovered out of', function () {
                var svgContainer = this.container.find('.topology-canvas');
                var evt = new MouseEvent("mouseout");
                var node = svgContainer.find("g.node").first();

                node[0].dispatchEvent(evt);
                var isTooltipstered = $(node).data('tooltipster-ns') && $(node).data('tooltipster-ns').length > 0;
                assert.equal(!isTooltipstered, true, "Tooltip is removed on node:mouseout" );
            });
        });

        describe('Validate Tooltips - Graph Editor layout', function () {
            beforeEach(function () {
                var _conf = $.extend(true, {}, forceDirectedTopologyConf);
                this.container = createContainer();
                _conf.container = this.container;
                _conf.legend = {
                    render: function () {
                        return '<div id="test-legend"></div>';
                    }
                };
                this.topologyInstance = Topology.getInstance(_conf);
                this.topologyInstance.build();
            });
            afterEach(function () {
                cleanUp(this);
            });
            it('should display a tooltip when a node is hovered over', function () {
                var $container = this.container.find('.topology-canvas');
                var $node = $container.find(".nodeContainer").first();

                $node.mouseover();
                var isTooltipstered = $node.data('tooltipster-ns') && $node.data('tooltipster-ns').length > 0;
                assert.equal(isTooltipstered, true, "Tooltip is attached to the node being hovered" );
            });
            it('should remove the tooltip when a node is hovered out of', function () {
                var $container = this.container.find('.topology-canvas');
                var $node = $container.find(".nodeContainer").first();

                $node.mouseout();
                var isTooltipstered = $node.data('tooltipster-ns') && $node.data('tooltipster-ns').length > 0;
                assert.equal(!isTooltipstered, true, "Tooltip is removed on node:mouseout" );
            });
        });

        describe('Validate Tooltips - Chord layout', function () {
            beforeEach(function () {
                var _conf = $.extend(true, {}, forceDirectedTopologyConf);
                this.container = createContainer();
                _conf.container = this.container;
                _conf.legend = {
                    render: function () {
                        return '<div id="test-legend"></div>';
                    }
                };
                this.topologyInstance = Topology.getInstance(_conf, "chord");
                this.topologyInstance.build();
            });
            afterEach(function () {
                cleanUp(this);
            });
            it('should display a tooltip when a node is hovered over', function () {
                var svgContainer = this.container.find('.topology-canvas');
                var evt = new MouseEvent("mouseover");
                var node = svgContainer.find("g.node text").eq(1);

                node[0].dispatchEvent(evt);
                var isTooltipstered = $(node).data('tooltipster-ns') && $(node).data('tooltipster-ns').length > 0;
                assert.equal(isTooltipstered, true, "Tooltip is attached to the node being hovered" );
            });
            it('should remove the tooltip when a node is hovered out of', function () {
                var svgContainer = this.container.find('.topology-canvas');
                var evt = new MouseEvent("mouseout");
                var node = svgContainer.find("g.node text").eq(1);

                node[0].dispatchEvent(evt);
                var isTooltipstered = $(node).data('tooltipster-ns') && $(node).data('tooltipster-ns').length > 0;
                assert.equal(!isTooltipstered, true, "Tooltip is removed on node:mouseout" );
            });
        });

        describe('Validate subNodes', function () {
            beforeEach(function () {
                var _conf = $.extend(true, {}, topologyConf);
                this.container = createContainer();
                _conf.container = this.container;
                _conf.legend = {
                    render: function () {
                        return '<div id="test-legend"></div>';
                    }
                };
                this.topologyInstance = Topology.getInstance(_conf, "tree");
                this.topologyInstance.build();
            });
            afterEach(function () {
                cleanUp(this);
            });
            it('should display subNodes when a node badge is clicked', function () {
                var svgContainer = this.container.find('.topology-canvas');
                var evt = new MouseEvent("click");
                var node = svgContainer.find("g.node");
                node[0].dispatchEvent(evt);
                var subNode = $(svgContainer).find('.subnode-badge' + topologyConf.data.children[0].id);
                assert.isTrue(subNode.length > 0, "SubNode is attached to the container" );
            });
            it('should display subNode links when a node badge is clicked', function () {
                var svgContainer = this.container.find('.topology-canvas');
                var evt = new MouseEvent("click");
                var node = svgContainer.find("g.node");
                node[0].dispatchEvent(evt);
                var subNode = $(svgContainer).find('.link.subnode-badge' + topologyConf.data.children[0].id);
                assert.isTrue(subNode.length > 0, "SubNode link is attached to the container" );
            });
            it('should display subNode link arrow heads when a node badge is clicked', function () {
                var svgContainer = this.container.find('.topology-canvas');
                var evt = new MouseEvent("click");
                var node = svgContainer.find("g.node");
                node[0].dispatchEvent(evt);
                var subNode = $(svgContainer).find('.link-arrow.link.subnode-badge' + topologyConf.data.children[0].id);
                assert.isTrue(subNode.length > 0, "SubNode link arrowhead is attached to the container" );
            });
            it('should trigger a public event called slipstream.topology.node:click when a subnode is clicked', function () {
                //Click badge to display subNodes
                var $svgContainer = this.container.find('.topology-canvas');
                var evt = new MouseEvent("click");
                var $nodeBadge = $svgContainer.find("g.node").eq(1).find('g:nth-child(2)'); //get the badge.
                $nodeBadge[0].dispatchEvent(evt); //click badge.

                this.container.on("slipstream.topology.node:click", function (evt, node) {
                    node.id.should.exist;
                });
                //Select a subNode
                $subNode = $svgContainer.find("g.node[subnode='true']").first();
                $subNode[0].dispatchEvent(evt); //click subNode element.
            });
            it('should contain node-badge selected class when a subnode badge is clicked', function () {
                //Click badge to display subNodes
                var $svgContainer = this.container.find('.topology-canvas');

                // ensure 'selected' style is not applied prior to clicking on the badge
                var selectedBadgeStyle = $svgContainer.find('.node-badge.show.selected');
                assert.isTrue(selectedBadgeStyle.length == 0, "SubNode badge does not have selected class before click");

                var evt = new MouseEvent("click");
                var $nodeBadge1 = $svgContainer.find("g.node").eq(0).find('g:nth-child(2)'); //get the first badge
                var $nodeBadge2 = $svgContainer.find("g.node").eq(1).find('g:nth-child(2)'); //get the second badge
                $nodeBadge1[0].dispatchEvent(evt); //click the first badge

                selectedBadgeStyle = $svgContainer.find('.node-badge.show.selected'); // check if 'selected' style is applied
                assert.isTrue(selectedBadgeStyle.length == 1, "Only one subNode badge has selected class after click");
            });
        });

        describe('Validate subNode config object', function () {
            beforeEach(function () {
                var _conf = $.extend(true, {}, topologyConf);
                this.container = createContainer();
                _conf.container = this.container;

                var subNodeBadgeClick = function (node) {
                    node.should.exist;
                    if (node.subNodes && node.subNodes.length > 2) {
                        return false;
                    }
                    return true;
                };
                _conf.subNode = {
                    badgeOnClick: subNodeBadgeClick
                };
                this.topologyInstance = Topology.getInstance(_conf, "tree");
                this.topologyInstance.build();
            });
            afterEach(function () {
                cleanUp(this);
            });
            it('should toggle based on subnode badge badgeOnClick config', function () {
                //Click badge to display subNodes
                var $svgContainer = this.container.find('.topology-canvas');

                // ensure 'selected' style is not applied prior to clicking on the badge
                var selectedBadgeStyle = $svgContainer.find('.node-badge.show.selected');
                assert.isTrue(selectedBadgeStyle.length == 0, "SubNode badges does not have selected class before click");

                var evt = new MouseEvent("click");
                var $nodeBadge1 = $svgContainer.find("g.node").eq(0).find('g:nth-child(2)'); //get the first badge
                var $nodeBadge2 = $svgContainer.find("g.node").eq(1).find('g:nth-child(2)'); //get the second badge
                $nodeBadge1[0].dispatchEvent(evt); //click the first badge

                selectedBadgeStyle = $nodeBadge1.find('.node-badge.show.selected'); // check if 'selected' style is applied
                assert.isTrue(selectedBadgeStyle.length == 1, "The subNode badge can be toggled");

                $nodeBadge2[0].dispatchEvent(evt); //click the second badge

                selectedBadgeStyle = $nodeBadge2.find('.node-badge.show.selected'); // check if 'selected' style is applied
                assert.isTrue(selectedBadgeStyle.length == 0, "The subNode badge cannot be toggled");
            });

        });

        describe('Expanded subNodes must remain expanded on a visual re-render', function () {
            before(function () {
                var _conf = $.extend(true, {}, topologyConf);
                this.container = createContainer();
                _conf.container = this.container;

                var subNodeBadgeClick = function (node) {
                    node.should.exist;
                    if (node.subNodes && node.subNodes.length > 2) {
                        return false;
                    }
                    return true;
                };
                _conf.subNode = {
                    badgeOnClick: subNodeBadgeClick
                };
                this.topologyInstance = Topology.getInstance(_conf, "tree");
                this.topologyInstance.build();
            });
            after(function () {
                cleanUp(this);
            });
            it('should expand subNodes', function () {
                //Click badge to display subNodes
                var $svgContainer = this.container.find('.topology-canvas');

                // ensure 'selected' style is not applied prior to clicking on the badge
                var selectedBadgeStyle = $svgContainer.find('.node-badge.show.selected');
                assert.isTrue(selectedBadgeStyle.length == 0, "SubNode badges does not have selected class before click");

                var evt = new MouseEvent("click");
                var $nodeBadge1 = $svgContainer.find(".nodeBadgeGroup").eq(0); //get the first badge
                var $nodeBadge2 = $svgContainer.find(".nodeBadgeGroup").eq(1); //get the second badge
                $nodeBadge1[0].dispatchEvent(evt); //click the first badge

                selectedBadgeStyle = $nodeBadge1.find('.node-badge.show.selected'); // check if 'selected' style is applied
                assert.isTrue(selectedBadgeStyle.length == 1, "The subNode badge can be toggled");

                $nodeBadge2[0].dispatchEvent(evt); //click the second badge

                selectedBadgeStyle = $nodeBadge2.find('.node-badge.show.selected'); // check if 'selected' style is applied
                assert.isTrue(selectedBadgeStyle.length == 0, "The subNode badge cannot be toggled");

            });
            it('should retain selection after dataStore update or Topology reset action', function () {
                var $svgContainer = this.container.find('.topology-canvas');
                var selectedBadgeStyle;

                var updatedData = {
                    "name": "File updated",
                    "id": "Node100",
                    "icon": "file_default",
                    "children": [],
                    "type": "fs-topo-node",
                    "link": {
                        "type": "fs-topo-link"
                    }
                };
                var data = this.topologyInstance.updateNode(updatedData);
                var updatedFromDataStore = this.topologyInstance.get(updatedData.id);
                assert.isTrue(updatedFromDataStore.name == updatedData.name, "updated name in dataStore" );


                var $nodeBadge1 = $svgContainer.find(".nodeBadgeGroup").eq(0); //get the first badge
                var $nodeBadge2 = $svgContainer.find(".nodeBadgeGroup").eq(1); //get the second badge
                selectedBadgeStyle = $nodeBadge1.find('.node-badge.show.selected'); // check if 'selected' style is applied
                assert.isTrue(selectedBadgeStyle.length == 1, "The subNode badge remains expanded");

                selectedBadgeStyle = $nodeBadge2.find('.node-badge.show.selected'); // check if 'selected' style is applied
                assert.isTrue(selectedBadgeStyle.length == 0, "The subNode badge remains collapsed");

                this.topologyInstance.reload(); //Reload the instance to make sure that subNode selections are retained.

                $nodeBadge1 = $svgContainer.find(".nodeBadgeGroup").eq(0); //get the first badge
                $nodeBadge2 = $svgContainer.find(".nodeBadgeGroup").eq(1); //get the second badge
                selectedBadgeStyle = $nodeBadge1.find('.node-badge.show.selected'); // check if 'selected' style is applied
                assert.isTrue(selectedBadgeStyle.length == 1, "The subNode badge remains expanded");

                selectedBadgeStyle = $nodeBadge2.find('.node-badge.show.selected'); // check if 'selected' style is applied
                assert.isTrue(selectedBadgeStyle.length == 0, "The subNode badge remains collapsed");
            });
        });

        describe('Validate TreedataStore', function () {
            beforeEach(function () {
                var _conf = $.extend(true, {}, topologyConf);
                _conf.dataStore = new TreeDataStore(_conf.data);
                this.data = _conf.data;
                this.dataStore = _conf.dataStore;
                this.container = createContainer();
                _conf.container = this.container;
                _conf.legend = {
                    render: function () {
                        return '<div id="test-legend"></div>';
                    }
                };
                this.topologyInstance = Topology.getInstance(_conf, "tree");
                this.topologyInstance.build();
            });
            afterEach(function () {
                cleanUp(this);
            });
            it('should get data from dataStore when get is called', function () {
                var data = this.dataStore.get();
                assert.isTrue(this.data.id == data.id, "gets data back from dataStore" );
            });
            it('should update data in dataStore when put is called', function () {
                var updatedData = {
                    "name": "File updated",
                    "id": "Node100",
                    "icon": "file_default",
                    "children": [],
                    "type": "fs-topo-node",
                    "link": {
                        "type": "fs-topo-link"
                    }
                };
                var data = this.dataStore.put(updatedData);
                var updatedFromDataStore = this.dataStore.get(updatedData.id);
                assert.isTrue(updatedFromDataStore.name == updatedData.name, "updated data in dataStore" );
            });
            it('should add array of children in dataStore when add is called', function () {
                var childNode = {
                    "name": "File updated",
                    "id": "child3445",
                    "icon": "file_default",
                    "children": [],
                    "type": "fs-topo-node",
                    "link": {
                        "type": "fs-topo-link"
                    }
                };
                var originalChLength = this.dataStore.get("Node100").children.length;
                this.dataStore.add("Node100", [childNode]);
                var data = this.dataStore.get();
                assert.isTrue(data.children.length == originalChLength+1, "new child is added to node" );
            });
            it('should add a child in dataStore when add is called', function () {
                var childNode = {
                    "name": "File updated",
                    "id": "child3445",
                    "icon": "file_default",
                    "children": [],
                    "type": "fs-topo-node",
                    "link": {
                        "type": "fs-topo-link"
                    }
                };
                var originalChLength = this.dataStore.get("Node100").children.length;
                this.dataStore.add("Node100", childNode);
                var data = this.dataStore.get();
                assert.isTrue(data.children.length == originalChLength+1, "new child is added to node" );
            });
            it('should remove child from dataStore when remove is called', function () {
                var data = this.dataStore.get();
                var originalChLength = data.children.length;
                var firstChildNode = data.children[0];
                this.dataStore.remove(firstChildNode.id);

                var updatedChLength = this.dataStore.get().children.length;
                assert.isTrue(updatedChLength == originalChLength-1, "the child has been removed from dataStore" );
            });
            it('should return an error from dataStore when node is non-existent.', function () {
                var self = this;
                var throwErrorFunc_get = function(){
                    self.dataStore.get('000invalidid');
                };
                var throwErrorFunc_put = function(){
                    var updatedData = {
                        "name": "File updated",
                        "id": "000invalidid"
                    };
                    self.dataStore.put(updatedData);
                };
                var throwErrorFunc_add = function(){
                    self.dataStore.add('000invalidid', {});
                };
                var throwErrorFunc_remove = function(){
                    self.dataStore.remove('000invalidid');
                };
                assert.throws(throwErrorFunc_get, Error, 'Node could not be found for id - 000invalidid');
                assert.throws(throwErrorFunc_put, Error, 'Node could not be found for id - 000invalidid');
                assert.throws(throwErrorFunc_add, Error, 'Node could not be found for id - 000invalidid');
                assert.throws(throwErrorFunc_remove, Error, 'Node could not be found for id - 000invalidid');
            });
        });

        describe('Validate data management topology interfaces - TreedataStore', function () {
            beforeEach(function () {
                var _conf = $.extend(true, {}, topologyConf);
                _conf.dataStore = new TreeDataStore(_conf.data);
                this.data = _conf.data;
                this.container = createContainer();
                _conf.container = this.container;
                _conf.legend = {
                    render: function () {
                        return '<div id="test-legend"></div>';
                    }
                };
                this.topologyInstance = Topology.getInstance(_conf, "tree");
                this.topologyInstance.build();
            });
            afterEach(function () {
                cleanUp(this);
            });
            it('should get data from dataStore when get is called', function () {
                var data = this.topologyInstance.get();
                assert.isTrue(this.data.id == data.id, "gets data back from dataStore" );
            });
            it('should update data in dataStore when put is called', function () {
                var updatedData = {
                    "name": "File updated",
                    "id": "Node100",
                    "icon": "file_default",
                    "children": [],
                    "type": "fs-topo-node",
                    "link": {
                        "type": "fs-topo-link"
                    }
                };
                var data = this.topologyInstance.updateNode(updatedData);
                var updatedFromDataStore = this.topologyInstance.get(updatedData.id);
                assert.isTrue(updatedFromDataStore.name == updatedData.name, "updated name in dataStore" );
                assert.isTrue(updatedFromDataStore.id == updatedData.id, "updated id in dataStore" );
                assert.isTrue(updatedFromDataStore.icon == updatedData.icon, "updated icon in dataStore" );
                assert.isTrue(updatedFromDataStore.type == updatedData.type, "updated type in dataStore" );
                assert.isTrue(updatedFromDataStore.link == updatedData.link, "updated link in dataStore" );
            });
            it('should add array of children in dataStore when add is called', function () {
                var childNode = {
                    "name": "File updated",
                    "id": "child3445",
                    "icon": "file_default",
                    "children": [],
                    "type": "fs-topo-node",
                    "link": {
                        "type": "fs-topo-link"
                    }
                };
                var originalChLength = this.topologyInstance.get("Node100").children.length;
                this.topologyInstance.addNode("Node100", [childNode]);
                var data = this.topologyInstance.get();
                assert.isTrue(data.children.length == originalChLength+1, "new child is added to node" );
            });
            it('should add a child in dataStore when add is called', function () {
                var childNode = {
                    "name": "File updated",
                    "id": "child3445",
                    "icon": "file_default",
                    "children": [],
                    "type": "fs-topo-node",
                    "link": {
                        "type": "fs-topo-link"
                    }
                };
                var originalChLength = this.topologyInstance.get("Node100").children.length;
                this.topologyInstance.addNode("Node100", childNode);
                var data = this.topologyInstance.get();
                assert.isTrue(data.children.length == originalChLength+1, "new child is added to node" );
            });
            it('should remove child from dataStore when remove is called', function () {
                var data = this.topologyInstance.get();
                var originalChLength = data.children.length;
                var firstChildNode = data.children[0];
                this.topologyInstance.removeNode(firstChildNode.id);

                var updatedChLength = this.topologyInstance.get().children.length;
                assert.isTrue(updatedChLength == originalChLength-1, "the child has been removed from dataStore" );
            });
        });

        describe('Validate FlatdataStore', function () {
            before(function () {
                this.data = forceDirectedTopologyData;
                this.dataStore = new FlatDataStore(forceDirectedTopologyData);
            });
            after(function () {
                this.data = null;
                this.dataStore = null;
            });
            it('should get data from dataStore when get is called', function () {
                var data = this.dataStore.get();
                assert.isTrue(_.isEqual(data, this.data), "gets data back from dataStore" );
                var obj = this.dataStore.get('123_node');
                assert.isTrue(obj.id == data.nodes[0].id, "gets node data back from dataStore");
                var obj = this.dataStore.get('445_link');
                assert.isTrue(obj.id == data.links[0].id, "gets link data back from dataStore");
            });
            it('should update data in dataStore when put is called', function () {
                var updatedNode = {
                    "id": "123_node",
                    "name": "Node updated"
                };
                var data = this.dataStore.put(updatedNode);
                var updatedFromDataStore = this.dataStore.get(updatedNode.id);
                assert.isTrue(updatedFromDataStore.name == updatedNode.name, "updated data in dataStore" );
            });
            it('should add links in dataStore when add is called', function () {
                var linksArray = [{source: "123_node", target: "456_node", id: "245_link", name: "245_link", bidirectional: true},
                    {source: "123_node", target: "457_node", id: "249_link", name: "249_link"}];
                var originalData = this.dataStore.get();
                var originalLinksLength = originalData.links.length;
                this.dataStore.add(linksArray);

                var data = this.dataStore.get();
                var linksLength = data.links.length;
                assert.isTrue(linksLength == originalLinksLength+2, "links were added" );
            });
            it('should add node in dataStore when add is called', function () {
                var node = {name: "node4", id: "497_node"};
                var originalData = this.dataStore.get();
                var originalNodesLength = originalData.nodes.length;
                this.dataStore.add(node);

                var data = this.dataStore.get();
                var nodesLength = data.nodes.length;
                assert.isTrue(nodesLength == originalNodesLength+1, "node was added" );
            });
            it('should remove node from dataStore when remove is called', function () {
                var originalData = this.dataStore.get();
                var originalNodesLength = originalData.nodes.length;
                var originalLinksLength = originalData.links.length;
                this.dataStore.remove(originalData.nodes[0].id);
                this.dataStore.remove(originalData.links[0].id);

                var data = this.dataStore.get();
                var updatedNodesLength = data.nodes.length;
                var updatedLinksLength = data.links.length;
                assert.isTrue(updatedNodesLength == originalNodesLength-1, "the node has been removed from dataStore" );
                assert.isTrue(updatedLinksLength == originalLinksLength-1, "the link has been removed from dataStore" );
            });
            it('should filter type from dataStore when filter is called', function () {
                var data = this.dataStore.get();
                var nodes = this.dataStore.filter({"type":"node"});
                var links = this.dataStore.filter({"type":"link"});

                assert.isTrue(_.isEqual(data.nodes.length, nodes.length), "gets nodes back from dataStore" );
                assert.isTrue(_.isEqual(data.links.length, links.length), "gets nodes back from dataStore" );
            });
            it('should filter object attributes from dataStore when filter is called', function () {
                var data = this.dataStore.get();
                var linksWithSameSource = this.dataStore.filter({"attributes":{"source":"123_node"}});
                var linksWithUniqueTarget = this.dataStore.filter({"attributes":{"target":"456_node"}});
                var node = this.dataStore.filter({"attributes":{"name":"node4"}});
                var nodeWithType = this.dataStore.filter({"attributes":{"name":"node2"},"type":"node"});

                assert.isTrue(_.isEqual(data.links.length, linksWithSameSource.length), "gets filtered data from dataStore" );
                assert.isTrue(_.isEqual(1, linksWithUniqueTarget.length), "gets filtered data from dataStore" );
                assert.isTrue(_.isEqual(1, node.length), "gets filtered data from dataStore" );
                assert.isTrue(_.isEqual(1, nodeWithType.length), "gets filtered data from dataStore" );
            });
            it('should return an error from dataStore when node / link is non-existent.', function () {
                var self = this;
                var throwErrorFunc_get = function(){
                    self.dataStore.get('000invalidid');
                };
                var throwErrorFunc_put = function(){
                    var updatedData = {
                        "name": "File updated",
                        "id": "000invalidid"
                    };
                    self.dataStore.put(updatedData);
                };
                var throwErrorFunc_remove = function(){
                    self.dataStore.remove('000invalidid');
                };
                assert.throws(throwErrorFunc_get, Error, 'Node or link could not be found for id - 000invalidid');
                assert.throws(throwErrorFunc_put, Error, 'Node or link could not be found for id - 000invalidid');
                assert.throws(throwErrorFunc_remove, Error, 'Node or link could not be found for id - 000invalidid');
            });
            it('should return an error for invalid JSON data.', function () {
                var invalid_dataStore = function(){
                    var dataStore = new FlatDataStore("invalid_data");
                };
                assert.throws(invalid_dataStore, Error, 'The provided data must be in JSON format');
            });
        });

        describe('Validate data management Graph topology interfaces - FlatdataStore', function () {
            beforeEach(function () {
                var _conf = $.extend(true, {}, forceDirectedTopologyConf);
                this.data = _conf.data;
                this.container = createContainer();
                _conf.container = this.container;
                _conf.legend = {
                    render: function () {
                        return '<div id="test-legend"></div>';
                    }
                };
                _conf.dataStore = new FlatDataStore(this.data);
                this.topologyInstance = Topology.getInstance(_conf, "_graph");
                this.topologyInstance.build();
            });
            afterEach(function () {
                cleanUp(this);
            });
            it('should get data from dataStore when get is called', function () {
                var data = this.topologyInstance.get();
                assert.isTrue(this.data.nodes.length == data.nodes.length, "gets data back from dataStore" );
                assert.isTrue(this.data.links.length == data.links.length, "gets data back from dataStore" );
            });
            it('should update data in dataStore when put is called', function () {
                var updatedData = {
                    "name": "Node 1",
                    "id": "123_node"
                };
                var data = this.topologyInstance.update(updatedData);
                var updatedFromDataStore = this.topologyInstance.get(updatedData.id);
                assert.isTrue(updatedFromDataStore.name == updatedData.name, "updated name in dataStore" );
                assert.isTrue(updatedFromDataStore.id == updatedData.id, "updated id in dataStore" );
            });
            it('should add links in dataStore when add is called', function () {
                var linksArray = [{source: "123_node", target: "456_node", id: "245_link", name: "245_link", bidirectional: true},
                    {source: "123_node", target: "457_node", id: "249_link", name: "249_link"}];
                var originalData = this.topologyInstance.get();
                var originalLinksLength = originalData.links.length;
                this.topologyInstance.add(linksArray);

                var data = this.topologyInstance.get();
                var linksLength = data.links.length;
                assert.isTrue(linksLength == originalLinksLength+2, "links were added" );
            });
            it('should add node in dataStore when add is called', function () {
                var node = {name: "node4", id: "497_node"};
                var originalData = this.topologyInstance.get();
                var originalNodesLength = originalData.nodes.length;
                this.topologyInstance.add(node);

                var data = this.topologyInstance.get();
                var nodesLength = data.nodes.length;
                assert.isTrue(nodesLength == originalNodesLength+1, "node was added" );
            });
            it('should remove node from dataStore when remove is called', function () {
                var originalData = this.topologyInstance.get();
                var originalNodesLength = originalData.nodes.length;
                var originalLinksLength = originalData.links.length;
                this.topologyInstance.remove(originalData.nodes[0].id);
                this.topologyInstance.remove(originalData.links[0].id);

                var data = this.topologyInstance.get();
                var updatedNodesLength = data.nodes.length;
                var updatedLinksLength = data.links.length;
                assert.isTrue(updatedNodesLength == originalNodesLength-1, "the node has been removed from dataStore" );
                assert.isTrue(updatedLinksLength == originalLinksLength-1, "the link has been removed from dataStore" );
            });
            it('should filter type from dataStore when filter is called', function () {
                var data = this.topologyInstance.get();
                var nodes = this.topologyInstance.filter({"type":"node"});
                var links = this.topologyInstance.filter({"type":"link"});

                assert.isTrue(_.isEqual(data.nodes.length, nodes.length), "gets nodes back from dataStore" );
                assert.isTrue(_.isEqual(data.links.length, links.length), "gets nodes back from dataStore" );
            });
            it('should filter object attributes from dataStore when filter is called', function () {
                var data = this.topologyInstance.get();
                var linksWithSameSource = this.topologyInstance.filter({"attributes":{"source":"123_node"}});
                var linksWithUniqueTarget = this.topologyInstance.filter({"attributes":{"target":"456_node"}});
                var node = this.topologyInstance.filter({"attributes":{"name":"node1"}});
                var nodeWithType = this.topologyInstance.filter({"attributes":{"name":"node2"},"type":"node"});

                assert.isTrue(_.isEqual(data.links.length, linksWithSameSource.length), "gets filtered data from dataStore" );
                assert.isTrue(_.isEqual(1, linksWithUniqueTarget.length), "gets filtered data from dataStore" );
                assert.isTrue(_.isEqual(1, node.length), "gets filtered data from dataStore" );
                assert.isTrue(_.isEqual(1, nodeWithType.length), "gets filtered data from dataStore" );
            });
        });

        describe('Validate data management Graph Editor topology interfaces - FlatdataStore', function () {
            beforeEach(function () {
                var _conf = $.extend(true, {}, forceDirectedTopologyConf);
                this.data = _conf.data;
                this.container = createContainer();
                _conf.container = this.container;
                _conf.legend = {
                    render: function () {
                        return '<div id="test-legend"></div>';
                    }
                };
                _conf.dataStore = new FlatDataStore(this.data);
                this.topologyInstance = Topology.getInstance(_conf);
                this.topologyInstance.build();
            });
            afterEach(function () {
                cleanUp(this);
            });
            it('should get data from dataStore when get is called', function () {
                var data = this.topologyInstance.get();
                assert.isTrue(this.data.nodes.length == data.nodes.length, "gets data back from dataStore" );
                assert.isTrue(this.data.links.length == data.links.length, "gets data back from dataStore" );
            });
            it('should update data in dataStore when put is called', function () {
                var updatedData = {
                    "name": "Node 1",
                    "id": "123_node"
                };
                var data = this.topologyInstance.update(updatedData);
                var updatedFromDataStore = this.topologyInstance.get(updatedData.id);
                assert.isTrue(updatedFromDataStore.name == updatedData.name, "updated name in dataStore" );
                assert.isTrue(updatedFromDataStore.id == updatedData.id, "updated id in dataStore" );
            });
            it('should add links in dataStore when add is called', function () {
                var linksArray = [{source: "123_node", target: "456_node", id: "245_link", name: "245_link", bidirectional: true},
                    {source: "123_node", target: "457_node", id: "249_link", name: "249_link"}];
                var originalData = this.topologyInstance.get();
                var originalLinksLength = originalData.links.length;
                this.topologyInstance.add(linksArray);

                var data = this.topologyInstance.get();
                var linksLength = data.links.length;
                assert.isTrue(linksLength == originalLinksLength+2, "links were added" );
            });
            it('should add node in dataStore when add is called', function () {
                var node = {name: "node4", id: "497_node"};
                var originalData = this.topologyInstance.get();
                var originalNodesLength = originalData.nodes.length;
                this.topologyInstance.add(node);

                var data = this.topologyInstance.get();
                var nodesLength = data.nodes.length;
                assert.isTrue(nodesLength == originalNodesLength+1, "node was added" );
            });
            it('should remove node from dataStore when remove is called', function () {
                var originalData = this.topologyInstance.get();
                var originalNodesLength = originalData.nodes.length;
                var originalLinksLength = originalData.links.length;
                this.topologyInstance.remove(originalData.nodes[0].id);
                this.topologyInstance.remove(originalData.links[0].id);

                var data = this.topologyInstance.get();
                var updatedNodesLength = data.nodes.length;
                var updatedLinksLength = data.links.length;
                assert.isTrue(updatedNodesLength == originalNodesLength-1, "the node has been removed from dataStore" );
                assert.isTrue(updatedLinksLength == originalLinksLength-1, "the link has been removed from dataStore" );
            });
            it('should filter type from dataStore when filter is called', function () {
                var data = this.topologyInstance.get();
                var nodes = this.topologyInstance.filter({"type":"node"});
                var links = this.topologyInstance.filter({"type":"link"});

                assert.isTrue(_.isEqual(data.nodes.length, nodes.length), "gets nodes back from dataStore" );
                assert.isTrue(_.isEqual(data.links.length, links.length), "gets nodes back from dataStore" );
            });
            it('should filter object attributes from dataStore when filter is called', function () {
                var data = this.topologyInstance.get();
                var linksWithSameSource = this.topologyInstance.filter({"attributes":{"source":"123_node"}});
                var linksWithUniqueTarget = this.topologyInstance.filter({"attributes":{"target":"456_node"}});
                var node = this.topologyInstance.filter({"attributes":{"name":"node1"}});
                var nodeWithType = this.topologyInstance.filter({"attributes":{"name":"node2"},"type":"node"});

                assert.isTrue(_.isEqual(data.links.length, linksWithSameSource.length), "gets filtered data from dataStore" );
                assert.isTrue(_.isEqual(1, linksWithUniqueTarget.length), "gets filtered data from dataStore" );
                assert.isTrue(_.isEqual(1, node.length), "gets filtered data from dataStore" );
                assert.isTrue(_.isEqual(1, nodeWithType.length), "gets filtered data from dataStore" );
            });
        });

        describe('Validate data management Chord topology interfaces - FlatdataStore', function () {
            beforeEach(function () {
                var _conf = $.extend(true, {}, forceDirectedTopologyConf);
                this.data = _conf.data;
                this.container = createContainer();
                _conf.container = this.container;
                _conf.legend = {
                    render: function () {
                        return '<div id="test-legend"></div>';
                    }
                };
                _conf.dataStore = new FlatDataStore(this.data);
                this.topologyInstance = Topology.getInstance(_conf, "chord");
                this.topologyInstance.build();
            });
            afterEach(function () {
                cleanUp(this);
            });
            it('should get data from dataStore when get is called', function () {
                var data = this.topologyInstance.get();
                assert.isTrue(this.data.nodes.length == data.nodes.length, "gets data back from dataStore" );
                assert.isTrue(this.data.links.length == data.links.length, "gets data back from dataStore" );
            });
            it('should update data in dataStore when put is called', function () {
                var updatedData = {
                    "name": "Node 1",
                    "id": "123_node"
                };
                var data = this.topologyInstance.update(updatedData);
                var updatedFromDataStore = this.topologyInstance.get(updatedData.id);
                assert.isTrue(updatedFromDataStore.name == updatedData.name, "updated name in dataStore" );
                assert.isTrue(updatedFromDataStore.id == updatedData.id, "updated id in dataStore" );
            });
            it('should add links in dataStore when add is called', function () {
                var linksArray = [{source: "123_node", target: "456_node", id: "245_link", name: "245_link", bidirectional: true},
                    {source: "123_node", target: "457_node", id: "249_link", name: "249_link"}];
                var originalData = this.topologyInstance.get();
                var originalLinksLength = originalData.links.length;
                this.topologyInstance.add(linksArray);

                var data = this.topologyInstance.get();
                var linksLength = data.links.length;
                assert.isTrue(linksLength == originalLinksLength+2, "links were added" );
            });
            it('should add node in dataStore when add is called', function () {
                var node = {name: "node4", id: "497_node"};
                var originalData = this.topologyInstance.get();
                var originalNodesLength = originalData.nodes.length;
                this.topologyInstance.add(node);

                var data = this.topologyInstance.get();
                var nodesLength = data.nodes.length;
                assert.isTrue(nodesLength == originalNodesLength+1, "node was added" );
            });
            it('should remove node from dataStore when remove is called', function () {
                var originalData = this.topologyInstance.get();
                var originalNodesLength = originalData.nodes.length;
                var originalLinksLength = originalData.links.length;
                this.topologyInstance.remove(originalData.nodes[0].id);
                this.topologyInstance.remove(originalData.links[0].id);

                var data = this.topologyInstance.get();
                var updatedNodesLength = data.nodes.length;
                var updatedLinksLength = data.links.length;
                assert.isTrue(updatedNodesLength == originalNodesLength-1, "the node has been removed from dataStore" );
                assert.isTrue(updatedLinksLength == originalLinksLength-1, "the link has been removed from dataStore" );
            });
            it('should filter type from dataStore when filter is called', function () {
                var data = this.topologyInstance.get();
                var nodes = this.topologyInstance.filter({"type":"node"});
                var links = this.topologyInstance.filter({"type":"link"});

                assert.isTrue(_.isEqual(data.nodes.length, nodes.length), "gets nodes back from dataStore" );
                assert.isTrue(_.isEqual(data.links.length, links.length), "gets nodes back from dataStore" );
            });
            it('should filter object attributes from dataStore when filter is called', function () {
                var data = this.topologyInstance.get();
                var linksWithSameSource = this.topologyInstance.filter({"attributes":{"source":"123_node"}});
                var linksWithUniqueTarget = this.topologyInstance.filter({"attributes":{"target":"456_node"}});
                var node = this.topologyInstance.filter({"attributes":{"name":"node1"}});
                var nodeWithType = this.topologyInstance.filter({"attributes":{"name":"node2"},"type":"node"});

                assert.isTrue(_.isEqual(data.links.length, linksWithSameSource.length), "gets filtered data from dataStore" );
                assert.isTrue(_.isEqual(1, linksWithUniqueTarget.length), "gets filtered data from dataStore" );
                assert.isTrue(_.isEqual(1, node.length), "gets filtered data from dataStore" );
                assert.isTrue(_.isEqual(1, nodeWithType.length), "gets filtered data from dataStore" );
            });
        });

        describe('Validate droppable interaction for Tree Topology', function () {
            beforeEach(function () {
                var _conf = $.extend(true, {}, topologyConf);
                _conf.dataStore = new TreeDataStore(_conf.data);
                this.data = _conf.data;
                this.dataStore = _conf.dataStore;
                this.container = createContainer();
                _conf.container = this.container;
                _conf.legend = {
                    render: function () {
                        return '<div id="test-legend"></div>';
                    }
                };
                this.topologyInstance = Topology.getInstance(_conf, "tree");
                this.topologyInstance.build();
            });
            afterEach(function () {
                cleanUp(this);
            });
            it('should display valid and invalid drop targets', function () {
                var $svgContainer = this.container.find('.topology-canvas');
                var dragEl = $("<img src='' title='breakout-internet'>");
                this.container.on("slipstream.topology.over", $.proxy(function (evt, dragElement, topologyUi) {
                    var dropZones = {
                        valid: ['9da54794-9816-488f-9cb1-37c2b169bf70Link'],
                        invalid: ['ffb00ac2-6e7c-42aa-b5d7-5e2a7f1d5ac1Link']
                    };
                    var $svgContainer = this.container.find('.topology-canvas');
                    topologyUi.addDropTargets(dropZones);

                    var link = $svgContainer.find("g.link");
                    var validlinks = $(link).find('circle.valid-drop-target');
                    var invalidlinks = $(link).find('circle.invalid-drop-target');
                    assert.isTrue(validlinks.length == 1, "There is a valid drop target" );
                    assert.isTrue(invalidlinks.length == 1, "There is an invalid drop target" );

                    dragElement.should.exist;
                    topologyUi.should.exist;
                }, this));
                $svgContainer.trigger('topology-over', [dragEl]);
            });
            it('should remove valid and invalid drop targets', function () {
                var $svgContainer = this.container.find('.topology-canvas');
                var dragEl = $("<img src='' title='breakout-internet'>");
                this.container.on("slipstream.topology.over", $.proxy(function (evt, dragElement, topologyUi) {
                    var dropZones = {
                        valid: ['9da54794-9816-488f-9cb1-37c2b169bf70Link'],
                        invalid: ['ffb00ac2-6e7c-42aa-b5d7-5e2a7f1d5ac1Link']
                    };
                    var $svgContainer = this.container.find('.topology-canvas');
                    topologyUi.addDropTargets(dropZones);
                    topologyUi.removeDropTargets(dropZones);

                    var link = $svgContainer.find("g.link");
                    var validlinks = $(link).find('circle.valid-drop-target');
                    var invalidlinks = $(link).find('circle.invalid-drop-target');

                    assert.isTrue(validlinks.length == 0, "There are no valid drop targets" );
                    assert.isTrue(invalidlinks.length == 0, "There are no invalid drop targets" );

                }, this));
                $svgContainer.trigger('topology-over', [dragEl]);
            });
            it('should trigger event when element is over', function () {
                var svgContainer = this.container.find('.topology-canvas');
                this.container.on("slipstream.topology.over", function (evt, dragElement, topologyUi) {
                    evt.should.exist;
                });
                $(svgContainer).trigger('over');
            });
            it('should trigger event when element is dropped', function () {
                var $svgContainer = this.container.find('.topology-canvas');
                var dragEl = $("<img src='' title='breakout-internet'>");

                this.container.on("slipstream.topology.over", $.proxy(function (evt, dragElement, topologyUi) {
                    var dropZones = {
                        valid: ['9da54794-9816-488f-9cb1-37c2b169bf70Link'],
                        invalid: ['ffb00ac2-6e7c-42aa-b5d7-5e2a7f1d5ac1Link']
                    };
                    topologyUi.addDropTargets(dropZones);
                }, this));

                $svgContainer.trigger('topology-over', [dragEl]);

                var evt = new MouseEvent("mouseover");
                var $node = $svgContainer.find("g.link").first();
                this.container.on("slipstream.topology.link:mouseOver", function (evt, node) {
                    node.id.should.exist;
                });
                $node[ 0 ].dispatchEvent(evt);

                this.container.on("slipstream.topology.drop", function (evt, dropElement, dropTarget, topologyUi) {
                    dropElement.should.exist;
                    dropTarget.should.exist;
                    topologyUi.should.exist;

                    dropTarget.set({type:'attachment-point'});
                    var updatedModel = dropTarget.get();

                    assert.isTrue(dropTarget.getTargetType() == "link", "external element dropped on a link" );
                    assert.isTrue(updatedModel.type == "attachment-point", "external element dropped on a link verified by dataStore" );
                });

                $svgContainer.trigger('drop', [{helper: dragEl}]);

                dragEl = $("<img src='' title='new-element'>");
                var $originalContainer = $svgContainer;
                $svgContainer.trigger('drop', [{helper: dragEl}]);
                $svgContainer.trigger('dropout', [{helper: dragEl}]);

                assert.isTrue($originalContainer == $svgContainer, "No DOM changes when an element gets dropped on an unknown zone." );
            });
            it('should trigger mouseOver &  mouseOut events while element is over drop zones', function () {
                var $svgContainer = this.container.find('.topology-canvas');
                var dragEl = $("<img src='' title='breakout-internet'>");

                this.container.on("slipstream.topology.over", $.proxy(function (evt, dragElement, topologyUi) {
                    var dropZones = {
                        valid: ['9da54794-9816-488f-9cb1-37c2b169bf70Link', 'ffb00ac2-6e7c-42aa-b5d7-5e2a7f1d5ac1'],
                        invalid: ['ffb00ac2-6e7c-42aa-b5d7-5e2a7f1d5ac1Link', 'Node100']
                    };
                    topologyUi.addDropTargets(dropZones);
                }, this));

                $svgContainer.trigger('over', [dragEl]);

                //valid drop zones
                var evt = new MouseEvent("mouseover");
                var $node = $svgContainer.find("g.link").first();
                this.container.on("slipstream.topology.link.icon:mouseOver", function (evt, node) {
                    node.should.exist;
                });
                $node[ 0 ].dispatchEvent(evt);

                var evt = new MouseEvent("mouseout");
                var $node = $svgContainer.find("g.link").first();
                this.container.on("slipstream.topology.link.icon:mouseOut", function (evt, node) {
                    node.should.exist;
                });
                $node[ 0 ].dispatchEvent(evt);

                var evt = new MouseEvent("mouseover");
                var $node = $svgContainer.find("g.node").first();
                this.container.on("slipstream.topology.node:mouseOver", function (evt, node) {
                    node.should.exist;
                });
                $node[ 0 ].dispatchEvent(evt);

                var evt = new MouseEvent("mouseout");
                var $node = $svgContainer.find("g.node").first();
                this.container.on("slipstream.topology.node:mouseOut", function (evt, node) {
                    node.should.exist;
                });
                $node[ 0 ].dispatchEvent(evt);

                //invalid drop zones
                var evt = new MouseEvent("mouseover");
                var $node = $($svgContainer.find("g.node").get(2));
                this.container.on("slipstream.topology.node:mouseOver", function (evt, node) {
                    node.should.exist;
                });
                $node[ 0 ].dispatchEvent(evt);

            });

        });

        describe('Validate droppable interaction for Graph Editor Topology', function () {
            beforeEach(function () {
                var _conf = $.extend(true, {}, forceDirectedTopologyConf);
                _conf.dataStore = new FlatDataStore(_conf.data);
                _conf.edit = true;
                this.data = _conf.data;
                this.dataStore = _conf.dataStore;
                this.container = createContainer();
                _conf.container = this.container;
                _conf.legend = {
                    render: function () {
                        return '<div id="test-legend"></div>';
                    }
                };
                this.topologyInstance = Topology.getInstance(_conf);
                this.topologyInstance.build();
            });
            afterEach(function () {
                cleanUp(this);
            });
            it('should trigger event when element is over', function () {
                var $container = this.container.find('.topology-outer');

                this.container.on("slipstream.topology.over", function (evt, dragElement) {
                    evt.should.exist;
                });
                $container.trigger('topology-over');
            });
            it('should trigger event when element is dropped', function () {
                var $container = this.container.find('.topology-outer');
                var self = this;
                var dragEl = $("<img src='' title='breakout-internet'>");

                this.container.on("slipstream.topology.over", $.proxy(function (evt, dragElement) {
                    dragElement.should.exist;
                }, this));
                $container.trigger('topology-over', [dragEl]);

                this.container.on("slipstream.topology.drop", function (evt, dropElement) {
                    dropElement.should.exist;

                    var icon = dropElement.getAttribute('title'),
                        node = {name: icon, id: _.uniqueId("node"), type: icon, size: "medium"},
                        newIdAdded = node.id;
                    self.topologyInstance.add(node);
                    var newNode = self.topologyInstance.get(newIdAdded);
                    assert.isTrue(newNode.id == newIdAdded, "Node was added to the datastore" );
                    var $nodeEl =  $container.find('.nodeContainer[data-id='+newIdAdded+']');
                    assert.isTrue($nodeEl.attr('data-id') == newIdAdded, "Node was added to the view" );
                });

                $container.trigger('drop', [{helper: dragEl}]);
            });
        });

        describe('Validate connections on Graph Editor Topology', function () {
            beforeEach(function () {
                var _conf = $.extend(true, {}, forceDirectedTopologyConf);
                _conf.dataStore = new FlatDataStore(_conf.data);
                _conf.edit = true;
                this.data = _conf.data;
                this.dataStore = _conf.dataStore;
                this.container = createContainer();
                _conf.container = this.container;
                _conf.legend = {
                    render: function () {
                        return '<div id="test-legend"></div>';
                    }
                };
                this.topologyInstance = Topology.getInstance(_conf);
                this.topologyInstance.build();
            });
            afterEach(function () {
                cleanUp(this);
            });
            it('Add new connection', function () {
                var $container = this.container.find('.topology-outer');
                var connectionCount = +$container.find('.linkLabel').first().html();

                var newLink = {source: "123_node", target: "456_node", id: "555_link", name: "555_link"};
                this.topologyInstance.add(newLink);
                var newConnectionCount = +$container.find('.linkLabel').first().html();
                assert.isTrue(connectionCount+1 == newConnectionCount, "A new connection has been added" );
            });
            it('Remove connection', function () {
                var $container = this.container.find('.topology-outer');
                var links = forceDirectedTopologyConf.data.links;
                this.topologyInstance.remove(links[0].id);
                this.topologyInstance.remove(links[1].id);

                assert.isTrue($container.find('.linkLabel').length == 0, "All connections have been removed" );
            });
            it('Update connection', function () {
                var $container = this.container.find('.topology-outer');
                var connectionCount = +$container.find('.linkLabel').first().html();
                var links = forceDirectedTopologyConf.data.links;

                var link = links[0];
                link.target =  links[1].target;

                this.topologyInstance.update(link);
                var newConnectionCount = +$container.find('.linkLabel').first().html();
                assert.isTrue(connectionCount+1 == newConnectionCount, "A new connection has been moved and updated" );
            });
        });

        describe('Validate custom overlays on Graph Editor Topology', function() {
            beforeEach(function () {
                var _conf = $.extend(true, {}, forceDirectedTopologyConf);
                _conf.dataStore = new FlatDataStore(_conf.data);
                _conf.edit = true;
                this.data = _conf.data;
                this.dataStore = _conf.dataStore;
                this.container = createContainer();
                _conf.container = this.container;
                _conf.linkOverlay = function (links) {
                    return '<div style="background-image: url(img/icon_link_down.svg);"></div>';
                };
                this.topologyInstance = Topology.getInstance(_conf);
                this.topologyInstance.build();
            });
            afterEach(function () {
                cleanUp(this);
            });
            it('should use link overlay provided by user', function () {
                var $container = this.container.find('.topology-outer');
                var $linkOverlay = $container.find('.linkLabel').first();

                assert.isTrue($linkOverlay.css('background-image').length > 0, "User provided overlay used" );
            });
        });

        describe('Validate existence of multiple visualization instances', function () {
            before(function () {
                var _conf = $.extend(true, {}, topologyConf);

                this.container1 = createContainer(); //creates unique container
                _conf.container = this.container1;
                this.topologyInstance1 = Topology.getInstance(_conf, "tree");
                this.topologyInstance1.build();

                this.container2 = createContainer(); //creates unique container
                _conf.container = this.container2;
                this.topologyInstance2 = Topology.getInstance(_conf, "tree");
                this.topologyInstance2.build();
            });
            after(function () {
                this.topologyInstance1.destroy();
                this.topologyInstance2.destroy();
            });
            it('should render 2 topology canvas', function () {
                var svgContainer1 = this.container1.find('.topology-canvas');
                var svgContainer2 = this.container2.find('.topology-canvas');
                assert.isTrue(svgContainer1.length == 1, "First topology visual rendered.");
                assert.isTrue(svgContainer2.length == 1, "Second topology visual rendered.");
            });
            it('should zoom in on the desired visualization instance', function () {
                var $container1 = this.container1;
                var svgContainer1 = this.container1.find('.topology-canvas');
                var svgContainer2 = this.container2.find('.topology-canvas');
                var svgContainer1ZoomInvoked = false;
                var svgContainer2ZoomInvoked = false;

                svgContainer1.on('topology-zoom-in', function (evt) {
                    svgContainer1ZoomInvoked = true;
                    evt.should.exist;
                });
                svgContainer2.on('topology-zoom-in', function (evt) {
                    svgContainer2ZoomInvoked = true;
                });

                $container1.find('.topology-zoom-in').trigger('click');
                assert.isTrue(svgContainer1ZoomInvoked, "First topology visual zoomed.");
                assert.isFalse(svgContainer2ZoomInvoked, "Second topology visual not zoomed.");
            });
            it('should zoom out on the desired visualization instance', function () {
                var $container1 = this.container1;
                var svgContainer1 = this.container1.find('.topology-canvas');
                var svgContainer2 = this.container2.find('.topology-canvas');
                var svgContainer1ZoomInvoked = false;
                var svgContainer2ZoomInvoked = false;

                svgContainer1.on('topology-zoom-out', function (evt) {
                    svgContainer1ZoomInvoked = true;
                    evt.should.exist;
                });
                svgContainer2.on('topology-zoom-out', function (evt) {
                    svgContainer2ZoomInvoked = true;
                });

                $container1.find('.topology-zoom-out').trigger('click');
                assert.isTrue(svgContainer1ZoomInvoked, "First topology visual zoomed.");
                assert.isFalse(svgContainer2ZoomInvoked, "Second topology visual not zoomed.");
            });
        });
        describe('Validate addOn attribute on nodes', function () {
            before(function () {
                var _conf = $.extend(true, {}, topologyConf);
                _conf.data['addOn'] = {
                    "name": "Site_addOn1",
                    "size": "large",
                    "type": "attachment_point",
                    "position": "top"
                };
                _conf.data.children[0]['addOn'] = {
                    "name": "Site_addOn2",
                    "size": "medium",
                    "type": "attachment_point",
                    "position": "bottom"
                };
                this.container = createContainer();
                _conf.container = this.container;
                this.topologyInstance = Topology.getInstance(_conf, "tree");
                this.topologyInstance.build();
            });
            after(function () {
                cleanUp(this);
            });
            it('should decorate nodes with addOn elements', function () {
                var svgContainer = this.container.find('.topology-canvas');
                var node = svgContainer.find('g.node').filter(function (key, val) {
                    return val.hasAttribute('data-addOn');
                });
                assert.isTrue(node.length == 2, "addOn elements have been added to the nodes");
            });
            it('should add a line between addOn element and node', function () {
                //This cannot be unit tested since d3.selectAll() - (svgGroup.selectAll('g[data-addOn = "true"]')) behaves incosistently between browser & headless browser environment.
                //In a headless env, d3 does not select nodes with data-addOn attribute. Due to this reason, d3 does not create a line in headless environment, this has to be covered by QA manual / automation. Retaining this comment for future reference.
            });
        });

        describe('Graph layout - Validate Highlight feature', function () {
            before(function () {
                var _conf = $.extend(true, {}, forceDirectedTopologyConf);
                this.container = createContainer();
                _conf.container = this.container;
                _conf.legend = {
                    render: function () {
                        return '<div id="test-legend"></div>';
                    }
                };
                this.topologyInstance = Topology.getInstance(_conf, "_graph");
                this.topologyInstance.build();
            });
            after(function () {
                cleanUp(this);
            });
            it('should not highlight nodes when force graph is still ticking', function () {
                var $svgContainer = this.container.find('.topology-canvas');
                var evt = new MouseEvent("mouseover");
                var $node = $svgContainer.find("g.node").first();


                var mutedNodes = $svgContainer.find('g.node.mute').length;
                assert.isTrue(mutedNodes == 0, "No nodes are muted");

                $node[ 0 ].dispatchEvent(evt); //Mouse over a node when the force graph is still moving.
                var mutedNodes = $svgContainer.find('g.node.mute').length;
                assert.isTrue(mutedNodes == 0, "No nodes are muted");
            });
        });
    });
});
