/**
 * Form configuration required to render an VPN Profile create form using the FormWidget.
 *
 * @module vpnProfileFormConf
 * @author Mamata Devabhaktuni <mdevabhaktuni@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

 define ([
    ],function(){
        var VPNProfileFormConf = function(context){

            this.getValues = function (formMode){

            getHelpKeyForMode = function () {
                var helpKey = "";
                switch (formMode) {
                case 'EDIT':
                    helpKey = context.getHelpKey("VPN_PROFILE_CREATING");
                    break;
                case 'CREATE':
                    helpKey = context.getHelpKey("VPN_PROFILE_CREATING");
                    break;
                case 'CLONE':
                    helpKey = context.getHelpKey("POLICY_OBJECT_EDIT_CLONING");
                    break;
                 case 'VIEW':
                     helpKey = context.getHelpKey("POLICY_OBJECT_DETAIL_VIEW");
                     break;
                }

              return helpKey;

            };
            getInfotipForMode = function(){
                var infotip = "";
                switch (formMode) {
                case 'EDIT':
                    infotip = context.getMessage("vpn_profile_edit_title_help");
                    break;
                case 'CREATE':
                    infotip = context.getMessage("vpn_profiles_form_title_help");
                    break;
                case 'CLONE':
                    infotip = context.getMessage("vpn_profile_clone_title_help");
                    break;
                 case 'VIEW':
                     infotip = context.getMessage("vpn_profile_detail_view_title_help");
                     break;
                }
               return infotip;

            };
                return {
                    // "title": (action == Slipstream.SDK.Intent.action.ACTION_EDIT) ? context.getMessage("vpn_profiles_form_title_modify") : context.getMessage("vpn_profiles_form_title"),
                    "form_id" : "vpn-profile-configuration",
                    "form_name" : "vpn-profile-configuration",
                     "title-help": {
                        "content": getInfotipForMode,
                        "ua-help-text": context.getMessage('more_link'),
                        "ua-help-identifier": getHelpKeyForMode
                    },

                    "err_div_id": "errorDiv",
                    "err_div_message": context.getMessage("form_error"),
                    "err_div_link":"http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
                    "err_div_link_text":"Create VPN Profile help",
                    "err_timeout": "1000",
                    //"valid_timeout": "5000",
                    "on_overlay": true,
                    "add_remote_name_validation": 'name',
                    "sections":[
                        {
                            "elements":[
                                {
                                    "element_multiple_error": true,
                                    "id": "name",
                                    "name": "name",
                                    "label": context.getMessage("name"),
                                    "field-help": {
                                        "content": context.getMessage("vpn_profiles_name_inline_help")
                                    },
                                    "required": true,
                                    "error": true,
                                    "notshowvalid": true,
                                    "value": "{{name}}",
                                    "pattern-error": [
                                        {
                                            "pattern": "length",
                                            "min_length":"1",
                                            "max_length":"255",
                                            "error":context.getMessage("vpn_profile_name_validation_error")
                                        },
                                        {
                                            "pattern": "hasalphanumericdashunderscore",
                                            "error":context.getMessage("vpn_profile_name_validation_error")
                                        },
                                        {
                                            "pattern": "validtext",
                                            "error": context.getMessage("vpn_profile_name_validation_error")
                                        }
                                    ],
                                    "post_validation": "blankNameValidator"
                                },
                                {
                                    "element_textarea": true,
                                    "id": "description",
                                    "name": "description",
                                    "value": "{{description}}",
                                    "label": context.getMessage("description"),
                                    "field-help": {
                                        "content": context.getMessage("vpn_profiles_description_inline_help")
                                    },
                                     "error": context.getMessage('vpn_profile_description_field_error_max_length_name'),
                                     "pattern": "^[\\s\\S]{1,255}$"
                                    // "value": "{{description}}"
                                },
                                {
                                    "element_text": true,
                                    "id": "vpn-profile-phases",
                                    "class": "tab-widget",
                                    "name": "vpn-profile-phases",
                                    "placeholder": "Loading ..."
                                }
                            ]//end elements
                        }
                    ],//end sections
                    "buttonsAlignedRight": true,
                    "buttons": [
                        {
                            
                                "id": "ok",
                                "name": "ok",
                            "value": context.getMessage('ok')
                        }
                    ],
                    "cancel_link": {
                        "id": "cancel",
                        "value": context.getMessage("cancel"),
                    }
                };

            };
        };
            
        return VPNProfileFormConf;

 });