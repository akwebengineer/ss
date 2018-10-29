/**
 * A configuration object with the parameters required to build 
 * a grid for services
 *
 * @module serviceGridConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
'../../../../ui-common/js/common/restApiConstants.js',
'../../../../ui-common/js/common/gridConfigurationConstants.js'
], function (RestApiConstants, GridConfigurationConstants) {
    var Configuration = function(context) {
        this.formatTypeObject = function (cellValue, options, rowObject) {
            return (cellValue === false ? context.getMessage('application_grid_service') : context.getMessage('application_grid_service_group'));
        };
        this.unFormatTypeObject = function (formattedCellValue) {
          return (formattedCellValue === context.getMessage('application_grid_service') ?  false : true);
        };
        this.getValues = function() {

            return {
                "title": context.getMessage('application_grid_title'),
                "title-help": {
                    "content": context.getMessage('application_grid_tooltip'),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey("SHARED_OBJECTS_SERVICE_CREATING")
                },
                "tableId": "applications",
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
                "scroll": true,
                "jsonId": "id",
                "url": "/api/juniper/sd/service-management/services",
                "jsonRoot": "services.service",
                "jsonRecords": function(data) {
                    return data.services[RestApiConstants.TOTAL_PROPERTY];
                },
                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/vnd.juniper.sd.service-management.services+json;version=1;q=0.01'
                    }
                },
                "contextMenu": {
                    "edit": context.getMessage('application_grid_edit'),
                    "delete": context.getMessage('application_grid_delete')
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
                        "index": "is-group",
                        "name": "is-group",
                        "label": context.getMessage('grid_column_type'),
                        "formatter": this.formatTypeObject,
                        "unformat" : this.unFormatTypeObject
                    },
                    {
                        "index": "description",
                        "name": "description",
                        "label": context.getMessage('grid_column_description'),
                        "collapseContent": {
                            "singleValue" : true
                        },
                        "width": 300
                    },
                    {
                        "index": "domain-name",
                        "name": "domain-name",
                        "label": context.getMessage('grid_column_domain')
                    }
                ]
            };
        };
    };

    return Configuration;
});
