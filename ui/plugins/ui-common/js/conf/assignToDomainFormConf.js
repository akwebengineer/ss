/**
 * A configuration object with the parameters required to build
 * a form for assign to domain view
 *
 * @module AssignToDomainFormConf
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
], function () {

    var Configuration = function(option) {

        this.getValues = function() {
            var context = option.context,
                objectTypeText = option.objectTypeText;

            return {
                "form_id": "assign-to-domain-overlay-form",
                "form_name": "assign-to-domain-overlay-form",
                "title": context.getMessage('assign_to_domain_title', [objectTypeText]),
                "title-help": {
                    "content": context.getMessage('assign_to_domain_view_tooltip'),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey("POLICY_OBJECT_DOMAIN_ASSIGNING")
                },
                "on_overlay": true,
                "sections": [
                     {
                        "elements": [
                             {
                                "element_description": true,
                                "id": "assign-to-domain-label",
                                "name": "assign-to-domain-label",
                                "label": context.getMessage('assign_to_domain'),
                                "value": "",
                                "pattern": ""
                            }
                          ]
                    },
                    {
                        "section_id": "assign-to-domain-tree-section",
                        "heading_text": context.getMessage('assign_to_domain_introduce_text'),
                        "elements": [
                            {
                                "element_text": true,
                                "id": "assign-to-domain-tree",
                                "name": "assign-to-domain-tree",
                                "label": "",
                                "value": "",
                                "pattern": ""
                            }
                        ]
                    },
                    {
                        "elements": [
                            {
                                "element_checkbox": true,
                                "id": "assign-to-domain-ignore-warnings",
                                "label": context.getMessage('assign_to_domain_ignore_warnings'),
                                "values": [
                                    {
                                        "id": "assign-to-domain-ignore-warnings-enable",
                                        "name": "assign-to-domain-ignore-warnings-enable",
                                        "label": context.getMessage('checkbox_ignore'),
                                        "value": "enable",
                                        "checked": true
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "buttonsAlignedRight": true,
                "cancel_link": {
                    "id": "assign-to-domain-cancel",
                    "value": context.getMessage('cancel')
                },
                "buttons": [
                    {
                        "id": "assign-to-domain-assign",
                        "name": "assign",
                        "value": context.getMessage('ok')
                    }
                ]
            };
        };
    };

    return Configuration;
});