/**
 * A configuration object with the parameters required to build 
 * a grid for duplicate groups of nat pools
 *
 * @module natPoolsDuplicatesGridConfiguration
 * @author Swathi Nagaraj <swathin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
'../../../../../ui-common/js/common/restApiConstants.js',
 '../../../../../ui-common/js/common/gridConfigurationConstants.js'
], function (RestApiConstants,GridConfigurationConstants) {

    var Configuration = function(context) {
        var buildSubgridUrl = function (rowObject){
            var url = '/api/juniper/sd/nat-pool-management/nat-pools';
            url += "?domainContext=(filterDomainIds eq " + Juniper.sm.DomainProvider.getCurrentDomain() + ")&filter=(hashKey eq '" + rowObject['hashKey'] + "')";
            return url;
        };

        var showSubtitle = function (cellvalue, options, rowObject){
            return rowObject.name + '(' + rowObject.size + ' ' + context.getMessage('members_lowercase') + ')';
        };
        var showPoolType = function (cellvalue, options, rowObject){
            return (cellvalue === 0 ? 'SOURCE': cellvalue === 1 ? 'DESTINATION': '');
        }; 
        var showName = function(cellvalue, options, rowObject) {
            return '<span class="">' + rowObject['name'] + '</span>';
        };
        this.getValues = function() {

            return {
                "tableId":"nat-pools-duplicate-groups",
                "height": "310px",
                "url": '/api/juniper/sd/nat-pool-management/nat-pools/show-duplicates',
                "numberOfRows": GridConfigurationConstants.OVERLAY_PAGE_SIZE,
                "jsonRoot": "duplicate-list.duplicates",
                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/vnd.juniper.sd.show-duplictaes+json;version=2;q=0.02'
                    }
                },
                "scroll": true,
                "footer": false,
                "sorting": false,
                "jsonRecords": function(data) {
                    return data['duplicate-list'][RestApiConstants.TOTAL_PROPERTY];
                },
                "multiselect": "true",
                "contextMenu": {
                    "delete": context.getMessage('action_delete'),
                    "custom":[{
                            "label":context.getMessage('action_merge'),
                            "key":"mergeEvent"
                        },{
                            "label":context.getMessage('action_find_usage'),
                            "key":"findUsageEvent"
                        }]
                },
                "subGrid": {
                    "scroll": "true",
                    "height": "200px",
                    "numberOfRows": GridConfigurationConstants.SUBGRID_PAGE_SIZE,
                    "url": buildSubgridUrl,
                    "jsonRoot": "nat-pools.nat-pool",
                    "showRowNumbers":true,
                    "ajaxOptions": {
                        "headers": {
                            "Accept": 'application/vnd.juniper.sd.nat-pool-management.nat-pools+json;version=2;q=0.02'
                        }
                    },
                    "jsonRecords": function(data) {
                      return data["nat-pools"]['total'];
                    }
                },
                "columns": [
                    {
                        "index": "context",
                        "name": "context",
                        "label": context.getMessage('name'),
                        "width": 200,
                        "formatter":showSubtitle,
                        "sortable": false,
                        "groupBy":"true"
                    }, {
                        "index": "id",
                        "name": "id",
                        "hidden": true
                    }, {
                        "index": "hash-key",
                        "name": "hash-key",
                        "hidden": true
                    }, {
                        "index": "name",
                        "name": "name",
                        "hidden": true
                    }, {
                        "name": "displayName",
                        "label": context.getMessage('name'),
                        "width": 200,
                        "formatter":showName,
                        "sortable": false,
                        "hideHeader": "true"
                    }, {
                        "index": "description",
                        "name": "description",
                        "label": context.getMessage('description'),
                        "sortable": false,
                        "width": 200
                    },
                    {
                        "index": "pool-address",
                        "name": "pool-address.name",
                        "label": context.getMessage('natpool_grid_column_pool_address'),
                        "sortable": false,
                        "width": 200
                    },
                    {
                        "index": "pool-type",
                        "name": "pool-type",
                        "label": context.getMessage('natpool_grid_column_pool_type'),
                        "formatter":showPoolType,
                        "sortable": false,
                        "width": 183
                    }
                ]
            };
        };
        this.objectType = 'nat-pool';
    };

    return Configuration;
});
