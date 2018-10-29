/**
 * @module SSLForwardProxyProfileViewConfiguration
 * @author Ramesh A<ramesha@juniper.net>
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
                "sections": [
                    {
                        "section_id": "sd-ssl-forward-proxy-profile-basic-form1",
                        "heading": context.getMessage('ssl_general_information'),
                        "section_class": "section_class",
                        "progressive_disclosure": "expanded",
                        "elements": [
                            {
                                "element_description": true,
                                "id": "sd-ssl-forward-proxy-profile-name",
                                "name": "name",
                                "value": "{{name}}",
                                "label": context.getMessage('name')
                            },
                            {
                                "element_description": true,
                                "id": "sd-ssl-forward-proxy-profile-description",
                                "name": "description",
                                "value": "{{description}}",
                                "label": context.getMessage('description')
                            },
                            {
                                "element_description": true,
                                "id": "sd-ssl-form-preferred-cipher",
                                "name": "preferred-cipher",
                                "value":"{{preferred-cipher}}",
                                "label": context.getMessage('sslForwardProxyProfile_grid_column_preferredCipher')
                            },
                            {
                                "element_description": true,
                                "class":"ssl-forward-proxy-profile-custom-ciphers",
                                "id": "sd-ssl-forward-proxy-profile-custom-ciphers",
                                "label": context.getMessage('sslForwardProxyProfile_grid_column_customCiphers'),
                                "name": "custom-ciphers",
                                "value":"{{ciphers}}"
                            },
                            {
                                "element_description": true,
                                "id": "sd-ssl-form-is-flow-tracing",
                                "label": context.getMessage('ssl_forward_proxy_policy_flow_trace'),
                                "value": "{{is-flow-tracing}}"
                            },
                            {
                                "element_description": true,
                                "id": "sd-ssl-form-root-certificate",
                                "name": "root_certificate_dis",
                                "label": context.getMessage('ssl_forward_proxy_policy_root_certificate'),
                                "placeholder": context.getMessage('loading'),
                                "class": "sd-ssl-form-root-certificate"
                            },
                            {
                                "element_description": true,
                                "id": "sd-ssl-form-exempted-address",
                                "name": "sd-ssl-form-exempted-address",
                                "label": context.getMessage('ssl_forward_proxy_policy_exempted_address'),
                                "placeholder": context.getMessage('loading'),
                                "class": "sd-ssl-form-exempted-address"
                             }
                        ]
                    },
                    {
                        "section_id": "sd-ssl-forward-proxy-profile-basic-form2",
                        "heading": context.getMessage("ssl_forward_proxy_policy_actions"),
                        "section_class": "section_class",
                        "progressive_disclosure": "expanded",
                        "elements": [
                            {
                                "element_description": true,
                                "id": "sd-ssl-form-ignore-server-auth-failure",
                                "label": context.getMessage('ssl_forward_proxy_policy_server_authentication_failure'),
                                "value" :"{{ignore-server-auth-failure}}",
                                "label": context.getMessage('ssl_forward_proxy_policy_ignore')
                            },
                            {
                                "element_description": true,
                                "id": "sd-ssl-form-disable-session-resumption",
                                "label": context.getMessage('ssl_forward_proxy_policy_session_resumption'),
                                "value": "{{disable-session-resumption}}"
                            },
                            {
                                "element_description": true,
                                "class":"ssl-forward-proxy-profile-log",
                                "id": "sd-ssl-forward-proxy-profile-log",
                                "label": context.getMessage('ssl_forward_proxy_policy_log'),
                                "name": "ssl-log",
                                "value": "{{ssl-log}}"
                            },
                            {
                                "element_description": true,
                                "id": "sd-ssl-forward-proxy-profile-renegotiation",
                                "name": "renegotiation",
                                "value": "{{renegotiation}}",
                                "label": context.getMessage('ssl_forward_proxy_policy_renegotiation')
                            }
                        ]
                    }
                ],
                "buttonsAlignedRight": true,
                "buttons": [
                    {
                        "id": "sd-ssl-form-link-cancel",
                        "name": "OK",
                        "value": context.getMessage('ok')
                    }
                ]
            }
        };
    };

    return Configuration;
});

