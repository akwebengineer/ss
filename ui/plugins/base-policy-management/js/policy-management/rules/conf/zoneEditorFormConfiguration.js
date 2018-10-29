/**
 * Rule Grid Zone editor configuration object
 *
 * @module ZoneEditorFormConfiguration
 * @author Mamata <mamatad@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    ], function () {

    var RuleGridZoneEditorFormConfiguration = function (context) {

        this.getConfig = function() {
            return {
                "title": "",
                "form_id": "vpn_tunnels_form",
                "form_name": "vpn_tunnels_form",
                "title-help": {
                    "content": context.getMessage("ruleGrid_add_zone"),
                    "ua-help-identifier": "alias_for_title_zones"
                },
                "err_div_id": "errorDiv",
                "err_div_message": context.getMessage("form_error"),
                "err_div_link_text": context.getMessage("ruleGrid_add_zone"),
                "err_timeout": "1000",
                "valid_timeout": "5000",
                "on_overlay": true,

                "sections": [
                    {
                        "section_id": "section_zone",
                        "section_class": "section_class",
                        "elements": {
                            "element_text": true,
                            "id": "zone_editor",
                            "name": "zone_editor",
                            "label": context.getMessage("ruleGrid_zone"),
                            "width": 100,
                            "required": true,
                            "error": context.getMessage("error_make_selection"),
                            "field-help": {
                                "content": context.getMessage("rulegrid_column_zone_info_tip")
                            }
                        }
                    }
                ],
                "buttonsAlignedRight": true,
                "buttons": [
                    {
                        "id": "btnZoneOk",
                        "name": "btnZoneOk",
                        "value": context.getMessage('ok')
                    }
                ],
                "cancel_link": {
                    "id": "linkCancel",
                    "value": context.getMessage("cancel")
                }
            }
       };

    };

    return RuleGridZoneEditorFormConfiguration;

});
