/** TEST Module that defines the Graph layout example view
 *
 * @module GraphEditorView
 * @author Viswesh Subramanian <vissubra@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'backbone',
    'widgets/topology/topologyWidget',
    'widgets/topology/tests/conf/topologyConfiguration',
    'widgets/topology/tests/js/views/legendView',
    'text!widgets/topology/tests/templates/graphEditorLegendTemplate.html',
    'text!widgets/topology/tests/templates/dataStoreControlsTemplate.html',
    'text!widgets/topology/tests/templates/paletteTemplate.html',
    'text!widgets/topology/tests/templates/layoutControlsTemplate.html',
    'text!widgets/topology/tests/templates/nodeCustomTemplate.html',
    'widgets/topology/lib/flat/flatDataStore',
    'lib/template_renderer/template_renderer',
    'widgets/lineChart/lineChartWidget',
    'widgets/timeSeriesChart/timeSeriesChartWidget',
    'widgets/timeSeriesChart/tests/testData',
    'widgets/donutChart/donutChartWidget',
    'widgets/barChart/barChartWidget'
], function (Backbone, Topology, topologyConfiguration, LegendView, legendTemplate, dataStoreControlsTemplate, paletteTemplate, layoutControlsTemplate, nodeCustomTemplate, FlatDataStore, render_template, LineChartWidget, TimeSeriesChartWidget, TestData, DonutChartWidget, BarChartWidget) {
    var ForceDirectedView = Backbone.View.extend({
        events: {
            'click .getdata': 'getData',
            'click .addnode': 'addNode',
            'click .updatenode': 'updateNode',
            'click .deletenode': 'deleteNode'
        },
        initialize: function () {
            this.render();
        },
        render: function () {
            var topoWidth = window.innerWidth -200;
            var topoHeight = window.innerHeight -200;

            var self = this;

            var topologyConf = {
                data: topologyConfiguration.simpleNetwork,
                icons: topologyConfiguration.forceDirectedTopologyIcons,
                container: this.el,
                viewerDimensions: {
                    width: topoWidth,
                    height: topoHeight
                },
                showArrowHead: true,
                allowZoomAndPan: false,
                layout: {
                    type: "absolute"
                },
                edit: true,
                linkTypeReducer: function (links) {
                    return links.length > 0 && links[0].type;
                },
                customNodeView: function (node) {

                    var LineChart = function () {
                        this.render = function (node) {
                            this.el = $('<div class="nodeContainer" style="width: 200px; height: 200px" data-id=' + node.id + '></div>');

                            var options = {
                                xAxisTitle: node.name,
                                yAxisTitle: '',
                                //categories: ['Jan 1', 'Jan 2', 'Jan 3', 'Jan 4', 'Jan 5'],
                                categories: ['', '', '', '', ''],
                                maxLabelSize: 10,
                                legend: {
                                    enabled: false
                                },
                                lines: [{
                                    name: 'Device 1',
                                    data: [7.0, 6.9, 9.5, 14.5, 18.2]
                                }, {
                                    name: 'Device 2',
                                    data: [2.0, 5.0, 5.7, 11.3, 17.0]
                                }, {
                                    name: 'Device 3',
                                    data: [3.9, 4.2, 5.7, 8.5, 11.9]
                                }]
                            };

                            new LineChartWidget({
                                container: this.el,
                                options: options
                            }).build();

                            return this;
                        };

                        this.update = function (node) {
                            var $node = $(this.el);
                            if (node.position) {
                                $node.css(node.position ? node.position : {left: 0, top: 0});
                            }
                        }
                    };

                    var Donut = function () {
                        this.render = function (node) {
                            this.el = $('<div class="nodeContainer" style="width: 200px; height: 200px" data-id=' + node.id + '></div>');

                            var options = {
                                donut: {
                                    name: node.name,
                                    data: [
                                        ['Critical', 4440],
                                        ['High', 3000],
                                        ['Major', 2000],
                                        ['Minor', 1700],
                                        ['Low', 300]
                                    ],
                                    showInLegend: false
                                },
                                maxLegendLabelSize: 20,
                                showPercentInLegend: true,
                                // Uncomment following line to override widget colors array
                                colors: ['#b72841', '#ff3344', '#ff9a00', '#fec240', '#ffe96b']
                            };

                            var donutChartWidgetObj = new DonutChartWidget({
                                container: this.el,
                                options: options
                            }).build();


                            self.interval = setInterval(function(){
                                var newData = [
                                    ['Critical', Math.floor(Math.random() * 5440)],
                                    ['Major', 3000],
                                    ['Minor', 2000],
                                    ['Warning', 1700],
                                    ['Info', 300]
                                ];
                                donutChartWidgetObj.update(newData);

                            }, 2000);

                            var $title = $('<span>'+node.name+'</span>');
                            $title.css({
                                "display": "inline-block",
                                "text-align": "center",
                                "width": "100%",
                                "font-family": "open sans",
                                "color": "#666666",
                                "font-size": "16px",
                                "font-weight": "300",
                                "top": "5px",
                                "position": "relative"
                            });

                            this.el.prepend($title);

                            return this;
                        };

                        this.close = function() {
                            self.interval && clearInterval(self.interval);
                        }

                    };

                    var BarChart = function () {
                        this.render = function (node) {
                            this.el = $('<div class="nodeContainer" style="width: 200px; height: 200px" data-id=' + node.id + '></div>');

                            var options = {
                                type: 'stacked-bar',
                                title: node.name,
                                xAxisTitle: '',
                                yAxisTitle: '',
                                categories: [ '', '', '', '', '', ''],
                                data: [{
                                    name: 'Output',
                                    color: '#cfe5fb',
                                    y: [3, 2, 10, 20, 7]
                                },
                                    {
                                        name: 'Input',
                                        color: '#7460ee',
                                        y: [4, 35, 25, 20]
                                    }
                                ]
                            };

                            new BarChartWidget({
                                container: this.el,
                                options: options
                            }).build();
                            return this;
                        }
                    };

                    var BarChart_simple = function () {
                        this.render = function (node) {
                            this.el = $('<div class="nodeContainer" style="width: 200px; height: 200px" data-id=' + node.id + '></div>');

                            var options = {
                                type: 'column',
                                title: node.name,
                                xAxisTitle: 'Data Flow',
                                yAxisTitle: '',
                                color: '#47d1ff',
                                categories: ['','','',''],
                                data: [10, 30, 45, 85]
                            };

                            var conf = {
                                container: this.el,
                                options: options
                            }

                            var barChartWidgetObj = new BarChartWidget(conf);
                            barChartWidgetObj.build();
                            return this;
                        }
                    };

                    switch (node.type) {
                        case "firewall":
                            return Donut;
                        case "internet_breakout":
                            return LineChart;
                        case "switching_service":
                            return BarChart_simple;
                        case "internet_sevices":
                            return BarChart;

                    }

                }
            };


            this.$el.on("slipstream.topology.node:click", function (evt, node) {
                console.info("Node " + node.id + " was clicked");
                var selectedDataEl = $(this).find('.selectednode');
                selectedDataEl.val(JSON.stringify(node));
            });

            this.$el.on("slipstream.topology.link:click", function (evt, link) {
                console.info("Link " + JSON.stringify(link.links) + " was clicked");
                var selectedDataEl = $(this).find('.selectednode');
                selectedDataEl.val(JSON.stringify(link.links));
            });


            this.$el.on("slipstream.topology.link:add", function (evt, link) {
                _.extend(link,{"id": _.uniqueId("link"), name: "new link"});
                console.info('New Connection ');
                console.info(link);
                self.topology.add(link);
            });

            this.$el.on("slipstream.topology.link:move", function (evt, links) {
                links.links.forEach(function(ele) {
                    self.topology.update(ele);
                });
            });

            this.$el.on("slipstream.topology.link:remove", function (evt, links) {
                links.links.forEach(function(ele) {
                    self.topology.remove(ele.id);
                });
            });

            this.$el.on("slipstream.topology.over", function (evt, dragElement) {
                //dragElement - The element which is dragged over the visualization.
                $(dragElement).css({border: '3px #98fb98 dashed'}).animate({
                    borderWidth: 0
                }, 500);
            });

            this.$el.on("slipstream.topology.drop", function (evt, dropElement, dropPosition) {
                //dropElement - element which was dragged and now dropped
                //dropPosition - element drop position
                var icon = dropElement.getAttribute('title'),
                    node = {name: icon, id: _.uniqueId("node"), type: icon, size: "medium", position: dropPosition};
                self.topology.add(node);
            });

            this.topology =  Topology.getInstance(topologyConf);
            var result = this.topology.build();

            var $dataStoreControls = $(render_template(dataStoreControlsTemplate));
            $dataStoreControls.find('.getdataId').css('display', 'inline-block');


            this.$el.prepend($dataStoreControls);

            return this;
        },
        getData : function () {
            var nodeDataEl = this.$el.find('.nodedata');
            var selectedDataEl = this.$el.find('.selectednode');

            var idToQuery = this.$el.find('.getdataId input.id').val();
            var filterToQuery = this.$el.find('.getdataId input.filter').val().trim();
            if(idToQuery) {
                selectedDataEl.val(JSON.stringify(this.topology.get(idToQuery)));
            } else if (filterToQuery) {
                var results = this.topology.filter(JSON.parse(filterToQuery));
                selectedDataEl.val(JSON.stringify(results));
            }else {
                nodeDataEl.val(JSON.stringify(this.topology.get()));
            }
        },
        updateNode: function () {
            var selectedDataEl = this.$el.find('.selectednode'),
                node =  selectedDataEl.val().trim();

            if(!node) return;
            console.info("updateNode called from ForceDirectedView");
            this.topology.update(JSON.parse(node));
        },
        addNode: function () {
            var selectedDataEl = this.$el.find('.selectednode'),
                nodestr = selectedDataEl.val().trim();

            if(!nodestr) return;
            var node =  JSON.parse(nodestr);
            console.info("addNode called from ForceDirectedView");
            this.topology.add(node);
        },
        deleteNode: function () {
            var selectedDataEl = this.$el.find('.selectednode'),
                nodestr = selectedDataEl.val().trim();

            if(!nodestr) return;
            var node =  JSON.parse(nodestr);
            console.info("deleteNode called from ForceDirectedView");
            this.topology.remove(node.id);
        }
    });

    return ForceDirectedView;
});