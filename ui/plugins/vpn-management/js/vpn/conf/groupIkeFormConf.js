/**
 * A form configuration object with the common parameters required to build route settings editor for
 * modify vpn enpoint settings.
 *
 * @module groupIkeFormConfiguration
 * @author balasaritha <balasaritha@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {
    var groupIkeFormConfiguration = function (context) {

        this.getValues = function () {
            return {
                "title": context.getMessage("ipsec_vpns_endpoints_group_ike_settings"),
                "form_id": "edit_groupikesettings_form",
                "form_name": "edit_groupikesettings_form",
                "title-help": {
                    "content": context.getMessage("ipsec_vpns_endpoints_group_Ike_ID_Tooltip"),
                    "ua-help-identifier": "alias_for_title_edit_profile_binding"
                },
                "err_div_id": "errorDiv",
                "err_div_message": "form_error",
                "err_div_link_text": "none",
                "err_timeout": "1000",
                "valid_timeout": "5000",
                "on_overlay": true,
                "sections": [
                    {
                        "section_id": "cellEditor",
                        "section_class": "section_class",
                        "elements": [
                            {
                                "element_text": true,
                                "id": "container",
                                "name": "container",
                                "class": "container",
                                "label": context.getMessage("ipsec_vpns_endpoints_column_group_ike_container"),
                                "field-help": {
                                     "content": context.getMessage("ipsec_vpns_endpoints_container_tooltip")
                                 },
                                "required": false,
                                "value": "{{container}}",
                                //"error": context.getMessage("ipsec_vpns_endpoints_group_ike_container_error")
                            },
                            {
                                "element_text": true,
                                "id": "wildcard",
                                "name": "wildcard",
                                "class": "wildcard",
                                "label": context.getMessage("ipsec_vpns_endpoints_column_group_ike_wildcard"),
                                 "field-help": {
                                    "content": context.getMessage("ipsec_vpns_endpoints_wildcard_tooltip")
                                 },

                                "required": false,
                                "value": "{{wildcard}}",
                               // "error": context.getMessage("ipsec_vpns_endpoints_group_ike_wildcard_error")
                            },
                            {
                               "element_text": true,
                               "id": "hostname",
                               "name": "hostname",
                               "class": "hostname",
                               "label": context.getMessage("ipsec_vpns_endpoints_column_group_ike_hostname"),
                               "required": true,
                               "value": "{{hostname}}",
                               "error": context.getMessage("ipsec_vpns_endpoints_group_ike_hostname_error")
                           }
                        ]
                    }
                ],
                "buttonsAlignedRight": true,
                "buttons": [
                    {
                        "id": "btnOk",
                        "name": "btnOk",
                        "value": context.getMessage("ok")
                    }
                ],
                "cancel_link": {
                    "id": "linkCancel",
                    "value": context.getMessage("cancel")
                }
            }
        };
    };

    return groupIkeFormConfiguration;

});
