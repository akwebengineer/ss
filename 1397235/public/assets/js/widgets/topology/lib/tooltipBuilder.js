/**
 * A module that builds the tooltip used in Topology widget
 *
 * @module TooltipBuilder
 * @author Sanket Desai <sanketdesai@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define([
    'widgets/tooltip/tooltipWidget'
],  /** @lends TooltipBuilder */
    function(TooltipWidget) {

    var ToolTipBuilder = function() {
        var tooltipWidget;
        var self = this;

        /**
         * Adds tooltips to Topology widget
         * @param {Object} nodeEl - container of a node or link-icon where the mouseover event is triggered
         * @param {object} nodeObj - d3 object of node being hovered (in case of link icon, this object will consist of source and destination node of the link)
         * @param {object} conf - topology configuration object
         * @param {string} type - NODE, LINK or NODE-BADGE
         * @param {string} topologyType - Topology Type
         */
        this.addContentTooltips = function (nodeEl, nodeObj, conf, type, topologyType) {

            var tooltip_text = ' ';
            var tooltipConfig = {
                "minWidth": 100,
                "maxWidth": 100,
                "position": "top",
                "contentAsHTML": true,
                "animation": false,
                "contentCloning": false,
                "offsetX": 5
            };

            if (type == 'LINK') {
                switch (topologyType) {
                    case "tree":
                        nodeObj = nodeObj.target;
                        break;
                    default:
                        nodeObj = nodeObj;
                        break;
                }
            }

            _.extend(tooltipConfig, conf.tooltip);

            // override the tooltip parameters for NODE-BADGE so that topology widget can control the placement of the tooltips
            if (type == 'NODE-BADGE') {
                tooltipConfig.position = "right";
                tooltipConfig.offsetY = -6;
                //adjust the offsetX, based on badge size (rectangle badge width changes based on the number of subNodes)
                tooltipConfig.offsetX = (nodeObj.subNodes.length > 100) ? 22 : (nodeObj.subNodes.length < 10) ? 10 : 16;
            }

            this.tooltipReturnData = nodeObj;

            tooltipConfig.functionBefore = function($container, resume) {

                var nodeContainer = $container;
                var setTooltipData = function (tooltipData){
                    resume();
                    if(!tooltipData){
                        nodeContainer.tooltipster('hide');
                    }
                    else {
                        nodeContainer.tooltipster('content', $('<span>').append(tooltipData));
                    }
                };

                if(conf.tooltip.onHover && typeof(conf.tooltip.onHover) === 'function') {
                    conf.tooltip.onHover(type, self.tooltipReturnData, setTooltipData);
                }
            };

           tooltipWidget = new TooltipWidget({
                "elements": tooltipConfig,
                "container": nodeEl[0],
                "view":  tooltip_text
            });

          tooltipWidget.build();
          $(nodeEl[0]).tooltipster('show');
        };

        /**
         * Destroy the tooltip associated with node/icon
         */
        this.destroyTooltip = function () {
          if (tooltipWidget) {
            tooltipWidget.destroy();
            tooltipWidget=null;
          }
        }

    };

    return ToolTipBuilder;
});
