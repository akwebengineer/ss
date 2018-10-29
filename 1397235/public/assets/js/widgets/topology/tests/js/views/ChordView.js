/** TEST Module that defines the chord example view
* @copyright Juniper Networks, Inc. 2017
*/
define([
    'backbone',
    'widgets/topology/topologyWidget',
    'widgets/topology/tests/conf/topologyConfiguration',
    'widgets/topology/tests/js/views/legendView',
    'text!widgets/topology/tests/templates/chordViewLegendTemplate.html',
    'text!widgets/topology/tests/templates/dataStoreControlsTemplate.html',
    'widgets/topology/lib/flat/flatDataStore',
    'lib/template_renderer/template_renderer'
], function (Backbone, Topology, topologyConfiguration, LegendView, legendTemplate, dataStoreControlsTemplate, FlatDataStore, render_template) {
    var ForceDirectedView = Backbone.View.extend({
        events: {
            'click .getdata': 'getData',
            'click .addnode': 'addNode',
            'click .updatenode': 'updateNode',
            'click .deletenode': 'deleteNode',
            'click .viewChordCount': 'viewChordCount',
            'click .viewChordWeight': 'viewChordWeight'
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

            var topologyConf = {
                data: topologyConfiguration.forceDirectedTopologyData,
                container: this.el,
                viewerDimensions: {
                    width: topoWidth,
                    height: topoHeight
                },
                allowZoomAndPan: true,
                legend: legendTemplate,
                tooltip: tooltipObj,
                linkTypeReducer: function (links) {
                    var types = ["ok", "ok", "ok", "ok", "ok", "major", "critical"];
                    return types[Math.floor(Math.random()*types.length)];
                },
                chordContext: "count"
            };


            this.$el.on("slipstream.topology.node:click", function (evt, node) {
                console.info("Node " + node.id + " was clicked");
                var selectedDataEl = $(this).find('.selectednode');
                selectedDataEl.val(JSON.stringify(node));
            });

            this.$el.on("slipstream.topology.link:click", function (evt, links) {
                console.info("Links " + JSON.stringify(links) + " were clicked");
                var selectedDataEl = $(this).find('.selectednode');
                selectedDataEl.val(JSON.stringify(links));
            });

            this.topology =  Topology.getInstance(topologyConf, "chord");
            var result = this.topology.build();

            var $dataStoreControls = $(render_template(dataStoreControlsTemplate));
            var $viewToggles = $('<span style="float: right">Toggle Metric<button class="viewChordCount"># of links</button><button class="viewChordWeight">Traffic volume</button></span>');
            $dataStoreControls.append($viewToggles);
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
            var tooltip_data;
            if (elementType == 'NODE') {
                tooltip_data = "<span style='color:steelblue'> Name: " + elementObj.name + "<br/><span> <span style='color: lightsteelblue'> Type: " + elementObj.type + "</span>";
            } else if (elementType == 'LINK') {

                if(elementObj.length > 0) {
                    var chord = _.first(elementObj);
                    var source = chord.source;
                    var target = chord.target;

                    var flow1 = _.where(elementObj, {'source': source, 'target': target}).length;
                    var flow2 = _.where(elementObj, {'source': target, 'target': source}).length;

                    var template = _.template('<span>Source: <span style=\'color:steelblue\'><%= source %></span> Target: <span style=\'color:steelblue\'><%= target %></span> value: <%= flow %></span>');
                    tooltip_data = template({source: source, target: target, flow: flow1});
                    tooltip_data += "<hr>";
                    tooltip_data += template({source: target, target: source, flow: flow2});

                }

            }
            renderTooltip(tooltip_data);
        },
        viewChordCount: function () {
            this.topology.setChordContext("count");
        },
        viewChordWeight: function () {
            this.topology.setChordContext("weight");
        }
    });

    return ForceDirectedView;
});