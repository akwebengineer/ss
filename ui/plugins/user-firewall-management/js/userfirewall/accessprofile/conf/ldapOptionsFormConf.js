/**
 * Form configuration required to render the general form using the FormWidget.
 *
 * @module General Form Configuration for LDAP Options form
 * @author Vinay M S <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([], function () {

    var RETRY_INTERVAL_MAX = 4294967295,
        RETRY_INTERVAL_MIN = 60;

    var Configuration = function(context) {

        this.getValues = function() {

            return {
                "form_id": "access_profile_ldap_optionsl_form",
                "form_name": "access_profile_ldap_optionsl_form",
                "add_remote_name_validation": 'access_profile_name',
                "sections": [{
                    "elements": [
                        {
                            "element_checkbox": true,
                            "id": "access_profile_assemble_lable",
                            "field-help": {
                                "content": context.getMessage('access_profile_assemble_tooltip')
                            },
                            "label": context.getMessage('access_profile_assemble'),
                            "values": [
                                {
                                    "id": "access_profile_assemble",
                                    "name": "assemble",
                                    "label": context.getMessage("enable")
                                }
                            ]
                        },
                        {
                            "element_text": true,
                            "id": "access_profile_assemble_common_name",
                            "class": "access_profile_assemble_common_name",
                            "name": "common-name",
                            "value": "{{common-name}}",
                            "field-help": {
                                "content": context.getMessage('access_profile_common_name_tooltip')
                            },
                            "label": context.getMessage('access_profile_assemble_common_name')
                        },
                        {
                            "element_text": true,
                            "required": true,
                            "id": "access_profile_base_distinguished_name",
                            "name": "base-dn",
                            "value": "{{base-dn}}",
                            "field-help": {
                                "content": context.getMessage('access_profile_base_distinguished_name_tooltip')
                            },
                            "label": context.getMessage('access_profile_base_distinguished_name')
                        },
                        {
                            "element_number": true,
                            "id": "access_profile_revert_interval",
                            "name": "revert-interval",
                            "value": "{{revert-interval}}",
                            "field-help": {
                                "content": context.getMessage('access_profile_revert_interval_tooltip')
                            },
                            "label": context.getMessage('access_profile_revert_interval'),
                            "help": context.getMessage("access_profile_range", [RETRY_INTERVAL_MIN, RETRY_INTERVAL_MAX]),
                            "error": context.getMessage("access_profile_range", [RETRY_INTERVAL_MIN, RETRY_INTERVAL_MAX]),
                            "min_value":RETRY_INTERVAL_MIN,
                            "max_value":RETRY_INTERVAL_MAX
                        },
                        {
                            "element_text": true,
                            "id": "access_profile_search_filter",
                            "name": "search-filter",
                            "value": "{{search-filter}}",
                            "field-help": {
                                "content": context.getMessage('access_profile_search_filter_tooltip')
                            },
                            "label": context.getMessage('access_profile_search_filter')
                        },
                        {
                            "element_checkbox": true,
                            "id": "access_profile_admin_search_label",
                            "field-help": {
                                "content": context.getMessage('access_profile_admin_search_tooltip')
                            },
                            "label": context.getMessage('access_profile_admin_search'),
                            "values": [
                                {
                                    "id": "access_profile_admin_search",
                                    "name": "admin-search",
                                    "label": context.getMessage("enable")
                                }
                            ]
                        },
                        {
                            "element_text": true,
                            "required": true,
                            "id": "access_profile_distinguished_name",
                            "class": "access_profile_distinguished_name",
                            "name": "admin-dn",
                            "value": "{{admin-dn}}",
                            "field-help": {
                                "content": context.getMessage('access_profile_distinguished_name_tooltip')
                            },
                            "label": context.getMessage('access_profile_distinguished_name')
                        },
                        {
                            "element_password": true,
                            "required": true,
                            "id": "access_profile_password",
                            "class": "access_profile_password",
                            "name": "admin-password",
                            "value": "{{admin-password}}",
                            "field-help": {
                                "content": context.getMessage('access_profile_password_tooltip')
                            },
                            "label": context.getMessage('access_profile_password'),
                            "pattern-error": [{
                                "pattern": "length",
                                "min_length":"1",
                                "error": "Required"
                            }]
                        },
                    ]
                }]
            };
        };
    };

    return Configuration;
});