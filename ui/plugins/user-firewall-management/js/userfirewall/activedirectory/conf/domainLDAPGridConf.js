/**
 * A configuration object with the parameters required to build
 * a grid for Active Directory Domain LDAP Grid
 *
 * @module DomainLDAPGridConfiguration
 * @author Vinay M S <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([
    '../../../../../ui-common/js/common/restApiConstants.js',
    '../../../../../ui-common/js/common/gridConfigurationConstants.js',
    '../../constants/userFirewallConstants.js'
], function (RestApiConstants, GridConfigurationConstants, UserFirewallConstants) {

    var Configuration = function (context) {

var PORT_RANGE_MIN_VALUE = 1,
    PORT_RANGE_MAX_VALUE = 65535;
        /**
         * Returns configuration values
         */
        this.getValues = function () {
            return {
                "tableId": "domain_ldap_grid",
                "numberOfRows": 10,
                "height": "100px",
                "repeatItems": "true",
                "multiselect": "true",
                "scroll": true,
                "jsonId": "slipstreamGridWidgetRowId",
                "jsonRoot": UserFirewallConstants.ACTIVE_DIRECTORY.DOMAIN_LDAP.GRID_JSON_ROOT,
                "jsonRecords": function (data) {
                    if (data.records > 0) {
                        return data['ldap-addresses'][RestApiConstants.TOTAL_PROPERTY];
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
                    "edit": context.getMessage('active_directory_domain_ldap_title_edit'),
                    "delete": context.getMessage('active_directory_domain_ldap_title_delete')
                },
                "confirmationDialog": {
                    "delete": {
                        title: context.getMessage("active_directory_domain_ldap_delete_title"),
                        question: context.getMessage("active_directory_domain_ldap_delete_message")
                    }
                },
                "columns": [

                    {
                        "index": "id",
                        "name": "id",
                        "hidden": true
                    },
                    {
                        "index": "user-grp-ip-address",
                        "name": "user-grp-ip-address",
                        "label": context.getMessage('active_directory_ip_address'),
                         sortable: false,
                        "editCell": {
                            "type": "input",
                            required: true,
                            "pattern": "^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$",
                            "error": context.getMessage("active_directory_ipaddress_field_help")
                        }
                    },
                    {
                        "index": "user-grp-port",
                        "name": "user-grp-port",
                        "label": context.getMessage('active_directory_port'),
                        sortable: false,
                        "editCell": {
                            "type": "input",
                            required: false,
                            "pattern": '^(([1-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9]|[1-6][0-5][0-5][0-3][0-5])$|^$)',
                            'min_value': PORT_RANGE_MIN_VALUE,
                            'max_value': PORT_RANGE_MAX_VALUE,
                            "error": context.getMessage('active_directory_port_error', [PORT_RANGE_MIN_VALUE, PORT_RANGE_MAX_VALUE ])

                        }
                    }
                ]
            }
        }
    };

    return Configuration;
});