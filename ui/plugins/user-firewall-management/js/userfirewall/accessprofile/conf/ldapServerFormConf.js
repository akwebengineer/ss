/**
 * Form configuration required to render the general form using the FormWidget.
 *
 * @module LDAP Server Form Configuration
 * @author Vinay M S <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([], function () {

    var PORT_MIN = 1,
        PORT_MAX = 65535,
        RETRY_MIN = 1,
        RETRY_MAX = 10,
        TIMEOUT_MIN = 3,
        TIMEOUT_MAX = 90;

    var Configuration = function(context) {

        this.getValues = function() {

            return {
                "form_id": "access_profile_ldap_server_form",
                "form_name": "access_profile_ldap_server_form",
                "on_overlay": true,
                "title-help": {
                    "content": context.getMessage('access_profile_ldap_server_title_tooltip')
                },
                "sections": [
                    {
                        // "heading": context.getMessage('access_profile_general_setting_title'),
                        "elements": [
                            {
                                "element_multiple_error": true,
                                "id": "access_profile_address",
                                "name": "address",
                                "value": "{{address}}",
                                "label": context.getMessage('access_profile_address'),
                                "required": true,
                                "placeholder": context.getMessage('access_profile_hostname_or_ipv4_address'),
                                "notshowvalid": true,
                                "post_validation": "blankNameValidator",
                                "field-help": {
                                    "content": context.getMessage('access_profile_ldap_server_address_tooltip')
                                },
                                error: true,
                                "pattern-error": [
                                    {
                                        "pattern": "validtext",
                                        "error": context.getMessage('name_require_error')
                                    },
                                    {
                                        "regexId": "regex1",
                                        "pattern": "^[a-zA-Z0-9][a-zA-Z0-9-_.:\/]{0,62}$",
                                        "error": context.getMessage('address_name_error')
                                    }
                                ]
                            },
                            {
                                "element_number": true,
                                "id": "access_profile_port",
                                "name": "port",
                                "value": "{{port}}",
                                "field-help": {
                                    "content": context.getMessage('access_profile_ldap_server_port_tooltip')
                                },
                                "label": context.getMessage('access_profile_port'),
                                "help": context.getMessage("access_profile_range", [PORT_MIN, PORT_MAX]),
                                "error": context.getMessage("access_profile_range", [PORT_MIN, PORT_MAX]),
                                "min_value":PORT_MIN,
                                "max_value":PORT_MAX
                            },
                            {
                                "element_number": true,
                                "id": "access_profile_retry",
                                "name": "retry",
                                "value": "{{retry}}",
                                "field-help": {
                                    "content": context.getMessage('access_profile_ldap_server_retry_tooltip')
                                },
                                "label": context.getMessage('access_profile_retry'),
                                "help": context.getMessage("access_profile_range", [RETRY_MIN, RETRY_MAX]),
                                "error": context.getMessage("access_profile_range", [RETRY_MIN, RETRY_MAX]),
                                "min_value":RETRY_MIN,
                                "max_value":RETRY_MAX
                            },
                            {
                                "element_text": true,
                                "id": "access_profile_routing_instance",
                                "name": "routing-instance",
                                "value": "{{routing-instance}}",
                                "field-help": {
                                    "content": context.getMessage('access_profile_ldap_server_routing_instance_tooltip')
                                },
                                "label": context.getMessage('access_profile_routing_instance')
                            },
                            {
                                "element_ip": true,
                                "id": "access_profile_source_address",
                                "name": "src-address",
                                "value": "{{src-address}}",
                                "field-help": {
                                    "content": context.getMessage('access_profile_ldap_server_source_address_tooltip')
                                },
                                error: context.getMessage('active_directory_invalid_entry_ip_address_error'),
                                "label": context.getMessage('access_profile_source_address')
                            },
                            {
                                "element_number": true,
                                "id": "access_profile_timeout",
                                "name": "time-out",
                                "value": "{{time-out}}",
                                "field-help": {
                                    "content": context.getMessage('access_profile_ldap_server_timeout_tooltip')
                                },
                                "label": context.getMessage('access_profile_timeout'),
                                "help": context.getMessage("access_profile_range", [TIMEOUT_MIN, TIMEOUT_MAX]),
                                "error": context.getMessage("access_profile_range", [TIMEOUT_MIN, TIMEOUT_MAX]),
                                "min_value":TIMEOUT_MIN,
                                "max_value":TIMEOUT_MAX
                            }
                        ]
                    }
                ],
                "buttonsAlignedRight": true,
                "cancel_link": {
                    "id": "ldap-server-cancel",
                    "value": context.getMessage('cancel')
                },
                "buttons": [
                    {
                        "id": "ldap-server-save",
                        "name": "save",
                        "value": context.getMessage('ok')
                    }
                ]
            };
        };
    };

    return Configuration;
});