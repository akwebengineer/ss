/**
 * A configuration object with the parameters required to build 
 * a list builder for protected interface
 *
 * @module ProtectedInterfaceListBuilderConfiguration
 * @author Stanley Quan  <squan@juniper.net>
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
                    "url": listBuilderModel.getAvailableUrl()+'?ui-session-id='+context.uuiD,
                    "jsonRoot": "device-interfaces.interface",
                    "totalRecords": "device-interfaces." + RestApiConstants.TOTAL_PROPERTY
                },
                "selectedElements": {
                    "url": listBuilderModel.getSelectedUrl()+'?ui-session-id='+context.uuiD,
                    "jsonRoot": "device-interfaces.interface",
                    "totalRecords": "device-interfaces." + RestApiConstants.TOTAL_PROPERTY,
                    "hideSearchOptionMenu": true
                },
                "search": {
                    "url": function (currentPara, value){
                        console.log(value);
                        if (_.isArray(value)){
                            return _.extend(currentPara, {searchKey:value.join(' '), searchAll:true});
                        }else{
                            return _.extend(currentPara, {searchKey:value, searchAll:true});
                        }
                    }
                },
                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/vnd.juniper.sd.vpn-management.interface-refs+json;version=1;q=0.01'
                    }
                },
                "sorting": [{
                    "column": "name",
                    "order": "asc"
                }],
                "pageSize": ListBuilderCommonConstants.PAGE_SIZE,
                "id": "vpn-endpoint",
                "jsonId": "name",
                "height": '200px',
                "columns": [
                {
                    "index": "name",
                    "name": "name",
                    "label": context.getMessage('grid_column_name'),
                    "width": 100,
                    "sortable": false
                }, {
                    "index": "domain-name",
                    "name": "domain-name",
                    "label": context.getMessage('grid_column_domain'),
                    "width": 100,
                    "sortable": false,
                    "hidden" : true
                }]
            };
        };
    };

    return Configuration;
});
