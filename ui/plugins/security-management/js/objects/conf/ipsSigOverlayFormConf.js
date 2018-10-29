/**
 * A configuration object with the parameters required to build
 * a form for overlays - detectors and Ips sigs view
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
                "form_id": "ips-signature-overlay-form",
                "form_name": "ips-signature-overlay-form",
                "title": "Overlay",
                "on_overlay": true,
                "sections": [
                    {
                        "section_id": "ips-signature-overlay-list",
                        "elements": []
                    }
                ],
                "buttonsAlignedRight": true,
                "buttons": [
                    {
                        "id": "ips-signature-overlay-close",
                        "name": "close",
                        "value": context.getMessage('close')
                    }
                ]
            };
        };
    };

    return Configuration;
});