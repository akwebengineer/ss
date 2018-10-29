/**
 * Returns export rules view configuration.
 *
 * @author Tashi Garg <tgarg@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([ ],
    function () {

        var exportRulesViewConf = function (context) {

            this.getExportRulesFormElements = function () {
                return {
                    "title": context.getMessage('export_rules'),
                    "tooltip": context.getMessage('export_rules'),
                    "form_id": "export_rules_confirmation",
                    "on_overlay": true,
                    "title-help": {
                        "content": context.getMessage('policy_export_tooltip'),
                        "ua-help-text": context.getMessage("more_link"),
                        "ua-help-identifier": context.getHelpKey("POLICY_EXPORTING")
                    },
                    "sections": [
                        {
                            "heading": context.getMessage('export_rules_heading'),
                            "section_id": "exportRulesToHTMLMessageId",
                            "elements": [ ]
                        }
                    ],
                    "buttonsAlignedRight": true,
                    "cancel_link": {
                        "id": "cancelExportRules",
                        "value": "Cancel"
                    },
                    "buttons": [
                        {
                            "id": "exportRules",
                            "name": "exportRules",
                            "value": "Export"
                        }
                    ]
                };
            };
        };

        return exportRulesViewConf;

    });
