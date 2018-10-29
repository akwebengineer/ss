/**
 * A configuration object with the parameters required to build 
 * a form for service grid
 *
 * @module serviceSelectionGridFormConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
], function () {
    var Configuration = function(context) {
        this.getValues = function() {
            return {
                "title": context.getMessage('service_selection'),
                "form_id": "service-selection-grid-form",
                "form_name": "service-selection-grid-form",
                "on_overlay": true,
                "sections": [
                    {
                        "section_id": "service-selection-grid",
                        "elements": [
                            {
                                "element_text": true,
                                "id": "service-selection",
                                "name": "service-selection",
                                "label": context.getMessage('application_grid_service'),
                                "required": true,
                                "error": context.getMessage('require_error')
                            }
                         ]
                    }
                ],
                "buttonsAlignedRight": true,
                "cancel_link": {
                    "id": "service-selection-cancel",
                    "value": context.getMessage('cancel')
                },
                "buttons": [
                    {
                        "id": "service-selection-save",
                        "name": "save",
                        "value": context.getMessage('ok')
                    }
                ]
            };
        };
    };
    return Configuration;
});