/**
 * Form configuration required to render the general form using the FormWidget.
 *
 * @module General Form Configuration for Active Directory
 * @author Tashi Garg <tgarg@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([], function () {

    var NAME_MAX_LENGTH = 63,
        NAME_MIN_LENGTH = 1,
        DESCRIPTION_MAX_LENGTH = 255,
        AUTH_ENTRY_TIMEOUT_MIN_VAL = 10,
        AUTH_ENTRY_TIMEOUT_MAX_VAL = 1440,
        WMI_TIMESTAMP_MIN_VAL = 3,
        WMI_TIMESTAMP_MAX_VAL = 120;

    var Configuration = function (context, formMode) {

        /**
         * Return name element. For edit, it will be read only field else it will be of input type
         * @returns {*}
         */
        this.nameElement = function () {
            if (formMode === 'EDIT') {
                return {
                    "element_description": true,
                    "id": "active_directory_name",
                    "value": "{{name}}",
                    "label":context.getMessage('name'),
                    "name": "name"
                }
            }
            return  {
                'element_multiple_error': true,
                'id': 'active_directory_name',
                'name': 'name',
                'value': '{{name}}',
                "field-help": {
                    "content": context.getMessage('active_directory_name_tooptip')
                },
                'label': context.getMessage('name'),
                'required': true,
                'pattern-error': [{
                    'pattern': 'validtext',
                    'error': context.getMessage('name_require_error')
                },
                {
                    'pattern': 'length',
                    'max_length': NAME_MAX_LENGTH,
                    'min_length': NAME_MIN_LENGTH,
                    'error': context.getMessage('maximum_length_error', [NAME_MAX_LENGTH])
                },
                {
                    "regexId": "regex1",
                    "pattern": "^[a-zA-Z0-9][a-zA-Z0-9-_.:\/]{0,62}$",
                    "error": context.getMessage('active_directory_name_error')
                }],
                'error': context.getMessage('active_directory_name_error'),
                'notshowvalid': true
            }
        };

        /**
         * @returns Form configuration
         *
         */
        this.getValues = function () {

            return {
                'form_id': 'active-directory-general-form',
                'form_name': 'active-directory-general-form',
                'add_remote_name_validation': 'active_directory_name',
                "title-help": {
                    "content": context.getMessage('access_profile_create_view_tooltip'),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey("ACCESS_PROFILE_CREATING")
                },
                'sections': [{
                    'heading': context.getMessage('active_directory_general_title'),
                    section_id: 'active_directory_domain_info',
                    'progressive_disclosure': 'expanded',
                    'elements': [
                        this.nameElement(),
                        {
                            'element_textarea': true,
                            'id': 'active_directory_description',
                            'name': 'description',
                            'value': '{{description}}',
                            "field-help": {
                                "content": context.getMessage('active_directory_discription_tooptip')
                            },
                            'label': context.getMessage('description'),
                            'max_length': DESCRIPTION_MAX_LENGTH,
                            "post_validation": "descriptionValidator"
                        },
                        {
                            "element_checkbox": true,
                            "id": "active_directory_on_demand_probe",
                            "field-help": {
                                "content": context.getMessage('active_directory_on_demand_probe_tooptip')
                            },
                            "label": context.getMessage("active_directory_on_demand_probe"),
                            "values": [
                                {
                                    "id": "on-demand-probe",
                                    "name": "on-demand-probe",
                                    "label": context.getMessage("checkbox_enable"),
                                    "value": "{{on-demand-probe}}",
                                    "checked": false
                                }
                            ]
                        }
                    ]
                },
                {
                    'heading': context.getMessage('active_directory_timeout'),
                    section_id: 'active_directory_timeout',
                    'progressive_disclosure': 'expanded',
                    'elements': [
                        {
                            'element_text': true,
                            'id': 'authentication-time-out',
                            'name': 'authentication-time-out',
                            'value': '{{authentication-time-out}}',
                            "field-help": {
                                "content": context.getMessage('active_directory_auth_entry_timeout_tooptip')
                            },
                            label: context.getMessage('active_directory_authentication_timeout'),
                            'help': context.getMessage('active_directory_range_through_help_timeout', [0, AUTH_ENTRY_TIMEOUT_MIN_VAL,
                                AUTH_ENTRY_TIMEOUT_MAX_VAL ]),
                            "pattern": '^0$|^([1-9][0-9])$|^([1-9][0-9]{2})$|^(1[0-3][0-9]{2})$|^(14[0-3][0-9])$|^(1440)$',
                            "error": context.getMessage('authentication-timeout-help'),
                            "field-help": {
                                "content": context.getMessage('authentication-timeout-tooltip')
                            }
                        },
                        {
                            'element_text': true,
                            'id': 'wmi-time-out',
                            'name': 'wmi-time-out',
                            'value': '{{wmi-time-out}}',
                            "field-help": {
                                "content": context.getMessage('active_directory_wmi_timeout_tooptip')
                            },
                            label: context.getMessage('active_directory_wmi_timeout'),
                            'help': context.getMessage('active_directory_range_through_help', [WMI_TIMESTAMP_MIN_VAL,
                                WMI_TIMESTAMP_MAX_VAL, '' ]),
                            "pattern": '^([3-9])$|^([1-9][0-9])$|^(1[0-1][0-9])$|^120$',
                            error: context.getMessage('wmi-timeout-help')
                        }
                    ]
                },
                {
                    section_id: 'active_directory_filter',
                    heading: context.getMessage('active_directory_filter'),
                    'progressive_disclosure': 'expanded',
                    'elements': [{
                        "element_checkbox": true,
                        "id": "active_directory_include_address_check",
                        "field-help": {
                            "content": context.getMessage('active_directory_include_tooptip')
                        },
                        "label": '',
                        "values": [{
                            "id": "active_directory_include_address_enable",
                            "label": context.getMessage("address_include"),
                            "value": "enable",
                            "checked": false
                        }]
                    },
                    {
                        "element_description": true,
                        "id": "active_directory_include_address_list1",
                        "name": "include_address_list1",
                        "placeholder": context.getMessage('loading'),
                        "class": "hide active_directory_include_list1 list-builder listBuilderPlaceHolder",
                        "inlineButtons": [{
                            "id": "add-new-include-address-button",
                            "class": "slipstream-primary-button slipstream-secondary-button editorAddNewButton-align-right",
                            "name": "add-new-include-address-button",
                            "value": context.getMessage("active_directory_add_new_button")
                        }]
                    },
                    {
                        "element_description": true,
                        "id": "active_directory_include_address_list",
                        "name": "include_address_list",
                        "label": '',
                        "placeholder": context.getMessage('loading'),
                        "class": "hide active_directory_include_list list-builder listBuilderPlaceHolder"
                    },
                    {
                        "element_checkbox": true,
                        "id": "active_directory_exclude_address_check",
                        "label": '',
                        "field-help": {
                            "content": context.getMessage('active_directory_exclude_tooptip')
                        },
                        "values": [{
                            "id": "active_directory_exclude_address_enable",
                            "label": context.getMessage("address_exclude"),
                            "value": "enable",
                            "checked": false
                        }]
                    },
                    {
                        "element_description": true,
                        "id": "active_directory_exclude_address_list1",
                        "name": "exclude_address_list1",
                        "placeholder": context.getMessage('loading'),
                        "class": "hide active_directory_exclude_list1 list-builder listBuilderPlaceHolder",
                        "inlineButtons": [{
                            "id": "add-new-exclude-address-button",
                            "class": "slipstream-primary-button slipstream-secondary-button editorAddNewButton-align-right",
                            "name": "add-new-exclude-address-button",
                            "value": context.getMessage("active_directory_add_new_button")
                        }]
                    },
                    {
                        "element_description": true,
                        "id": "active_directory_exclude_address_list",
                        "name": "exclude_address_list",
                        "label": '',
                        "placeholder": context.getMessage('loading'),
                        "class": "hide active_directory_exclude_list list-builder listBuilderPlaceHolder"
                    }]
                }]
            };
        };
    };

    return Configuration;
});