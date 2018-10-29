/**
 * A configuration object with the parameters required to build 
 * a form for address grid
 *
 * @module addressSelectionGridFormConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
], function () {
    var Configuration = function(context) {
        this.getValues = function() {
            return {
                "title": context.getMessage('variable_address_selection'),
                "form_id": "address-selection-grid-form",
                "form_name": "address-selection-grid-form",
                "on_overlay": true,
                "sections": [
                    {
                        "section_id": "variable-address-selection",
                        "elements": [
                            {
                                "element_text": true,
                                "id": "address-selection",
                                "name": "address-selection",
                                "label": context.getMessage('variable_address'),
                                "required": true,
                                "error": context.getMessage('require_error')
                            }
                         ]
                    }
                ],
                "buttonsAlignedRight": true,
                "cancel_link": {
                    "id": "variable-address-selection-cancel",
                    "value": context.getMessage('cancel')
                },
                "buttons": [
                    {
                        "id": "variable-address-selection-save",
                        "name": "save",
                        "value": context.getMessage('ok')
                    }
                ]
            };
        };
    };
    return Configuration;
});