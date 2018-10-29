/**
 * A configuration object with the parameters required to build 
 * a form for selecting addresses
 *
 * @module addressSelectionFormConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
], function () {

    var Configuration = function(context) {

        this.getValues = function() {
            return {
                "title": context.getMessage('address_assign'),
                "form_id": "address-selection-form",
                "form_name": "address-selection-form",
                "on_overlay": true,
                "sections": [
                    {
                        "section_id": "addresses",
                        "elements": [
                            {
                                "element_text": true,
                                "id": "address-selection",
                                "name": "address-selection",
                                "placeholder": context.getMessage('loading'),
                                "class": "list-builder"
                            }
                            
                        ]
                    }
                ],
                "buttonsAlignedRight": true,
                "cancel_link": {
                    "id": "address-cancel",
                    "value": context.getMessage('cancel')
                },
                "buttons": [
                    {
                        "id": "address-save",
                        "name": "save",
                        "value": context.getMessage('ok')
                    }
                ]
            }
        };
    };

    return Configuration;
});
