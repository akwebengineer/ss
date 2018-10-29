/**
 * A configuration object with the parameters required to build 
 * a form for replace nat pools
 *
 * @module natPoolsReplaceFormConfiguration
 * @author Sandhya B <sandhyab@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
], function () {

    var Configuration = function(context) {

        this.getValues = function() {
            return {
                "title": context.getMessage('natpool_replace_title'),
                "form_id": "natpools-replace-form",
                "form_name": "natpools-replace-form",
                "on_overlay": true,
                "title-help": {
                        "content": context.getMessage("natpool_replace_title_tooltip"),
                         "ua-help-text": context.getMessage('more_link'),
                         "ua-help-identifier": context.getHelpKey("POLICY_OBJECT_DELETE_REPLACING")
                },
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
                                "id": "natpools-selection",
                                "name": "natpools-selection",
                                "label": context.getMessage('replace_with'),
                                "placeholder": context.getMessage('select_hint'),
                                "required": true,
                                "error": context.getMessage('require_error'),
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
                        "value": context.getMessage('replace')
                    }
                ]
            };
        };
    };

    return Configuration;
});