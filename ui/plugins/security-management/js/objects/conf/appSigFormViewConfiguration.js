/**
 * Created by vinutht on 5/14/15.
 */
define([],
    function() {
        var Configuration = function(context) {
            this.getValues = function() {
                return {
                    "form_id": "sd_appsig_form",
                    "form_name": "sd_appsig_form",
                    "title": context.getMessage('app_sig_create_title'),
                    "on_overlay": true,
                    "title-help": {
                        "content": context.getMessage("app_sig_form_title_help"),
                        "ua-help-identifier": "alias_for_title_ua_event_binding"
                    },
                    "err_div_id": "errorDiv",
                    "err_div_message": context.getMessage("form_error"),
                    "err_div_link": "http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
                    "err_div_link_text": "Create Application Signature help",
                    "err_timeout": "1000",
                    "valid_timeout": "5000",
                    "sections": [
                              {
                            "heading_text": context.getMessage('app_sig_create_intro'),
                            "elements": [
                                {
                                    "element_text": true,
                                    "name": "name",
                                    "label": "Name",
                                    "id": "app-sig-name",
                                    "pattern": "^[a-zA-Z0-9][a-zA-Z0-9\-_]{0,62}$",
                                    "required": true,
                                    "value": "{{name}}",
                                    "error": context.getMessage('app_sig_create_name_length_error'),
                                    "help": context.getMessage('app_sig_create_name_help'),
                                    "field-help": {
                                        "content": context.getMessage('app_sig_name_field_help'),
                                        "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                                    }
                                },
                                {
                                    "element_textarea": true,
                                    "name": "description",
                                    "id": "app-sig-description",
                                    "value": "{{description}}",
                                    "label": "Description",
                                    "field-help": {
                                        "content": context.getMessage('app_sig_description_field_help'),
                                        "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                                    }
                                }
                            ]
                        },
                        {
                            "heading": "Signature Details",
                            "title-help": {
                                "content": context.getMessage("app_sig_form_title_help"),
                                "ua-help-identifier": "alias_for_title_ua_event_binding"
                            },

                            "section_id": "sd_appsig_SigDetailsSectionBasic1",
                            "elements": [{
                                "label": context.getMessage("app_sig_create_type"),
                                "element_radio": true,
                                "id": "app-sig-type",
                                "values": [{
                                    "id": "app-sig-basic-radio",
                                    "name": "type",
                                    "label": context.getMessage("app_sig_create_type_basic"),
                                    "value": "protocol",
                                    "checked": true
                                }, {
                                    "id": "app-sig-advanced-radio",
                                    "name": "type",
                                    "label": context.getMessage("app_sig_create_type_advanced"),
                                    "value": "application"
                                }],
                                "field-help": {
                                    "content": context.getMessage('app_sig_type_field_help'),
                                    "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                                }
                            }]
                        }, {
                            "section_id": "sd_appsig_SigDetailsSectionBasic",
                            "elements": [


                                {
                                    "element_number": true,
                                    "name": "minimum_data",
                                    "label": "Minimum Data",
                                    "id": "app-sig-min-data",
                                    "value": "{{min_data}}",
                                    //    "required": true,
                                    "help": context.getMessage("app_sig_form_field_placeholder_min_data"),
                                    "error": context.getMessage("app_sig_form_field_error_min_data"),
                                    "min_value": "0",
                                    "max_value": "65535",
                                    "field-help": {
                                    "content": context.getMessage('app_sig_min_data_field_help'),
                                    "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                                }
                                },
                                {
                                    "element_text": true,
                                    "name": "port_range",
                                    "label": "Port Range",
                                    "id": "app-sig-port-range",
                                    "value": "{{port_range}}",
                                    "required": true,
                                    "help": context.getMessage("app_sig_form_field_placeholder_port_range"),
                                    "pattern": "^((TCP\/|tcp\/|UDP\/|udp\/)([1-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9]|[1-9][0-9][0-9][0-9][0-9]|0)(\-([1-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9]|[1-9][0-9][0-9][0-9][0-9]))?)(,(TCP\/|tcp\/|UDP\/|udp\/)([1-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9]|[1-9][0-9][0-9][0-9][0-9]|0)(\-([1-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9]|[1-9][0-9][0-9][0-9][0-9]))?)*$",
                                    "error": context.getMessage("app_sig_form_field_error_port_range"),
                                    "field-help": {
                                    "content": context.getMessage('app_sig_port_range_field_help'),
                                    "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                                }
                                }
                            ]
                        },
                        {
                            "section_id": "sd_appsig_SigDetailsSectionBasicPatterns",
                            "elements": [

                                {
                                    "element_textarea": true,
                                    "name": "client_to_server",
                                    "id": "app-sig-cts",
                                    "value": "{{client_to_server}}",
                                    "label": "Client to Server Pattern",
                                    "help": context.getMessage("app_sig_form_field_placeholder_cts"),
                                    "field-help": {
                                    "content": context.getMessage('app_sig_client_server_field_help'),
                                    "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                                }
                                }, {
                                    "element_textarea": true,
                                    "name": "server_to_client",
                                    "id": "app-sig-stc",
                                    "value": "{{server_to_client}}",
                                    "label": "Server to Client Pattern",
                                    "help": context.getMessage("app_sig_form_field_placeholder_cts"),
                                    "field-help": {
                                    "content": context.getMessage('app_sig_server_client_field_help'),
                                    "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                                }
                                }


                            ]
                        },
                        {

                            "section_id": "sd_appsig_SigDetailsSectionAdvanced",
                            "elements": [

                                {
                                    "element_number": true,
                                    "name": "max_transaction",
                                    "label": "Maximum Transaction",
                                    "id": "app-sig-max-transaction",
                                    "value": "{{max_transaction}}",
                                    "required": true,
                                    "field-help": {
                                         "content": context.getMessage('app_sig_maxTransaction_field_help'),
                                          "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                                    },
                                    "help": context.getMessage("app_sig_form_field_placeholder_min_data"),
                                    "error": context.getMessage("app_sig_form_field_error_max_transaction"),
                                    "min_value": "0",
                                    "max_value": "65535"
                                },
                                {
                                    "element_dropdown": true,
                                    "name": "protocol",
                                    "label": "Protocol",
                                    "id": "app-sig-protocol",
                                    "values": [{
                                        "label": "HTTP",
                                        "value": "http"
                                    }, {
                                        "label": "SSL",
                                        "value": "ssl"
                                    }],
                                    "field-help": {
                                        "content": context.getMessage('app_sig_protocol_field_help'),
                                        "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                                     }
                                },
                                {
                                    "element_checkbox": true,
                                    "label": "Chain Order",
                                    "id": "app-sig-chain-order",
                                    "field-help": {
                                        "content": context.getMessage('app_sig_chain_order_field_help'),
                                        "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                                    },
                                    "values": [{
                                        "name": "chain_order",
                                        "label": ""
                                    }]
                                },
                                {
                                    "element_text": true,
                                    "id": "app-sig-protocol-grid",
                                    "class": "hide grid-widget",
                                    "name": "app-sig-protocol-grid",
                                    "label": context.getMessage('app_sig_members'),
                                    "required": true
                                }

                            ]
                        },

                        {
                            "heading": "Tags",
                            "section_id": "sd_appsig_tags_form_category",
                            "elements": [{
                                "element_dropdown": true,
                                "name": "category",
                                "label": "Category",
                                "id": "app-sig-category",
                                "help": context.getMessage('app_sig_select_category'),
                                "field-help": {
                                    "content": context.getMessage('app_sig_category_field_help'),
                                    "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                                }
                            }]

                        }, {
                            "section_id": "sd_appsig_tags_form_sub_category",
                            "elements": [{
                                "element_dropdown": true,
                                "name": "sub_category",
                                "label": "Sub Category",
                                "id": "app-sig-sub-category",
                                "help": context.getMessage('app_sig_select_sub_category'),
                                "field-help": {
                                     "content": context.getMessage('app_sig_subCategory_field_help'),
                                     "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                                }

                            }, {
                                "element_dropdown": true,
                                "name": "risk",
                                "label": "Risk",
                                "id": "app-sig-risk",
                                "values": [{
                                    "label": "",
                                    "value": "0"
                                }, {
                                    "label": "Low",
                                    "value": "1"
                                }, {
                                    "label": "Moderate",
                                    "value": "2"
                                }, {
                                    "label": "High",
                                    "value": "3"
                                }, {
                                    "label": "Critical",
                                    "value": "4"
                                }],
                                "field-help": {
                                     "content": context.getMessage('app_sig_risk_field_help'),
                                     "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                                }
                            }]
                        }
                    ],
                    "buttonsAlignedRight": true,
                    "buttonsClass": "buttons_row",
                    "cancel_link": {
                        "id": "sd-appsig-cancel",
                        "value": context.getMessage('cancel')
                    },
                    "buttons": [
                    {
                        "id": "sd-appsig-save",
                        "name": "create",
                        "value": context.getMessage('ok')
                    }]
                };
            }
        };
        return Configuration;
    }
);