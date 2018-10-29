/**
 * A configuration object with the parameters required to build 
 * a grid for duplicate groups of portsets
 *
 * @module portSetsDuplicatesGridConfiguration
 * @author Damodhar <mdamodhar@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
'../../../../../ui-common/js/common/restApiConstants.js',
  '../../../../../ui-common/js/common/gridConfigurationConstants.js'
], function (RestApiConstants,GridConfigurationConstants) {

    var Configuration = function(context) {
        var buildSubgridUrl = function (rowObject){
            var url = '/api/juniper/sd/portset-management/port-sets';
            url += "?domainContext=(filterDomainIds eq " + Juniper.sm.DomainProvider.getCurrentDomain() + ")&filter=(hashKey eq '" + rowObject['hashKey'] + "')";
            return url;
        };
         var showName = function(cellvalue, options, rowObject) {
            return '<span class="">' + rowObject['name'] + '</span>';
        };
        var showSubtitle = function (cellvalue, options, rowObject){
            return rowObject.name + '(' + rowObject.size + ' ' + context.getMessage('members_lowercase') + ')';
        };
        this.getValues = function() {

            return {
                "tableId":"port-sets-duplicate-groups",
                "height": "310px",
                "url": '/api/juniper/sd/portset-management/port-sets/show-duplicates',
                "numberOfRows": GridConfigurationConstants.OVERLAY_PAGE_SIZE,
                "jsonRoot": "duplicate-list.duplicates",
                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/vnd.juniper.sd.show-duplictaes+json;version=1;q=0.01'
                    }
                },
                "scroll": true,
                "footer": false,
                "sorting":false,
                "jsonRecords": function(data) {
                    return data['duplicate-list'][RestApiConstants.TOTAL_PROPERTY];
                },
                "multiselect": "true",
                "contextMenu": {
                    //"delete": context.getMessage('action_delete'),
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
                    "jsonRoot": "port-sets.port-set",
                    "showRowNumbers":true,
                    "ajaxOptions": {
                        "headers": {
                            "Accept": 'application/vnd.juniper.sd.portset-management.port-set-refs+json;version=1;q=0.01'
                        }
                    },
                    "jsonRecords": function(data) {
                      return data["port-sets"]['total'];
                    }
                },
                "columns": [
                    {
                        "index": "context",
                        "name": "context",
                        "label": context.getMessage('name'),
                        "width": 242,
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
                        "width": 250,
                        "sortable": false,
                        "formatter":showName,
                        "hideHeader": "true"
                    }, {
                        "index": "ports",
                        "name": "ports",
                        "label": context.getMessage('portsets_grid_column_ports'),
                        "sortable": false,
                        "width": 250
                    }, {
                        "index": "description",
                        "name": "description",
                        "label": context.getMessage('description'),
                        "sortable": false,
                        "width": 300
                    }
                ]
            };
        };
        this.objectType = 'port-sets';
    };

    return Configuration;
});
