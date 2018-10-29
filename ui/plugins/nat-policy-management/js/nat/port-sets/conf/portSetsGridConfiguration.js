/**
 * A configuration object with the parameters required to build 
 * a grid for Port Sets
 *
 * @module PortSetsConfiguration
 * @author Sandhya <sandhyab@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
'../../../../../nat-policy-management/js/nat/common/constants/natPolicyManagementConstants.js',
'../../../../../ui-common/js/common/restApiConstants.js',
'../../../../../ui-common/js/common/gridConfigurationConstants.js'
], function (NATPolicyManagementConstants, RestApiConstants, GridConfigurationConstants) {

    var formatPorts = function (cellValue, options, rowObject) {
        return cellValue.split(/[\n,]+/);
    };
    var Configuration = function(context) {

    this.getValues = function() {

            return {
                "title": context.getMessage('portsets_grid_title'),
                "title-help": {
                    "content": context.getMessage('portsets_grid_title_tooltip'),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey("NAT_POLICY_PORT_SET_CREATING")
                },
                "tableId": "portsets",
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
                "url": NATPolicyManagementConstants.PORT_SETS_URL,
                "jsonRoot": "port-sets.port-set",
                "jsonId": "id",
                "jsonRecords": function(data) {
                    return data['port-sets'][RestApiConstants.TOTAL_PROPERTY];
                },
                "ajaxOptions": {
                    "headers": {
                        "Accept": NATPolicyManagementConstants.PORT_SETS_ACCEPT_HEADER
                    }
                },
                "contextMenu": {
                    "edit": context.getMessage('portsets_grid_edit'),
                    "delete": context.getMessage('portsets_grid_delete'),
                },
                "confirmationDialog": {
                    "delete": {
                        title: context.getMessage('portset_delete_title'),
                        question: context.getMessage('portset_delete_msg')
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
                        "index": "description",
                        "name": "description",
                        "label": context.getMessage('grid_column_description'),
                        "width": 186,
                        "collapseContent": {
                          "singleValue" : true
                        }
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
                    },
                    {
                        "index": "created-by-user-name",
                        "name": "created-by-user-name",
                        "label": context.getMessage('grid_column_created-by'),
                        "width": 186
                    },
                    {
                        "index": "ports",
                        "name": "ports",
                        "label": context.getMessage('portsets_grid_column_ports'),
                        "width": 186,
                        "collapseContent": {
                            "formatData": formatPorts
                        }
                    }
                ]
            }
        }
    };

    return Configuration;
});
