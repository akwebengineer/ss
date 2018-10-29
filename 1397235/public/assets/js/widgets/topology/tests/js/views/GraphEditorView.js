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
    'widgets/topology/lib/flat/flatDataStore',
    'lib/template_renderer/template_renderer'
], function (Backbone, Topology, topologyConfiguration, LegendView, legendTemplate, dataStoreControlsTemplate, paletteTemplate, layoutControlsTemplate, FlatDataStore, render_template) {
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
            var topoWidth = window.innerWidth - 100;
            var topoHeight = window.innerHeight - 100;

            var tooltipObj = {
                "onHover": this.tooltipCb
            };

            var self = this;

            var topologyConf = {
                data: topologyConfiguration.networkTopologyData,
                icons: topologyConfiguration.forceDirectedTopologyIcons,
                container: this.el,
                viewerDimensions: {
                    width: topoWidth,
                    height: topoHeight
                },
                showArrowHead: false,
                allowZoomAndPan: false,
                legend: legendTemplate,
                tooltip: tooltipObj,
                layout: {
                    type: "absolute", //"hierarchical", "spring", "absolute"
                    /*parameters: {
                        orientation: "LR", //"TB", "BT", "LR", "RL"
                    }*/
                },
                edit: true,
                linkOverlay: function (links) {
                    if(links.length > 0 && links[0].type == "dropped_default") {
                        return '<div style="background-image: url(img/icon_link_down.svg); width: 14px; height:14px; background-color:transparent; border: none; background-repeat: no-repeat;"></div>'
                    } else if(links.length > 0 && links[0].type == "bidirectional_link") {
                        return '<div style="background-color: #78bb4c;">' + links.length + ' </div>'
                    }
                    return '<div>' + links.length + '</div>';
                },
                linkTypeReducer: function (links) {
                    return links.length > 0 && links[0].type;
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

            this.$el.on("slipstream.topology.node:dragStop", function (evt, node, dragPosition) {
                //node - node object which was dragged
                //dragPosition - element drag stop position
                _.extend(node.position, dragPosition);
                self.topology.update(node);
            });

            this.topology =  Topology.getInstance(topologyConf);
            var result = this.topology.build();

            var $dataStoreControls = $(render_template(dataStoreControlsTemplate));
            var $paletteControls = $(render_template(paletteTemplate)).hide();
            $paletteControls.find('h3').text('Drag and drop onto workspace');
            var $togglePaletteButton = $('<button class="togglePalette" >Palette</button>');
            $togglePaletteButton.click(function() {
                $paletteControls.toggle("slide");
            });
            var $layoutControlsTemplate = $(render_template(layoutControlsTemplate));
            var orientations = ["RL", "BT", "LR", "TB"];
            $layoutControlsTemplate.click(function(event) {
                var buttonClick = $(event.target).data('layout'),
                    positions;

                switch (buttonClick) {
                    case "hierarchy":
                        positions = self.topology.getPositions({
                            type: "hierarchical"
                        });
                        break;
                    case "orientation":
                        var nextOrientation = orientations.shift();
                        orientations.push(nextOrientation);
                        positions = self.topology.getPositions({
                            type: "hierarchical",
                            parameters: {
                                orientation: nextOrientation
                            }
                        });
                        break;
                    case "spring":
                        positions = self.topology.getPositions({
                            type: "spring"
                        });
                        break;
                }

                _.each(positions, function (node) {
                    self.topology.update(node);
                });

            });
            $dataStoreControls.append($togglePaletteButton, $layoutControlsTemplate);
            $dataStoreControls.find('.getdataId').css('display', 'inline-block');

            //Transform draggable elements with jQuery draggable widget.
            var $draggableElements = $paletteControls.find('img').css('width', 30);
            $draggableElements.draggable({
                helper: "clone",
                start: function (evt, ui) {},
                stop: function (evt, ui) {},
                cursor: "pointer",
                zIndex: 100
            });

            this.$el.prepend($dataStoreControls, $paletteControls);

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
        },
        tooltipCb: function (elementType, elementObj, renderTooltip) {
            var tooltip_data;
            if (elementType == 'NODE') {
                tooltip_data = "<span style='color:steelblue'> Name: " + elementObj.name + "<br/><span> <span style='color: lightsteelblue'> Type: " + elementObj.type + "</span>";
            } else if (elementType == 'LINK') {

                if(elementObj.links.length > 0) {
                    var linkCount = elementObj.links.length,
                        firstLink = elementObj.links[0];
                    source = firstLink.source,
                        target = firstLink.target;

                    var template = _.template('<span>Source: <span style=\'color:steelblue\'><%= source %></span> Target: <span style=\'color:steelblue\'><%= target %></span> no of links: <%= count %></span>');
                    tooltip_data = template({source: source, target: target, count: linkCount});
                    tooltip_data += "<hr>";
                }

            }
            renderTooltip(tooltip_data);
        }
    });

    return ForceDirectedView;
});