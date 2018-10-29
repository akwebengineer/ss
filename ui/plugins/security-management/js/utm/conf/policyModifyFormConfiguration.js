/**
 * A configuration object with the parameters required to build
 * a form for UTM policy
 *
 * @module policyModifyFormConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
], function () {

    var Configuration = function(context) {

        this.getValues = function() {

            return {
               "form_id": "utm-policy-form",
               "form_name": "utm-policy-form",
               "on_overlay": true,
               "add_remote_name_validation": 'utm_policy_name',
                "sections": [
                ],
                "buttonsAlignedRight": true,
                "cancel_link": {
                    "id": "utm-policy-cancel",
                    "value": context.getMessage('cancel')
                },
                "buttons": [
                    {
                        "id": "utm-policy-save",
                        "name": "save",
                        "value": context.getMessage('ok')
                    }
                ]
            };
        };
    };

    return Configuration;
});