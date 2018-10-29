/**
 * Modify VPN Device Association page form configuration
 *
 * @module modifyVpnDeviceAssociationFormConf
 * @author balasaritha <balasaritha@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {

    var Configuration = function(context) {
        this.getValues = function() {

            return {

                "title": context.getMessage("vpn_modify_endpoint_settings_title"),
                "form_id": "modify-vpn-endpoint-settings",
                "form_name": "modify-vpn-endpoint-settings",
                "on_overlay": true,
                "title-help": {
                    "content": context.getMessage("vpn_trg_settings_form_title_help"),
                    "ua-help-identifier": "alias_for_title_ua_event_binding"
                },
                "err_div_id": "errorDiv",
                "err_div_message": "{{help_form_error}}",
                "err_div_link":"http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
                "err_timeout": "1000",
                "valid_timeout": "5000",
                "sections": [
                    {
                        "heading": context.getMessage("vpn_trg_settings_form_section_heading_vpn"),
                        "elements": [
                            {
                                "element_description": true,
                                "id": "name",
                                "label": context.getMessage("name"),
                                "value": "{{name}}"
                            },
                            {
                                "element_description": true,
                                "id": "type",
                                "label": context.getMessage("ipsec_vpns_grid_column_name_type"),
                                "value": "{{vpnType}}"
                            }
                        ]
                    },
                    {
                       "heading": context.getMessage("vpn_endpoint_settings_form_section_heading"),
                       "elements": [
                           {
                               "element_text": true,
                               "class": "list-builder hub",
                               "id": "hub",
                               "name": "hub",
                               "label": "Hubs",
                               "field-help": {
                                     "content": context.getMessage("vpn_wizard_device_hubs")
                                 },
                               "placeholder": "Loading ..."

                           },
                           {
                               "element_text": true,
                               "class": "list-builder endpoint",
                               "id": "endpoint",
                               "name": "endpoint",
                               "label": "Endpoint",
                               "field-help": {
                                     "content": context.getMessage("vpn_wizard_device_endpoint")
                                 },

                               "placeholder": "Loading ..."

                          }
                       ]
                    },
                    {
                        "heading": context.getMessage("vpn_endpoint_extranet_device_settings_form_section_heading"),
                        "elements": [
                           {
                               "element_text": true,
                               "class": "list-builder hub",
                               "id": "extranet-hub",
                               "name": "extranet-hub",
                               "label": "Hubs",
                               "field-help": {
                                     "content": context.getMessage("vpn_wizard_device_hubs")
                                 },
                               "placeholder": "Loading ..."

                           },
                           {
                               "element_text": true,
                               "class": "list-builder endpoint",
                               "id": "extranet-endpoint",
                               "name": "extranet-endpoint",
                               "label": "Endpoint",
                               "field-help": {
                                     "content": context.getMessage("vpn_wizard_extranet_device_endpoint")
                                 },

                               "placeholder": "Loading ..."

                          }
                        ]
                    }
                ],
                "buttonsAlignedRight": true,
                "buttons": [
                    {
                        "id": "linkClose",
                        "name": "linkClose",
                        "value": context.getMessage('cancel'),
                        "isInactive": "true" // Does not actually make it inactive, just gives it the secondary class
                    },
                    {
                        "id": "btnOk",
                        "name": "ok",
                        "value": context.getMessage('ok')
                    }
                ]
            };
        };
    };

    return Configuration;
});
