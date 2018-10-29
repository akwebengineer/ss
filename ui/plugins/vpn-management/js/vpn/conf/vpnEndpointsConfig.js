/**
 * Vpn Endpoints Page form configuration
 *
 * @module vpnEndpointsConfig
 * @author Stanley Quan <squan@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {

    var Configuration = function(context) {
        this.getValues = function() {

           formatLabel = function(){
                if(context.vpnType === "HUB_N_SPOKE")
                    return context.getMessage('ipsec_vpns_type_spoke');
                else
                    return context.getMessage('ipsec_vpns_type_endpoint');
            };

           formatFieldHelpContent = function(){
                if(context.vpnType === "HUB_N_SPOKE")
                    return context.getMessage('vpn_wizard_device_spoke');
                else
                    return  context.getMessage("vpn_wizard_device_endpoint")
            };

            return {

                "form_id": "zone_name_form",
                "form_name": "zone_name_form",
                "err_div_id": "errorDiv",
                "err_div_message": "{{help_form_error}}",
                "err_div_link":"http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
                "err_timeout": "1000",
                "valid_timeout": "5000",
                "sections": [
                    {
                       "heading_text": context.getMessage('vpn_wizard_name_page_desc'),
//                       "heading": "Example of the selectedChangeEvent for the selected column",
                       "heading": "",
                       "elements": [
                            {
                                "element_radio": true,
                                "id": "vpn-hub",
                                "label": context.getMessage('ipsec_vpns_type_hub'),
                                "class": "hide",
                                "field-help": {
                                    "content": context.getMessage("vpn_wizard_device_hubs")
                                },
                                "values": [
                                    {
                                        "id": "vpn-hub-devices",
                                        "name": "vpn-hub-selection-filter",
                                        "label": context.getMessage('ipsec_vpns_device_type'),
                                        "value": "Juniper",
                                        "checked": true
                                    },
                                    {
                                        "id": "vpn-hub-extranet",
                                        "name": "vpn-hub-selection-filter",
                                        "label": context.getMessage('ipsec_vpns_extranet_type'),
                                        "value": "Extranet"
                                    }
                                ]
                            },
                            {
                                "element_text": true,
                                "class": "list-builder hide",
                                "id": "hub",
                                "name": "hub",
                                "label": '',
                                "placeholder": "Loading ..."

                            },
                            {
                                "element_radio": true,
                                "id": "vpn-endpoint",
                                "label": formatLabel,
                                "field-help": {
                                    "content": formatFieldHelpContent
                                },
                                "values": [
                                    {
                                        "id": "vpn-endpoint-devices",
                                        "name": "vpn-endpoint-selection-filter",
                                        "label": context.getMessage('ipsec_vpns_device_type'),
                                        "value": "Juniper",
                                        "checked": true
                                    },
                                    {
                                        "id": "vpn-endpoint-extranet",
                                        "name": "vpn-endpoint-selection-filter",
                                        "label": context.getMessage('ipsec_vpns_extranet_type'),
                                        "value": "Extranet"
                                    }
                                ]
                            },
                            {
                                "element_text": true,
                                "class": "list-builder",
                                "id": "endpoint",
                                "name": "endpoint",
                                "label": '',
                                "placeholder": "Loading ..."

                            }

                       ]

                    }
                ]
            };
        };
    };
    return Configuration;       
});
