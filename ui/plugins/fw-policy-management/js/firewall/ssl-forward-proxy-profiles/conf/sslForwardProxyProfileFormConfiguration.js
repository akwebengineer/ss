/**
 * A configuration object with the parameters required to build 
 * a form for SSL Forward Proxy Profile Form
 *
 * @module SSLForwardProxyProfileFormConfiguration
 * @author Vinay M S <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
], function () {
    var Configuration = function(context) {
        this.getValues = function() {
            return {
                "form_id": "sd-ssl-forward-proxy-profile-create-form",
                "form_name": "sd-ssl-forward-proxy-profile-create-form",
                "on_overlay": true,
                "add_remote_name_validation": 'sd-ssl-forward-proxy-profile-name',
                "title-help": {
                    "content": context.getMessage('ssl_forward_proxy_profile_create_form_tooltip'),
                    "ua-help-text":context.getMessage("more_link"),
                    "ua-help-identifier": context.getHelpKey("FIREWALL_POLICY_SSL_PROXY_CREATING")
                },
                "sections": [
                    {
                        "section_id": "sd-ssl-forward-proxy-profile-basic-form1",
                        "heading": context.getMessage('ssl_general_information'),
                        "section_class": "section_class",
                        "progressive_disclosure": "expanded",
                        "elements": [
                            {
                                "element_text": true,
                                "id": "sd-ssl-forward-proxy-profile-name",
                                "name": "name",
                                "value": "{{name}}",
                                 "placeholder": "",
                                "label": context.getMessage('name'),
                                "pattern": "^[a-zA-Z0-9][a-zA-Z0-9-_]{0,62}$",
                                //"help": context.getMessage('name_help'),
                                "error": context.getMessage('ssl_fp_name_error_message'),
                                "required": true,
                                "field-help": {
                                    "content": context.getMessage('sslForwardProxyProfile_form_name_tooltip'),
                                    "ua-help-identifier": "alias_for_ua_event_binding"
                                }
                            },
                            {
                                "element_textarea": true,
                                "id": "sd-ssl-forward-proxy-profile-description",
                                "name": "description",
                                "value": "{{description}}",
                                "label": context.getMessage('description'),
                                //"help": context.getMessage('description_help'),
                                "error": context.getMessage('description_error'),
                                "pattern": "^.{1,1024}$",
                                "field-help": {
                                    "content": context.getMessage('sslForwardProxyProfile_form_description_tooltip'),
                                    "ua-help-identifier": "alias_for_ua_event_binding"
                                }
                            },
                            {
                                "element_dropdown": true,
                                "id": "sd-ssl-form-preferred-cipher",
                                "name": "preferred-cipher",
                                "initValue": "{{preferred-cipher}}",
                                "field-help": {
                                    "content": context.getMessage('sslForwardProxyProfile_preferredCipher_help'),
                                    "ua-help-identifier": "alias_for_ua_event_binding"
                                },
                                "values": [
                                    {"value": "", "label": "None" },
                                    {"value": "medium", "label": "Medium" },
                                    {"value": "strong", "label": "Strong" },
                                    {"value": "weak",   "label": "Weak"   },
                                    {"value": "custom", "label": "Custom" }
                                    
                                ],
                                "label": context.getMessage('sslForwardProxyProfile_grid_column_preferredCipher'),
                                // "help": context.getMessage('sslForwardProxyProfile_preferredCipher_help')
                            },
                            {
                                "element_description": true,
                                "class":"ssl-forward-proxy-profile-custom-ciphers",
                                "id": "sd-ssl-forward-proxy-profile-custom-ciphers",
                                "label": context.getMessage('sslForwardProxyProfile_grid_column_customCiphers'),
                                "name": "custom-ciphers",
                                "field-help": {
                                    "content": context.getMessage('sslForwardProxyProfile_customCipher_tooltip'),
                                    "ua-help-identifier": "alias_for_ua_event_binding"
                                }
                            },
                            {
                                "element_checkbox": true,
                                "id": "sd-ssl-form-is-flow-tracing",
                                "label": context.getMessage('ssl_forward_proxy_policy_flow_trace'),
                                "field-help": {
                                    "content": context.getMessage('sslForwardProxyProfile_flow_trace_tooltip'),
                                    "ua-help-identifier": "alias_for_ua_event_binding"
                                },
                                "values": [
                                    {
                                        "id": "sd-ssl-form-is-flow-tracing",
                                        "name": "is-flow-tracing",
                                        "label": context.getMessage("ssl_forward_proxy_policy_enable_flow_trace"),
                                        "checked": false
                                    }
                                ]
                            },
                            {
                                "element_description": true,
                                "id": "sd-ssl-form-root-certificate",
                                "name": "root_certificate_dis",
                                "label": context.getMessage('ssl_forward_proxy_policy_root_certificate'),
                                "error": context.getMessage('application_services_error'),
                                "placeholder": context.getMessage('loading'),
                                "required": true,
                                "class": "sd-ssl-form-root-certificate",
                                "field-help": {
                                    "content": context.getMessage('sslForwardProxyProfile_root_certificate_tooltip'),
                                    "ua-help-identifier": "alias_for_ua_event_binding"
                                }
                            },
                            {
                                "element_text": true,
                                "id": "sd-ssl-fw-exempted-address-group",
                                "name": "sd-ssl-fw-exempted-address-group",
                                "label": context.getMessage('ssl_forward_proxy_policy_exempted_address'),
                                "error": context.getMessage('application_services_error'),
                                "placeholder": context.getMessage('loading'),
                                "class": "list-builder listBuilderPlaceHolder",
                                "field-help": {
                                    "content": context.getMessage('sslForwardProxyProfile_exempted_address_tooltip'),
                                    "ua-help-identifier": "alias_for_ua_event_binding"
                                },
                                "inlineButtons": [{
                                    "id": "add-new-button1",
                                    "class": "slipstream-primary-button slipstream-secondary-button editorAddNewButton-align-right",
                                    "name": "add-new_button",
                                    "value": context.getMessage("sslForwardProxyProfile_exempted_address_addNewButton")
                                }]


                            }
                        ]
                    },
                    {
                        "section_id": "sd-ssl-forward-proxy-profile-basic-form2",
                        "heading": context.getMessage("ssl_forward_proxy_policy_actions"),
                        "section_class": "section_class ssl_fP_form_seperator",
                        "progressive_disclosure": "expanded",
                        "elements": [
                            {
                                "element_checkbox": true,
                                "id": "sd-ssl-form-ignore-server-auth-failure",
                                "label": context.getMessage('ssl_forward_proxy_policy_server_authentication_failure'),
                                "field-help": {
                                    "content": context.getMessage('sslForwardProxyProfile_server_authentication_tooltip'),
                                    "ua-help-identifier": "alias_for_ua_event_binding"
                                },
                                "values": [
                                    {
                                        "id": "sd-ssl-form-ignore-server-auth-failure",
                                        "name": "ignore-server-auth-failure",
                                        "label": context.getMessage('ssl_forward_proxy_policy_ignore'),
                                        "checked": false
                                    }
                                ]
                            },
                            {
                                "element_checkbox": true,
                                "id": "sd-ssl-form-disable-session-resumption",
                                "label": context.getMessage('ssl_forward_proxy_policy_session_resumption'),
                                "field-help": {
                                    "content": context.getMessage('sslForwardProxyProfile_session_resumption_tooltip'),
                                    "ua-help-identifier": "alias_for_ua_event_binding"
                                },
                                "values": [
                                    {
                                        "id": "sd-ssl-form-disable-session-resumption",
                                        "name": "disable-session-resumption",
                                        "label": context.getMessage("ssl_forward_proxy_policy_disable_session_resumption"),
                                        "checked": false
                                    }
                                ]
                            },
                            {
                                "element_description": true,
                                "class":"ssl-forward-proxy-profile-log",
                                "id": "sd-ssl-forward-proxy-profile-log",
                                "label": context.getMessage('ssl_forward_proxy_policy_log'),
                                "field-help": {
                                    "content": context.getMessage('sslForwardProxyProfile_policy_log_tooltip'),
                                    "ua-help-identifier": "alias_for_ua_event_binding"
                                },
                                "name": "ssl-log"
                            },
                            {
                                "element_dropdown": true,
                                "id": "sd-ssl-forward-proxy-profile-renegotiation",
                                "name": "renegotiation",
                                "field-help": {
                                    "content": context.getMessage('sslForwardProxyProfile_renegotiation_tooltip'),
                                    "ua-help-identifier": "alias_for_ua_event_binding"
                                },
                                "initValue": {"id": "NONE", "text": 'None'},
                                "values": [
                                    {"value": "NONE", "label": "None"},
                                    {"value": "ALLOW", "label": "Allow"},
                                    {"value": "ALLOW_SECURE", "label":"Allow-secure"},
                                    {"value": "DROP", "label": "Drop"}
                                ],
                                "label": context.getMessage('ssl_forward_proxy_policy_renegotiation')
                            }
                        ]
                    }
                ],
                "buttonsAlignedRight": true,
                "cancel_link": {
                    "id": "sd-ssl-form-link-cancel",
                    "value": context.getMessage('cancel')
                },
                "buttons": [
                    {
                        "id": "sd-ssl-form-button-save",
                        "name": "save",
                        "value": context.getMessage('ok')
                    }
                ]
            }
        };
    };

    return Configuration;
});

