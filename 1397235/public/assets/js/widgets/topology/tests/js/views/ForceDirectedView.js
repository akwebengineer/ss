/** TEST Module that defines the force directed example view
* @copyright Juniper Networks, Inc. 2017
*/
define([
    'backbone',
    'widgets/topology/topologyWidget',
    'widgets/topology/tests/conf/topologyConfiguration',
    'widgets/topology/tests/js/views/legendView',
    'text!widgets/topology/tests/templates/forceDirectedLegendTemplate.html',
    'text!widgets/topology/tests/templates/dataStoreControlsTemplate.html',
    'widgets/topology/lib/flat/flatDataStore',
    'lib/template_renderer/template_renderer'
], function (Backbone, Topology, topologyConfiguration, LegendView, legendTemplate, dataStoreControlsTemplate, FlatDataStore, render_template) {
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

            var nodes = topologyConfiguration.forceDirectedTopologyData.nodes,
                links = topologyConfiguration.forceDirectedTopologyData.links,
                icons = topologyConfiguration.forceDirectedTopologyIcons;

            var tooltipObj = {
                "onHover": this.tooltipCb
            };

            //Generate nodes dynamically.
            //NOTE: Nodes are generated randomly only for test purposes. The below for block should *not* be part the app implementation.
            for (var index = 0; index < 50; index++ ) {
                var images = Object.keys(icons);
                var node = {
                    id: index,
                    name: "Node "+index,
                    type: images[Math.floor(Math.random()*images.length)]
                };

                var link = {
                    source: nodes[Math.floor(Math.random()*nodes.length)].id,
                    target: nodes[Math.floor(Math.random()*nodes.length)].id,
                    id: index+"-link",
                    name: index+"-link",
                    type: links[Math.floor(Math.random()*links.length)].type
                };
                // Uncomment below line to generate random nodes.
                // topologyConfiguration.forceDirectedTopologyData.nodes.push(node);
            }

            //Generate links dynamically.
            //NOTE: Links are generated randomly only for test purposes. The below for block should *not* be part the app implementation.
            for (var index = 0; index < 10; index++ ) {
                var link = {
                    source: nodes[Math.floor(Math.random()*nodes.length)].id,
                    target: nodes[Math.floor(Math.random()*nodes.length)].id,
                    id: index+"-link",
                    name: index+"-link",
                    type: links[Math.floor(Math.random()*links.length)].type
                };
              // Uncomment below line to generate random links.
              // topologyConfiguration.forceDirectedTopologyData.links.push(link);
            }

            var topologyConf = {
                data: topologyConfiguration.forceDirectedTopologyData,
                icons: icons,
                container: this.el,
                viewerDimensions: {
                    width: topoWidth,
                    height: topoHeight
                },
                showArrowHead: true,
                allowZoomAndPan: true,
                legend: legendTemplate,
                tooltip: tooltipObj
            };


            this.$el.on("slipstream.topology.node:click", function (evt, node) {
                console.info("Node " + node.id + " was clicked");
                var selectedDataEl = $(this).find('.selectednode');
                selectedDataEl.val(JSON.stringify(node));
            });

            this.$el.on("slipstream.topology.link:click", function (evt, link) {
                console.info("Link " + link.id + " was clicked");
                var selectedDataEl = $(this).find('.selectednode');
                selectedDataEl.val(JSON.stringify(link));
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
        },
        tooltipCb: function (elementType, elementObj, renderTooltip) {
            if (elementType == 'NODE') {
                var tooltip_data;
                tooltip_data = "<span style='color:steelblue'> Name: " + elementObj.name + "<br/><span> <span style='color: lightsteelblue'> Type: " + elementObj.type + "</span>";
                renderTooltip(tooltip_data);
            }
        }
    });

    return ForceDirectedView;
});