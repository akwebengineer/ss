/**
 * A form configuration object with the common parameters required to build advpn Settings editor for
 * modify ADVPN Settings for Tunnels
 * @module advpnSettingsFormConfiguration
 * @author Shashidhara NR <shashinrp@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
*/

define([], function () {


    var adVpnSettingsFormConfiguration = function (context) {

        this.getValues = function () {
            return {
                "title": context.getMessage("ipsec_vpns_tunnels_column_advpn_settings"),
                "form_id": "edit_ADVPN_form",
                "form_name": "edit_ADVPN_form",
                "title-help": {
                    "content": context.getMessage("ipsec_vpns_tunnels_advpn_title_help"),
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
                                    "element_number": true,
                                    "id": "shortcut-conn-limit",
                                    "name": "shortcut-conn-limit",
                                    "label": "ShortCut Connection Limit:",
                                    "placeholder": "",
                                    "value": "{{shortcut-conn-limit}}",
                                    "min_value":"0",
                                    "max_value":"4294967295",
                                    "error" : context.getMessage("ipsec_vpns_tunnels_shortcut_con_limit_error"),
                                    "field-help": {
                                       "content" : context.getMessage("ipsec_vpns_tunnels_advpn_shortcut_field_help")
                                    }
                             },
                             {
                                    "element_number": true,
                                    "id": "idle-threshold",
                                    "name": "idle-threshold",
                                    "label": "Idle Threshold(packets/second):",
                                    "placeholder": "",
                                    "value": "{{idle-threshold}}",
                                    "min_value":"3",
                                    "max_value":"5000",
                                    "error" : context.getMessage("ipsec_vpns_tunnels_idle_threshold_error"),
                                    "field-help": {
                                       "content" : context.getMessage("ipsec_vpns_tunnels_advpn_idle_threshold_field_help")
                                    }
                             },
                             {
                                    "element_number": true,
                                    "id": "idle-time",
                                    "name": "idle-time",
                                    "label": "Idle Time(seconds):",
                                    "placeholder": "",
                                    "value": "{{idle-time}}",
                                    "min_value":"60",
                                    "max_value":"86400",
                                    "error" : context.getMessage("ipsec_vpns_tunnels_idle_time_error"),
                                    "field-help": {
                                       "content" : context.getMessage("ipsec_vpns_tunnels_advpn_idle_time_field_help")
                                    }
                             },

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

    return adVpnSettingsFormConfiguration;

});
