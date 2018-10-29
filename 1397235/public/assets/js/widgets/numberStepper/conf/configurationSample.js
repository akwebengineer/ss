/**
 * A sample configuration object that shows the parameters required to build a numberStepper widget
 *
 * @module configurationSample
 * @author Swena Gupta <gswena@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define([], function () {

    var configurationSample = {};

    configurationSample.useMinMaxOption = {
        "min_value": -10,
        "max_value": 10
    };

    configurationSample.useMinMaxDisabledOption = {
        "min_value": -10,
        "max_value": 10,
        "disabled": true
    };
    return configurationSample;

});