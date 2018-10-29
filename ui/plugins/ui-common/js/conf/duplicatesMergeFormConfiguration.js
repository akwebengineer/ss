/**
 * A configuration object with the parameters required to build
 * a form for install view
 *
 * @module duplicatesMergeFormConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
], function () {

    var Configuration = function(context) {

        this.getValues = function() {

            return {
                "form_id": "duplicate-groups-merge-form",
                "form_name": "duplicate-groups-merge-form",
                "on_overlay": true,
                "sections": [
                    {
                        "section_id": "duplicate-groups-merge-section",
                        "elements": [
                             {
                                 "element_dropdown": true,
                                 "id": "duplicate-groups-merge-name",
                                 "name": "duplicate-groups-merge-name",
                                 "label": context.getMessage('name'),
                                 "required": true,
                                 "values": [],
                                 "error": context.getMessage('require_error')
                             },
                             {
                                 "element_textarea": true,
                                 "id": "duplicate-groups-merge-description",
                                 "name": "description",
                                 "label": context.getMessage('description'),
                                 "required": false
                             }
                         ]
                    }
                ],
                "buttonsAlignedRight": true,
                "cancel_link": {
                    "id": "duplicate-groups-merge-cancel",
                    "value": context.getMessage('cancel')
                },
                "buttons": [
                    {
                        "id": "duplicate-groups-merge-save",
                        "name": "install",
                        "value": context.getMessage('ok')
                    }
                ]
            };
        };
    };

    return Configuration;
});
