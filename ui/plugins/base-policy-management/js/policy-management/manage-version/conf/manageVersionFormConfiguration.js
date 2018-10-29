/**
 * A configuration object with the parameters required to build
 * a form for manage version view
 *
 * @module manageVersionFormConfiguration
 * @author  <dkumara@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
], function () {

    var Configuration = function(context) {

        this.getValues = function() {

            return {
                "form_id": "managerollback-groups-form",
                "form_name": "managerollback-groups-form",
                "title": context.getMessage('snapshot_manage_version'),
                "on_overlay": true,
                "title-help": {
                    "content": context.getMessage("manage_version_title_tooltip"),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey("POLICY_MANAGE_ROLLBACK_VERSIONING")
                },
                "sections": [
                    {
                        "section_id": "managerollback-groups-list",
                        "elements": [
                            {
                                "class": "gridWidgetPlaceHolder"
                            }
                        ]
                    }
                ],
                "buttonsAlignedRight": true,
                "buttons": [
                    {
                        "id": "managerollback-groups-close",
                        "name": "close",
                        "value": context.getMessage('close')
                    }
                ]
            };
        };
    };

    return Configuration;
});
