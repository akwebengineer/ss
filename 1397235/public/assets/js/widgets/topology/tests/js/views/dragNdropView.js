/** TEST Module that defines the topology drag and drop example view
 * @copyright Juniper Networks, Inc. 2017
 */
define([
    'backbone',
    'widgets/topology/topologyWidget',
    'widgets/topology/tests/conf/topologyConfiguration',
    'text!widgets/topology/tests/templates/paletteTemplate.html',
    'lib/template_renderer/template_renderer',
    'jqueryui'
], function (Backbone, Topology, topologyConfiguration, paletteTemplate, render_template, jQueryUi) {
    var DragNDropTopologyView = Backbone.View.extend({
        events: {},
        initialize: function () {
            this.render();
        },
        render: function () {
            var draggedEl,
                dropZones = {
                    valid: ['11link', '12link', '12', '123'],
                    invalid: ['13link', '11']
                };

            var topoWidth = window.innerWidth - 100;
            var topoHeight = window.innerHeight - 100;

            var topologyConf = {
                dataType: "json",
                data: topologyConfiguration.dragNdropData,
                icons: topologyConfiguration.dragNdropIcons,
                mode: "view",
                collapseChildrenThreshold: 6,
                container: this.el,
                viewerDimensions: {
                    width: topoWidth,
                    height: topoHeight,
                },
                showArrowHead: false,
                allowChildrenCollapse: true,
                allowZoomAndPan: true,
                nodeSpacing: {
                    horizontalGap: 250,
                    verticalGap: 150
                }
            };


            this.$el.on("slipstream.topology.node:click", function (evt, node) {
                console.info("Node " + node.id + "was clicked");
            });

            this.$el.on("slipstream.topology.addOn:click", function (evt, node) {
                console.info("AddOn " + node.name + " was clicked");
            });

            this.$el.on("slipstream.topology.link:click", function (evt, node) {
                console.info("Link " + node.id + "was clicked");
            });

            this.$el.on("slipstream.topology.over", function (evt, dragElement, topologyUi) {
                /*dragElement - The element which is dragged over the visualization.
                  topologyUi - instance of the visualization with helper methods.
                            method addDropTargets: displays drop targets
                            method removeDropTargets: removes drop targets*/
                topologyUi.addDropTargets(dropZones);
            });

            this.$el.on("slipstream.topology.drop", function (evt, dropElement, dropTarget, topologyUi) {
                //dropElement - element which was dragged and now dropped
                /*dropTarget - instance of the dropTarget.
                         method put: pass the updated object as parameter. This will update the dataStore for the drop target,
                         method get: returns data model of node/link,
                         method getTargetType: returns dropTarget type (node/link)
                 topologyUi - instance of the visualization with helper methods.*/

                var icon = dropElement.getAttribute('title'),
                    updateObject,
                    droppedOnObj = dropTarget.get();

                if (droppedOnObj.addOn) {
                    updateObject = droppedOnObj.addOn.type = icon;
                } else {
                    updateObject = {
                        "type": icon
                    };
                }
                dropTarget.set(updateObject);
                topologyUi.removeDropTargets();
            });

            this.$el.on("slipstream.topology.link.icon:mouseOver", function (evt, node) {
                if (dropZones.valid.indexOf(node.link.id) > -1) {
                    draggedEl && draggedEl.addClass('helper_styling'); //customize styling on the dragged element.
                }
            });

            this.$el.on("slipstream.topology.link.icon:mouseOut", function (evt, node) {
                draggedEl && draggedEl.removeClass('helper_styling');
            });

            var paletteView = $(render_template(paletteTemplate));
            this.$el.prepend(paletteView);

            //Transform draggable elements with jQuery draggable widget.
            var $draggableElements = this.$el.find('.topology_palette_controls img').css('width', 50);
            $draggableElements.draggable({
                helper: "clone",
                start: function (evt, ui) {
                    draggedEl = ui.helper;
                },
                stop: function (evt, ui) {
                    draggedEl = null;
                },
                cursor: "pointer",
                cursorAt: {top: -2, left: -2},
                zIndex: 100
            });

            this.dragNdropTopology = Topology.getInstance(topologyConf, "tree");
            this.dragNdropTopology.build();
            return this;
        }
    });

    return DragNDropTopologyView;
});