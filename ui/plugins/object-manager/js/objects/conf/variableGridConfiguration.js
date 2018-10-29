/**
 * A configuration object with the parameters required to build 
 * a grid for Variables
 *
 * @module variableConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../ui-common/js/common/restApiConstants.js',
    '../../../../ui-common/js/common/gridConfigurationConstants.js'
], function (RestApiConstants, GridConfigurationConstants) {

    var Configuration = function(context) {

        this.formatTypeObject = function (cellValue, options, rowObject) {
            if (cellValue === 'ADDRESS')  return context.getMessage('variable_grid_type_address');
            if (cellValue === 'ZONE')  return context.getMessage('variable_grid_type_zone');
        };
            
        this.getValues = function() {
        
            return {
                "title": context.getMessage('variable_grid_title'),
                "title-help": {
                    "content": context.getMessage('variable_grid_tooltip'),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey("SHARED_OBJECTS_VARIABLE_DEFINITION_CREATING")
                },
                "tableId": "variables",
                "numberOfRows": GridConfigurationConstants.PAGE_SIZE,
                "height": "auto",
                "sortName": "name",
                "sortOrder": "asc",
                "repeatItems": "true",
                "multiselect": "true",
                "scroll": true,
                "url": "/api/juniper/sd/variable-management/variable-definitions",
                "jsonId": "id",
                "jsonRoot": "variable-definitions.variable-definition",
                "jsonRecords": function(data) {
                    return data['variable-definitions'][RestApiConstants.TOTAL_PROPERTY];
                },
                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/vnd.juniper.sd.variable-management.variable-definitions+json;version=1;q=0.01'
                    }
                },
                "contextMenu": {
                    "edit": context.getMessage('variable_grid_edit'),
                    "delete": context.getMessage('variable_grid_delete')
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
                        "label": context.getMessage('grid_column_name'),
                        "width": 186
                    },
                    {
                        "index": "default-value",
                        "name": "default-value",
                        "label": context.getMessage('variable_grid_column_default_value'),
                        "width": 186
                    },
                    {
                        "index": "description",
                        "name": "description",
                        "label": context.getMessage('grid_column_description'),
                        "collapseContent": {
                            "singleValue" : true
                        },
                        "width": 186
                    },
                    {
                        "index": "type",
                        "name": "type",
                        "label": context.getMessage('grid_column_type'),
                        "width": 186,
                        "formatter": this.formatTypeObject
                    },
                    {
                        "index": "domain-name",
                        "name": "domain-name",
                        "label": context.getMessage('grid_column_domain'),
                        "width": 186
                    }
                ]
            };
        };
    };

    return Configuration;
});
