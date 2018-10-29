/**
 * A configuration object with the parameters required to build 
 * a grid for protocols
 *
 * @module serviceDetailServiceGridConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
        './protocolTypes.js',
        'text!../../../../sd-common/js/templates/serviceProtocolDetail.html',
        '../../../../ui-common/js/common/gridConfigurationConstants.js'
], function (protocolTypes, detailTemplate, GridConfigurationConstants) {
    var Configuration = function(context) {
        this.getValues = function() {
            return {
                "tableId": "service-protocols",
                "numberOfRows": GridConfigurationConstants.OVERLAY_PAGE_SIZE,
                "height": "200px",
                "repeatItems": "true",
                "scroll": true,
                "jsonId": "id",
                "columns": [
                    {
                        "index": "name",
                        "name": "name",
                        "label": context.getMessage('application_detail_service_name'),
                        "width": 90
                    },
                    {
                        "index": "type",
                        "name": "type",
                        "label": context.getMessage('grid_column_type'),
                        "width": 100
                    },
                    {
                        "index": "domain",
                        "name": "domain",
                        "label": context.getMessage('grid_column_domain'),
                        "width": 90
                    },
                    {
                        "index": "description",
                        "name": "description",
                        "label": context.getMessage('grid_column_description'),
                        "width": 250
                    }
                ]
            };
        };
    };

    return Configuration;
});
