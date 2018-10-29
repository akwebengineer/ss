/**
 * A configuration object with the parameters required for tree registry
 *
 * @module treeRegistry
 * @copyright Juniper Networks, Inc. 2017
 */

define([], function () {

    var treeRegistry = {};

    // Size object contains various parameters related to node, link, badge and label size/placement across the topology container.
    // The following sizes are supported by the widget:
    //   small : Image is rendered with size as 15px X 15px
    //   medium: Image is rendered with size as 30px X 30px
    //   large : Image is rendered with size as 45px X 45px

    treeRegistry.size = {
        'small':  {
            value: 15,
            nodeRadius: 10,
            nodeBorder: 2,
            xNodeLabel: 10,
            yNodeLabel: 20,
            xLeafNodeLabel: 35,
            xBadgeTextRight: 10,
            yBadgeTextRight: 6,
            xBadgeRectRight: 6,
            yBadgeRectRight: -2,
            xBadgeTextLeft: -9,
            yBadgeTextLeft: 0 ,
            xBadgeRectLeft: -15,
            yBadgeRectLeft: -7,
            xLinkImg: -8,
            yLinkImg: -6,
            xLinkAnchor: 0,
            yLinkAnchor: 1,
            xAddOnEl: {small: 0, medium: 8, large: 15},
            yAddOnEl: {top: -43, bottom: 28},
            yAddOnElLabel: {top: -10, bottom: 30}
        },
        'medium': {
            value: 30,
            nodeRadius: 22,
            nodeBorder: 3,
            xNodeLabel: 15,
            yNodeLabel: 30,
            xLeafNodeLabel: 45,
            xBadgeTextRight: 25,
            yBadgeTextRight: 13,
            xBadgeRectRight: 20,
            yBadgeRectRight: 5,
            xBadgeTextLeft: -9,
            yBadgeTextLeft: 1,
            xBadgeRectLeft: -14,
            yBadgeRectLeft: -7,
            xLinkImg: -10,
            yLinkImg: -14,
            xLinkAnchor: 5,
            yLinkAnchor: 0,
            xAddOnEl: {small: -8, medium: 0, large: 8},
            yAddOnEl: {top: -58, bottom: 28},
            yAddOnElLabel: {top: -10, bottom: 45}
        },
        'large':  {
            value: 45,
            nodeRadius: 30,
            nodeBorder: 4,
            xNodeLabel: 22,
            yNodeLabel: 40,
            xLeafNodeLabel: 55,
            xBadgeTextRight: 40,
            yBadgeTextRight: 20,
            xBadgeRectRight: 35,
            yBadgeRectRight: 12,
            xBadgeTextLeft: -7,
            yBadgeTextLeft: 0,
            xBadgeRectLeft: -12,
            yBadgeRectLeft: -8,
            xLinkImg: -18,
            yLinkImg: -18,
            xLinkAnchor: 5,
            yLinkAnchor: 4,
            xAddOnEl: {small: -14, medium: -8, large: 0},
            yAddOnEl: {top: -73, bottom: 28},
            yAddOnElLabel: {top: -10, bottom: 60}
        }
    };

    return treeRegistry;

});