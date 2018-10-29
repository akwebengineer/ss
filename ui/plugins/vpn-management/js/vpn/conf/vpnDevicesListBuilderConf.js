/**
 * A configuration object with the parameters required to build 
 * a list builder for vpn endpoints
 *
 * @module VpnDevicesListBuilderConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
'../../../../ui-common/js/common/restApiConstants.js',
'../../../../ui-common/js/common/listBuilderCommonConstants.js'
], function (RestApiConstants, ListBuilderCommonConstants) {

    var Configuration = function(context) {
        this.getValues = function(listBuilderModel) {

            return {
                "availableElements": {
                    "url": listBuilderModel.getAvailableUrl(),
                    "jsonRoot": "vpn-devices.device",
                    "urlParameters": {deviceType: "Juniper"},
                    "totalRecords": "vpn-devices." + RestApiConstants.TOTAL_PROPERTY
                },
                "selectedElements": {
                    "url": listBuilderModel.getSelectedUrl(),
                    "jsonRoot": "vpn-devices.device",
                    "totalRecords": "vpn-devices." + RestApiConstants.TOTAL_PROPERTY,
                    "hideSearchOptionMenu": true
                },
                "search": {
                    "url": function (currentPara, value){
                        console.log(value);
                        if (_.isArray(value)){
                            return _.extend(currentPara);
                        }else{
                            return _.extend(currentPara);
                        }
                    }
                },
                "ajaxOptions": {
                    "headers": {
                        "Accept": "application/vnd.juniper.sd.vpn-management.device-refs+json;version=1;q=0.01"
                    }
                },
                "sorting": [{
                    "column": "name",
                    "order": "asc"
                }],
                "pageSize": ListBuilderCommonConstants.PAGE_SIZE,
                "id": "vpn-endpoint",
                "jsonId": "id",
                "height": '200px',
                "columns": [
                {
                    "index": "id",
                    "name": "id",
                    "hidden": true
                }, {
                    "index": "name",
                    "name": "name",
                    "label": context.getMessage('grid_column_name'),
                    "width": 180,
                    "sortable": false
                }, {
                    "index": "domain-name",
                    "name": "domain-name",
                    "label": context.getMessage('grid_column_domain'),
                    "width": 80,
                    "sortable": false
                }]
            };
        };
    };

    return Configuration;
});
