/**
 * Form configuration required to render the general form using the FormWidget.
 *
 * @module Domain settings Form Configuration for Active Directory
 * @author Vinay M S <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([], function () {

    var NAME_MAX_LENGTH = 64,
        NAME_MIN_LENGTH = 1,
        DESCRIPTION_MAX_LENGTH = 255,
        USERNAME_MAX_LENGTH = 64,
        USERNAME_MIN_LENGTH = 1,
        PASSWORD_MAX_LENGTH = 128,
        PASSWORD_MIN_LENGTH = 1,
        PORT_RANGE_MIN_VALUE = 1,
        PORT_RANGE_MAX_VALUE = 65535,
        EVENT_LOG_SCANNING_RANGE_MIN_VALUE = 5,
        EVENT_LOG_SCANNING_RANGE_MAX_VALUE = 60,
        INITIAL_TIMESTAMP_MIN_VAL = 1,
        INITIAL_TIMESTAMP_MAX_VAL = 168;

    var Configuration = function (context) {

        /**
         * @returns Form configuration
         *
         */
        this.getValues = function () {

            return {
                'form_id': 'active-directory-general-form',
                'form_name': 'active-directory-general-form',
                'add_remote_name_validation': 'active_directory_name',
                "on_overlay": true,
                "title-help": {
                    "content": context.getMessage('active_directory_add_domain_settings_tooltip')
                },
                'sections': [{
                   // 'heading': context.getMessage('active_directory_title_domain_name'),
                    section_id: 'active_directory_domain_info',
                    'progressive_disclosure': 'expanded',
                    'elements': [{
                            'element_multiple_error': true,
                            'id': 'active_directory_domain_name',
                            'name': 'domain-name',
                            'value': '{{domain-name}}',
                            "field-help": {
                                "content": context.getMessage('active_directory_domain_settings_name_tooptip')
                            },
                            'label': context.getMessage('active_directory_title_domain_name'),
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
                        },
                        {
                            'element_textarea': true,
                            'id': 'active_directory_description',
                            'name': 'domain-description',
                            'value': '{{domain-description}}',
                            "field-help": {
                                "content": context.getMessage('active_directory_domain_settings_discription_tooptip')
                            },
                            'label': context.getMessage('description'),
                            'max_length': DESCRIPTION_MAX_LENGTH,
                            "post_validation": "descriptionValidator"
                        },
                        {
                            'element_multiple_error': true,
                            'id': 'active_directory_domain_username',
                            'name': 'user-name',
                            'value': '{{user-name}}',
                            'required': true,
                            "field-help": {
                                "content": context.getMessage('active_directory_domain_settings_username_tooptip')
                            },
                            'label': context.getMessage('active_directory_domain_username'),
                            'pattern-error': [{
                                'pattern': 'length',
                                'max_length': USERNAME_MAX_LENGTH,
                                'min_length': USERNAME_MIN_LENGTH,
                                'error': context.getMessage('maximum_length_error', [USERNAME_MAX_LENGTH])
                            },
                            {
                                'pattern': 'validtext',
                                'error': context.getMessage('name_require_error')
                            }],
                            'error': true,
                            'notshowvalid': true
                        },
                        {
                            'element_password': true,
                            'id': 'active_directory_domain_password',
                            'name': 'user-password',
                            'value': '{{user-password}}',
                            "field-help": {
                                "content": context.getMessage('active_directory_domain_settings_password_tooptip')
                            },
                            'required': true,
                            'label': context.getMessage('active_directory_domain_password'),
                            'pattern-error': [{
                                'pattern': 'length',
                                'max_length': PASSWORD_MAX_LENGTH,
                                'min_length': PASSWORD_MIN_LENGTH,
                                'error': context.getMessage('maximum_length_error', [PASSWORD_MAX_LENGTH])
                            },
                            {
                                'pattern': 'validtext'
                            }],
                            'error': true,
                            'notshowvalid': true
                        },
                        {
                            "element_description": true,
                            "field-help": {
                                "content": context.getMessage('active_directory_domain_controllers_tooptip')
                            },
                            "label": context.getMessage('active_directory_domain_controller_title'),
                            "id": "active_directory_domain_controller",
                            "name": "active_directory_domain_controller"
                        }

                    ]
                },
                {
                    'heading': context.getMessage('active_directory_user_group_mapping'),
                    section_id: 'active_directory_group_mapping',
                    'progressive_disclosure': 'expanded',
                    'elements': [{
                        "element_description": true,
                        "field-help": {
                            "content": context.getMessage('active_directory_ldap_ip_address_tooltip')
                        },
                        "label": '',//context.getMessage('active_directory_domain_ldap_title'),
                        "id": "active_directory_domain_ldap",
                        "name": "active_directory_domain_ldap"
                    },
                    {
                        'element_text': true,
                        'id': 'baseDN',
                        'name': 'base',
                        'max_length': PASSWORD_MAX_LENGTH,
                        'value': '{{base}}',
                        "field-help": {
                            "content": context.getMessage('active_directory_ldap_base_dn_tooltip')
                        },
                        'label': context.getMessage('active_directory_base'),
                        //'post_validation': 'baseValidation',
                        error: context.getMessage('active_directory_base_require')
                    },
                    {
                        'element_multiple_error': true,
                        'id': 'active_directory_ldap_username',
                        'name': 'user-grp-name',
                        "field-help": {
                            "content": context.getMessage('active_directory_ldap_username_tooltip')
                        },
                        'label': context.getMessage('active_directory_domain_username'),
                        'pattern-error': [{
                            'pattern': 'length',
                            'max_length': USERNAME_MAX_LENGTH,
                            'min_length': USERNAME_MIN_LENGTH,
                            'error': context.getMessage('maximum_length_error', [USERNAME_MAX_LENGTH])
                        },
                        {
                            'pattern': 'validtext'
                        }],
                        'error': true,
                        'notshowvalid': true,
                        value: '{{user-grp-name}}',
                        post_validation: 'baseValidation'
                    },
                    {
                        'element_password': true,
                        'id': 'active_directory_ldap_password',
                        'name': 'user-grp-password',
                        "field-help": {
                            "content": context.getMessage('active_directory_ldap_pasword_tooltip')
                        },
                        'label': context.getMessage('active_directory_domain_password'),
                        //disabled: true,
                        'pattern-error': [{
                            'pattern': 'length',
                            'max_length': PASSWORD_MAX_LENGTH,
                            'min_length': PASSWORD_MIN_LENGTH,
                            'error': context.getMessage('maximum_length_error', [PASSWORD_MAX_LENGTH])
                        },
                        {
                            'pattern': 'validtext'
                        }],
                        'error': true,
                        'notshowvalid': true,
                        value: '{{user-grp-password}}',
                        post_validation: 'baseValidation'
                    },
                    {
                        "element_checkbox": true,
                        "id": "active_directory_use_ssl",
                        "field-help": {
                            "content": context.getMessage('active_directory_ldap_use_ssl_tooltip')
                        },
                        "label": context.getMessage('active_directory_use_ssl'),
                        "values": [{
                            "id": "use-ssl",
                            "name": "use-ssl",
                            "label": context.getMessage("checkbox_enable"),
                            "value": "{{use-ssl}}",
                            "checked": false
                        }],
                        post_validation: 'baseValidation'
                    },
                    {
                        "element_checkbox": true,
                        "id": "active_directory_auth_algo",
                        "field-help": {
                            "content": context.getMessage('active_directory_domain_settings_password_tooptip')
                        },
                        "label": context.getMessage("active_directory_auth_algo"),
                        "field-help": {
                            "content": context.getMessage('active_directory_ldap_auth_algorithm_tooltip')
                        },
                        "values": [{
                            "id": "authentication-algorithm",
                            "name": "authentication-algorithm", //
                            "label": context.getMessage("active_directory_authAlgoVal"),
                            "value": "{{authentication-algorithm}}",
                            "checked": false
                        }],
                        post_validation: 'baseValidation'
                    },
                    {
                        "element_description": true,
                        "label": '',
                        "values": ''
                    }]
                },
                {
                    'heading': context.getMessage('active_directory_ip_mapping_title'),
                    section_id: 'active_directory_user_mapping',
                    'progressive_disclosure': 'expanded',
                    'elements': [{
                        "element_description": true,
                        "id": "active_directory_discovery_method",
                        "field-help": {
                            "content": context.getMessage('active_directory_ldap_discover_method_tooltip')
                        },
                        "value": context.getMessage('active_directory_discovery_method_value'),
                        "label": context.getMessage('active_directory_discovery_method'),
                        "name": "active_directory_discovery_method"
                    },
                    {
                        'element_number': true,
                        'id': 'event_log_scanning_interval',
                        'name': 'event-log-interval',
                        'value': '{{event-log-interval}}',
                        "field-help": {
                            "content": context.getMessage('active_directory_ldap_event_log_scanning_interval_tooltip')
                        },
                        label: context.getMessage('active_directory_event_log_scanning_interval_label'),
                        'field-help': {
                            'content': context.getMessage('active_directory_event_log_tooltip')
                        },
                       // class: 'hide',
                        error: context.getMessage('active_directory_range_through_help',
                            [EVENT_LOG_SCANNING_RANGE_MIN_VALUE, EVENT_LOG_SCANNING_RANGE_MAX_VALUE, '']),
                        'help': context.getMessage('active_directory_range_through_help',
                            [EVENT_LOG_SCANNING_RANGE_MIN_VALUE, EVENT_LOG_SCANNING_RANGE_MAX_VALUE, '']),
                        'min_value': EVENT_LOG_SCANNING_RANGE_MIN_VALUE,
                        'max_value': EVENT_LOG_SCANNING_RANGE_MAX_VALUE,
                        post_validation: 'rangeValidate'
                    },
                    {
                        'element_number': true,
                        'id': 'initial_event_log_timestamp_interval',
                        'name': 'event-log-time-span',
                        'value': '{{event-log-time-span}}',
                        "field-help": {
                            "content": context.getMessage('active_directory_ldap_initial_event_log_timespan_tooltip')
                        },
                        "label": context.getMessage('active_directory_initial_event_log_timespan_label'),
                        'field-help': {
                            'content': context.getMessage('active_directory_event_timespan_tooltip')
                        },
                      //  class: 'hide',
                        error: context.getMessage('active_directory_range_through_help', [INITIAL_TIMESTAMP_MIN_VAL,
                            INITIAL_TIMESTAMP_MAX_VAL, '']),
                        'help': context.getMessage('active_directory_range_through_help', [INITIAL_TIMESTAMP_MIN_VAL,
                            INITIAL_TIMESTAMP_MAX_VAL, '']),
                        'min_value': INITIAL_TIMESTAMP_MIN_VAL,
                        'max_value': INITIAL_TIMESTAMP_MAX_VAL,
                        post_validation: 'rangeValidate'
                    }]
                }],
                "buttonsAlignedRight": true,
                "cancel_link": {
                    "id": "domain-settings-cancel",
                    "value": context.getMessage('cancel')
                },
                "buttons": [
                    {
                        "id": "domain-settings-save",
                        "name": "save",
                        "value": context.getMessage('ok')
                    }
                ]
            };
        };
    };

    return Configuration;
});