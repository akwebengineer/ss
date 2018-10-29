/**
 * A configuration object with the parameters required to build
 * a form for duplicate view
 *
 * @module duplicatesFormConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
], function () {

    var Configuration = function(context) {

        this.getValues = function() {

            return {
                "form_id": "duplicate-groups-form",
                "form_name": "duplicate-groups-form",
                "title": context.getMessage('action_show_duplicates'),
                "title-help": {
                    "content": context.getMessage('show_duplicate_view_tooltip'),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey("POLICY_OBJECT_DUPLICATE_SHOWING")
                },
                "on_overlay": true,
                "sections": [
                    {
                        "section_id": "duplicate-groups-list",
                        "section_class": "gridWidgetPlaceHolder",
                        "elements": []
                    }
                ],
                "buttonsAlignedRight": true,
                "buttons": [
                    {
                        "id": "duplicate-groups-close",
                        "name": "close",
                        "value": context.getMessage('close')
                    }
                ]
            };
        };
    };

    return Configuration;
});
