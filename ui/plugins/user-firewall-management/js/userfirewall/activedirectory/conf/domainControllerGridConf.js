/**
 * A configuration object with the parameters required to build
 * a grid for Active Directory Domain Controller
 *
 * @module DomainControllerGridConfiguration
 * @author Tashi Garg <tgarg@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([
    '../../../../../ui-common/js/common/restApiConstants.js',
    '../../../../../ui-common/js/common/gridConfigurationConstants.js',
    '../../constants/userFirewallConstants.js'
], function (RestApiConstants, GridConfigurationConstants, UserFirewallConstants) {

    var Configuration = function (context) {


        /**
         * Returns configuration values
         */
        this.getValues = function () {
            return {
                "tableId": "domain_controllers_grid",
                "numberOfRows": 10,
                "height": "100px",
                "repeatItems": "true",
                "multiselect": "true",
                "scroll": true,
                "jsonId": "slipstreamGridWidgetRowId",
                "jsonRoot": UserFirewallConstants.ACTIVE_DIRECTORY.DOMAIN_CONTROLLER.GRID_JSON_ROOT,
                "jsonRecords": function (data) {
                    if (data.records > 0) {
                        return data['domain-controllers'][RestApiConstants.TOTAL_PROPERTY];
                    }
                },

                "createRow": {
                    "addLast": true,
                    "showInline": true
                },

                "editRow": {
                    "showInline": true
                },

                "contextMenu": {
                    "edit": context.getMessage('active_directory_domain_controller_title_edit'),
                    "delete": context.getMessage('active_directory_domain_controller_title_delete')
                },
                "confirmationDialog": {
                    "delete": {
                        title: context.getMessage("active_directory_domain_controller_delete_title"),
                        question: context.getMessage("active_directory_domain_controller_delete_message")
                    }
                },
                "columns": [

                    {
                        "index": "id",
                        "name": "id",
                        "hidden": true
                    },
                    {
                        "index": "domain-controller-name",
                        "name": "domain-controller-name",
                        "label": context.getMessage('active_directory_domain_controller_name'),
                         sortable: false,
                        "editCell": {
                            "type": "input",
                            "pattern": "^[a-zA-Z0-9][a-zA-Z0-9-_.:\/]{0,62}$",
                            "error": context.getMessage("active_directory_name_error"),
                            required: true

                        }
                    },
                    {
                        "index": "domain-controller-ip-address",
                        "name": "domain-controller-ip-address",
                        "label": context.getMessage('active_directory_ip_address'),
                        sortable: false,
                        "editCell": {
                            "type": "input",
                            required: true,
                            "pattern": "^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$",
                            "error": context.getMessage("active_directory_ipaddress_field_help")
                        }
                    }
                ]
            }
        }
    };

    return Configuration;
});