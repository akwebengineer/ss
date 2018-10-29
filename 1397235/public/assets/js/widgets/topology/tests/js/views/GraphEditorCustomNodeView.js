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
    'widgets/lineChart/lineChartWidget'
], function (Backbone, Topology, topologyConfiguration, LegendView, legendTemplate, dataStoreControlsTemplate, paletteTemplate, layoutControlsTemplate, nodeCustomTemplate, FlatDataStore, render_template, LineChartWidget) {
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
            var topoWidth = window.innerWidth - 300;
            var topoHeight = window.innerHeight - 500;

            var self = this;

            var topologyConf = {
                data: topologyConfiguration.ipsecTopologyData,
                icons: topologyConfiguration.forceDirectedTopologyIcons,
                container: this.el,
                viewerDimensions: {
                    width: topoWidth,
                    height: topoHeight
                },
                showArrowHead: false,
                allowZoomAndPan: false,
                layout: {
                    type: "hierarchical", //"hierarchical", "spring", "absolute"
                    parameters: {
                        orientation: "LR", //"TB", "BT", "LR", "RL"
                        nodeSpacing: {value:250}
                    }
                },
                edit: false,
                linkOverlay: function (links) {
                    return '<div style="display: none">' + links.length + '</div>';
                },
                linkTypeReducer: function (links) {
                    return links.length > 0 && links[0].type;
                },
                connection: {
                    type: "Straight"
                },
                customNodeView: function (node, nodeEl) {

                    //Example for Slipstream view.
                    return function MyView() {
                        this.render = function(node) {
                            var data = $.extend({}, node, {
                                image: topologyConf.icons[node.type],
                                statusImage : "img/icon_link_up.svg"
                            });
                            this.el = render_template(nodeCustomTemplate, data);
                            return this;
                        };
                        this.update = function(node) {
                            $node = $(this.el);
                            $node.removeClass('small medium large').addClass(node.size);
                            $node.find('.node').css('background-image', 'url(' + topologyConf.icons[node.type] + ')');
                            $node.find('.customlabel').text(node.name);
                            node.position && $node.css(node.position ? node.position : {left: 0, top: 0});
                        }
                    }

                    //Example for HTML string.
                    /*if(nodeEl) {
                        var $nodeEl = $(nodeEl);
                        $nodeEl.removeClass('small medium large').addClass(node.size);
                        $nodeEl.find('.node').css('background-image', 'url(' + topologyConf.icons[node.type] + ')');
                        $nodeEl.find('.customlabel').text(node.name);
                        node.position && $nodeEl.css(node.position ? node.position : {left: 0, top: 0});
                    } else {
                        var data = $.extend({}, node, {
                            image: topologyConf.icons[node.type],
                            statusImage : "img/icon_link_up.svg"
                        });
                        return render_template(nodeCustomTemplate, data);
                    }*/

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