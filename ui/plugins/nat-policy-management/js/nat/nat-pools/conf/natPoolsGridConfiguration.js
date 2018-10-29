/**
 * A configuration object with the parameters required to build 
 * a grid for nat pools
 *
 * @module natpoolConfiguration
 * @author mdamodhar <mdamodhar@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../../nat-policy-management/js/nat/common/constants/natPolicyManagementConstants.js',
    '../../../../../ui-common/js/common/restApiConstants.js',
    '../../../../../ui-common/js/common/gridConfigurationConstants.js'
], function (NATPolicyManagementConstants, RestApiConstants,GridConfigurationConstants) {

    var Configuration = function(context) {
     var showPoolType = function (cellvalue, options, rowObject){
            return (cellvalue === 0 ? 'SOURCE': 'DESTINATION');
        };  
    this.getValues = function() {

            return {
                "title": context.getMessage('natpool_grid_title'),
                "title-help": {
                    "content": context.getMessage('natpool_grid_title_tooltip'),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey("NAT_POOL_CREATING")
                },
                "tableId": "natpool",
                "numberOfRows": GridConfigurationConstants.PAGE_SIZE,
                "height": GridConfigurationConstants.TABLE_HEIGHT,
                "sorting": [
                    {
                    "column": "name",
                    "order": "asc"
                    }
                ],
                "filter": {
                    searchUrl: true,
                    optionMenu: {
                        "showHideColumnsItem": {},
                        "customItems": []
                    }
                },
                "repeatItems": "true",
                "multiselect": "true",
                "scroll": true,
                "url": NATPolicyManagementConstants.NAT_POOLS_URL,
                "jsonRoot": "nat-pools.nat-pool",
                "jsonId": "id",
                "jsonRecords": function(data) {
                    return data['nat-pools'][RestApiConstants.TOTAL_PROPERTY];
                },
                "ajaxOptions": {
                    "headers": {
                        "Accept": NATPolicyManagementConstants.NAT_POOLS_ACCEPT_HEADER
                    }
                },
                "contextMenu": {
                    "edit": context.getMessage('natpool_grid_edit'),
                    "delete": context.getMessage('natpool_grid_delete')
                },
                "confirmationDialog": {
                    "delete": {
                        title: context.getMessage('natpool_delete_title'),
                        question: context.getMessage('natpool_delete_msg')
                    }
                },
                "columns": [
                    {
                        "id": "id",
                        "name": "id",
                        "hidden": true
                    },
                    {
                        "index": "name",
                        "name": "name",
                        "label": context.getMessage('grid_column_name'),
                        "width": 186
                    },
                    {
                        "index": "pool-address",
                        "name": "pool-address.name",
                        "label": context.getMessage('natpool_grid_column_pool_address'),
                        "width": 186
                    },
                    {
                        "index": "description",
                        "name": "description",
                        "label": context.getMessage('grid_column_description'),
                        "width": 186,
                        "collapseContent": {
                          "singleValue" : true
                        }
                    },
                    {
                        "index": "pool-type",
                        "name": "pool-type",
                        "label": context.getMessage('natpool_grid_column_pool_type'),
                        "formatter":showPoolType,
                        "unformat" : function (formattedValue) {
                          return formattedValue === 'SOURCE' ? 0 : 1;
                        },
                        "width": 186
                    },
                    {
                        "index": "domain-name",
                        "name": "domain-name",
                        "label": context.getMessage('grid_column_domain'),
                        "width": 186
                    },
                    {
                       "index": "domain-id",
                        "name": "domain-id",
                        "hidden": true
                    }
                ]
            }
        }
    };

    return Configuration;
});
