/**
 * A form configuration object with the common parameters required to build ipsSignsture for rules in IPS Policies
 *
 * @module ipsSigEditorFormConfiguration
 * @author Damodhar M <mdamodhar@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([], function() {
    var ipsSigEditorFormConfiguration = function(context) {
        this.getValues = function() {
            return {
                "title": context.getMessage('ips_rules_editor_ipssignature_title'),
                "title-help": {
                    "content": context.getMessage("ips_rules_editor_ips_signature_title_info_tip"),
                    "ua-help-text": context.getMessage("more_link"),
                    "ua-help-identifier": context.getHelpKey("IPS_POLICY_CREATING")
                },
                "form_id": "ipsSigEditorForm",
                "form_name": "ipsSigEditorForm",
                "on_overlay": true,
                "sections": [{
                    "section_id": "cellEditor",
                    "elements": [{
                        "element_description": true,
                        "id": "ips-sig-static-grid",
                        "label": context.getMessage('ips_rules_editor_ipssignature_label'),
                        "name": "ips-sig-static-grid",
                        "class": "ips-sig-static-grid",
                        "field-help": {
                            "content": context.getMessage('ips_rules_editor_ipssignature_tooltip'),
                            "ua-help-identifier": "alias_for_ua_event_binding"
                        }
                    }]
                }],
                "buttonsAlignedRight": true,
                "buttons": [{
                    "id": "save",
                    "name": "save",
                    "value": context.getMessage('ok')
                }],
                "cancel_link": {
                    "id": "cancel",
                     "value": context.getMessage("cancel")
                }
            }
        };
    };
    return ipsSigEditorFormConfiguration;
});