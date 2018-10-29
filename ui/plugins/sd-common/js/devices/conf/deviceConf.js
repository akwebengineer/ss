/**
 
 * @author WASIM AFSAR A
 * @copyright Juniper Networks, Inc. 2015
 */

define([
], function () {

    var Configuration = function(context) {

        this.getValues = function() {

            return {
                "form_id": "devices-form",
                "form_name": "devices-form",
                "title": context.getMessage("policies_devices"),
                "on_overlay": true,
                "sections": [
                    {
                        "section_id": "device-list",
                        "elements": []
                    }
                ],
                "buttonsAlignedRight": true,
                "buttons": [
                    {
                        "id": "ok",
                        "name": "OK",
                        "value": "OK"
                    }
                ]
            };
        };
    };

    return Configuration;
});