/**
 * A configuration object with the parameters required to build
 * a form for overlays - policy sequence view
 *
 * @module policySequenceFormConfiguration
 * @author Swathi Nagaraj <swathin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
], function () {

    var Configuration = function(context) {

        this.getValues = function() {

            return {
                "form_id": "policy-sequence-overlay-form",
                "form_name": "policy-sequence-overlay-form",
                "title": "Select Policy Sequence",
                "title-help": {
                    "content": context.getMessage('policy_sequence_info_tips'),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey("IPS_POLICY_SIGNATURE_MAIN_PAGE_FIELD")
                },
                "on_overlay": true,
                "sections": [
                    {
                        "section_id": "policy-sequence-overlay-list",
                        "elements": []
                    }
                ],
                "buttonsAlignedRight": true,
                "buttonsClass":"buttons_row",
                "cancel_link": {
                    "id": "policy-sequence-overlay-close",
                    "value": context.getMessage('cancel')
                },
                "buttons": [
                    {
                        "id": "policy-sequence-overlay-ok",
                        "name": "create",
                        "value": "OK"
                    }
                ]
            };
        };
    };

    return Configuration;
});