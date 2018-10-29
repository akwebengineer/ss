/**
 * A configuration object with the parameters required to build
 * a form for overlays - update summary & detectors view
 *
 * @module signatureDatabaseOverlayFormConf
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
], function () {

    var Configuration = function(context) {

        this.getValues = function() {

            return {
                "form_id": "signature-database-overlay-form",
                "form_name": "signature-database-overlay-form",
                "title": "overlay",
                "on_overlay": true,
                "sections": [
                    {
                        "section_id": "signature-database-overlay-list",
                         "elements": []
                    }
                ],
                "buttonsAlignedRight": true,
                "buttons": [
                    {
                        "id": "signature-database-overlay-close",
                        "name": "close",
                        "value": context.getMessage('close')
                    }
                ]
            };
        };
    };

    return Configuration;
});