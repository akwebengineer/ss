/**
 * A configuration object with the parameters required to build 
 * a grid for Zone-sets
 *
 * @module zoneSetGridConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
'../../../../ui-common/js/common/restApiConstants.js',
'../../../../ui-common/js/common/gridConfigurationConstants.js'
], function (RestApiConstants, GridConfigurationConstants) {
    var formatZones = function (cellValue, options, rowObject) {
        return cellValue.split(",");
    };

    var Configuration = function(context) {

        this.getValues = function() {

            return {
                "title": context.getMessage('zone_set_grid_title'),
                "title-help": {
                    "content": context.getMessage('zone_set_intro'),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier":context.getHelpKey("SHARED_OBJECTS_ZONE_SET_CREATING")
                },
                "tableId": "zone_set",
                "numberOfRows": GridConfigurationConstants.PAGE_SIZE,
                "height": "auto",
                "sorting": [
                    {
                    "column": "name",
                    "order": "asc"
                    }
                ],
                "repeatItems": "true",
                "multiselect": "true",
                "scroll":"true",
                "jsonId": "id",
                "url": "/api/juniper/sd/zoneset-management/zone-sets",
                "jsonRoot": "zone-sets.zone-set",
                "jsonRecords": function(data) {
                    return data['zone-sets'][RestApiConstants.TOTAL_PROPERTY];
                },
                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/vnd.juniper.sd.zoneset-management.zone-set-refs+json;version=1;q=0.01'
                    }
                },
                "contextMenu": {
                    "edit": context.getMessage('zone_set_grid_edit'),
                    "delete": context.getMessage('zone_set_grid_delete')
                },
                "filter": {
                    searchUrl: true,
                    optionMenu: {
                        "showHideColumnsItem": {},
                        "customItems": []
                    }
                },
                "columns": [
                    {
                        "index": "id",
                        "name": "id",
                        "hidden": true
                    },
                    {
                        "index": "domain-id",
                        "name": "domain-id",
                        "hidden": true
                    },
                    {
                        "index": "name",
                        "name": "name",
                        "label": context.getMessage('grid_column_name')
                    },
                    {
                        "index": "description",
                        "name": "description",
                        "sortable": false,
                        "collapseContent": {
                            "singleValue" : true
                        },
                        "label": context.getMessage('grid_column_description')
                    },
                    {
                        "index": "domain-name",
                        "name": "domain-name",
                        "sortable": false,
                        "label": context.getMessage('grid_column_domain')
                    },
                    {
                        "index": "zones",
                        "name": "zones",
                        "sortable": false,
                        "label": context.getMessage('zone_set_grid_column_zones'),
                        "collapseContent": {
                            "formatData": formatZones
                        }
                    }
                ]
            };
        };
    };

    return Configuration;
});
