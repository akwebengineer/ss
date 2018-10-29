/**
 * A configuration object with the parameters required for graph registry
 *
 * @module graphRegistry
 * @copyright Juniper Networks, Inc. 2017
 */

define([], function () {

    var graphRegistry = {};

    // Size object contains various parameters related to node, link and label size/placement across the topology container.
    // The following sizes are supported by the widget:
    //   small : Image is rendered with size as 15px X 15px
    //   medium: Image is rendered with size as 30px X 30px
    //   large : Image is rendered with size as 45px X 45px

    graphRegistry.size = {
        'small': {
            value: 15
        },
        'medium': {
            value: 30
        },
        'large': {
            value: 45
        }
    };

    return graphRegistry;
});