/**
 * A configuration object with the parameters required to build 
 * a form for nat pools grid
 *
 * @module natPoolsSelectionGridFormConfiguration
 * @author Sandhya B <sandhyab@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
], function () {
    var Configuration = function(context) {
        this.getValues = function() {
            return {
                "title": context.getMessage('natpool_selection'),
                "form_id": "nat-pools-selection-grid-form",
                "form_name": "nat-pools-selection-grid-form",
                "on_overlay": true,
                "sections": [
                    {
                        "section_id": "nat-pool-selection-form",
                        "elements": [
                            {
                                "element_text": true,
                                "id": "nat-pool-selection",
                                "name": "nat-pool-selection",
                                "label": context.getMessage('natpool_variable'),
                                "required": true,
                                "error": context.getMessage('require_error'),
                            }
                         ]
                    }
                ],
                "buttonsAlignedRight": true,
                "cancel_link": {
                    "id": "nat-pool-selection-cancel",
                    "value": context.getMessage('cancel')
                },
                "buttons": [
                    {
                        "id": "nat-pool-selection-save",
                        "name": "save",
                        "value": context.getMessage('ok')
                    }
                ]
            };
        };
    };
    return Configuration;
});