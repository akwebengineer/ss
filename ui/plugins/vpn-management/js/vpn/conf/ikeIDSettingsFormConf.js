/**
 * A form configuration object with the common parameters required to build IKE ID editor for
 * modify vpn tunnel endpoints.
 *
 * @module ikeIDSettingsFormConfiguration
 * @author Venkata Swaroop <vswaroop@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {
    var ikeIDSettingsFormConfiguration = function (context, certBasedProfile, aggressiveProfile) {
        var ikeType = '';

        if(certBasedProfile) {
                ikeType = [ {
                                "label": "",
                                "value": ""
                            },
                            {
                                "label": "Hostname",
                                "value": "Hostname"
                            },
                            {
                                "label": "User@hostname",
                                "value": "User@hostname"
                            },
                            {
                                "label": "DN",
                                "value": "DN"
                            } ];
        } else {
            if(aggressiveProfile){
                ikeType = [ {
                                "label": "",
                                "value": ""
                            },
                            {
                                "label": "Hostname",
                                "value": "Hostname"
                            },
                            {
                                "label": "User@hostname",
                                "value": "User@hostname"
                            } ];
                } else {
                ikeType = [ {
                                "label": "",
                                "value": ""
                            },
                            {
                            "label": "Hostname",
                            "value": "Hostname"
                            },
                            {
                                "label": "User@hostname",
                                "value": "User@hostname"
                            },
                            {
                                "label": "IPAddress",
                                "value": "IPAddress"
                            } ,
                            {
                                "label": "None",
                                "value": "None"
                            } ];
                }
        }

        this.getValues = function () {
            return {
                "title": context.getMessage("vpn_profiles_form_field_label_ike_id_title"),
                "form_id": "edit_ike_ID_form",
                "form_name": "edit_ike_ID_form",
                "title-help": {
                    "content": context.getMessage("vpn_profiles_form_field_label_ike_id_title_help"),
                    "ua-help-identifier": "alias_for_title_edit_ike_ID"
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
                                "id": "ike-id",
                                "name": "ike-id",
                                "pattern": "^[a-zA-Z0-9][a-zA-Z0-9~`!@#$%^&*()=_./+-\\-\\s\/]{0,128}$",
                                "label": context.getMessage("vpn_profiles_form_field_label_ike-id"),
                                "field-help": {
                                   "content" : context.getMessage("vpn_profiles_form_field_label_ike_id_field_help")
                                }
                             },
                             {
                                "element_dropdown": true,
                                "id": "ike-type",
                                "name": "ike-type",
                                "label": context.getMessage("vpn_profiles_form_field_label_ike_id_type"),
                                "field-help": {
                                    "content": context.getMessage("vpn_profiles_form_field_label_ike_id_type_field_help")
                                },
                                "required": false,
                                "values": ikeType,
                                "error": "Please make a selection"

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

    return ikeIDSettingsFormConfiguration;

});
