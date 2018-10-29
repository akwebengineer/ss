/**
 * A  configuration object with the parameters required to build a Tooltip widget in the Grid wdiget
 *
 * @module tooltipConfiguration
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([], function () {

    var tooltipConfiguration = {};

    tooltipConfiguration.filter = {
        "minWidth": 300,
        "maxWidth": 300,
        "position": 'right',
        "interactive": true
    };

    tooltipConfiguration.header = {
        "minWidth": 300,
        "maxWidth": 300,
        "position": 'top',
        "interactive": true
    };

    tooltipConfiguration.groupColumn = {
        "minWidth": 150,
        "maxWidth": 300,
        "position": 'bottom',
        "style": "grid-widget"
    };

    tooltipConfiguration.allCells = {
        "delay": 500,
        "onlyOne": true
    };

    tooltipConfiguration.moreCellContent = {
        "minWidth": 100,
        "maxWidth": 100,
        "position": 'bottom-left',
        "interactive": true,
        "contentAsHTML": true,
        "style": "grid-widget",
        "animation": false,
        "contentCloning": false
    };

    tooltipConfiguration.dataTooltipContent = {
        "maxWidth": 300,
        "position": 'bottom',
        "interactive": true,
        "contentAsHTML": true,
        "style": "grid-widget",
        "animation": false,
        "contentCloning": false,
        "delay": 500,
        "onlyOne": true
    };

    tooltipConfiguration.multiselectCellFooter = {
        "interactive": true,
        "position": "top-right",
        "style": "dragndropTooltip",
        "offsetX": 2
    };

    tooltipConfiguration.selectionTooltip = {
        "minWidth": 60,
        "maxWidth": 100,
        "position": 'bottom-right',
        "interactive": true,
        "animation": false,
        "contentAsHTML": true,
        "contentCloning": false
    };
    
    return tooltipConfiguration;

});
