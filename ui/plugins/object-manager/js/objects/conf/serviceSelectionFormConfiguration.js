/**
 * A configuration object with the parameters required to build 
 * a form for selecting services
 *
 * @module serviceSelectionFormConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
], function () {
    var Configuration = function(context) {
        this.getValues = function() {
            return {
                "title": context.getMessage('service_assign'),
                "form_id": "service-selection-form",
                "form_name": "service-selection-form",
                "on_overlay": true,
                "sections": [
                    {
                        "section_id": "services",
                        "state_expanded": true,
                        "elements": [
                            {
                                "element_text": true,
                                "id": "service-selection",
                                "name": "service-selection",
                                "placeholder": context.getMessage('loading'),
                                "class": "list-builder"
                            }
                        ]
                    }
                ],
                "buttonsAlignedRight": true,
                "cancel_link": {
                    "id": "service-cancel",
                    "value": context.getMessage('cancel')
                },
                "buttons": [
                    {
                        "id": "service-save",
                        "name": "save",
                        "value": context.getMessage('ok')
                    }
                ]
            };
        };
    };

    return Configuration;
});