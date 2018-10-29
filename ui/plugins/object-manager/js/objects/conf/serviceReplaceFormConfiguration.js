/**
 * A configuration object with the parameters required to build 
 * a form for replace service
 *
 * @module serviceReplaceFormConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
], function () {

    var Configuration = function(context) {

        this.getValues = function() {
            return {
                "title": context.getMessage('replace_title_service'),
                "form_id": "service-replace-form",
                "form_name": "service-replace-form",
                "title-help": {
                    "content": context.getMessage('service_replace_view_tooltip'),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey("POLICY_OBJECT_DELETE_REPLACING")
                },
                "on_overlay": true,
                "sections": [
                    {
                        "section_id": "replace-selection",
                        "elements": [
                            {
                                "element_text": true,
                                "id": "replace-selection-grid",
                                "name": "replace-selection-grid",
                                "placeholder": context.getMessage('loading'),
                                "required": false,
                                "class": "grid-widget"
                            }
                        ]
                    },
                    {
                        "section_id": "replace-with-selection",
                        "elements": [
                            {
                                "element_text": true,
                                "id": "service-selection-replace",
                                "name": "service-selection-replace",
                                "label": context.getMessage('replace_with'),
                                "placeholder": context.getMessage('select_hint'),
                                "required": true,
                                "error": context.getMessage('require_error')
                            }
                         ]
                    }
                ],
                "buttonsAlignedRight": true,
                "cancel_link": {
                    "id": "replace-cancel",
                    "value": context.getMessage('cancel')
                },
                "buttons": [
                    {
                        "id": "replace-save",
                        "name": "save",
                        "value": context.getMessage('ok')
                    }
                ]
            };
        };
    };

    return Configuration;
});
