/*
Configuration for setting up the form in demo page
*/

define([
], function () {

    var configurationSample = {};

    configurationSample.elements = {
        "title": "IP CIDR Demo",
        "form_id": "ipCidrDemo",
        "form_name": "ipCidrDemo",
        "title-help": {
            "content": "Configure IP CIDR options for demo",
            "ua-help-identifier": "alias_for_title_ua_event_binding"
        },
        "err_div_id": "errorDiv",
        "err_div_message": "One or more fields have errors. Update the fields highlighted below. For detailed information on possible values see",
        "err_div_link":"http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
        "err_div_link_text":"Configuring Basic Settings",
        "err_timeout": "1000",
        "valid_timeout": "5000",
        "sections": [
            {
                "heading": "Instantiate IP CIDR with options below",
                "heading_text": "Fill in options to see the IP CIDR",
                "section_id": "section_id_1",
                
                "elements": [
                   {
                        "element_text": true,
                        "id": "ip_label",
                        "name": "ip_label",
                        "label": "label",
                        "field-help": {
                            "content": "IP Address",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "IP Address",   
                        "pattern": ".*"
                    },
                    {
                        "element_text": true,
                        "id": "ip_id",
                        "name": "ip_id",
                        "label": "id",
                        "field-help": {
                            "content": "",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "text_ip",   
                        "pattern": ".*"
                    },
                    {
                        "element_text": true,
                        "id": "ip_name",
                        "name": "ip_name",
                        "label": "name",
                        "field-help": {
                            "content": "text_ip",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "text_ip",   
                        "pattern": ".*"
                    },
                    {
                        "element_text": true,
                        "id": "ip_placeholder",
                        "name": "ip_placeholder",
                        "label": "ip_placeholder",
                        "field-help": {
                            "content": "IPv4 or IPv6 address",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "placeholder for IP field",   
                        "pattern": ".*"
                    },
                    {
                        "element_text": true,
                        "id": "ip_value",
                        "name": "ip_value",
                        "label": "ip_value",
                        "field-help": {
                            "content": "IPv4 or IPv6 address",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "127.0.0.0",   
                        "pattern": ".*"
                    },
                    {
                        "element_text": true,
                        "id": "ip_tooltip",
                        "name": "ip_tooltip",
                        "label": "ip_tooltip",
                        "field-help": {
                            "content": "IPv6 example: 2001:db8:85a3:0:0:8aa2e:370:7334",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "IPv6 example: 2001:db8:85a3:0:0:8aa2e:370:7334",   
                        "pattern": ".*"
                    },
                    {
                        "element_text": true,
                        "id": "ip_error",
                        "name": "ip_error",
                        "label": "ip_error",
                        "field-help": {
                            "content": "Invalid IP address format",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "Invalid IP address format",   
                        "pattern": ".*"
                    },
                    {
                        "element_text": true,
                        "id": "cidr_label",
                        "name": "cidr_label",
                        "label": "cidr_label",
                        "field-help": {
                            "content": "/",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "/",   
                        "pattern": ".*"
                    },
                    {
                        "element_text": true,
                        "id": "cidr_id",
                        "name": "cidr_id",
                        "label": "cidr_id",
                        "field-help": {
                            "content": "text_cidr",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "text_cidr",   
                        "pattern": ".*"
                    },
                    {
                        "element_text": true,
                        "id": "cidr_name",
                        "name": "cidr_name",
                        "label": "cidr_name",
                        "field-help": {
                            "content": "text_cidr",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "text_cidr",   
                        "pattern": ".*"
                    },
                    {
                        "element_text": true,
                        "id": "cidr_placeholder",
                        "name": "cidr_placeholder",
                        "label": "cidr_placeholder",
                        "field-help": {
                            "content": "placeholder for CIDR field",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "CIDR",   
                        "pattern": ".*"
                    },
                    {
                        "element_text": true,
                        "id": "cidr_value",
                        "name": "cidr_value",
                        "label": "cidr_value",
                        "field-help": {
                            "content": "Initial value for cidr. Cidr field will be disabled unless initial value is specified",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "24",   
                        "pattern": ".*"
                    },
                    {
                        "element_text": true,
                        "id": "cidr_error",
                        "name": "cidr_error",
                        "label": "cidr_error",
                        "field-help": {
                            "content": "Invalid CIDR",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "Invalid CIDR",   
                        "pattern": ".*"
                    },
                    {
                        "element_text": true,
                        "id": "subnet_label",
                        "name": "subnet_label",
                        "label": "subnet_label",
                        "field-help": {
                            "content": "Subnet mask",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "Subnet mask",   
                        "pattern": ".*"
                    },
                    {
                        "element_text": true,
                        "id": "subnet_id",
                        "name": "subnet_id",
                        "label": "subnet_id",
                        "field-help": {
                            "content": "text_subnet",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "text_subnet",   
                        "pattern": ".*"
                    },
                    {
                        "element_text": true,
                        "id": "subnet_name",
                        "name": "subnet_name",
                        "label": "subnet_name",
                        "field-help": {
                            "content": "text_subnet",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "text_subnet",   
                        "pattern": ".*"
                    },
                    {
                        "element_text": true,
                        "id": "subnet_placeholder",
                        "name": "subnet_placeholder",
                        "label": "subnet_placeholder",
                        "field-help": {
                            "content": "placeholder for subnet field",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "subnet mask",   
                        "pattern": ".*"
                    },
                    {
                        "element_text": true,
                        "id": "subnet_value",
                        "name": "subnet_value",
                        "label": "subnet_value",
                        "field-help": {
                            "content": "value for subnet. Subnet value is disabled if no initial value is entered",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "1.2.3.4",   
                        "pattern": ".*"
                    },
                    {
                        "element_text": true,
                        "id": "subnet_error",
                        "name": "subnet_error",
                        "label": "subnet_error",
                        "field-help": {
                            "content": "enter a valid subnet mask",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "Please enter a valid subnet mask",   
                        "pattern": ".*"
                    },
                    {
                        "element_checkbox": true,
                        "id": "ip_required",
                        "label": "ip_required",
                        "required": false,
                        "values": [
                            {
                                "id": "checkbox_required",
                                "name": "checkbox_required",
                                "label": "",
                                "value": "required",
                                "checked": true
                            }
                        ],
                        "field-help": {
                            "content": "(optional) string to indicate the kind of dialog box. One of the following: 'warning' (displayed with an outline); when not specified no special outline will be shown on the dialog. Use the 'warning' parameter to capture user attention for important confirmation questions.",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        }
                        
                    }
                ]
            }
            
        ],

        "buttonsClass":"buttons_row",
        "buttons": [
             // add buttons
             {
                "id": "generate",
                "name": "generate",
                "value": "Generate",
                "isInactive": true
            }
        ]
        
    };

    configurationSample.values = {
        //any default values used in elements
    };

    return configurationSample;

});