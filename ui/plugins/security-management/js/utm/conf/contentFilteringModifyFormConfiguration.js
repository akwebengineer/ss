/**
 * A configuration object with the parameters required to build
 * a form for content filtering profile
 *
 * @module contentFilteringModifyFormConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
], function () {

    var Configuration = function(context) {

        this.getValues = function() {

            return {
               "form_id": "utm-content-filtering-form",
               "form_name": "utm-content-filtering-form",
               "on_overlay": true,
               "add_remote_name_validation": 'utm-contentfiltering-name',
                "sections": [
                ],
                "buttonsAlignedRight": true,
                "cancel_link": {
                    "id": "utm-content-filtering-cancel",
                    "value": context.getMessage('cancel')
                },
                "buttons": [
                    {
                        "id": "utm-content-filtering-save",
                        "name": "save",
                        "value": context.getMessage('ok')
                    }
                ]
            };
        };
    };

    return Configuration;
});