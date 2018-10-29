/**
 * A form configuration object with the common parameters required to build vpn profile editor for
 * tunnel settings vpn wizard.
 *
 * @module modifyVpnProfileFormConfiguration
 * @author Venkata Swaroop <vswaroop@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {
    var modifyVpnProfileFormConfiguration = function (context) {

        this.getValues = function () {
            return {
                "title": context.getMessage("ipsec_vpns_tunnels_column_profile"),
                "form_id": "edit_vpnprofile_form",
                "form_name": "edit_vpnprofile_form",
                "title-help": {
                    "content": context.getMessage("ipsec_vpns_tunnels_vpn_profile_title_help"),
                    "ua-help-identifier": "alias_for_title_edit_vpn_profile"
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
                                "element_dropdown": true,
                                "id": "profile-id",
                                "name": "profile-name",
                                "label": context.getMessage("vpn_profiles_grid_title"),
                                "field-help": {
                                    "content":context.getMessage("ipsec_vpns_tunnels_vpn_profile_field_help")
                                },
                                "required": false,
                                "values": [
                                ],
                                "error": "Please make a selection"

                             },
                             {
                                "element_checkbox": true,
                                "id": "vpn-create-customize-id",
                                "name" : "vpn-create-customise",
                                "label": "",                                
                                "values": [
                                    {
                                        "id": "vpn-create-customise-id",
                                        "name": "vpn-create-customise",
                                        "label": context.getMessage("vpn_customise")
                                    }
                                ]
                             },
                             {
                                    "element_text": false,
                                    "id": "vpn-profile-phases",
                                    "class": "tab-widget",
                                    "name": "vpn-profile-phases",
                                    "placeholder": "Loading ..."
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

    return modifyVpnProfileFormConfiguration;

});
