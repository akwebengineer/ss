/**
 * A configuration object with the parameters required to build 
 * a grid for duplicate groups of zone-sets
 *
 * @module zoneSetDuplicatesGridConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
'../../../../ui-common/js/common/restApiConstants.js',
'../../../../ui-common/js/common/gridConfigurationConstants.js'
], function (RestApiConstants, GridConfigurationConstants) {

    var Configuration = function(context) {
        var buildSubgridUrl = function (rowObject){
            var url = '/api/juniper/sd/zoneset-management/zone-sets';
            url += "?domainContext=(filterDomainIds eq " + Juniper.sm.DomainProvider.getCurrentDomain() + ")&filter=(hashKey eq '" + rowObject['hashKey'] + "')";
            return url;
        };

        var showSubtitle = function (cellvalue, options, rowObject){
            return rowObject.name + '(' + rowObject.size + ' ' + context.getMessage('members_lowercase') + ')';
        };

        var showName = function(cellvalue, options, rowObject) {
            return '<span class="zone-column">' + rowObject['name'] + '</span>';
        }

        this.getValues = function() {

            return {
                "tableId":"zone-set-duplicate-groups",
                "height": "310px",
                "url": "/api/juniper/sd/zoneset-management/zone-sets/show-duplicates",
                "numberOfRows": GridConfigurationConstants.OVERLAY_PAGE_SIZE,
                "jsonRoot": "duplicate-list.duplicates",
                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/vnd.juniper.sd.show-duplictaes+json;version=1;q=0.01'
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
//                    "delete": context.getMessage('action_delete'),
                    "custom":[{
                            "label":context.getMessage('action_merge'),
                            "key":"mergeEvent"
                        },{
                            "label":context.getMessage('action_find_usage'),
                            "key":"findUsageEvent"
                        }]
                },
                "subGrid": {
                    "url": buildSubgridUrl,
                    "jsonRoot": "zone-sets.zone-set",
                    "showRowNumbers":true,
                    "scroll": "true",
                    "height": "200px",
                    "numberOfRows": GridConfigurationConstants.SUBGRID_PAGE_SIZE,
                    "ajaxOptions": {
                        "headers": {
                            "Accept": 'application/vnd.juniper.sd.zoneset-management.zone-set-refs+json;version=1;q=0.01'
                        }
                    },
                    "jsonRecords": function(data) {
                        return data['zone-sets']['total'];
                    }
                },
                "columns": [
                    {
                        "index": "context",
                        "name": "context",
                        "label": context.getMessage('name'),
                        "width": 200,
                        "formatter":showSubtitle,
                        "groupBy":"true"
                    }, {
                        "index": "id",
                        "name": "id",
                        "label": "id",
                        "hidden": true
                    }, {
                        "index": "hash-key",
                        "name": "hash-key",
                        "hidden": true
                    },{
                        "index": "name",
                        "name": "name",
                        "hidden": true
                    }, {
                        "name": "displayName",
                        "label": context.getMessage('name'),
                        "width": 200,
                        "formatter":showName,
                        "hideHeader": "true"
                    }, {
                        "index": "zones",
                        "name": "zones",
                        "label": context.getMessage('zone_set_grid_column_zones'),
                        "width": 300
                    }, {
                        "index": "description",
                        "name": "description",
                        "label": context.getMessage('description'),
                        "width": 300
                    }
                ]
            };
        };
        this.objectType = 'zoneset';
    };

    return Configuration;
});
