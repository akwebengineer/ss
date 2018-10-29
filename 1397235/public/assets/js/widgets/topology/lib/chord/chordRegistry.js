/**
 * A configuration object with the parameters required for graph registry
 * @module graphRegistry
 * @author Viswesh Subramanian <vissubra@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define([], function () {

    var chordRegistry = {};

    chordRegistry.layout = {
        margin: 50,
        chordPadding: 0.02,
        arcWidth: 10,
        topologyPadding: 100
    };

    return chordRegistry;
});